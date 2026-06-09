import Link from "next/link";
import { Bot, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteNavbar } from "@/components/site-navbar";

interface BlogPostLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  date?: string;
  readTime?: string;
}

export function BlogPostLayout({ children, title, description, date = "2026", readTime = "5 min" }: BlogPostLayoutProps) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteNavbar />

      {/* Article */}
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground" aria-label="Fil d'Ariane">
          <Link href="/" className="hover:text-foreground transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-foreground">{title.length > 40 ? title.slice(0, 40) + "…" : title}</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="mb-4 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="rounded-full border bg-muted px-3 py-1 font-medium">Guide</span>
            <span>{date}</span>
            <span>·</span>
            <span>{readTime} de lecture</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{description}</p>
        </header>

        {/* Content */}
        <div className="prose prose-slate dark:prose-invert max-w-none
          prose-headings:font-bold prose-headings:tracking-tight
          prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:pb-2
          prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
          prose-p:text-muted-foreground prose-p:leading-7
          prose-li:text-muted-foreground
          prose-strong:text-foreground
          prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-mono prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none
          prose-pre:rounded-xl prose-pre:border prose-pre:bg-muted/50 prose-pre:overflow-x-auto
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        ">
          {children}
        </div>
      </article>

      {/* CTA */}
      <section className="border-t bg-primary/5 px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Prêt à ajouter un chatbot sur votre site ?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Créez et intégrez votre chatbot en moins de 5 minutes. 7 jours d&apos;essai gratuit.
          </p>
          <Button size="lg" asChild className="mt-6">
            <Link href="/auth/register">Créer mon chatbot gratuitement <ArrowRight className="h-4 w-4" /></Link>
          </Button>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
            {["Sans carte bancaire", "Sans code", "Prêt en 2 minutes"].map((f) => (
              <span key={f} className="flex items-center gap-1">
                <Check className="h-3.5 w-3.5 text-emerald-500" /> {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">botexpress</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/legal" className="hover:text-foreground transition-colors">Mentions légales</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Confidentialité</Link>
            <Link href="/affiliation" className="hover:text-foreground transition-colors">Affiliation</Link>
          </div>
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} botexpress</p>
        </div>
      </footer>
    </div>
  );
}
