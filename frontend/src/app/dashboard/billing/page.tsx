"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { type Usage } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Check, CreditCard, ExternalLink, Clock, Gift } from "lucide-react";
import toast from "react-hot-toast";

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    monthlyPrice: 9.99,
    features: ["1 chatbot", "100 messages/mois", "5 pages analysées", "Widget standard"],
  },
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 29,
    features: ["3 chatbots", "1 000 messages/mois", "50 pages analysées", "Branding personnalisé", "Support email"],
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 79,
    popular: true,
    features: ["10 chatbots", "10 000 messages/mois", "200 pages analysées", "Branding personnalisé", "Analytics", "Support prioritaire"],
  },
  {
    id: "business",
    name: "Business",
    monthlyPrice: 199,
    features: ["50 chatbots", "100 000 messages/mois", "1 000 pages analysées", "Tout inclus", "Support prioritaire dédié"],
  },
];

function getTrialDaysLeft(trialEndsAt: string): number {
  const end = new Date(trialEndsAt).getTime();
  const now = Date.now();
  return Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
}

function BillingContent() {
  const searchParams = useSearchParams();
  const [usage, setUsage] = useState<Usage | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  useEffect(() => {
    async function load() {
      try {
        if (searchParams.get("success") === "true") {
          await api.syncSubscription();
          toast.success("Abonnement activé ! Profitez de vos 7 jours gratuits.");
        }
        const data = await api.getUsage();
        setUsage(data);
      } catch {
        toast.error("Erreur de chargement");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [searchParams]);

  async function handleUpgrade(planId: string) {
    setUpgrading(planId);
    try {
      const referralCode = localStorage.getItem("be_ref_code") || undefined;
      const { checkout_url } = await api.createCheckout(planId, billing, referralCode);
      window.location.href = checkout_url;
    } catch {
      toast.error("Erreur lors de la redirection vers Stripe");
      setUpgrading(null);
    }
  }

  async function handleManage() {
    try {
      const { portal_url } = await api.createPortal();
      window.location.href = portal_url;
    } catch {
      toast.error("Erreur lors de l'ouverture du portail");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  const currentPlan = usage?.plan || "free";
  const isTrialing = usage?.subscription_status === "trialing";
  const hasUsedTrial = usage?.has_used_trial ?? false;
  const trialDaysLeft = isTrialing && usage?.trial_ends_at
    ? getTrialDaysLeft(usage.trial_ends_at)
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Abonnement</h1>
        <p className="mt-1 text-muted-foreground">
          Gérez votre plan et suivez votre consommation.
        </p>
      </div>

      {/* Trial banner */}
      {isTrialing && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-amber-700 dark:text-amber-400">
                  Essai gratuit — {trialDaysLeft} jour{trialDaysLeft > 1 ? "s" : ""} restant{trialDaysLeft > 1 ? "s" : ""}
                </p>
                <p className="text-sm text-muted-foreground">
                  Votre carte sera débitée automatiquement à la fin de l&apos;essai.
                </p>
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={handleManage} className="mt-3 w-full sm:w-auto">
              <CreditCard className="h-4 w-4" />
              Gérer l&apos;abonnement
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Current usage */}
      {usage && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle>Utilisation actuelle</CardTitle>
              {currentPlan !== "free" && (
                <Button variant="outline" size="sm" onClick={handleManage} className="shrink-0">
                  <CreditCard className="h-4 w-4" />
                  <span className="hidden sm:inline">Gérer l&apos;abonnement</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span>Messages ce mois</span>
                <span className="font-medium">
                  {usage.messages_used.toLocaleString()} / {usage.messages_limit.toLocaleString()}
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${Math.min(100, (usage.messages_used / usage.messages_limit) * 100)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span>Chatbots</span>
                <span className="font-medium">{usage.chatbots_used} / {usage.chatbots_limit}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${Math.min(100, (usage.chatbots_used / usage.chatbots_limit) * 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing toggle */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-1 rounded-xl border bg-muted/50 p-1">
          <button
            onClick={() => setBilling("monthly")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              billing === "monthly"
                ? "bg-background shadow text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Mensuel
          </button>
          <button
            onClick={() => setBilling("annual")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              billing === "annual"
                ? "bg-background shadow text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Annuel
            <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-xs font-semibold text-emerald-600">
              -20%
            </span>
          </button>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-1.5 text-center text-sm text-muted-foreground">
          <Gift className="h-4 w-4 shrink-0 text-primary" />
          <span>7 jours gratuits · carte requise · résiliation à tout moment</span>
        </div>
      </div>

      {/* Plans */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          const price = billing === "annual"
            ? Math.round(plan.monthlyPrice * 12 * 0.8 / 12 * 100) / 100
            : plan.monthlyPrice;
          return (
            <Card
              key={plan.id}
              className={
                plan.popular
                  ? "relative border-primary ring-1 ring-primary"
                  : isCurrent
                    ? "border-foreground/20"
                    : ""
              }
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge>Populaire</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{price.toLocaleString("fr-FR", { minimumFractionDigits: price % 1 ? 2 : 0 })}&euro;</span>
                  <span className="text-sm text-muted-foreground">/mois</span>
                </div>
                {billing === "annual" && (
                  <p className="text-xs text-emerald-600">
                    Facturé {Math.round(plan.monthlyPrice * 12 * 0.8)}&euro;/an
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {!hasUsedTrial ? (
                  <div className="rounded-lg bg-primary/5 px-3 py-2 text-xs font-medium text-primary">
                    7 jours gratuits
                  </div>
                ) : (
                  <div className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                    Essai déjà utilisé — facturation immédiate
                  </div>
                )}
                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                {isCurrent ? (
                  <Button variant="outline" className="w-full" disabled>
                    Plan actuel {isTrialing ? "(essai)" : ""}
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={!!upgrading}
                  >
                    {upgrading === plan.id ? (
                      <Spinner className="h-4 w-4" />
                    ) : hasUsedTrial ? (
                      "S'abonner"
                    ) : (
                      "Commencer l'essai gratuit"
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Paiement sécurisé par Stripe · Résiliation possible à tout moment · Sans engagement
      </p>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense>
      <BillingContent />
    </Suspense>
  );
}
