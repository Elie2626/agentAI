import type { Metadata } from "next";
import { UtensilsCrossed } from "lucide-react";
import { NichePage } from "@/components/niche-page";

export const metadata: Metadata = {
  title: "Chatbot pour restaurant — Réservations & menu automatisés | botexpress",
  description: "Ajoutez un chatbot IA à votre restaurant en 30 secondes. Répondez aux questions sur le menu, les horaires, les allergènes et les réservations 24h/24. Essai gratuit.",
  alternates: { canonical: "https://www.botexpress.fr/chatbot-restaurant" },
  keywords: ["chatbot restaurant", "chatbot pour restaurant", "chatbot réservation restaurant", "assistant virtuel restaurant", "chatbot menu restaurant"],
  openGraph: {
    title: "Chatbot pour restaurant — Réservations & menu automatisés",
    description: "Votre restaurant répond à vos clients 24h/24 : menu, horaires, allergènes, réservations. Prêt en 30 secondes.",
    url: "https://www.botexpress.fr/chatbot-restaurant",
  },
};

export default function ChatbotRestaurantPage() {
  return (
    <NichePage
      h1="Chatbot pour restaurant : menu, horaires et réservations en automatique"
      subtitle="Vos clients posent des questions à 23h. Votre équipe dort. Votre chatbot, lui, répond en 2 secondes — menu du jour, allergènes, horaires, disponibilités."
      Icon={UtensilsCrossed}
      iconColor="text-orange-500"
      iconBg="bg-orange-500/10"
      useCases={[
        { title: "Questions sur le menu", desc: "Plats du jour, allergènes, options végétariennes — votre chatbot répond précisément basé sur votre carte en ligne." },
        { title: "Horaires d'ouverture", desc: "Fini les appels pour demander si vous êtes ouverts le lundi. Le chatbot répond 24h/24." },
        { title: "Réservations", desc: "Le chatbot guide les clients vers votre système de réservation ou collecte les informations pour vous." },
        { title: "Événements & privatisations", desc: "Anniversaires, enterrements de vie, séminaires — votre chatbot qualifie la demande avant de vous la transmettre." },
        { title: "Livraison & Click & Collect", desc: "Zones de livraison, délais, commande en ligne — toutes les infos pratiques disponibles instantanément." },
        { title: "Avis & fidélisation", desc: "Le chatbot peut inviter les clients satisfaits à laisser un avis Google après leur repas." },
      ]}
      testimonial={{
        quote: "Avant, mes clients appelaient pour demander si on était ouverts le dimanche. Maintenant le chatbot répond à leur place. J'ai gagné 30 minutes par jour.",
        name: "Thomas M.",
        role: "Restaurateur, Lyon",
      }}
      faq={[
        { q: "Est-ce que le chatbot connaît mon menu ?", a: "Oui. Il analyse votre site et extrait automatiquement les informations sur votre menu, vos plats, vos prix et vos allergènes. Si votre carte est en ligne, il la connaît." },
        { q: "Comment l'installer sur mon site de restaurant ?", a: "Une ligne de code à coller dans votre site. Compatible WordPress, Wix, Squarespace, sites codés à la main. Si vous avez un webmaster, il lui faudra 2 minutes." },
        { q: "Peut-il prendre des réservations ?", a: "Il peut guider les clients vers votre formulaire de réservation ou votre numéro de téléphone. Pour une prise de réservation automatique complète, une intégration avec votre logiciel de caisse est nécessaire." },
        { q: "Combien ça coûte ?", a: "Vous pouvez créer et tester votre chatbot gratuitement. Le déploiement sur votre site commence à 9,99€/mois — moins cher qu'une heure de travail." },
        { q: "Et si mon menu change souvent ?", a: "Il suffit de relancer une analyse de votre site depuis votre dashboard. Le chatbot se met à jour en quelques secondes." },
      ]}
    />
  );
}
