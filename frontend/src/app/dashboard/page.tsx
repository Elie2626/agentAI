"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { type Chatbot, type Usage } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  MessageSquarePlus,
  Globe,
  MessageSquare,
  BarChart3,
  ExternalLink,
  Trash2,
  Copy,
  Settings,
} from "lucide-react";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [bots, usageData] = await Promise.all([
          api.listChatbots(),
          api.getUsage(),
        ]);
        setChatbots(bots);
        setUsage(usageData);
      } catch {
        toast.error("Erreur de chargement");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce chatbot ?")) return;
    try {
      await api.deleteChatbot(id);
      setChatbots((prev) => prev.filter((c) => c.id !== id));
      toast.success("Chatbot supprimé");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  }

  function copyEmbedCode(code: string) {
    navigator.clipboard.writeText(code);
    toast.success("Code copié dans le presse-papiers");
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Mes chatbots</h1>
          <p className="mt-1 text-muted-foreground">
            Gérez et personnalisez vos chatbots IA.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/chatbots/new">
            <MessageSquarePlus className="h-4 w-4" />
            Nouveau chatbot
          </Link>
        </Button>
      </div>

      {/* Upgrade banner for free users */}
      {usage && !usage.can_deploy && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold">Activez vos chatbots</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Vous pouvez créer et configurer vos chatbots gratuitement. Pour les déployer sur votre site, souscrivez à un abonnement.
              </p>
            </div>
            <Button asChild className="shrink-0">
              <Link href="/dashboard/billing">Voir les offres</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      {usage && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Messages cette période</p>
                <p className="text-xl font-bold">
                  {usage.messages_used.toLocaleString()}{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    / {usage.messages_limit.toLocaleString()}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Chatbots actifs</p>
                <p className="text-xl font-bold">
                  {usage.chatbots_used}{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    / {usage.chatbots_limit}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Plan actuel</p>
                <p className="text-xl font-bold capitalize">{usage.plan}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chatbot list */}
      {chatbots.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <MessageSquarePlus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Aucun chatbot</h3>
            <p className="mt-1 text-center text-sm text-muted-foreground">
              Créez votre premier chatbot en quelques minutes.
            </p>
            <Button className="mt-6" asChild>
              <Link href="/dashboard/chatbots/new">
                <MessageSquarePlus className="h-4 w-4" />
                Créer un chatbot
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {chatbots.map((bot) => (
            <Card key={bot.id} className="overflow-hidden">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: bot.primary_color + "20" }}
                  >
                    {bot.logo_url ? (
                      <img src={bot.logo_url} alt="" className="h-6 w-6 rounded object-contain" />
                    ) : (
                      <Globe className="h-5 w-5" style={{ color: bot.primary_color }} />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-base">{bot.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">{bot.website_url}</p>
                  </div>
                </div>
                {usage?.can_deploy ? (
                  <Badge variant="success">Actif</Badge>
                ) : (
                  <Badge variant="secondary">Brouillon</Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: bot.primary_color }} />
                  <span className="text-xs text-muted-foreground">{bot.primary_color}</span>
                  <span className="text-xs text-muted-foreground">|</span>
                  <span className="text-xs text-muted-foreground">{bot.font_family}</span>
                  <span className="text-xs text-muted-foreground">|</span>
                  <span className="text-xs capitalize text-muted-foreground">{bot.industry}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/dashboard/chatbots/${bot.id}`}>
                      <Settings className="h-3.5 w-3.5" />
                      Configurer
                    </Link>
                  </Button>
                  {usage?.can_deploy ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyEmbedCode(bot.embed_code)}
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copier le code
                  </Button>
                  ) : (
                  <Button size="sm" variant="default" asChild>
                    <Link href="/dashboard/billing">
                      S&apos;abonner pour activer
                    </Link>
                  </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleDelete(bot.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
