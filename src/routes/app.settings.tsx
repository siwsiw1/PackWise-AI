import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { User, Mail, Lock, Eye, EyeOff, Loader2, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/page-header";
import { getUser, changePasswordApi, type AuthUser } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "Settings — PackWise AI" }] }),
  component: SettingsPage,
});

const ROLE_LABEL: Record<string, string> = {
  engineer: "Packaging Engineer",
  manager:  "Operations Manager",
  admin:    "Administrator",
  "Packaging Engineer": "Packaging Engineer",
  "Operations Manager": "Operations Manager",
  Admin: "Administrator",
};

function SettingsPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match", { description: "Please ensure both passwords are the same." });
      return;
    }
    
    if (password.length < 6) {
      toast.error("Password too short", { description: "Password must be at least 6 characters long." });
      return;
    }

    setLoading(true);
    try {
      await changePasswordApi(password);
      toast.success("Password updated successfully");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "Failed to update password", { description: "Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-8 max-w-4xl">
      <PageHeader
        title="Settings"
        description="Manage your profile information and account security settings."
      />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1 border-border/70 shadow-none h-fit">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-primary" /> Profile Info
            </CardTitle>
            <CardDescription>Your personal account details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center py-4 border-b border-border/60">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--primary-soft)] text-xl font-bold text-primary mb-3">
                {user.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
              <h3 className="font-semibold text-lg text-foreground text-center">{user.name}</h3>
              <p className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full mt-1">
                {ROLE_LABEL[user.role] || user.role}
              </p>
            </div>
            
            <div className="space-y-3 pt-2 text-sm">
              <div>
                <Label className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                  <Mail className="h-3 w-3" /> Email Address
                </Label>
                <span className="text-foreground font-medium block truncate">{user.email}</span>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                  <Shield className="h-3 w-3" /> Role Permissions
                </Label>
                <span className="text-foreground font-medium block capitalize">{user.role}</span>
              </div>
              {user.company && (
                <div>
                  <Label className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                    Company
                  </Label>
                  <span className="text-foreground font-medium block">{user.company}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="md:col-span-2 border-border/70 shadow-none">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" /> Change Password
            </CardTitle>
            <CardDescription>Update your password to keep your account secure.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={show ? "text" : "password"} 
                      placeholder="••••••••" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShow((s) => !s)} 
                      className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground" 
                      aria-label="Toggle password visibility"
                    >
                      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input 
                    id="confirm-password" 
                    type={show ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button type="submit" disabled={loading} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving Changes
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
