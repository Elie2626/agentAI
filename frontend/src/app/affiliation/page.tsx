import type { Metadata } from "next";
import Link from "next/link";
import { Bot, ArrowRight, CheckCircle2, TrendingUp, Users, Euro, Share2, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Programme d'affiliation — Gagnez 10% de commission | botexpress",
  description: "Rejoignez le programme d'affiliation botexpress et gagnez 10% de commission sur chaque abonnement. Partagez votre lien, vos filleuls s'abonnent, vous touchez de l'argent chaque mois.",
  keywords: ["affiliation chatbot", "programme affiliation IA", "gagner argent chatbot", "partenariat botexpress", "commission chatbot"],
  alternates: { canonical: "https://www.botexpress.fr/affiliation" },
  openGraph: {
    title: "Programme d'affiliation botexpress — 10% de commission",
    description: "Partagez botexpress et gagnez 10% sur chaque abonnement de vos filleuls. Paiement mensuel par virement SEPA.",
    url: "https://www.botexpress.fr/affiliation",
    type: "website",
  },
};

const PLANS = [
  { name: "Basic", price: 9.99, commission: 1.0 },
  { name: "Starter", price: 29, commission: 2.9 },
  { name: "Pro", price: 79, commission: 7.9 },
  { name: "Business", price: 199, commission: 19.9 },
];

const FAQ = [
  {
    q: "Qui peut devenir affilié ?",
    a: "Tout abonné botexpress avec un plan actif peut rejoindre le programme. Pas besoin d'être influenceur ou créateur de contenu — si vous connaissez des entrepreneurs ou des boutiques en ligne, c'est suffisant.",
  },
  {
    q: "Comment sont calculées les commissions ?",
    a: "Vous recevez 10% du premier mois payé par chaque filleul (hors période d'essai). Si votre filleul s'abonne au plan Pro à 79€/mois, vous touchez 7,90€.",
  },
  {
    q: "Quand suis-je payé ?",
    a: "Les commissions sont versées chaque mois par virement SEPA dès que votre solde dépasse 20€. Vous renseignez votre IBAN directement dans votre dashboard.",
  },
  {
    q: "Combien de temps dure le cookie de parrainage ?",
    a: "Votre lien de parrainage est permanent. Si quelqu'un clique dessus aujourd'hui et s'inscrit dans 6 mois, vous touchez quand même la commission.",
  },
  {
    q: "Y a-t-il une limite de filleuls ?",
    a: "Aucune. Vous pouvez parrainer autant de personnes que vous voulez.",
  },
  {
    q: "L'essai gratuit est-il compté ?",
    a: "Non. La commission est versée uniquement quand votre filleul effectue son premier paiement réel, après l'essai de 7 jours.",
  },
];

