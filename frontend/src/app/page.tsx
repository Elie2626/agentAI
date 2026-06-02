"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useT } from "@/i18n";
import { Button } from "@/components/ui/button";
import { AnimatedHeroBg } from "@/components/ui/animated-hero-bg";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Bot,
  Zap,
  Palette,
  Code2,
  ArrowRight,
  Globe,
  MessageSquare,
  BarChart3,
  Check,
  ChevronDown,
  Star,
  Users,
  Building2,
  Shield,
} from "lucide-react";

/* ───────── DATA ───────── */

const FEATURES = [
  { icon: Globe, title: "Analyse automatique", description: "Entrez l'URL de votre site, notre système extrait couleurs, logo, polices et contenu de toutes les pages." },
  { icon: Palette, title: "Personnalisation visuelle", description: "Le chatbot reprend automatiquement l'identité visuelle de votre marque." },
  { icon: MessageSquare, title: "IA conversationnelle", description: "Chatbot intelligent, formé sur le contenu complet de votre site." },
  { icon: Code2, title: "Intégration simple", description: "Un seul script à copier-coller. Compatible avec tous les sites web." },
  { icon: Zap, title: "Prêt en 2 minutes", description: "Créez et déployez votre chatbot en quelques clics, sans connaissance technique." },
  { icon: BarChart3, title: "Suivi & Analytics", description: "Visualisez les utilisateurs, les questions fréquentes et les horaires d'activité." },
];

const PLANS = [
  { name: "Basic", price: "9,99", features: ["1 chatbot", "100 messages/mois", "5 pages analysées", "Widget standard"], cta: "Commencer avec Basic", highlighted: false },
  { name: "Starter", price: "29", features: ["3 chatbots", "1 000 messages/mois", "50 pages analysées", "Branding personnalisé", "Support email"], cta: "Essayer Starter", highlighted: false },
  { name: "Pro", price: "79", features: ["10 chatbots", "10 000 messages/mois", "200 pages analysées", "Branding personnalisé", "Analytics avancés", "Support prioritaire"], cta: "Passer à Pro", highlighted: true },
  { name: "Business", price: "199", features: ["50 chatbots", "100 000 messages/mois", "1 000 pages analysées", "Tout inclus", "Support dédié", "API access"], cta: "Contacter les ventes", highlighted: false },
];

const TESTIMONIALS = [
  { name: "Marie Dupont", role: "Fondatrice, Selecta", text: "En 5 minutes notre chatbot était en ligne avec nos couleurs. Les clients adorent.", rating: 5 },
  { name: "Thomas Martin", role: "Gérant, Clim69", text: "Le chatbot répond aux questions sur nos services 24h/24. On a réduit les appels de 40%.", rating: 5 },
  { name: "Sophie Laurent", role: "E-commerce, ModaShop", text: "L'analyse automatique du site est bluffante. Le bot connaissait déjà tout notre catalogue.", rating: 5 },
];

const FAQ_KEYS = ["faq1", "faq2", "faq3", "faq4", "faq5", "faq6"];

