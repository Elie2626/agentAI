"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { type AffiliateInfo, type AffiliateStats } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Copy, Users, Euro, Clock, CheckCircle2, Share2, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";

export default function AffiliatePage() {
  const [info, setInfo] = useState<AffiliateInfo | null>(null);
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [affiliateInfo, affiliateStats] = await Promise.all([
          api.getAffiliate(),
          api.getAffiliateStats(),
        ]);
        setInfo(affiliateInfo);
        setStats(affiliateStats);
      } catch {
        toast.error("Erreur de chargement");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié !`);
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  const planLabels: Record<string, string> = {
    basic: "Basic", starter: "Starter", pro: "Pro", business: "Business",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Programme d&apos;affiliation</h1>
        <p className="mt-1 text-muted-foreground">
          Gagnez <strong>10% de commission</strong> sur chaque abonnement souscrit via votre lien.
        </p>
      </div>

      {/* How it works */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: Share2, step: "1", title: "Partagez votre lien", desc: "Envoyez votre lien unique à vos contacts ou publiez-le en ligne." },
          { icon: Users, step: "2", title: "Ils s'inscrivent", desc: "Ils créent un compte et souscrivent à un plan botexpress." },
          { icon: TrendingUp, step: "3", title: "Vous gagnez 10%", desc: "10% de leur abonnement mensuel vous est crédité chaque mois." },
        ].map((item) => (
          <div key={item.step} className="flex gap-4 rounded-2xl border bg-card p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <item.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">{item.step}. {item.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Your link */}
      {info && (
        <Card>
          <CardHeader>
            <CardTitle>Votre lien de parrainage</CardTitle>
            <CardDescription>Partagez ce lien — toute inscription via ce lien vous rapporte 10% de commission.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <div className="flex items-center gap-2 rounded-xl border bg-muted/50 px-4 py-3 text-sm font-mono">
                  <span className="min-w-0 flex-1 truncate">{info.referral_link}</span>
                </div>
              </div>
              <Button onClick={() => copy(info.referral_link, "Lien")} className="shrink-0">
                <Copy className="h-4 w-4" />
                Copier le lien
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Ou partagez le code :</span>
              <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-1.5">
                <code className="text-sm font-bold tracking-widest text-primary">{info.referral_code}</code>
                <button
                  onClick={() => copy(info.referral_code, "Code")}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Copier le code"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      {stats && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Filleuls</p>
                  <p className="text-2xl font-bold">{stats.total_referrals}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">En attente</p>
                  <p className="text-2xl font-bold">{stats.pending.toFixed(2)}&euro;</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total gagné</p>
                  <p className="text-2xl font-bold">{stats.total_earned.toFixed(2)}&euro;</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Referrals list */}
          <Card>
            <CardHeader>
              <CardTitle>Historique des commissions</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.referrals.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Users className="mb-3 h-10 w-10 text-muted-foreground/40" />
                  <p className="font-medium">Pas encore de filleuls</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Partagez votre lien pour commencer à gagner des commissions.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-muted-foreground">
                        <th className="pb-3 pr-4 font-medium">Plan souscrit</th>
                        <th className="pb-3 pr-4 font-medium">Commission</th>
                        <th className="pb-3 pr-4 font-medium">Statut</th>
                        <th className="pb-3 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {stats.referrals.map((r) => (
                        <tr key={r.id}>
                          <td className="py-3 pr-4 font-medium">{planLabels[r.plan] || r.plan}</td>
                          <td className="py-3 pr-4 font-semibold text-emerald-600">+{r.commission.toFixed(2)}&euro;</td>
                          <td className="py-3 pr-4">
                            <Badge variant={r.status === "paid" ? "success" : "secondary"}>
                              {r.status === "paid" ? "Payée" : "En attente"}
                            </Badge>
                          </td>
                          <td className="py-3 text-muted-foreground">
                            {new Date(r.created_at).toLocaleDateString("fr-FR")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      <Card className="border-muted bg-muted/30">
        <CardContent className="p-5 text-sm text-muted-foreground">
          <strong className="text-foreground">Conditions :</strong> Les commissions sont versées manuellement chaque mois via virement ou PayPal une fois le seuil de 20€ atteint. Elles sont calculées sur la première mensualité payée par chaque filleul (hors période d&apos;essai).
        </CardContent>
      </Card>
    </div>
  );
}
