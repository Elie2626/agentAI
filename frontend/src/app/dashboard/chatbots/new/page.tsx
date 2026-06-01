"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { CHATBOT_TYPES, type ChatbotType } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  ArrowLeft,
  ArrowRight,
  Headphones,
  TrendingUp,
  Calendar,
  UtensilsCrossed,
  Home,
  ShoppingCart,
  Bot,
  Check,
  Globe,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { ChatbotPreview } from "@/components/chatbot/chatbot-preview";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Headphones,
  TrendingUp,
  Calendar,
  UtensilsCrossed,
  Home,
  ShoppingCart,
  Bot,
};

export default function NewChatbotPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<ChatbotType | null>(null);
  const [name, setName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [createdBot, setCreatedBot] = useState<any>(null);

  async function handleCreate() {
    if (!selectedType || !name || !websiteUrl) return;
    setAnalyzing(true);
    try {
      const bot = await api.createChatbot({
        name,
        chatbot_type: selectedType,
        website_url: websiteUrl,
      });
      setCreatedBot(bot);
      setStep(4);
      toast.success("Chatbot créé avec succès !");
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la création");
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Nouveau chatbot
        </h1>
        <p className="mt-1 text-muted-foreground">
          Créez un chatbot personnalisé en 3 étapes simples.
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                step >= s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {step > s ? <Check className="h-4 w-4" /> : s}
            </div>
            {s < 4 && (
              <div className={cn("h-0.5 w-8 sm:w-16", step > s ? "bg-primary" : "bg-muted")} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Type */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Type de chatbot</CardTitle>
            <CardDescription>
              Choisissez le type qui correspond le mieux à votre activité.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {CHATBOT_TYPES.map((type) => {
                const Icon = ICON_MAP[type.icon] || Bot;
                const isSelected = selectedType === type.value;
                return (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={cn(
                      "flex items-start gap-4 rounded-xl border p-4 text-left transition-all cursor-pointer",
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "hover:border-foreground/20 hover:bg-muted/50"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                        isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{type.label}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {type.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => setStep(2)}
                disabled={!selectedType}
              >
                Continuer
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Name */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Nom du chatbot</CardTitle>
            <CardDescription>
              Donnez un nom à votre assistant virtuel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="botName" className="text-sm font-medium">
                  Nom *
                </label>
                <Input
                  id="botName"
                  placeholder="Ex: Assistant MonSite, Support Client..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  autoFocus
                />
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Button>
              <Button onClick={() => setStep(3)} disabled={!name.trim()}>
                Continuer
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: URL + Analyze */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>URL de votre site</CardTitle>
            <CardDescription>
              Notre système va analyser automatiquement votre site pour personnaliser le chatbot.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="url" className="text-sm font-medium">
                  URL du site web *
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://www.monsite.com"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="pl-9"
                    autoFocus
                  />
                </div>
              </div>

              {analyzing && (
                <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <Spinner className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-primary">Analyse et scraping en cours...</p>
                    <p className="text-sm text-muted-foreground">
                      Extraction de l&apos;identité visuelle et exploration de toutes les pages du site. Cela peut prendre 30 secondes à 1 minute.
                    </p>
                  </div>
                </div>
              )}

              <div className="rounded-xl bg-muted/50 p-4">
                <h4 className="mb-2 text-sm font-medium">Ce que nous analysons :</h4>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {[
                    "Couleurs principales de la marque",
                    "Logo et favicon",
                    "Polices utilisées",
                    "Secteur d'activité",
                    "Toutes les pages du site (contenu, services, FAQ...)",
                    "Ton de communication",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!websiteUrl.trim() || analyzing}
              >
                {analyzing ? (
                  <Spinner className="h-4 w-4" />
                ) : (
                  <>
                    Créer le chatbot
                    <Sparkles className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Result */}
      {step === 4 && createdBot && (
        <div className="space-y-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                <Check className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Chatbot créé avec succès !</h3>
                <p className="text-sm text-muted-foreground">
                  Votre chatbot &quot;{createdBot.name}&quot; est prêt à être intégré.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Analysis results */}
          <Card>
            <CardHeader>
              <CardTitle>Résultat de l&apos;analyse</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Couleur principale</p>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-6 w-6 rounded-md border"
                      style={{ backgroundColor: createdBot.primary_color }}
                    />
                    <span className="font-mono text-sm">{createdBot.primary_color}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Police détectée</p>
                  <p className="font-medium">{createdBot.font_family}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Secteur</p>
                  <p className="font-medium capitalize">{createdBot.industry}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium capitalize">{createdBot.chatbot_type}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Embed code */}
          <Card>
            <CardHeader>
              <CardTitle>Code d&apos;intégration</CardTitle>
              <CardDescription>
                Copiez ce code et collez-le juste avant la balise &lt;/body&gt; de votre site.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="overflow-x-auto rounded-lg bg-foreground/5 p-4 text-sm">
                  <code>{createdBot.embed_code}</code>
                </pre>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute right-2 top-2"
                  onClick={() => {
                    navigator.clipboard.writeText(createdBot.embed_code);
                    toast.success("Code copié !");
                  }}
                >
                  Copier
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Aperçu</CardTitle>
            </CardHeader>
            <CardContent>
              <ChatbotPreview chatbot={createdBot} />
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button asChild>
              <a href={`/dashboard/chatbots/${createdBot.id}`}>
                Configurer le chatbot
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/dashboard">Retour au dashboard</a>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
