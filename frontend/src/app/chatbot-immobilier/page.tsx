import type { Metadata } from "next";
import { Home } from "lucide-react";
import { NichePage } from "@/components/niche-page";

export const metadata: Metadata = {
  title: "Chatbot pour agence immobilière — Leads & RDV automatisés | botexpress",
  description: "Chatbot IA pour agence immobilière. Qualifiez vos prospects, présentez vos biens et planifiez des visites 24h/24. Créez votre chatbot immobilier en 30 secondes.",
  alternates: { canonical: "https://www.botexpress.fr/chatbot-immobilier" },
  keywords: ["chatbot immobilier", "chatbot agence immobilière", "chatbot pour agence immobilière", "chatbot prospect immobilier", "assistant virtuel immobilier"],
  openGraph: {
    title: "Chatbot pour agence immobilière — Leads & visites automatisés",
    description: "Vos prospects visitent votre site à 22h. Votre chatbot qualifie, présente les biens et prend rendez-vous. 24h/24.",
    url: "https://www.botexpress.fr/chatbot-immobilier",
  },
};

export default function ChatbotImmobilierPage() {
  return (
    <NichePage
      h1="Chatbot pour agence immobilière : qualifiez vos prospects 24h/24"
      subtitle="80% des acheteurs cherchent des biens en dehors des heures de bureau. Votre chatbot répond, qualifie et prend rendez-vous à votre place — même à minuit."
      Icon={Home}
      iconColor="text-emerald-500"
      iconBg="bg-emerald-500/10"
      useCases={[
        { title: "Qualification des acheteurs", desc: "Budget, surface, localisation, délai d'achat — le chatbot pose les bonnes questions pour vous envoyer des leads qualifiés." },
        { title: "Présentation des biens", desc: "Prix, superficie, étage, charges — votre chatbot répond sur chaque bien référencé sur votre site." },
        { title: "Prise de RDV de visite", desc: "Le chatbot collecte les créneaux souhaités et vous transmet les informations par email." },
        { title: "Questions sur l'agence", desc: "Honoraires, zones géographiques, services proposés — toutes les infos pratiques disponibles instantanément." },
        { title: "Estimations", desc: "Le chatbot oriente les vendeurs vers votre formulaire d'estimation et collecte les premières informations." },
        { title: "Gestion locative", desc: "Questions sur les locations disponibles, conditions d'entrée, charges — votre chatbot informe et filtre." },
      ]}
      testimonial={{
        quote: "On récupérait 3-4 leads par semaine via notre formulaire. Depuis le chatbot, on en reçoit 15-20. Les gens n'ont plus à attendre le lendemain matin pour avoir une réponse.",
        name: "Sarah K.",
        role: "Directrice d'agence, Paris 15e",
      }}
      faq={[
        { q: "Le chatbot peut-il connaître tous mes biens ?", a: "Oui, il analyse les annonces publiées sur votre site. Plus votre site est à jour, plus il est précis dans ses réponses." },
        { q: "Est-ce compatible avec mon logiciel de transaction ?", a: "botexpress fonctionne en complément de votre logiciel. Il ne remplace pas votre CRM mais capture les leads avant qu'ils n'appellent un concurrent." },
        { q: "Comment les prospects me contactent ensuite ?", a: "Le chatbot peut collecter email et téléphone, puis vous envoyer un récapitulatif. Vous pouvez aussi le rediriger vers votre formulaire existant." },
        { q: "Et si un client pose une question hors de ma zone ?", a: "Il répond sur la base de votre contenu. Si l'information n'est pas sur votre site, il invite le visiteur à vous contacter directement." },
      ]}
    />
  );
}
