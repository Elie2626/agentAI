import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";
import { I18nProvider } from "@/i18n";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  metadataBase: new URL("https://botforge.app"),
  title: {
    default: "BotForge — Créer un chatbot IA pour site web en 2 minutes",
    template: "%s | BotForge",
  },
  description:
    "Créez un chatbot IA personnalisé pour votre site web en 2 minutes. BotForge analyse automatiquement votre site, extrait vos couleurs et contenu, et génère un assistant virtuel intelligent. Compatible WordPress, Shopify, Wix. Essai gratuit.",
  keywords: [
    "chatbot IA",
    "créer chatbot",
    "chatbot site web",
    "chatbot personnalisé",
    "assistant virtuel",
    "chatbot entreprise",
    "chatbot automatique",
    "chatbot WordPress",
    "chatbot Shopify",
    "chatbot e-commerce",
    "intelligence artificielle chatbot",
    "chatbot support client",
    "chatbot commercial",
    "widget chat site web",
    "chatbot en ligne",
    "chatbot français",
    "chatbot sans code",
    "créer assistant virtuel",
    "chatbot IA gratuit",
    "chatbot pour site internet",
    "bot conversationnel",
    "chatbot service client",
    "chatbot SaaS",
    "BotForge",
  ],
  authors: [{ name: "BotForge" }],
  creator: "BotForge",
  publisher: "BotForge",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://botforge.app",
    languages: { "fr-FR": "https://botforge.app" },
  },
  openGraph: {
    title: "BotForge — Créer un chatbot IA pour site web en 2 minutes",
    description:
      "Entrez l'URL de votre site, notre IA analyse le contenu et crée un chatbot aux couleurs de votre marque. Support client, vente, réservation. Essai gratuit.",
    siteName: "BotForge",
    type: "website",
    locale: "fr_FR",
    url: "https://botforge.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "BotForge — Créer un chatbot IA en 2 minutes",
    description:
      "Créez un chatbot IA personnalisé pour votre site web. Analyse automatique, branding, intégration en un clic.",
    creator: "@botforge",
  },
  category: "technology",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={geist.variable}>
      <head>
        <link rel="canonical" href="https://botforge.app" />
      </head>
      <body className="min-h-dvh font-sans">
        <I18nProvider>
        {children}
        </I18nProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { borderRadius: "0.75rem", fontSize: "0.875rem" },
          }}
        />
      </body>
    </html>
  );
}
