import type { Metadata } from "next";
import Link from "next/link";
import { Bot, ArrowRight } from "lucide-react";
import { SiteNavbar } from "@/components/site-navbar";

export const metadata: Metadata = {
  title: "Blog — Guides d'intégration chatbot IA | botexpress",
  description: "Guides pratiques pour intégrer un chatbot IA sur votre site web : WordPress, Shopify, HTML, React. Sans code, en quelques minutes.",
  alternates: { canonical: "https://www.botexpress.fr/blog" },
};

const ARTICLES = [
  {
    href: "/blog/integrer-chatbot-site-web",
    title: "Comment intégrer un chatbot sur son site web (2026)",
    description: "Guide complet pas à pas pour ajouter un chatbot IA sur n'importe quel type de site en moins de 5 minutes.",
    tag: "Guide",
    readTime: "6 min",
  },
  {
    href: "/blog/chatbot-wordpress",
    title: "Chatbot WordPress : ajouter un chatbot IA en 5 minutes",
    description: "Plugin officiel botexpress pour WordPress. Installation en 3 clics, compatible tous thèmes.",
    tag: "WordPress",
    readTime: "5 min",
  },
  {
    href: "/blog/chatbot-shopify",
    title: "Chatbot Shopify : automatiser votre support en 10 minutes",
    description: "Intégrez un chatbot IA sur votre boutique Shopify via theme.liquid. Répond aux questions produits 24h/24.",
    tag: "Shopify",
    readTime: "5 min",
  },
  {
    href: "/blog/chatbot-html",
    title: "Ajouter un chatbot sur un site HTML — 1 ligne de code",
    description: "La méthode la plus simple : copiez-collez un script avant </body>. Compatible Webflow, Wix, sites statiques.",
    tag: "HTML",
    readTime: "3 min",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteNavbar />

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Guides d&apos;intégration chatbot</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Tutoriels pratiques pour ajouter un chatbot IA sur votre site, quelle que soit votre plateforme.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          {ARTICLES.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="group flex flex-col rounded-2xl border bg-card p-6 transition-shadow hover:shadow-md hover:border-primary/30"
            >
              <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="rounded-full border bg-muted px-2.5 py-0.5 font-medium">{a.tag}</span>
                <span>{a.readTime} de lecture</span>
              </div>
              <h2 className="text-base font-semibold leading-snug group-hover:text-primary transition-colors">
                {a.title}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {a.description}
              </p>
              <span className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Lire l&apos;article <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </main>

      <footer className="border-t px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">botexpress</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/legal" className="hover:text-foreground">Mentions légales</Link>
            <Link href="/privacy" className="hover:text-foreground">Confidentialité</Link>
          </div>
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} botexpress</p>
        </div>
      </footer>
    </div>
  );
}
