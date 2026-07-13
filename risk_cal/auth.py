"""
PackWise Risk Prediction API — Authentication
================================================
Wraps Supabase Auth (NOT a custom password system). Matches the team's
original flowchart: Admin creates PE/PM accounts (no public self-signup),
users log in with email+password, Admin can reset a user's password.

Endpoints:
    POST /auth/login           - anyone: log in, get an access token
    POST /auth/create-user     - ADMIN ONLY: create a new PE/PM/Admin account
    GET  /auth/me               - anyone with a valid token: who am I / my role
    POST /auth/reset-password  - ADMIN ONLY: reset a user's password

Protecting other endpoints:
    from auth import get_current_user
    @app.post("/predict")
    def predict_from_row(row: ProductRow, user = Depends(get_current_user)):
        ...
"""

import os
import secrets
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from supabase import create_client, Client

router = APIRouter(prefix="/auth", tags=["auth"])
security = HTTPBearer()

_SUPABASE_URL = os.getenv("SUPABASE_URL")
_SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

_admin_client: Client | None = None
if _SUPABASE_URL and _SUPABASE_SERVICE_KEY:
    _admin_client = create_client(_SUPABASE_URL, _SUPABASE_SERVICE_KEY)


# ---------------------------------------------------------------------
# Request/response schemas
# ---------------------------------------------------------------------

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class CreateUserRequest(BaseModel):
    email: EmailStr
    name: str
    role: str  # 'Admin' | 'Packaging Engineer' | 'Product Manager'
    # No password field — the system auto-generates a temporary one,
    # same as /auth/reset-password does. This matches real-world practice
    # (Google Workspace, AWS IAM, Azure AD, etc. all auto-generate initial
    # passwords rather than letting Admin type one) and avoids Admin
    # falling into the habit of reusing the same guessable temp password
    # for every new account.


class ResetPasswordRequest(BaseModel):
    user_id: str
    # No new_password field anymore — the system GENERATES a fresh
    # temporary password. Admin cannot set a custom one on reset, and
    # cannot retrieve the user's actual current password (impossible by
    # design — see auth_migration.sql comments).


class ChangePasswordRequest(BaseModel):
    new_password: str


# ---------------------------------------------------------------------
# Dependency: verify the caller's token, get their user + role
# ---------------------------------------------------------------------

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    """
    Use as a FastAPI dependency to protect any endpoint.

    Expects:
        Authorization: Bearer <access_token>
    """

    if _admin_client is None:
        raise HTTPException(
            status_code=500,
            detail="Supabase not configured on the server.",
        )

    token = credentials.credentials

    try:
        user_response = _admin_client.auth.get_user(token)
        auth_user = user_response.user

        if auth_user is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid or expired token.",
            )

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token.",
        )

    profile = (
        _admin_client.table("app_user")
        .select("*")
        .eq("user_id", auth_user.id)
        .execute()
    )

    if not profile.data:
        raise HTTPException(
            status_code=404,
            detail="Authenticated, but no matching app_user profile found.",
        )

    return profile.data[0]


def require_admin(user: dict = Depends(get_current_user)) -> dict:
    """Use instead of get_current_user on endpoints only Admins may call."""
    if user["role"] != "Admin":
        raise HTTPException(status_code=403, detail="Admin role required for this action.")
    return user


# ---------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------

@router.post("/login")
def login(body: LoginRequest):
    """Anyone: log in with email+password, get back an access token."""
    if _admin_client is None:
        raise HTTPException(status_code=500, detail="Supabase not configured on the server.")
    try:
        result = _admin_client.auth.sign_in_with_password({"email": body.email, "password": body.password})
        return {
            "access_token": result.session.access_token,
            "refresh_token": result.session.refresh_token,
            "user": {"id": result.user.id, "email": result.user.email},
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Login failed: {e}")


@router.post("/create-user")
def create_user(body: CreateUserRequest, admin: dict = Depends(require_admin)):
    """
    ADMIN ONLY — creates a new Packaging Engineer / Product Manager / Admin
    account. Matches the team's flowchart: no public self-registration.
    A temporary password is auto-generated (same pattern as
    /auth/reset-password) — Admin relays it to the new user through your
    usual offline/chat channel; the user must set their own password on
    first login (must_change_password is set to true automatically).
    """
    if _admin_client is None:
        raise HTTPException(status_code=500, detail="Supabase not configured on the server.")
    try:
        temp_password = secrets.token_urlsafe(9)
        result = _admin_client.auth.admin.create_user({
            "email": body.email,
            "password": temp_password,
            "email_confirm": True,  # skip email verification step for internal accounts
            "user_metadata": {"name": body.name, "role": body.role},
        })
        # app_user row (with must_change_password=true) is created
        # automatically by the on_auth_user_created trigger — see
        # auth_migration.sql — no manual insert needed here.
        return {
            "id": result.user.id,
            "email": result.user.email,
            "name": body.name,
            "role": body.role,
            "temporary_password": temp_password,
            "note": "Give this to the new user through your usual offline/chat channel. "
                    "They will be required to set their own new password on first login.",
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not create user: {e}")


@router.get("/me")
def me(user: dict = Depends(get_current_user)):
    """Returns the caller's own profile (id, email, name, role)."""
    return user


@router.post("/reset-password")
def reset_password(body: ResetPasswordRequest, admin: dict = Depends(require_admin)):
    """
    ADMIN ONLY — issues a brand NEW temporary password for a user who
    forgot theirs (matches the flowchart: user reports to Admin
    offline/chat -> Admin resets -> gives new password -> user must
    change it again on next login).

    Important: this does NOT and CANNOT restore the user's original
    password — once a user sets their own password, it's stored as a
    one-way hash that nobody (not Admin, not the system itself) can ever
    read back. A fresh temporary password is generated instead, which
    gives the exact same practical outcome for the user.
    """
    if _admin_client is None:
        raise HTTPException(status_code=500, detail="Supabase not configured on the server.")
    try:
        temp_password = secrets.token_urlsafe(9)  # short, readable-enough temp password
        _admin_client.auth.admin.update_user_by_id(body.user_id, {"password": temp_password})
        _admin_client.table("app_user").update({"must_change_password": True}).eq("user_id", body.user_id).execute()
        return {
            "status": "password reset",
            "temporary_password": temp_password,
            "note": "Give this to the user through your usual offline/chat channel. "
                    "They will be required to set their own new password on next login.",
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not reset password: {e}")


@router.post("/change-password")
def change_password(body: ChangePasswordRequest, user: dict = Depends(get_current_user)):
    """
    Self-service — the logged-in user sets their OWN new password
    (required after first login, and after any Admin-issued reset).
    Once this succeeds, nobody (including Admin) can retrieve this
    password again — only the user knows it from this point on.
    """
    if _admin_client is None:
        raise HTTPException(status_code=500, detail="Supabase not configured on the server.")
    try:
        _admin_client.auth.admin.update_user_by_id(user["user_id"], {"password": body.new_password})
        _admin_client.table("app_user").update({"must_change_password": False}).eq("user_id", user["user_id"]).execute()
        return {"status": "password changed"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not change password: {e}")
