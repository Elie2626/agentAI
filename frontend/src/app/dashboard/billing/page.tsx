"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { type Usage } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Check, CreditCard, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: 9.99,
    features: ["1 chatbot", "100 messages/mois", "5 pages analysées", "Widget standard"],
  },
  {
    id: "starter",
    name: "Starter",
    price: 29,
    features: ["3 chatbots", "1 000 messages/mois", "50 pages analysées", "Branding personnalisé", "Support email"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 79,
    popular: true,
    features: ["10 chatbots", "10 000 messages/mois", "200 pages analysées", "Branding personnalisé", "Analytics", "Support prioritaire"],
  },
  {
    id: "business",
    name: "Business",
    price: 199,
    features: ["50 chatbots", "100 000 messages/mois", "1 000 pages analysées", "Tout inclus", "Support prioritaire dédié"],
  },
];

export default function BillingPage() {
  const searchParams = useSearchParams();
  const [usage, setUsage] = useState<Usage | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        if (searchParams.get("success") === "true") {
          await api.syncSubscription();
          toast.success("Abonnement activé avec succès !");
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
    if (planId === "free") return;
    setUpgrading(planId);
    try {
      const { checkout_url } = await api.createCheckout(planId);
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Abonnement</h1>
        <p className="mt-1 text-muted-foreground">
          Gérez votre plan et suivez votre consommation.
        </p>
      </div>

      {/* Current usage */}
      {usage && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Utilisation actuelle</CardTitle>
              {currentPlan !== "free" && (
                <Button variant="outline" size="sm" onClick={handleManage}>
                  <CreditCard className="h-4 w-4" />
                  Gérer l&apos;abonnement
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
                  style={{
                    width: `${Math.min(100, (usage.messages_used / usage.messages_limit) * 100)}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span>Chatbots</span>
                <span className="font-medium">
                  {usage.chatbots_used} / {usage.chatbots_limit}
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${Math.min(100, (usage.chatbots_used / usage.chatbots_limit) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plans */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan) => {
          const isCurrent = currentPlan === plan.id;
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
                  <span className="text-3xl font-bold">{plan.price}&euro;</span>
                  <span className="text-sm text-muted-foreground">/mois</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
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
                    Plan actuel
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={upgrading === plan.id || plan.id === "free"}
                  >
                    {upgrading === plan.id ? (
                      <Spinner className="h-4 w-4" />
                    ) : plan.id === "free" ? (
                      "Plan gratuit"
                    ) : (
                      "Passer à ce plan"
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
