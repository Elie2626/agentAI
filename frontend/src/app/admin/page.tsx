"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  BarChart3,
  Bot,
  LogOut,
  MessageSquare,
  RefreshCw,
  Trash2,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || "";

const PLANS = ["free", "basic", "starter", "pro", "business"] as const;

const PLAN_COLORS: Record<string, string> = {
  free: "bg-muted text-muted-foreground",
  basic: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  starter: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  pro: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  business: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

interface Stats {
  total_users: number;
  total_chatbots: number;
  total_messages: number;
  plan_distribution: Record<string, number>;
}

interface AdminUser {
  uid: string;
  email: string;
  plan: string;
  created_at: string;
  chatbot_count: number;
  messages_used: number;
}

function adminFetch(path: string, options: RequestInit = {}) {
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Secret": ADMIN_SECRET,
      ...(options.headers ?? {}),
    },
  });
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") === "true") {
      setAuthenticated(true);
    }
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        adminFetch("/api/v1/admin/stats"),
        adminFetch("/api/v1/admin/users"),
      ]);
      if (!statsRes.ok || !usersRes.ok) throw new Error();
      setStats(await statsRes.json());
      setUsers(await usersRes.json());
    } catch {
      toast.error("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) loadData();
  }, [authenticated, loadData]);

  function login() {
    if (password === ADMIN_SECRET && ADMIN_SECRET !== "") {
      sessionStorage.setItem("admin_auth", "true");
      setAuthenticated(true);
    } else {
      toast.error("Mot de passe incorrect");
    }
  }

  async function updatePlan(uid: string, plan: string) {
    try {
      const res = await adminFetch(`/api/v1/admin/users/${uid}/plan`, {
        method: "PATCH",
        body: JSON.stringify({ plan }),
      });
      if (!res.ok) throw new Error();
      setUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, plan } : u)));
      toast.success(`Plan mis à jour → ${plan}`);
    } catch {
      toast.error("Erreur lors de la mise à jour");
    }
  }

  async function deleteUser(uid: string, email: string) {
    if (!confirm(`Supprimer l'utilisateur ${email} ?`)) return;
    try {
      const res = await adminFetch(`/api/v1/admin/users/${uid}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setUsers((prev) => prev.filter((u) => u.uid !== uid));
      toast.success("Utilisateur supprimé");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  }

  const filteredUsers = users.filter((u) => {
    const matchSearch = u.email.toLowerCase().includes(search.toLowerCase());
    const matchPlan = planFilter === "all" || u.plan === planFilter;
    return matchSearch && matchPlan;
  });

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-center">Admin Panel</CardTitle>
            <p className="text-center text-sm text-muted-foreground">BotForge — accès local uniquement</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Mot de passe admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
            />
            <Button className="w-full" onClick={login}>
              Se connecter
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">BotForge — accès local uniquement</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Actualiser
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                sessionStorage.removeItem("admin_auth");
                setAuthenticated(false);
              }}
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>

        {loading && !stats ? (
          <div className="flex justify-center py-20">
            <Spinner className="h-8 w-8 text-primary" />
          </div>
        ) : (
          <>
            {/* Stats cards */}
            {stats && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={<Users className="h-5 w-5 text-primary" />} label="Utilisateurs" value={stats.total_users} />
                <StatCard icon={<Bot className="h-5 w-5 text-primary" />} label="Chatbots" value={stats.total_chatbots} />
                <StatCard icon={<MessageSquare className="h-5 w-5 text-primary" />} label="Messages total" value={stats.total_messages} />
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <BarChart3 className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground">Plans actifs</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(stats.plan_distribution)
                        .sort(([a], [b]) => PLANS.indexOf(a as never) - PLANS.indexOf(b as never))
                        .map(([plan, count]) => (
                          <span key={plan} className={`rounded-full px-2 py-0.5 text-xs font-medium ${PLAN_COLORS[plan] ?? ""}`}>
                            {plan}: {count}
                          </span>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Users table */}
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <CardTitle>Utilisateurs ({filteredUsers.length})</CardTitle>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Rechercher un email..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="h-8 w-48 text-sm"
                    />
                    <select
                      value={planFilter}
                      onChange={(e) => setPlanFilter(e.target.value)}
                      className="h-8 rounded-md border border-input bg-background px-2 text-sm"
                    >
                      <option value="all">Tous les plans</option>
                      {PLANS.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-muted-foreground">
                        <th className="pb-3 pr-4 font-medium">Email</th>
                        <th className="pb-3 pr-4 font-medium">Plan</th>
                        <th className="pb-3 pr-4 font-medium text-center">Chatbots</th>
                        <th className="pb-3 pr-4 font-medium text-center">Messages (mois)</th>
                        <th className="pb-3 pr-4 font-medium">Inscrit le</th>
                        <th className="pb-3 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredUsers.map((user) => (
                        <tr key={user.uid} className="group hover:bg-muted/30">
                          <td className="py-3 pr-4">
                            <span className="font-mono text-xs">{user.email || <span className="text-muted-foreground">—</span>}</span>
                          </td>
                          <td className="py-3 pr-4">
                            <select
                              value={user.plan}
                              onChange={(e) => updatePlan(user.uid, e.target.value)}
                              className={`rounded-full border-0 px-2 py-0.5 text-xs font-medium outline-none cursor-pointer ${PLAN_COLORS[user.plan] ?? ""}`}
                            >
                              {PLANS.map((p) => (
                                <option key={p} value={p}>{p}</option>
                              ))}
                            </select>
                          </td>
                          <td className="py-3 pr-4 text-center tabular-nums">{user.chatbot_count}</td>
                          <td className="py-3 pr-4 text-center tabular-nums">{user.messages_used}</td>
                          <td className="py-3 pr-4 text-muted-foreground">
                            {user.created_at
                              ? new Date(user.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })
                              : "—"}
                          </td>
                          <td className="py-3">
                            <button
                              onClick={() => deleteUser(user.uid, user.email)}
                              className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                              aria-label="Supprimer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredUsers.length === 0 && (
                    <p className="py-12 text-center text-sm text-muted-foreground">Aucun utilisateur trouvé</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tabular-nums">{value.toLocaleString()}</p>
        </div>
      </CardContent>
    </Card>
  );
}
