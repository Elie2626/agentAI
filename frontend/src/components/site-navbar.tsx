"use client";

import { useState } from "react";
import Link from "next/link";
import { Bot, ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Blog", href: "/blog" },
  { label: "Affiliation", href: "/affiliation" },
];

interface SiteNavbarProps {
  ctaLabel?: string;
  ctaHref?: string;
}

export function SiteNavbar({
  ctaLabel = "Essai gratuit",
  ctaHref = "/auth/register",
}: SiteNavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => setOpen(false)}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">botexpress</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            asChild
            size="sm"
            className="hidden md:inline-flex"
          >
            <Link href="/auth/login">Connexion</Link>
          </Button>
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href={ctaHref}>
              {ctaLabel} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          {/* Hamburger — mobile only */}
          <button
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            className="flex h-9 w-9 items-center justify-center rounded-lg border bg-background transition-colors hover:bg-muted md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t bg-background md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-2 border-t pt-3">
              <Button variant="outline" asChild className="w-full">
                <Link href="/auth/login" onClick={() => setOpen(false)}>
                  Connexion
                </Link>
              </Button>
              <Button asChild className="w-full">
                <Link href={ctaHref} onClick={() => setOpen(false)}>
                  {ctaLabel} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
