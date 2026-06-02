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
  Download,
  HelpCircle,
  Lock,
  MessageSquare,
  Plus,
  Save,
  Settings,
  Shield,
  Trash2,
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
  const [allowedDomains, setAllowedDomains] = useState<string[]>([]);
  const [newDomain, setNewDomain] = useState("");
  const [savingDomains, setSavingDomains] = useState(false);
  const [leadCaptureEnabled, setLeadCaptureEnabled] = useState(false);
  const [leadCaptureFields, setLeadCaptureFields] = useState<string[]>(["name", "email"]);
  const [leads, setLeads] = useState<{ id: string; name: string; email: string; phone: string; created_at: string }[]>([]);
  const [savingLeads, setSavingLeads] = useState(false);

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
        setAllowedDomains(bot.allowed_domains ?? []);
        setLeadCaptureEnabled(bot.lead_capture_enabled ?? false);
        setLeadCaptureFields(bot.lead_capture_fields ?? ["name", "email"]);
        // Load leads (ignore error if none yet)
        try {
          const leadsData = await api.getLeads(id);
          setLeads(leadsData.leads ?? []);
        } catch { /* no leads yet */ }
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

  function addDomain() {
    const clean = newDomain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
    if (!clean || allowedDomains.includes(clean)) return;
    setAllowedDomains([...allowedDomains, clean]);
    setNewDomain("");
  }

  async function handleSaveDomains() {
    setSavingDomains(true);
    try {
      const updated = await api.updateChatbot(id, { allowed_domains: allowedDomains });
      setChatbot(updated);
      toast.success("Domaines autorisés enregistrés");
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSavingDomains(false);
    }
  }

  async function handleSaveLeadCapture() {
    setSavingLeads(true);
    try {
      const updated = await api.updateChatbot(id, {
        lead_capture_enabled: leadCaptureEnabled,
        lead_capture_fields: leadCaptureFields,
      });
      setChatbot(updated);
      toast.success("Capture de leads enregistrée");
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSavingLeads(false);
    }
  }

  function toggleLeadField(field: string) {
    setLeadCaptureFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
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
        <StatsTab analytics={analytics} loading={analyticsLoading} primaryColor={chatbot.primary_color} leads={leads} leadCaptureEnabled={leadCaptureEnabled} />
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

            {usage?.can_deploy && (
              <Card>
                <CardHeader>
                  <CardTitle>Plugins CMS</CardTitle>
                  <CardDescription>Installez votre chatbot en un clic sur WordPress ou Shopify.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* WordPress */}
                  <div className="rounded-lg border p-4 space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#21759B]/10">
                          <svg className="h-5 w-5 text-[#21759B]" viewBox="0 0 24 24" fill="currentColor" aria-label="WordPress">
                            <path d="M21.469 6.825c.84 1.537 1.318 3.3 1.318 5.175 0 3.979-2.156 7.456-5.363 9.325l3.295-9.527c.615-1.54.82-2.771.82-3.864 0-.405-.026-.78-.07-1.11m-7.981.105c.647-.03 1.232-.105 1.232-.105.582-.075.514-.93-.067-.899 0 0-1.755.135-2.88.135-1.064 0-2.85-.15-2.85-.15-.585-.03-.661.855-.075.885 0 0 .54.061 1.125.09l1.68 4.605-2.37 7.08L5.354 6.9c.649-.03 1.234-.1 1.234-.1.585-.075.516-.93-.065-.896 0 0-1.746.138-2.874.138-.2 0-.438-.008-.69-.015C4.911 3.15 8.235 1.215 12 1.215c2.809 0 5.365 1.072 7.286 2.833-.046-.003-.091-.009-.141-.009-1.06 0-1.812.923-1.812 1.914 0 .89.513 1.643 1.06 2.531.411.72.89 1.643.89 2.977 0 .915-.354 1.994-.821 3.479l-1.075 3.585-3.9-11.61.001.014zM12 22.784c-1.059 0-2.081-.153-3.048-.437l3.237-9.406 3.315 9.087c.024.053.05.101.078.149-1.12.393-2.325.609-3.582.609M1.211 12c0-1.564.336-3.05.935-4.39L7.29 21.709C3.694 19.96 1.212 16.271 1.211 12M12 0C5.385 0 0 5.385 0 12s5.385 12 12 12 12-5.385 12-12S18.615 0 12 0"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium">WordPress</p>
                          <p className="text-xs text-muted-foreground">Plugin à installer via Extensions → Ajouter</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <a href="/botexpress-chatbot.zip" download>
                          <Download className="h-3.5 w-3.5 mr-1.5" />
                          Télécharger
                        </a>
                      </Button>
                    </div>
                    <div>
                      <p className="mb-1.5 text-xs font-medium text-muted-foreground">Votre Chatbot ID (à coller dans Réglages → botexpress) :</p>
                      <div className="relative">
                        <pre className="overflow-x-auto rounded-lg bg-foreground/5 px-3 py-2 text-xs">
                          <code>{chatbot.id}</code>
                        </pre>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => {
                            navigator.clipboard.writeText(chatbot.id);
                            toast.success("Chatbot ID copié !");
                          }}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  {/* Shopify */}
                  <div className="rounded-lg border p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#96BF48]/10">
                        <svg className="h-5 w-5 text-[#96BF48]" viewBox="0 0 24 24" fill="currentColor" aria-label="Shopify">
                          <path d="M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.73c-.018-.116-.114-.192-.211-.192s-1.929-.136-1.929-.136-1.275-1.274-1.439-1.411c-.045-.037-.075-.057-.121-.074l-.914 21.104h.023zM11.71 11.305s-.81-.424-1.774-.424c-1.447 0-1.504.906-1.504 1.141 0 1.232 3.24 1.715 3.24 4.629 0 2.295-1.44 3.76-3.406 3.76-2.354 0-3.54-1.465-3.54-1.465l.646-2.086s1.245 1.066 2.28 1.066c.675 0 .975-.545.975-.932 0-1.619-2.654-1.694-2.654-4.359-.034-2.237 1.571-4.416 4.827-4.416 1.257 0 1.875.361 1.875.361l-.945 2.715-.02.01zM11.17.83c.136 0 .271.038.405.135-.984.465-2.064 1.639-2.508 3.992-.656.213-1.293.405-1.889.578C7.697 3.75 8.951.84 11.17.84V.83zm1.235 2.949v.135c-.754.232-1.583.484-2.394.736.466-1.777 1.333-2.645 2.085-2.971.193.501.309 1.176.309 2.1zm.539-2.234c.694.074 1.141.867 1.429 1.755-.349.114-.735.231-1.158.366v-.252c0-.752-.096-1.371-.271-1.871v.002zm2.992 1.289c-.02 0-.06.021-.078.021s-.289.075-.714.21c-.423-1.233-1.176-2.37-2.508-2.37h-.115C12.135.209 11.669 0 11.265 0 8.159 0 6.675 3.877 6.21 5.846c-1.194.365-2.063.636-2.16.674-.675.213-.694.232-.772.87-.075.462-1.83 14.063-1.83 14.063L15.009 24l.927-21.166z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Shopify</p>
                        <p className="text-xs text-muted-foreground">Collez ce code dans votre <code className="text-xs bg-muted px-1 rounded">theme.liquid</code></p>
                      </div>
                    </div>
                    <div className="relative">
                      <pre className="overflow-x-auto rounded-lg bg-foreground/5 p-3 text-xs">
                        <code>{`<script\n  src="https://www.botexpress.fr/widget.js"\n  data-chatbot-id="${chatbot.id}"\n  data-api-url="https://agentai-23tt.onrender.com"\n  defer\n></script>`}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute right-2 top-2"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `<script\n  src="https://www.botexpress.fr/widget.js"\n  data-chatbot-id="${chatbot.id}"\n  data-api-url="https://agentai-23tt.onrender.com"\n  defer\n></script>`
                          );
                          toast.success("Code Shopify copié !");
                        }}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Dans Shopify Admin → Boutique en ligne → Thèmes → Modifier le code → <code className="bg-muted px-1 rounded">layout/theme.liquid</code> → collez juste avant <code className="bg-muted px-1 rounded">&lt;/body&gt;</code>
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:sticky lg:top-8 space-y-6">
            <div>
              <h3 className="mb-4 font-semibold">Aperçu en temps réel</h3>
              <ChatbotPreview chatbot={previewBot} />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Domaines autorisés
                </CardTitle>
                <CardDescription>
                  Limitez l&apos;utilisation du widget à vos domaines. Si aucun domaine n&apos;est ajouté, le widget fonctionne partout.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="exemple.com"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addDomain()}
                  />
                  <Button variant="secondary" size="icon" onClick={addDomain} aria-label="Ajouter">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {allowedDomains.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Aucun domaine restreint — widget accessible depuis n&apos;importe quel site.</p>
                ) : (
                  <ul className="space-y-2">
                    {allowedDomains.map((d) => (
                      <li key={d} className="flex items-center justify-between rounded-md border bg-muted/40 px-3 py-2 text-sm font-mono">
                        {d}
                        <button
                          aria-label={`Supprimer ${d}`}
                          onClick={() => setAllowedDomains(allowedDomains.filter((x) => x !== d))}
                          className="ml-2 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <Button onClick={handleSaveDomains} disabled={savingDomains} size="sm" className="w-full">
                  {savingDomains ? <Spinner className="h-4 w-4" /> : <><Save className="h-3.5 w-3.5" /> Enregistrer les domaines</>}
                </Button>
              </CardContent>
            </Card>

            {/* Lead capture */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Capture de leads
                </CardTitle>
                <CardDescription>
                  Collectez nom, email et téléphone avant que le visiteur commence à chatter.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="flex cursor-pointer items-center justify-between gap-3">
                  <span className="text-sm font-medium">Activer la capture de leads</span>
                  <button
                    role="switch"
                    aria-checked={leadCaptureEnabled}
                    onClick={() => setLeadCaptureEnabled(!leadCaptureEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${leadCaptureEnabled ? "bg-primary" : "bg-muted-foreground/30"}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${leadCaptureEnabled ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                </label>
                {leadCaptureEnabled && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Champs à collecter :</p>
                    {[
                      { key: "name", label: "Nom" },
                      { key: "email", label: "Email" },
                      { key: "phone", label: "Téléphone" },
                    ].map(({ key, label }) => (
                      <label key={key} className="flex cursor-pointer items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={leadCaptureFields.includes(key)}
                          onChange={() => toggleLeadField(key)}
                          className="h-4 w-4 rounded border-border accent-primary"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                )}
                <Button onClick={handleSaveLeadCapture} disabled={savingLeads} size="sm" className="w-full">
                  {savingLeads ? <Spinner className="h-4 w-4" /> : <><Save className="h-3.5 w-3.5" /> Enregistrer</>}
                </Button>

                {/* Leads list */}
                {leads.length > 0 && (
                  <div className="mt-2">
                    <p className="mb-2 text-xs font-medium text-muted-foreground">{leads.length} lead{leads.length > 1 ? "s" : ""} collecté{leads.length > 1 ? "s" : ""}</p>
                    <div className="max-h-48 overflow-y-auto rounded-lg border">
                      {leads.map((lead) => (
                        <div key={lead.id} className="border-b px-3 py-2 last:border-0">
                          <p className="text-sm font-medium">{lead.name || lead.email || "Anonyme"}</p>
                          <p className="text-xs text-muted-foreground">{lead.email}{lead.phone ? ` · ${lead.phone}` : ""}</p>
                          <p className="text-xs text-muted-foreground/60">{new Date(lead.created_at).toLocaleDateString("fr-FR")}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
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
  leads,
  leadCaptureEnabled,
}: {
  analytics: ChatbotAnalytics | null;
  loading: boolean;
  primaryColor: string;
  leads: { id: string; name: string; email: string; phone: string; created_at: string }[];
  leadCaptureEnabled: boolean;
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

      {/* Leads card — shown if capture enabled OR at least 1 lead exists */}
      {(leadCaptureEnabled || leads.length > 0) && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4 text-primary" />
                Leads collectés
              </CardTitle>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {leads.length} lead{leads.length !== 1 ? "s" : ""}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {leads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Users className="mb-2 h-8 w-8 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">Aucun lead pour le moment.</p>
                <p className="mt-1 text-xs text-muted-foreground">Les visiteurs qui remplissent le formulaire apparaîtront ici.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs text-muted-foreground">
                      <th className="pb-2 pr-4 font-medium">Nom</th>
                      <th className="pb-2 pr-4 font-medium">Email</th>
                      <th className="pb-2 pr-4 font-medium">Téléphone</th>
                      <th className="pb-2 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {leads.map((lead) => (
                      <tr key={lead.id}>
                        <td className="py-2 pr-4 font-medium">{lead.name || <span className="text-muted-foreground">—</span>}</td>
                        <td className="py-2 pr-4">{lead.email || <span className="text-muted-foreground">—</span>}</td>
                        <td className="py-2 pr-4">{lead.phone || <span className="text-muted-foreground">—</span>}</td>
                        <td className="py-2 text-muted-foreground text-xs">{new Date(lead.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

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
