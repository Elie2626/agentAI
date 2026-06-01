"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { type Usage } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Lock, Mail, Send, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

interface Ticket {
  id: string;
  subject: string;
  message: string;
  category: string;
  status: string;
  created_at: string;
}

const CATEGORIES = [
  { value: "general", label: "Question générale" },
  { value: "bug", label: "Signaler un bug" },
  { value: "billing", label: "Facturation" },
  { value: "feature", label: "Demande de fonctionnalité" },
  { value: "other", label: "Autre" },
];

const STATUS_CONFIG: Record<string, { label: string; variant: "default" | "secondary" | "success"; icon: typeof Clock }> = {
  open: { label: "Ouvert", variant: "default", icon: Clock },
  in_progress: { label: "En cours", variant: "secondary", icon: AlertCircle },
  resolved: { label: "Résolu", variant: "success", icon: CheckCircle2 },
};

export default function SupportPage() {
  const [usage, setUsage] = useState<Usage | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("general");

  const hasSupport = usage?.features.email_support ?? false;

  useEffect(() => {
    async function load() {
      try {
        const usageData = await api.getUsage();
        setUsage(usageData);
        if (usageData.features.email_support) {
          const ticketList = await api.listTickets();
          setTickets(ticketList);
        }
      } catch {
        toast.error("Erreur de chargement");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    setSending(true);
    try {
      const ticket = await api.createTicket({ subject, message, category });
      setTickets((prev) => [ticket, ...prev]);
      setSubject("");
      setMessage("");
      setCategory("general");
      toast.success("Ticket envoyé ! Nous reviendrons vers vous rapidement.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de l'envoi");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  if (!hasSupport) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Support</h1>
          <p className="mt-1 text-muted-foreground">Contactez notre équipe de support.</p>
        </div>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <Lock className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Support email non disponible</h3>
            <p className="mt-1 max-w-sm text-center text-sm text-muted-foreground">
              Le support par email est inclus à partir du plan Starter. Passez à un plan supérieur pour contacter notre équipe.
            </p>
            <Button className="mt-6" asChild>
              <Link href="/dashboard/billing">Voir les offres</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Support</h1>
        <p className="mt-1 text-muted-foreground">
          Contactez notre équipe — nous vous répondrons sous 24h.
          {usage?.features.priority_support && (
            <Badge variant="default" className="ml-2 align-middle">Prioritaire</Badge>
          )}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Nouveau ticket
            </CardTitle>
            <CardDescription>Décrivez votre problème ou question en détail.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">Catégorie *</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">Sujet *</label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ex : Problème d'intégration du widget"
                  maxLength={200}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">Message *</label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Décrivez votre problème en détail..."
                  rows={6}
                  maxLength={5000}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                <p className="text-xs text-muted-foreground">{message.length} / 5 000 caractères</p>
              </div>
              <Button type="submit" disabled={sending} className="w-full">
                {sending ? (
                  <Spinner className="h-4 w-4" />
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Envoyer le ticket
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Ticket history */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Mes tickets</h2>
          {tickets.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Mail className="h-8 w-8 text-muted-foreground" />
                <p className="mt-3 text-sm text-muted-foreground">Aucun ticket pour le moment</p>
              </CardContent>
            </Card>
          ) : (
            tickets.map((ticket) => {
              const statusInfo = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open;
              const StatusIcon = statusInfo.icon;
              return (
                <Card key={ticket.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate font-medium">{ticket.subject}</h3>
                          <Badge variant={statusInfo.variant} className="shrink-0">
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {statusInfo.label}
                          </Badge>
                        </div>
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {ticket.message}
                        </p>
                        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="capitalize">{CATEGORIES.find(c => c.value === ticket.category)?.label || ticket.category}</span>
                          <span>
                            {new Date(ticket.created_at).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
