"use client";

import React, { useEffect, useRef } from "react";
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
  UtensilsCrossed,
  Home,
  ShoppingCart,
  Wrench,
  HeartPulse,
  Briefcase,
  Clock,
  CheckCircle2,
  Download,
  Copy,
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
  { name: "Basic", monthlyPrice: 9.99, features: ["1 chatbot", "100 messages/mois", "5 pages analysées", "Widget standard"], cta: "Essayer gratuitement", highlighted: false },
  { name: "Starter", monthlyPrice: 29, features: ["3 chatbots", "1 000 messages/mois", "50 pages analysées", "Branding personnalisé", "Support email"], cta: "Essayer gratuitement", highlighted: false },
  { name: "Pro", monthlyPrice: 79, features: ["10 chatbots", "10 000 messages/mois", "200 pages analysées", "Branding personnalisé", "Analytics avancés", "Support prioritaire"], cta: "Essayer gratuitement", highlighted: true },
  { name: "Business", monthlyPrice: 199, features: ["50 chatbots", "100 000 messages/mois", "1 000 pages analysées", "Tout inclus", "Support dédié", "API access"], cta: "Essayer gratuitement", highlighted: false },
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
  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "annual">("monthly");

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
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            {isAuthenticated ? (
              <Button asChild size="sm"><Link href="/dashboard">{t("nav_dashboard")} <ArrowRight className="h-4 w-4" /></Link></Button>
            ) : (
              <>
                <Button variant="ghost" asChild className="hidden sm:inline-flex"><Link href="/auth/login">{t("nav_login")}</Link></Button>
                <Button asChild size="sm"><Link href="/auth/register"><span className="sm:hidden">S'inscrire</span><span className="hidden sm:inline">{t("nav_register")}</span> <ArrowRight className="h-4 w-4" /></Link></Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero + Demo ── */}
      <section className="relative overflow-hidden px-4 pb-16 pt-12 sm:pb-24 sm:pt-20 sm:px-6 lg:px-8">
        <AnimatedHeroBg />
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left — Text */}
            <div className="text-center lg:text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm text-muted-foreground">
                <Zap className="h-3.5 w-3.5 text-primary" />
                {t("hero_badge")}
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                {t("hero_title1")}
                <span className="block text-primary">{t("hero_title2")}</span>
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground lg:mx-0">
                {t("hero_subtitle")}
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-4 lg:justify-start">
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
      <section id="features" className="px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("features_title")}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{t("features_subtitle")}</p>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:mt-16 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
      <section className="border-t bg-muted/30 px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("how_title")}</h2>
          </Reveal>
          <div className="mt-12 grid gap-8 sm:gap-12 md:grid-cols-3">
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

      {/* ── Integrations ── */}
      <section className="px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Compatible avec tous vos outils</h2>
            <p className="mt-4 text-lg text-muted-foreground">HTML, WordPress, Shopify — intégrez votre chatbot en moins de 2 minutes, sans aucune connaissance technique.</p>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:mt-16 lg:grid-cols-3">
            {/* HTML */}
            <Reveal>
              <div className="flex h-full flex-col rounded-2xl border bg-card p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                    <Code2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">HTML / Tout site</p>
                    <p className="text-xs text-muted-foreground">Site statique, Webflow, Wix…</p>
                  </div>
                </div>
                <ol className="flex-1 space-y-3">
                  {[
                    { n: "1", text: "Créez votre chatbot depuis le dashboard botexpress" },
                    { n: "2", text: "Copiez le script généré automatiquement (1 ligne)" },
                    { n: "3", text: "Collez-le avant </body> dans le code de votre site" },
                    { n: "4", text: "Sauvegardez — votre chatbot est en ligne" },
                  ].map((s) => (
                    <li key={s.n} className="flex items-start gap-3 text-sm">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{s.n}</span>
                      <span className="text-muted-foreground">{s.text}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-6 rounded-xl bg-muted/60 px-4 py-3 font-mono text-xs text-muted-foreground">
                  <span className="text-primary">&lt;script</span> src=&quot;botexpress.fr/widget.js&quot;<br />
                  &nbsp;&nbsp;data-chatbot-id=&quot;<span className="text-amber-500">votre-id</span>&quot;<br />
                  <span className="text-primary">&gt;&lt;/script&gt;</span>
                </div>
              </div>
            </Reveal>

            {/* WordPress */}
            <Reveal>
              <div className="flex h-full flex-col rounded-2xl border bg-card p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#21759B]/10">
                    <svg className="h-5 w-5 text-[#21759B]" viewBox="0 0 24 24" fill="currentColor" aria-label="WordPress">
                      <path d="M21.469 6.825c.84 1.537 1.318 3.3 1.318 5.175 0 3.979-2.156 7.456-5.363 9.325l3.295-9.527c.615-1.54.82-2.771.82-3.864 0-.405-.026-.78-.07-1.11m-7.981.105c.647-.03 1.232-.105 1.232-.105.582-.075.514-.93-.067-.899 0 0-1.755.135-2.88.135-1.064 0-2.85-.15-2.85-.15-.585-.03-.661.855-.075.885 0 0 .54.061 1.125.09l1.68 4.605-2.37 7.08L5.354 6.9c.649-.03 1.234-.1 1.234-.1.585-.075.516-.93-.065-.896 0 0-1.746.138-2.874.138-.2 0-.438-.008-.69-.015C4.911 3.15 8.235 1.215 12 1.215c2.809 0 5.365 1.072 7.286 2.833-.046-.003-.091-.009-.141-.009-1.06 0-1.812.923-1.812 1.914 0 .89.513 1.643 1.06 2.531.411.72.89 1.643.89 2.977 0 .915-.354 1.994-.821 3.479l-1.075 3.585-3.9-11.61.001.014zM12 22.784c-1.059 0-2.081-.153-3.048-.437l3.237-9.406 3.315 9.087c.024.053.05.101.078.149-1.12.393-2.325.609-3.582.609M1.211 12c0-1.564.336-3.05.935-4.39L7.29 21.709C3.694 19.96 1.212 16.271 1.211 12M12 0C5.385 0 0 5.385 0 12s5.385 12 12 12 12-5.385 12-12S18.615 0 12 0"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">WordPress</p>
                    <p className="text-xs text-muted-foreground">Plugin officiel botexpress</p>
                  </div>
                </div>
                <ol className="flex-1 space-y-3">
                  {[
                    { n: "1", text: "Allez dans votre dashboard → Intégration → Télécharger le plugin WordPress" },
                    { n: "2", text: "WP Admin → Extensions → Ajouter → Téléverser le fichier .zip" },
                    { n: "3", text: "Activez le plugin" },
                    { n: "4", text: "Réglages → botexpress → collez votre Chatbot ID → Sauvegardez" },
                  ].map((s) => (
                    <li key={s.n} className="flex items-start gap-3 text-sm">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-xs font-bold text-blue-500">{s.n}</span>
                      <span className="text-muted-foreground">{s.text}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-6 flex items-center gap-2 rounded-xl bg-blue-500/5 border border-blue-500/20 px-4 py-3 text-sm">
                  <Download className="h-4 w-4 shrink-0 text-blue-500" />
                  <span className="text-blue-600 dark:text-blue-400 font-medium">Plugin disponible dans votre dashboard</span>
                </div>
              </div>
            </Reveal>

            {/* Shopify */}
            <Reveal>
              <div className="flex h-full flex-col rounded-2xl border bg-card p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#96BF48]/10">
                    <svg className="h-5 w-5 text-[#96BF48]" viewBox="0 0 24 24" fill="currentColor" aria-label="Shopify">
                      <path d="M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.73c-.018-.116-.114-.192-.211-.192s-1.929-.136-1.929-.136-1.275-1.274-1.439-1.411c-.045-.037-.075-.057-.121-.074l-.914 21.104h.023zM11.71 11.305s-.81-.424-1.774-.424c-1.447 0-1.504.906-1.504 1.141 0 1.232 3.24 1.715 3.24 4.629 0 2.295-1.44 3.76-3.406 3.76-2.354 0-3.54-1.465-3.54-1.465l.646-2.086s1.245 1.066 2.28 1.066c.675 0 .975-.545.975-.932 0-1.619-2.654-1.694-2.654-4.359-.034-2.237 1.571-4.416 4.827-4.416 1.257 0 1.875.361 1.875.361l-.945 2.715-.02.01zM11.17.83c.136 0 .271.038.405.135-.984.465-2.064 1.639-2.508 3.992-.656.213-1.293.405-1.889.578C7.697 3.75 8.951.84 11.17.84V.83zm1.235 2.949v.135c-.754.232-1.583.484-2.394.736.466-1.777 1.333-2.645 2.085-2.971.193.501.309 1.176.309 2.1zm.539-2.234c.694.074 1.141.867 1.429 1.755-.349.114-.735.231-1.158.366v-.252c0-.752-.096-1.371-.271-1.871v.002zm2.992 1.289c-.02 0-.06.021-.078.021s-.289.075-.714.21c-.423-1.233-1.176-2.37-2.508-2.37h-.115C12.135.209 11.669 0 11.265 0 8.159 0 6.675 3.877 6.21 5.846c-1.194.365-2.063.636-2.16.674-.675.213-.694.232-.772.87-.075.462-1.83 14.063-1.83 14.063L15.009 24l.927-21.166z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">Shopify</p>
                    <p className="text-xs text-muted-foreground">Snippet liquid prêt à l&apos;emploi</p>
                  </div>
                </div>
                <ol className="flex-1 space-y-3">
                  {[
                    { n: "1", text: "Dashboard → Intégration → Copier le snippet Shopify" },
                    { n: "2", text: "Shopify Admin → Boutique en ligne → Thèmes → Modifier le code" },
                    { n: "3", text: "Ouvrez layout/theme.liquid" },
                    { n: "4", text: "Collez le snippet juste avant </body> et sauvegardez" },
                  ].map((s) => (
                    <li key={s.n} className="flex items-start gap-3 text-sm">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-bold text-emerald-500">{s.n}</span>
                      <span className="text-muted-foreground">{s.text}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-500/5 border border-emerald-500/20 px-4 py-3 text-sm">
                  <Copy className="h-4 w-4 shrink-0 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Code copié en 1 clic depuis votre dashboard</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <Reveal>
        <section className="px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("testimonials_title")}</h2>
              <p className="mt-4 text-lg text-muted-foreground">{t("testimonials_subtitle")}</p>
            </div>
            <div className="mt-10 grid gap-4 sm:mt-16 sm:grid-cols-2 md:grid-cols-3">
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
      <section id="pricing" className="border-t bg-muted/30 px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("pricing_title")}</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">{t("pricing_subtitle")}</p>
          </Reveal>
          {/* Billing toggle */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="flex items-center gap-1 rounded-xl border bg-background p-1 shadow-sm">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`rounded-lg px-5 py-2 text-sm font-medium transition-all ${billingCycle === "monthly" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition-all ${billingCycle === "annual" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
              >
                Annuel
                <span className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${billingCycle === "annual" ? "bg-white/20 text-white" : "bg-emerald-500/15 text-emerald-600"}`}>-20%</span>
              </button>
            </div>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Zap className="h-3.5 w-3.5 text-primary" />
              7 jours gratuits · carte requise · résiliation à tout moment
            </p>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((plan) => {
              const price = billingCycle === "annual"
                ? Math.round(plan.monthlyPrice * 12 * 0.8 / 12 * 100) / 100
                : plan.monthlyPrice;
              const displayPrice = price % 1 === 0 ? price.toString() : price.toFixed(2).replace(".", ",");
              return (
                <Reveal key={plan.name}>
                  <div className={`relative flex h-full flex-col rounded-2xl border p-6 ${plan.highlighted ? "border-primary bg-card shadow-lg ring-1 ring-primary" : "bg-card"}`}>
                    {plan.highlighted && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">Populaire</div>
                    )}
                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="text-4xl font-bold">{displayPrice}&euro;</span>
                      <span className="text-muted-foreground">/mois</span>
                    </div>
                    {billingCycle === "annual" && (
                      <p className="mt-0.5 text-xs text-emerald-600">Facturé {Math.round(plan.monthlyPrice * 12 * 0.8)}&euro;/an</p>
                    )}
                    <div className="mt-3 rounded-lg bg-primary/8 px-3 py-1.5 text-center text-xs font-medium text-primary">
                      7 jours gratuits
                    </div>
                    <ul className="mt-5 flex-1 space-y-3">
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
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <Reveal>
        <section id="faq" className="px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("faq_title")}</h2>
              <p className="mt-4 text-lg text-muted-foreground">{t("faq_subtitle")}</p>
            </div>
            <div className="mt-8 space-y-3 sm:mt-12">
              {FAQ_KEYS.map((key) => (
                <FaqItem key={key} q={t(`${key}_q`)} a={t(`${key}_a`)} />
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Niches ── */}
      <Reveal>
        <section className="border-t px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("niches_title")}</h2>
              <p className="mt-4 text-lg text-muted-foreground">{t("niches_subtitle")}</p>
            </div>
            <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: UtensilsCrossed, key: "restaurant", href: "/chatbot-restaurant", color: "text-orange-500", bg: "bg-orange-500/10" },
                { icon: Home,            key: "immo",       href: "/chatbot-immobilier", color: "text-emerald-500", bg: "bg-emerald-500/10" },
                { icon: ShoppingCart,    key: "ecommerce",  href: "/chatbot-ecommerce",  color: "text-blue-500",    bg: "bg-blue-500/10" },
                { icon: Wrench,          key: "pme",        href: "/chatbot-pme",         color: "text-violet-500",  bg: "bg-violet-500/10" },
                { icon: HeartPulse,      key: "sante",      href: "/chatbot-sante",       color: "text-rose-500",    bg: "bg-rose-500/10" },
                { icon: Briefcase,       key: "service",    href: "/chatbot-services",    color: "text-primary",     bg: "bg-primary/10" },
              ].map(({ icon: Icon, key, href, color, bg }) => (
                <Link key={key} href={href} className="group rounded-2xl border bg-card p-6 transition-all hover:shadow-md hover:border-primary/40">
                  <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${bg}`}>
                    <Icon className={`h-5 w-5 ${color}`} />
                  </div>
                  <h3 className="font-semibold">{t(`niche_${key}` as never)}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{t(`niche_${key}_desc` as never)}</p>
                  <span className={`mt-4 inline-flex items-center gap-1 text-sm font-medium ${color} opacity-0 transition-opacity group-hover:opacity-100`}>
                    En savoir plus <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Objections ── */}
      <Reveal>
        <section className="border-t bg-muted/30 px-4 py-16 sm:py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("obj_title")}</h2>
            </div>
            <div className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              {(["1","2","3","4"] as const).map((n) => (
                <div key={n} className="rounded-2xl border bg-card p-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    {n === "1" ? <Clock className="h-5 w-5 text-primary" /> :
                     n === "2" ? <Bot className="h-5 w-5 text-primary" /> :
                     n === "3" ? <Code2 className="h-5 w-5 text-primary" /> :
                                 <Palette className="h-5 w-5 text-primary" />}
                  </div>
                  <h3 className="font-semibold">{t(`obj_${n}_title` as never)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(`obj_${n}_desc` as never)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── CTA final ── */}
      <section className="border-t bg-primary/5 px-4 py-16 sm:py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("cta_title")}</h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">{t("cta_subtitle")}</p>
          <Button size="lg" asChild className="mt-8">
            <Link href="/auth/register">{t("cta_button")} <ArrowRight className="h-4 w-4" /></Link>
          </Button>
          <div className="mt-4 flex flex-col items-center gap-2 text-sm text-muted-foreground sm:flex-row sm:justify-center sm:gap-0">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Aucune carte bancaire</span>
            <span className="hidden sm:mx-3 sm:inline">·</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Sans code</span>
            <span className="hidden sm:mx-3 sm:inline">·</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Prêt en 30 secondes</span>
          </div>
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
