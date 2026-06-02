"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { type AffiliateInfo, type AffiliateStats } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Copy, Users, Clock, CheckCircle2, Share2, TrendingUp, CreditCard, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AffiliatePage() {
  const [info, setInfo] = useState<AffiliateInfo | null>(null);
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [ibanName, setIbanName] = useState("");
  const [iban, setIban] = useState("");
  const [savingPayout, setSavingPayout] = useState(false);
  const [restricted, setRestricted] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [affiliateInfo, affiliateStats, payoutInfo] = await Promise.all([
          api.getAffiliate(),
          api.getAffiliateStats(),
          api.getPayoutInfo(),
        ]);
        setInfo(affiliateInfo);
        setStats(affiliateStats);
        setIbanName(payoutInfo.full_name || "");
        setIban(payoutInfo.iban || "");
      } catch (e: any) {
        if (e.message?.includes("abonnement actif") || e.message?.includes("403")) {
          setRestricted(true);
        } else {
          toast.error("Erreur de chargement");
        }
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

  async function handleSavePayout() {
    if (!ibanName.trim()) { toast.error("Entrez votre nom complet"); return; }
    if (!iban.trim()) { toast.error("Entrez votre IBAN"); return; }
    setSavingPayout(true);
    try {
      await api.savePayoutInfo({ full_name: ibanName.trim(), iban: iban.trim() });
      toast.success("Informations de paiement enregistrées");
    } catch (e: any) {
      toast.error(e.message || "Erreur lors de la sauvegarde");
    } finally {
      setSavingPayout(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  if (restricted) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <Lock className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="mt-4 text-xl font-bold">Abonnement requis</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Le programme d&apos;affiliation est réservé aux membres avec un abonnement actif.
          Commencez votre essai gratuit de 7 jours pour y accéder.
        </p>
        <Button asChild className="mt-6">
          <Link href="/dashboard/billing">Voir les offres</Link>
        </Button>
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

      {/* IBAN payout info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Informations de paiement
          </CardTitle>
          <CardDescription>
            Renseignez votre IBAN pour recevoir vos commissions par virement bancaire.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="payout-name" className="text-sm font-medium">
              Nom complet (titulaire du compte) *
            </label>
            <Input
              id="payout-name"
              placeholder="Jean Dupont"
              value={ibanName}
              onChange={(e) => setIbanName(e.target.value)}
              autoComplete="name"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="payout-iban" className="text-sm font-medium">
              IBAN *
            </label>
            <Input
              id="payout-iban"
              placeholder="FR76 3000 6000 0112 3456 7890 189"
              value={iban}
              onChange={(e) => setIban(e.target.value.toUpperCase())}
              autoComplete="off"
              className="font-mono tracking-wider"
            />
            <p className="text-xs text-muted-foreground">
              Format : FR76 XXXX XXXX XXXX XXXX XXXX XXX — les espaces sont acceptés.
            </p>
          </div>
          {iban && (
            <div className="flex items-start gap-2 overflow-hidden rounded-lg bg-muted/50 px-3 py-2 text-xs font-mono text-muted-foreground">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
              <span className="break-all">{iban.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim()}</span>
            </div>
          )}
          <Button onClick={handleSavePayout} disabled={savingPayout} className="w-full">
            {savingPayout ? <Spinner className="h-4 w-4" /> : "Enregistrer mes coordonnées bancaires"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-muted bg-muted/30">
        <CardContent className="p-5 text-sm text-muted-foreground">
          <strong className="text-foreground">Conditions :</strong> Les commissions sont versées par virement SEPA chaque mois une fois le seuil de 20€ atteint. Elles sont calculées sur la première mensualité payée par chaque filleul (hors période d&apos;essai). Vos coordonnées bancaires sont stockées de façon sécurisée et ne sont jamais partagées.
        </CardContent>
      </Card>
    </div>
  );
}