export default function AffiliationPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Programme d'affiliation botexpress",
    description: "Gagnez 10% de commission sur chaque abonnement botexpress souscrit via votre lien de parrainage.",
    url: "https://www.botexpress.fr/affiliation",
    publisher: {
      "@type": "Organization",
      name: "botexpress",
      url: "https://www.botexpress.fr",
    },
  };

  return (
    <div className="min-h-dvh bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">botexpress</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link href="/auth/login">Se connecter</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/register">
                Rejoindre le programme <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section className="border-b bg-gradient-to-b from-primary/5 to-background px-4 py-20 sm:py-28 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm text-muted-foreground">
              <Zap className="h-3.5 w-3.5 text-primary" />
              Programme d&apos;affiliation
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Gagnez{" "}
              <span className="text-primary">10% de commission</span>
              <br />sur chaque abonnement
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
              Partagez votre lien unique. Vos contacts s&apos;abonnent à botexpress.
              Vous touchez 10% du premier mois — automatiquement, par virement SEPA.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/register">
                  Créer mon compte gratuitement <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/login">Accéder à mon dashboard</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Réservé aux abonnés botexpress · Aucun frais d&apos;entrée
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">
              Comment ça marche
            </h2>
            <div className="grid gap-8 sm:grid-cols-3">
              {[
                {
                  icon: Share2,
                  step: "1",
                  title: "Partagez votre lien",
                  desc: "Depuis votre dashboard, copiez votre lien unique et partagez-le à vos contacts, sur vos réseaux ou dans vos newsletters.",
                },
                {
                  icon: Users,
                  step: "2",
                  title: "Ils s'abonnent",
                  desc: "Vos filleuls cliquent sur votre lien, créent leur compte et souscrivent à n'importe quel plan botexpress.",
                },
                {
                  icon: Euro,
                  step: "3",
                  title: "Vous touchez 10%",
                  desc: "Dès leur premier paiement, 10% du montant vous est crédité. Versement mensuel par virement SEPA.",
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground">
                    {item.step}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Commission table */}
        <section className="border-y bg-muted/30 px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-4 text-center text-3xl font-bold tracking-tight">
              Combien pouvez-vous gagner ?
            </h2>
            <p className="mb-10 text-center text-muted-foreground">
              10% du premier mois payé par chaque filleul
            </p>
            <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Plan souscrit</th>
                    <th className="px-6 py-4 text-center font-semibold">Prix/mois</th>
                    <th className="px-6 py-4 text-right font-semibold text-primary">Votre commission</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {PLANS.map((plan) => (
                    <tr key={plan.name} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 font-medium">{plan.name}</td>
                      <td className="px-6 py-4 text-center text-muted-foreground">{plan.price}€</td>
                      <td className="px-6 py-4 text-right font-bold text-primary">+{plan.commission.toFixed(2)}€</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="border-t bg-primary/5 px-6 py-4 text-sm text-muted-foreground">
                <strong className="text-foreground">Exemple :</strong> 5 filleuls sur le plan Pro = <strong className="text-primary">39,50€/mois</strong> de commissions.
              </div>
            </div>
          </div>
        </section>

        {/* Advantages */}
        <section className="px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">
              Pourquoi rejoindre le programme ?
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: TrendingUp,
                  title: "Lien permanent",
                  desc: "Votre lien de parrainage ne expire jamais. Une publication aujourd'hui peut vous rapporter des commissions dans 6 mois.",
                },
                {
                  icon: Shield,
                  title: "Paiement sécurisé",
                  desc: "Virement SEPA mensuel directement sur votre compte bancaire. Aucune plateforme tierce, aucune conversion.",
                },
                {
                  icon: Zap,
                  title: "Mise en place en 2 min",
                  desc: "Connectez-vous, copiez votre lien, partagez-le. Le tracking et les commissions sont 100% automatiques.",
                },
                {
                  icon: Users,
                  title: "Filleuls illimités",
                  desc: "Pas de plafond. Plus vous parrainez, plus vous gagnez. Le programme est ouvert à tous les abonnés.",
                },
                {
                  icon: Euro,
                  title: "Seuil bas à 20€",
                  desc: "Les virements sont déclenchés dès 20€ de commissions accumulées — pas besoin d'attendre des mois.",
                },
                {
                  icon: CheckCircle2,
                  title: "Dashboard transparent",
                  desc: "Suivez vos filleuls, vos commissions en attente et l'historique des paiements en temps réel.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border bg-card p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t bg-muted/30 px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-10 text-center text-3xl font-bold tracking-tight">
              Questions fréquentes
            </h2>
            <div className="space-y-4">
              {FAQ.map((item) => (
                <details key={item.q} className="group rounded-xl border bg-card">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 font-medium">
                    {item.q}
                    <span className="shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45">+</span>
                  </summary>
                  <div className="px-6 pb-4 text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="border-t px-4 py-16 sm:py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Prêt à commencer ?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Créez votre compte, souscrivez à un plan, et votre lien de parrainage
              est disponible immédiatement dans votre dashboard.
            </p>
            <Button size="lg" asChild className="mt-8">
              <Link href="/auth/register">
                Créer mon compte — 7 jours gratuits <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              Carte bancaire requise · Résiliation à tout moment · Aucun engagement
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sm">botexpress</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/legal" className="hover:text-foreground transition-colors">Mentions légales</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Confidentialité</Link>
            <Link href="/" className="hover:text-foreground transition-colors">Retour au site</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
