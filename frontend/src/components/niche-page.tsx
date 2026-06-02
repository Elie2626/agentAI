import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Star, CheckCircle2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NichePageProps {
  /** Keyword cible H1 */
  h1: string;
  /** Sous-titre hero */
  subtitle: string;
  /** Description meta (utilisé dans layout parent) */
  description?: string;
  /** Icône secteur */
  Icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  /** Cas d'usage spécifiques */
  useCases: { title: string; desc: string }[];
  /** Témoignage fictif adapté */
  testimonial: { quote: string; name: string; role: string };
  /** FAQ spécifique au secteur */
  faq: { q: string; a: string }[];
}

export function NichePage({
  h1, subtitle, Icon, iconColor, iconBg, useCases, testimonial, faq,
}: NichePageProps) {
  return (
    <div className="min-h-dvh font-sans">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <span className="text-xl font-bold">botexpress</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild><Link href="/auth/login">Connexion</Link></Button>
            <Button asChild><Link href="/auth/register">Essai gratuit <ArrowRight className="h-4 w-4" /></Link></Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(55%_45%_at_50%_55%,hsl(var(--primary)/0.1),transparent)]" />
        <div className="mx-auto max-w-3xl text-center">
          <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg}`}>
            <Icon className={`h-7 w-7 ${iconColor}`} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">{h1}</h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{subtitle}</p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/register">Créer mon chatbot gratuitement <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/">Voir tous les secteurs</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground flex items-center justify-center gap-3 flex-wrap">
            <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Gratuit pour tester</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Sans code</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Prêt en 30 secondes</span>
          </p>
        </div>
      </section>

      {/* Use cases */}
      <section className="border-t px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-2xl font-bold sm:text-3xl mb-12">Ce que votre chatbot fait pour vous</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.map((uc, i) => (
              <div key={i} className="rounded-2xl border bg-card p-5">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-semibold">{uc.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-bold sm:text-3xl mb-12">Prêt en 30 secondes</h2>
          <div className="space-y-6">
            {[
              { n: "1", t: "Collez l'URL de votre site", d: "Notre IA explore toutes les pages, extrait votre contenu, vos horaires, vos services." },
              { n: "2", t: "Votre chatbot est créé automatiquement", d: "Il adopte vos couleurs, votre logo, votre identité visuelle. Zéro configuration manuelle." },
              { n: "3", t: "Copiez 1 ligne de code", d: "Collez le script dans votre site. C'est tout. Votre chatbot est en ligne instantanément." },
            ].map(({ n, t, d }) => (
              <div key={n} className="flex gap-4 rounded-2xl border bg-card p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">{n}</div>
                <div>
                  <h3 className="font-semibold">{t}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="border-t px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />)}
          </div>
          <blockquote className="text-xl font-medium leading-relaxed">"{testimonial.quote}"</blockquote>
          <p className="mt-4 text-sm text-muted-foreground">— {testimonial.name}, {testimonial.role}</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-2xl font-bold sm:text-3xl mb-10">Questions fréquentes</h2>
          <div className="space-y-4">
            {faq.map((item, i) => (
              <div key={i} className="rounded-xl border bg-card p-5">
                <h3 className="font-semibold">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-primary/5 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-bold">Votre site répond à vos clients. Même quand vous dormez.</h2>
          <p className="mt-4 text-muted-foreground">Créez votre chatbot gratuitement. Aucune carte bancaire requise.</p>
          <Button size="lg" asChild className="mt-8">
            <Link href="/auth/register">Créer mon chatbot gratuitement <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-primary">
              <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <span className="font-semibold">botexpress</span>
          </Link>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/legal" className="hover:text-foreground">Mentions légales</Link>
            <Link href="/privacy" className="hover:text-foreground">Confidentialité</Link>
            <Link href="/" className="hover:text-foreground">Accueil</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
