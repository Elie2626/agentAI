import Link from "next/link";
import { Bot, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
        <Bot className="h-8 w-8 text-primary" />
      </div>
      <h1 className="mt-6 text-4xl font-bold tracking-tight">404</h1>
      <p className="mt-2 text-lg text-muted-foreground">
        Cette page n&apos;existe pas ou a été déplacée.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">
          <ArrowLeft className="h-4 w-4" />
          Retour à l&apos;accueil
        </Link>
      </Button>
    </div>
  );
}