/* ───────── SCROLL ANIMATION HOOK ───────── */

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("animate-in");
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal-section ${className || ""}`}>
      {children}
    </div>
  );
}

/* ───────── FAQ ACCORDION ───────── */

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-xl border bg-card">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 font-medium">
        {q}
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <div className="px-6 pb-4 text-sm leading-relaxed text-muted-foreground">
        {a}
      </div>
    </details>
  );
}

/* ───────── PAGE ───────── */

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const { t } = useT();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "botexpress",
        url: "https://www.botexpress.fr",
        logo: "https://www.botexpress.fr/icon.png",
        description: "Plateforme SaaS de création de chatbots IA personnalisés pour sites web.",
        sameAs: [],
      },
      {
        "@type": "SoftwareApplication",
        name: "botexpress",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: "https://www.botexpress.fr",
        description: "Créez un chatbot IA personnalisé pour votre site web en 2 minutes. Analyse automatique du site, personnalisation visuelle, intégration en un clic.",
        offers: [
          { "@type": "Offer", name: "Basic", price: "9.99", priceCurrency: "EUR", url: "https://www.botexpress.fr/auth/register" },
          { "@type": "Offer", name: "Starter", price: "29", priceCurrency: "EUR", url: "https://www.botexpress.fr/auth/register" },
          { "@type": "Offer", name: "Pro", price: "79", priceCurrency: "EUR", url: "https://www.botexpress.fr/auth/register" },
          { "@type": "Offer", name: "Business", price: "199", priceCurrency: "EUR", url: "https://www.botexpress.fr/auth/register" },
        ],
        aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "127", bestRating: "5" },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ_KEYS.map((key) => ({
          "@type": "Question",
          name: t(`${key}_q`),
          acceptedAnswer: { "@type": "Answer", text: t(`${key}_a`) },
        })),
      },
      {
        "@type": "WebPage",
        name: "botexpress — Créer un chatbot IA pour site web",
        description: "Créez un chatbot IA personnalisé pour votre site web en 2 minutes.",
        url: "https://www.botexpress.fr",
        inLanguage: "fr-FR",
      },
    ],
  };

  return (
    <div className="min-h-dvh">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">botexpress</span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">{t("nav_features")}</a>
            <a href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">{t("nav_pricing")}</a>
            <a href="#faq" className="text-sm text-muted-foreground transition-colors hover:text-foreground">{t("nav_faq")}</a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {isAuthenticated ? (
              <Button asChild><Link href="/dashboard">{t("nav_dashboard")} <ArrowRight className="h-4 w-4" /></Link></Button>
            ) : (
              <>
                <Button variant="ghost" asChild><Link href="/auth/login">{t("nav_login")}</Link></Button>
                <Button asChild><Link href="/auth/register">{t("nav_register")} <ArrowRight className="h-4 w-4" /></Link></Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero + Demo ── */}
      <section className="relative overflow-hidden px-4 pb-24 pt-20 sm:px-6 lg:px-8">
        <AnimatedHeroBg />
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left — Text */}
            <div className="text-center lg:text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm text-muted-foreground">
                <Zap className="h-3.5 w-3.5 text-primary" />
                {t("hero_badge")}
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                {t("hero_title1")}
                <span className="block text-primary">{t("hero_title2")}</span>
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground lg:mx-0">
                {t("hero_subtitle")}
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
                <Button size="lg" asChild>
                  <Link href="/auth/register">{t("hero_cta1")} <ArrowRight className="h-4 w-4" /></Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#features">{t("hero_cta2")}</a>
                </Button>
              </div>
            </div>
            {/* Right — Widget demo */}
            <div className="relative mx-auto w-full max-w-sm lg:mx-0 lg:ml-auto">
              <div className="overflow-hidden rounded-2xl border bg-card shadow-2xl">
                {/* Widget header */}
                <div className="flex items-center gap-3 bg-primary px-4 py-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                    <MessageSquare className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary-foreground">MonSite Assistant</p>
                    <p className="text-xs text-primary-foreground/70">En ligne</p>
                  </div>
                </div>
                {/* Messages */}
                <div className="space-y-3 p-4">
                  <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-muted px-4 py-2.5 text-sm">
                    Bonjour ! Comment puis-je vous aider ?
                  </div>
                  <div className="ml-auto max-w-[75%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                    Quels sont vos tarifs ?
                  </div>
                  <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-muted px-4 py-2.5 text-sm">
                    <p className="mb-1">Voici nos formules :</p>
                    <p className="mb-0.5"><strong>Basic</strong> — 29&#8364;/mois</p>
                    <p className="mb-0.5"><strong>Pro</strong> — 59&#8364;/mois</p>
                    <p>Souhaitez-vous plus de détails ?</p>
                  </div>
                </div>
                {/* Input */}
                <div className="border-t px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 rounded-xl border bg-muted/50 px-4 py-2.5 text-sm text-muted-foreground">
                      Écrivez votre message...
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                      <ArrowRight className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </div>
                  <p className="mt-2 text-center text-[10px] text-muted-foreground">Propulsé par botexpress</p>
                </div>
              </div>
              {/* Decorative glow */}
              <div className="absolute -inset-4 -z-10 rounded-3xl bg-primary/10 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Social proof bar ── */}
      <section className="border-y bg-muted/30 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-8 sm:gap-12">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4 text-primary" />
            <span><strong className="text-foreground">500+</strong> {t("social_chatbots")}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4 text-primary" />
            <span><strong className="text-foreground">200+</strong> {t("social_companies")}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MessageSquare className="h-4 w-4 text-primary" />
            <span><strong className="text-foreground">50K+</strong> {t("social_conversations")}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-primary" />
            <span><strong className="text-foreground">RGPD</strong> {t("social_gdpr")}</span>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("features_title")}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{t("features_subtitle")}</p>
          </Reveal>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <Reveal key={f.title}>
                <div className="group h-full rounded-2xl border bg-card p-6 transition-shadow hover:shadow-md">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="border-t bg-muted/30 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("how_title")}</h2>
          </Reveal>
          <div className="mt-16 grid gap-12 md:grid-cols-3">
            {[
              { step: "1", title: "Entrez votre URL", desc: "Collez l'adresse de votre site. Notre système explore toutes les pages et extrait le contenu, les couleurs et le logo." },
              { step: "2", title: "Personnalisez", desc: "Choisissez le type de chatbot, ajustez le style. Le widget adopte automatiquement l'identité de votre marque." },
              { step: "3", title: "Intégrez", desc: "Copiez une seule ligne de code et collez-la dans votre site. Votre chatbot est en ligne instantanément." },
            ].map((item) => (
              <Reveal key={item.step} className="text-center">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground">{item.step}</div>
                <h3 className="mb-3 text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <Reveal>
        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("testimonials_title")}</h2>
              <p className="mt-4 text-lg text-muted-foreground">{t("testimonials_subtitle")}</p>
            </div>
            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className="rounded-2xl border bg-card p-6">
                  <div className="mb-3 flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="mb-4 text-sm leading-relaxed text-muted-foreground">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {t.name.split(" ").map((w) => w[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Pricing ── */}
      <section id="pricing" className="border-t bg-muted/30 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("pricing_title")}</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">{t("pricing_subtitle")}</p>
          </Reveal>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((plan) => (
              <Reveal key={plan.name}>
                <div className={`relative h-full rounded-2xl border p-6 ${plan.highlighted ? "border-primary bg-card shadow-lg ring-1 ring-primary" : "bg-card"}`}>
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">Populaire</div>
                  )}
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}&euro;</span>
                    <span className="text-muted-foreground">/mois</span>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{f}
                      </li>
                    ))}
                  </ul>
                  <Button className="mt-8 w-full" variant={plan.highlighted ? "default" : "outline"} asChild>
                    <Link href="/auth/register">{plan.cta}</Link>
                  </Button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <Reveal>
        <section id="faq" className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("faq_title")}</h2>
              <p className="mt-4 text-lg text-muted-foreground">{t("faq_subtitle")}</p>
            </div>
            <div className="mt-12 space-y-3">
              {FAQ_KEYS.map((key) => (
                <FaqItem key={key} q={t(`${key}_q`)} a={t(`${key}_a`)} />
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── CTA final ── */}
      <section className="border-t bg-primary/5 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("cta_title")}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{t("cta_subtitle")}</p>
          <Button size="lg" asChild className="mt-8">
            <Link href="/auth/register">{t("cta_button")} <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">botexpress</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/legal" className="text-sm text-muted-foreground transition-colors hover:text-foreground">{t("footer_legal")}</Link>
              <Link href="/privacy" className="text-sm text-muted-foreground transition-colors hover:text-foreground">{t("footer_privacy")}</Link>
            </div>
          </div>
          <div className="mt-6 border-t pt-6 text-center">
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} botexpress. {t("footer_rights")}</p>
          </div>
        </div>
      </footer>

      {/* ── Scroll animation styles ── */}
      <style jsx global>{`
        .reveal-section {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .reveal-section.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        @media (prefers-reduced-motion: reduce) {
          .reveal-section {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
