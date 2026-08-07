import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, X, Search, Clock, Copy, KeyRound } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { type ManagedUser, managedUsers } from "@/lib/mock-data";
import { toast } from "sonner";
import { createUserApi } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

export const Route = createFileRoute("/app/users")({
  head: () => ({ meta: [{ title: "User Management — PackWise AI" }] }),
  component: UsersPage,
});

const ROLE_OPTIONS: { value: ManagedUser["role"]; label: string }[] = [
  { value: "unassigned", label: "Unassigned" },
  { value: "engineer", label: "Engineer" },
  { value: "manager", label: "Manager" },
  { value: "admin", label: "Admin" },
];

function statusBadge(status: ManagedUser["status"]) {
  if (status === "active") return "bg-[color:var(--success)]/10 text-[color:var(--success)] border-transparent";
  if (status === "invited" || status === "pending") return "bg-[color:var(--warning)]/15 text-[color:var(--warning-foreground)] border-transparent";
  return "bg-destructive/10 text-destructive border-transparent";
}

function UsersPage() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [q, setQ] = useState("");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteData, setInviteData] = useState({ name: "", email: "", role: "Packaging Engineer" });
  const [createdResult, setCreatedResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [resetModal, setResetModal] = useState<{
    isOpen: boolean;
    user: ManagedUser | null;
    tempPass: string;
    copied: boolean;
    loading: boolean;
  }>({
    isOpen: false,
    user: null,
    tempPass: "",
    copied: false,
    loading: false,
  });

  const fetchUsers = async () => {
    try {
      const { data } = await supabase
        .from("app_user")
        .select("*")
        .order("name", { ascending: true });
      if (data && data.length > 0) {
        setUsers(
          data.map((u: any) => ({
            id: u.user_id,
            name: u.name || "Unknown",
            email: u.email || "",
            company: u.company || "PackWise Demo",
            role: (() => {
              const r = (u.role || "").toLowerCase();
              if (r.includes("admin")) return "admin";
              if (r.includes("manager") || r.includes("product") || r === "pm") return "manager";
              if (r.includes("engineer") || r === "pe") return "engineer";
              return "unassigned";
            })(),
            status: u.must_change_password ? "invited" : "active",
            joined: u.created_at ? new Date(u.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Jul 12",
          }))
        );
      } else {
        setUsers(managedUsers);
      }
    } catch {
      setUsers(managedUsers);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteLoading(true);
    try {
      const res = await createUserApi(inviteData.email, inviteData.name, inviteData.role);
      setCreatedResult(res);
      toast.success("User created successfully!");
      // Add to local state
      setUsers((prev) => [{
        id: res.id,
        name: res.name,
        email: res.email,
        company: "PackWise Demo",
        role: res.role.includes("Manager") || res.role === "manager" ? "manager" : res.role === "Packaging Engineer" || res.role === "engineer" ? "engineer" : "admin",
        status: "invited",
        joined: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })
      }, ...prev]);
    } catch (err: any) {
      toast.error(err.message || "Failed to create user");
    } finally {
      setInviteLoading(false);
    }
  };

  const filtered = users.filter((u) =>
    [u.name, u.email, u.company].some((v) => v.toLowerCase().includes(q.toLowerCase())),
  );

  const updateRole = async (id: string, role: ManagedUser["role"]) => {
    let dbRole = role as string;
    if (role === "admin") dbRole = "Admin";
    if (role === "manager") dbRole = "Product Manager";
    if (role === "engineer") dbRole = "Packaging Engineer";

    const { error } = await supabase
      .from("app_user")
      .update({ role: dbRole })
      .eq("user_id", id);

    if (error) {
      toast.error("Failed to update role in database");
    } else {
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
      toast.success("Role updated");
    }
  };

  const handleResetPassword = async (userItem: ManagedUser) => {
    setResetModal({
      isOpen: true,
      user: userItem,
      tempPass: "",
      copied: false,
      loading: true,
    });

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let tempPass = "Pk#" + Array.from({ length: 9 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join("");

    try {
      // 1. Try backend reset API
      const token = localStorage.getItem("packwise_token");
      if (token) {
        const res = await fetch(`${import.meta.env.VITE_API_URL ?? "http://localhost:8000"}/auth/reset-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify({ user_id: userItem.id }),
        }).catch(() => null);
        if (res && res.ok) {
          const data = await res.json();
          if (data.temporary_password) {
            tempPass = data.temporary_password;
          }
        }
      }

      // 2. Set must_change_password = true in DB
      await supabase
        .from("app_user")
        .update({ must_change_password: true })
        .eq("user_id", userItem.id);

      setUsers((prev) => prev.map((u) => u.id === userItem.id ? { ...u, status: "invited" } : u));

      setResetModal({
        isOpen: true,
        user: userItem,
        tempPass: tempPass,
        copied: false,
        loading: false,
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to reset password");
      setResetModal((prev) => ({ ...prev, isOpen: false, loading: false }));
    }
  };

  const copyResetPassword = () => {
    if (!resetModal.tempPass) return;
    navigator.clipboard.writeText(resetModal.tempPass);
    setResetModal((prev) => ({ ...prev, copied: true }));
    toast.success("Password copied to clipboard!");
    setTimeout(() => {
      setResetModal((prev) => ({ ...prev, copied: false }));
    }, 3000);
  };

  const removeUser = async (id: string) => {
    const { error } = await supabase
      .from("app_user")
      .delete()
      .eq("user_id", id);

    if (error) {
      toast.error("Failed to remove user");
    } else {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("User removed");
    }
  };

  const invitedCount = users.filter((u) => u.status === "invited").length;
  const activeCount = users.filter((u) => u.status === "active").length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="User Management"
        description="Approve new sign-ups, assign roles, and manage workspace access."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/70 shadow-none">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Total users</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{users.length}</p>
          </CardContent>
        </Card>
        <Card className="border-border/70 shadow-none">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Invited</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{invitedCount}</p>
          </CardContent>
        </Card>
        <Card className="border-border/70 shadow-none">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Active</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{activeCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/70 shadow-none">
        <CardContent className="p-0">
          <div className="flex items-center justify-between gap-3 border-b border-border/70 p-4">
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, email, company…" className="h-9 pl-8" />
            </div>
            
            <Dialog open={isInviteOpen} onOpenChange={(open) => {
              setIsInviteOpen(open);
              if (!open) setCreatedResult(null);
            }}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">Invite user</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite New User</DialogTitle>
                  <DialogDescription>
                    Create a new account. They will be given a temporary password.
                  </DialogDescription>
                </DialogHeader>
                
                {createdResult ? (
                  <div className="space-y-4 py-4">
                    <div className="rounded-md bg-green-50 dark:bg-green-950/40 p-4 border border-green-200 dark:border-green-800">
                      <p className="text-sm text-green-800 dark:text-green-300 font-medium mb-2">User created successfully!</p>
                      <div className="space-y-1 text-sm">
                        <p><strong>Email:</strong> {createdResult.email}</p>
                        <p><strong>Role:</strong> {createdResult.role}</p>
                        <p className="mt-2 text-xs text-muted-foreground">{createdResult.note}</p>
                      </div>
                    </div>
                    <div className="rounded-md bg-muted p-4 flex flex-col items-center justify-center space-y-2">
                      <p className="text-sm font-medium">Temporary Password</p>
                      <div className="flex items-center gap-2 w-full justify-center">
                        <code className="text-lg bg-background px-3 py-1 rounded border font-mono select-all font-semibold">
                          {createdResult.temporary_password}
                        </code>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(createdResult.temporary_password);
                            toast.success("Password copied to clipboard!");
                          }}
                        >
                          <Copy className="h-3.5 w-3.5 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        Please copy this password. It will not be shown again.
                      </p>
                    </div>
                    <DialogFooter>
                      <Button onClick={() => setIsInviteOpen(false)}>Close</Button>
                    </DialogFooter>
                  </div>
                ) : (
                  <form onSubmit={handleInvite}>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input required placeholder="John Doe" value={inviteData.name} onChange={e => setInviteData({...inviteData, name: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input required type="email" placeholder="john@example.com" value={inviteData.email} onChange={e => setInviteData({...inviteData, email: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <Select value={inviteData.role} onValueChange={v => setInviteData({...inviteData, role: v})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Packaging Engineer">Packaging Engineer</SelectItem>
                            <SelectItem value="Product Manager">Product Manager</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="ghost" onClick={() => setIsInviteOpen(false)}>Cancel</Button>
                      <Button type="submit" disabled={inviteLoading}>
                        {inviteLoading ? "Creating..." : "Create Account"}
                      </Button>
                    </DialogFooter>
                  </form>
                )}
              </DialogContent>
            </Dialog>

            {/* Reset Password Result Dialog */}
            <Dialog open={resetModal.isOpen} onOpenChange={(open) => {
              if (!open) setResetModal((prev) => ({ ...prev, isOpen: false }));
            }}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
                    <KeyRound className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    Reset Password
                  </DialogTitle>
                  <DialogDescription>
                    Temporary password generated for <span className="font-semibold text-foreground">{resetModal.user?.name}</span> ({resetModal.user?.email})
                  </DialogDescription>
                </DialogHeader>

                {resetModal.loading ? (
                  <div className="py-8 text-center text-sm text-muted-foreground space-y-2">
                    <Clock className="h-6 w-6 animate-spin mx-auto text-primary" />
                    <p>Resetting password and generating temporary credentials...</p>
                  </div>
                ) : (
                  <div className="space-y-4 py-2">
                    <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3.5 flex items-start gap-3">
                      <KeyRound className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                        User password has been reset. Share this temporary password with the user so they can sign in.
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Temporary Password
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          readOnly
                          value={resetModal.tempPass}
                          className="font-mono text-base tracking-wider font-semibold bg-muted/60 pr-2 select-all"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={copyResetPassword}
                          className="gap-1.5 shrink-0 min-w-[90px]"
                        >
                          {resetModal.copied ? (
                            <>
                              <Check className="h-4 w-4 text-green-600" />
                              <span className="text-green-600 font-medium">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4" />
                              <span>Copy</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed bg-muted/30 p-2.5 rounded border border-border/50">
                      🔒 The user will be required to change their password upon their next login.
                    </p>

                    <DialogFooter className="pt-2">
                      <Button onClick={() => setResetModal((prev) => ({ ...prev, isOpen: false }))}>
                        Done
                      </Button>
                    </DialogFooter>
                  </div>
                )}
              </DialogContent>
            </Dialog>

          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                    <Clock className="h-5 w-5 animate-spin mx-auto text-primary mb-2" />
                    Retrieving users...
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                    No users match your search.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--primary-soft)] text-xs font-semibold text-primary">
                          {(u.name || "U").split(" ").map((p) => p[0]).slice(0, 2).join("")}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{u.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{u.company}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusBadge(u.status) + " capitalize text-[10px]"}>
                        {u.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select value={u.role} onValueChange={(v) => updateRole(u.id, v as ManagedUser["role"])}>
                        <SelectTrigger className="h-8 w-36 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLE_OPTIONS.map((r) => (
                            <SelectItem key={r.value} value={r.value} className="text-xs">{r.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{u.joined}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleResetPassword(u)}
                          className="h-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                          title="Reset user password"
                        >
                          Reset PW
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeUser(u.id)}
                          className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <X className="h-3.5 w-3.5 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
