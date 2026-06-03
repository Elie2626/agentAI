"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { signOut } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Bot,
  LayoutDashboard,
  MessageSquarePlus,
  CreditCard,
  LifeBuoy,
  Settings,
  LogOut,
  Menu,
  X,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useT } from "@/i18n";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_ITEMS = [
  { href: "/dashboard", labelKey: "nav_my_chatbots", icon: LayoutDashboard },
  { href: "/dashboard/chatbots/new", labelKey: "nav_new_chatbot", icon: MessageSquarePlus },
  { href: "/dashboard/billing", labelKey: "nav_billing", icon: CreditCard },
  { href: "/dashboard/affiliate", labelKey: "nav_affiliate", icon: Users },
  { href: "/dashboard/support", labelKey: "nav_support", icon: LifeBuoy },
  { href: "/dashboard/settings", labelKey: "nav_settings", icon: Settings },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useT();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
    // Create Firestore user document on first dashboard visit
    if (!loading && user) {
      import("@/lib/api").then(({ api }) => api.getMe().catch(() => {}));
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-dvh bg-muted/30">
      {/* Mobile header */}
      <div className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background px-4 lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Bot className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold">botexpress</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-muted"
          aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-background transition-transform lg:static lg:translate-x-0",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <Link href="/" className="hidden h-16 items-center gap-2 border-b px-6 lg:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold">botexpress</span>
          </Link>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </nav>

          <div className="border-t p-3">
            <div className="mb-3 flex items-center justify-between rounded-lg bg-muted px-3 py-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{user.displayName || "Utilisateur"}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
              <ThemeToggle className="shrink-0" />
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground"
              onClick={() => {
                signOut();
                router.push("/");
              }}
            >
              <LogOut className="h-5 w-5" />
              {t("nav_logout")}
            </Button>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-h-[calc(100dvh-4rem)] flex-1 lg:min-h-dvh">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
