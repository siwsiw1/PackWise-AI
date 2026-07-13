"""
PackWise Risk Prediction API
==============================
FastAPI service wrapping the rule_engine package (Process 5.0 in the
PackWise DFD). See README.md in this folder for setup/run instructions.
"""

import os
from dotenv import load_dotenv
load_dotenv()  # reads .env file if present — see .env.example

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional

from rule_engine import (
    ProductFeatures, RiskCategory, BodyRegion, AccessoryItem, AccessoryRetention,
    predict,
)
from rule_engine.mapping import row_to_product_features
from supabase_client import save_assessment
from auth import router as auth_router, get_current_user

import os

app = FastAPI(
    title="PackWise Risk Prediction API",
    description="Rule-based Transport Risk Predictor: Drop Test, Movement, and Accessory Loss Risk.",
    version="1.0.0",
)

# Allowed origins are read from an environment variable so you can switch
# between local dev and production WITHOUT editing this file.
#   - Local dev (default if unset): allows any origin, easiest for testing.
#   - Before deploying for real: set the ALLOWED_ORIGINS env var to your
#     actual dashboard URL(s), comma-separated, e.g.:
#       ALLOWED_ORIGINS="https://your-dashboard.lovable.app,http://localhost:5173"
_origins_env = os.getenv("ALLOWED_ORIGINS")
allow_origins = _origins_env.split(",") if _origins_env else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)


# ---------------------------------------------------------------------
# Request schemas
# ---------------------------------------------------------------------

class ProductRow(BaseModel):
    """
    Shape matching the team's dataset (packaging_dataset.csv columns).
    This is the PRIMARY way to call the API — send the same fields the
    Attachment Recommendation Engine already produces/consumes.
    """
    plan_id: int = Field(..., description="The packaging_plan.plan_id this assessment belongs to")
    product_weight_g: float
    height_cm: float
    fragility_score: float
    center_of_gravity: str = Field(..., description="'Center', 'Back', 'Left', 'Right', or 'Front'")
    accessory_count: int = 0
    accessory_weight_g: float = 0.0
    movement_score: float = 0.0
    complexity_score: float = 0.0
    stability_index: float = 0.0
    recommended_head_strap: int = 0
    recommended_waist_strap: int = 0
    recommended_hand_strap: int = 0
    recommended_leg_strap: int = 0

    class Config:
        json_schema_extra = {
            "example": {
                "plan_id": 1,
                "product_weight_g": 123,
                "height_cm": 30.0,
                "fragility_score": 5,
                "center_of_gravity": "Back",
                "accessory_count": 3,
                "accessory_weight_g": 31.0,
                "movement_score": 7,
                "complexity_score": 7,
                "stability_index": 5,
                "recommended_head_strap": 1,
                "recommended_waist_strap": 4,
                "recommended_hand_strap": 1,
                "recommended_leg_strap": 0,
            }
        }


# ---------------------------------------------------------------------
# Response serialization helpers
# (dataclasses hold non-JSON-serializable bits like rule condition lambdas,
# so we build clean dicts by hand rather than using them directly)
# ---------------------------------------------------------------------

def serialize_report(report) -> dict:
    return {
        "overall_risk_level": report.overall_risk_level,
        "categories": {
            category.value: {
                "risk_level": result.risk_level,
                "risk_percentage": result.risk_percentage,
                "pass_probability": result.pass_probability,
                "matched_rules": [
                    {
                        "rule_id": m.rule.rule_id,
                        "evidence_id": m.rule.evidence_id,
                        "severity": m.rule.severity,
                        "confidence": m.rule.confidence,
                        "source_reference": m.rule.source_reference,
                        "explanation": m.explanation,
                    }
                    for m in result.matched_rules
                ],
            }
            for category, result in report.results.items()
        },
        "movement_by_region": {
            region.value: data for region, data in report.movement_by_region.items()
        },
        "accessory_loss_by_item": report.accessory_loss_by_item,
        "explanation_trace": report.explanation_trace,
    }


# ---------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------

@app.get("/health")
def health():
    return {"status": "ok", "service": "PackWise Risk Prediction API"}


@app.post("/predict")
def predict_from_row(row: ProductRow, user: dict = Depends(get_current_user)):
    """
    Primary endpoint. Requires a valid login token (Authorization: Bearer ...).
    Accepts a product record shaped like the team's dataset (same fields the
    Attachment Recommendation Engine already works with), runs the risk
    engine, SAVES the result to Supabase (risk_assessment + child tables),
    and returns the full risk report plus the new assessment_id.
    """
    try:
        row_dict = row.model_dump()
        plan_id = row_dict.pop("plan_id")
        features = row_to_product_features(row_dict)
        report = predict(features)
        report_dict = serialize_report(report)

        assessment_id = save_assessment(
            plan_id=plan_id,
            report_dict=report_dict,
            input_snapshot=row_dict,
        )
        report_dict["assessment_id"] = assessment_id
        report_dict["saved_to_database"] = assessment_id is not None

        return report_dict
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction failed: {e}")


@app.post("/predict/features")
def predict_from_features(features_dict: dict):
    """
    Advanced/testing endpoint. Accepts a ProductFeatures-shaped dict
    directly (accessories as a list of {name, weight_g, retention_type}),
    bypassing the dataset-row mapping. Useful if a future module wants to
    hand off already-fully-formed features instead of raw dataset rows.
    """
    try:
        accessories = [
            AccessoryItem(
                name=a["name"], weight_g=a["weight_g"],
                retention_type=AccessoryRetention(a.get("retention_type", "None")),
                fragility=a.get("fragility"),
            )
            for a in features_dict.get("accessories", [])
        ]
        body_region_coverage = {
            BodyRegion(k): v for k, v in features_dict.get("body_region_coverage", {}).items()
        } or None

        kwargs = {k: v for k, v in features_dict.items() if k not in ("accessories", "body_region_coverage", "product_fragility")}
        features = ProductFeatures(
            product_fragility=features_dict["product_fragility"],
            accessories=accessories,
            **({"body_region_coverage": body_region_coverage} if body_region_coverage else {}),
            **kwargs,
        )
        report = predict(features)
        return serialize_report(report)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction failed: {e}")
