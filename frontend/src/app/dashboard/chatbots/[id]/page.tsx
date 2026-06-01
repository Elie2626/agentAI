"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { type Chatbot, type Usage, type ChatbotAnalytics } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { ChatbotPreview } from "@/components/chatbot/chatbot-preview";
import {
  ArrowLeft,
  BarChart3,
  Clock,
  Copy,
  HelpCircle,
  Lock,
  MessageSquare,
  Save,
  Settings,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";

type Tab = "stats" | "config";

export default function ChatbotDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("stats");
  const [chatbot, setChatbot] = useState<Chatbot | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [analytics, setAnalytics] = useState<ChatbotAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [primaryColor, setPrimaryColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");
  const [textColor, setTextColor] = useState("auto");
  const [widgetSize, setWidgetSize] = useState("medium");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [placeholderText, setPlaceholderText] = useState("");

  const canBrand = usage?.features.custom_branding ?? false;

  useEffect(() => {
    async function load() {
      try {
        const [bot, usageData] = await Promise.all([
          api.getChatbot(id),
          api.getUsage(),
        ]);
        setChatbot(bot);
        setUsage(usageData);
        setName(bot.name);
        setPrimaryColor(bot.primary_color);
        setSecondaryColor(bot.secondary_color);
        setTextColor(bot.text_color || "auto");
        setWidgetSize(bot.widget_size || "medium");
        setWelcomeMessage(bot.welcome_message);
        setPlaceholderText(bot.placeholder_text);
      } catch {
        toast.error("Chatbot introuvable");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  useEffect(() => {
    async function loadAnalytics() {
      setAnalyticsLoading(true);
      try {
        const data = await api.getChatbotAnalytics(id);
        setAnalytics(data);
      } catch {
        setAnalytics(null);
      } finally {
        setAnalyticsLoading(false);
      }
    }
    if (!loading) {
      loadAnalytics();
    }
  }, [id, loading]);

  async function handleSave() {
    setSaving(true);
    try {
      const payload: Record<string, string> = {
        name,
        welcome_message: welcomeMessage,
        placeholder_text: placeholderText,
      };
      if (canBrand) {
        payload.primary_color = primaryColor;
        payload.secondary_color = secondaryColor;
        payload.text_color = textColor;
        payload.widget_size = widgetSize;
      }
      const updated = await api.updateChatbot(id, payload);
      setChatbot(updated);
      toast.success("Modifications enregistrées");
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !chatbot) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  const previewBot: Chatbot = {
    ...chatbot,
    name,
    primary_color: primaryColor,
    secondary_color: secondaryColor,
    text_color: textColor,
    widget_size: widgetSize,
    welcome_message: welcomeMessage,
    placeholder_text: placeholderText,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-4">
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ backgroundColor: chatbot.primary_color + "20" }}
          >
            {chatbot.logo_url ? (
              <img src={chatbot.logo_url} alt="" className="h-6 w-6 rounded object-contain" />
            ) : (
              <MessageSquare className="h-5 w-5" style={{ color: chatbot.primary_color }} />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{chatbot.name}</h1>
            <p className="text-sm text-muted-foreground">{chatbot.website_url}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border bg-muted/50 p-1">
        <button
          onClick={() => setTab("stats")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
            tab === "stats"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          Statistiques
        </button>
        <button
          onClick={() => setTab("config")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
            tab === "config"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Settings className="h-4 w-4" />
          Configuration
        </button>
      </div>

      {/* Stats tab */}
      {tab === "stats" && (
        <StatsTab analytics={analytics} loading={analyticsLoading} primaryColor={chatbot.primary_color} />
      )}

      {/* Config tab */}
      {tab === "config" && (
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personnalisation</CardTitle>
                <CardDescription>Modifiez l&apos;apparence et le comportement du chatbot.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="chatbotName" className="text-sm font-medium">Nom</label>
                  <Input
                    id="chatbotName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="relative">
                  {!canBrand && (
                    <div className="absolute -inset-2 z-10 flex flex-col items-center justify-center rounded-lg bg-background/80 backdrop-blur-[2px]">
                      <Lock className="mb-2 h-5 w-5 text-muted-foreground" />
                      <p className="text-sm font-medium text-muted-foreground">Plan Starter ou supérieur requis</p>
                      <Button size="sm" variant="link" asChild className="mt-1">
                        <Link href="/dashboard/billing">Passer à un plan supérieur</Link>
                      </Button>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="primaryColor" className="text-sm font-medium">Couleur principale</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          id="primaryColor"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="h-10 w-10 cursor-pointer rounded-lg border"
                          disabled={!canBrand}
                        />
                        <Input
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="font-mono"
                          disabled={!canBrand}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="secondaryColor" className="text-sm font-medium">Couleur secondaire</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          id="secondaryColor"
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="h-10 w-10 cursor-pointer rounded-lg border"
                          disabled={!canBrand}
                        />
                        <Input
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="font-mono"
                          disabled={!canBrand}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="textColor" className="text-sm font-medium">Couleur du texte</label>
                  <div className="flex items-center gap-2">
                    <select
                      id="textColor"
                      value={textColor === "auto" ? "auto" : "custom"}
                      onChange={(e) => setTextColor(e.target.value === "auto" ? "auto" : "#ffffff")}
                      disabled={!canBrand}
                      className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="auto">Automatique (contraste)</option>
                      <option value="custom">Personnalisé</option>
                    </select>
                    {textColor !== "auto" && (
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="h-10 w-10 cursor-pointer rounded-lg border"
                          disabled={!canBrand}
                        />
                        <Input
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-28 font-mono"
                          disabled={!canBrand}
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    En mode auto, le texte s&apos;adapte pour rester lisible sur la couleur principale.
                  </p>
                </div>
                <div className="space-y-2">
                  <label htmlFor="widgetSize" className="text-sm font-medium">Taille du widget</label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { value: "small", label: "Petit", desc: "320 × 440" },
                      { value: "medium", label: "Moyen", desc: "380 × 520" },
                      { value: "large", label: "Grand", desc: "440 × 600" },
                    ] as const).map((s) => (
                      <button
                        key={s.value}
                        type="button"
                        disabled={!canBrand}
                        onClick={() => setWidgetSize(s.value)}
                        className={`flex flex-col items-center rounded-lg border-2 px-3 py-3 text-sm transition-colors ${
                          widgetSize === s.value
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-muted hover:border-foreground/20"
                        } ${!canBrand ? "opacity-50" : "cursor-pointer"}`}
                      >
                        <span className="font-medium">{s.label}</span>
                        <span className="mt-0.5 text-xs text-muted-foreground">{s.desc}px</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="welcome" className="text-sm font-medium">Message d&apos;accueil</label>
                  <Input
                    id="welcome"
                    value={welcomeMessage}
                    onChange={(e) => setWelcomeMessage(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="placeholder" className="text-sm font-medium">Placeholder</label>
                  <Input
                    id="placeholder"
                    value={placeholderText}
                    onChange={(e) => setPlaceholderText(e.target.value)}
                  />
                </div>
                <Button onClick={handleSave} disabled={saving} className="w-full">
                  {saving ? <Spinner className="h-4 w-4" /> : <><Save className="h-4 w-4" /> Enregistrer</>}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Code d&apos;intégration</CardTitle>
              </CardHeader>
              <CardContent>
                {usage?.can_deploy ? (
                  <div className="relative">
                    <pre className="overflow-x-auto rounded-lg bg-foreground/5 p-4 text-sm">
                      <code>{chatbot.embed_code}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute right-2 top-2"
                      onClick={() => {
                        navigator.clipboard.writeText(chatbot.embed_code);
                        toast.success("Code copié !");
                      }}
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Copier
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8">
                    <Lock className="mb-2 h-6 w-6 text-muted-foreground" />
                    <p className="text-sm font-medium">Abonnement requis</p>
                    <p className="mt-1 text-center text-xs text-muted-foreground">
                      Souscrivez à un plan pour obtenir le code d&apos;intégration et déployer votre chatbot.
                    </p>
                    <Button size="sm" className="mt-4" asChild>
                      <Link href="/dashboard/billing">Voir les offres</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:sticky lg:top-8">
            <h3 className="mb-4 font-semibold">Aperçu en temps réel</h3>
            <ChatbotPreview chatbot={previewBot} />
          </div>
        </div>
      )}
    </div>
  );
}


function StatsTab({
  analytics,
  loading,
  primaryColor,
}: {
  analytics: ChatbotAnalytics | null;
  loading: boolean;
  primaryColor: string;
}) {
  if (loading) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <BarChart3 className="h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">Impossible de charger les statistiques</p>
        </CardContent>
      </Card>
    );
  }

  const maxHourly = Math.max(...analytics.hourly_distribution, 1);
  const maxDaily = Math.max(...analytics.daily_activity.map((d) => d.count), 1);

  const peakHour = analytics.hourly_distribution.indexOf(
    Math.max(...analytics.hourly_distribution)
  );

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Messages total</p>
              <p className="text-2xl font-bold">{analytics.total_messages.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Utilisateurs uniques</p>
              <p className="text-2xl font-bold">{analytics.total_sessions.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Msg / utilisateur</p>
              <p className="text-2xl font-bold">{analytics.avg_messages_per_session}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Heure de pointe</p>
              <p className="text-2xl font-bold">
                {analytics.total_messages > 0 ? `${peakHour}h - ${peakHour + 1}h` : "—"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Daily activity - last 30 days */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Activité des 30 derniers jours</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.total_messages === 0 ? (
              <EmptyChart label="Aucun message pour le moment" />
            ) : (
              <div className="flex items-end gap-[3px]" style={{ height: 160 }}>
                {analytics.daily_activity.map((day) => {
                  const height = maxDaily > 0 ? (day.count / maxDaily) * 100 : 0;
                  const date = new Date(day.date);
                  const label = date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
                  return (
                    <div
                      key={day.date}
                      className="group relative flex-1"
                      style={{ height: "100%" }}
                    >
                      <div className="absolute bottom-0 w-full rounded-t-sm transition-colors" style={{
                        height: `${Math.max(height, day.count > 0 ? 4 : 0)}%`,
                        backgroundColor: day.count > 0 ? primaryColor : "transparent",
                        opacity: 0.8,
                      }} />
                      <div className="pointer-events-none absolute -top-10 left-1/2 z-20 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background group-hover:block">
                        {label}: {day.count} msg
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>Il y a 30j</span>
              <span>Aujourd&apos;hui</span>
            </div>
          </CardContent>
        </Card>

        {/* Hourly distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Répartition par heure</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.total_messages === 0 ? (
              <EmptyChart label="Aucune donnée disponible" />
            ) : (
              <div className="flex items-end gap-1" style={{ height: 160 }}>
                {analytics.hourly_distribution.map((count, hour) => {
                  const height = maxHourly > 0 ? (count / maxHourly) * 100 : 0;
                  return (
                    <div
                      key={hour}
                      className="group relative flex-1"
                      style={{ height: "100%" }}
                    >
                      <div className="absolute bottom-0 w-full rounded-t-sm transition-colors" style={{
                        height: `${Math.max(height, count > 0 ? 4 : 0)}%`,
                        backgroundColor: count > 0 ? primaryColor : "transparent",
                        opacity: hour === peakHour ? 1 : 0.6,
                      }} />
                      <div className="pointer-events-none absolute -top-10 left-1/2 z-20 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background group-hover:block">
                        {hour}h: {count} msg
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>0h</span>
              <span>6h</span>
              <span>12h</span>
              <span>18h</span>
              <span>23h</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top questions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <HelpCircle className="h-4 w-4" />
            Questions les plus fréquentes
          </CardTitle>
          <CardDescription>Les messages les plus envoyés par vos visiteurs sur les 30 derniers jours.</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.top_questions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <HelpCircle className="h-8 w-8 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">
                Pas encore de questions enregistrées
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {analytics.top_questions.map((q, i) => {
                const maxCount = analytics.top_questions[0].count;
                const width = maxCount > 0 ? (q.count / maxCount) * 100 : 0;
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm">{q.question}</p>
                      <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {q.count}x
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${width}%`, backgroundColor: primaryColor }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


function EmptyChart({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center" style={{ height: 160 }}>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
