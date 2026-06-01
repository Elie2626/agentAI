"use client";

import { useState } from "react";
import Link from "next/link";
import { resetPassword } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Bot, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch {
      toast.error("Impossible d'envoyer l'email. Vérifiez l'adresse.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">BotForge</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Mot de passe oublié</CardTitle>
            <CardDescription>
              Entrez votre email pour recevoir un lien de réinitialisation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="flex flex-col items-center py-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="mt-4 font-semibold">Email envoyé</h3>
                <p className="mt-1 text-center text-sm text-muted-foreground">
                  Si un compte existe pour <strong>{email}</strong>, vous recevrez un lien de réinitialisation dans quelques instants.
                </p>
                <Button variant="outline" asChild className="mt-6">
                  <Link href="/auth/login">
                    <ArrowLeft className="h-4 w-4" />
                    Retour à la connexion
                  </Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="vous@exemple.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9"
                      required
                      autoFocus
                      autoComplete="email"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Spinner className="h-4 w-4" /> : "Envoyer le lien"}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  <Link href="/auth/login" className="font-medium text-primary hover:underline">
                    Retour à la connexion
                  </Link>
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
