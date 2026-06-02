import type { Metadata } from "next";
import { ShoppingCart } from "lucide-react";
import { NichePage } from "@/components/niche-page";

export const metadata: Metadata = {
  title: "Chatbot pour e-commerce — Support client automatisé | botexpress",
  description: "Chatbot IA pour boutique en ligne. Réduisez vos tickets de support de 60% : suivi de commandes, retours, conseils produits. Compatible Shopify, WooCommerce, PrestaShop.",
  alternates: { canonical: "https://www.botexpress.fr/chatbot-ecommerce" },
  keywords: ["chatbot e-commerce", "chatbot boutique en ligne", "chatbot Shopify", "chatbot WooCommerce", "chatbot support client ecommerce", "chatbot pour site ecommerce"],
  openGraph: {
    title: "Chatbot pour e-commerce — -60% de tickets de support",
    description: "Votre chatbot répond aux questions produits, politiques de retour et suivi de commandes. 24h/24, automatiquement.",
    url: "https://www.botexpress.fr/chatbot-ecommerce",
  },
};

export default function ChatbotEcommercePage() {
  return (
    <NichePage
      h1="Chatbot pour e-commerce : -60% de tickets de support, +20% de conversions"
      subtitle="Vos clients ont des questions avant d'acheter. S'ils n'obtiennent pas de réponse immédiate, ils partent chez un concurrent. Votre chatbot répond en 2 secondes."
      Icon={ShoppingCart}
      iconColor="text-blue-500"
      iconBg="bg-blue-500/10"
      useCases={[
        { title: "Conseils produits", desc: "Taille, matière, compatibilité, différences entre modèles — votre chatbot aide à choisir et augmente le panier moyen." },
        { title: "Politique de retour", desc: "Délais, conditions, procédure — les questions les plus fréquentes répondues automatiquement, 24h/24." },
        { title: "Livraison & délais", desc: "Zones de livraison, délais estimés, suivi de colis — réduisez drastiquement les emails de vos clients." },
        { title: "Disponibilité & stocks", desc: "Réassort, tailles disponibles, alternatives — le chatbot informe et évite les frustrations." },
        { title: "Promotions & codes promo", desc: "Le chatbot peut partager les offres en cours et les conditions d'utilisation de vos codes." },
        { title: "SAV & réclamations", desc: "Il qualifie le problème, collecte les infos nécessaires et transmet à votre équipe un ticket structuré." },
      ]}
      testimonial={{
        quote: "On recevait 200 emails de support par semaine, dont 60% posaient les mêmes questions. Depuis le chatbot, on est descendus à 80. Notre équipe se concentre sur les vrais problèmes.",
        name: "Laura D.",
        role: "Fondatrice, boutique mode en ligne",
      }}
      faq={[
        { q: "Est-ce compatible avec Shopify ?", a: "Oui. botexpress fonctionne avec n'importe quel site web. Pour Shopify, vous collez le script dans le thème (Settings > Themes > Edit code) en 2 minutes." },
        { q: "Le chatbot peut-il accéder à mes commandes en temps réel ?", a: "Il répond sur la base de votre contenu public. Pour un accès aux commandes en temps réel, une intégration API avec votre plateforme est nécessaire (plan Business)." },
        { q: "Est-ce qu'il va vraiment réduire mes tickets ?", a: "En moyenne, 60% des questions posées au support sont répétitives. Un chatbot formé sur votre site répond à ces questions automatiquement." },
        { q: "Et les clients qui veulent parler à un humain ?", a: "Vous pouvez configurer le chatbot pour proposer un email ou un formulaire de contact quand la question dépasse ses capacités." },
        { q: "Ça marche en plusieurs langues ?", a: "Oui, le chatbot détecte la langue du visiteur et répond automatiquement en français, anglais, espagnol et plus." },
      ]}
    />
  );
}
