import type { Metadata } from "next";
import { Briefcase } from "lucide-react";
import { NichePage } from "@/components/niche-page";

export const metadata: Metadata = {
  title: "Chatbot pour entreprise de services & conseil — Leads automatisés | botexpress",
  description: "Chatbot IA pour agences, consultants et prestataires de services. Qualifiez vos prospects et présentez votre offre 24h/24. Créé en 30 secondes. Essai gratuit.",
  alternates: { canonical: "https://www.botexpress.fr/chatbot-services" },
  keywords: ["chatbot services", "chatbot agence", "chatbot consultant", "chatbot entreprise services", "chatbot prestataire", "assistant virtuel entreprise"],
  openGraph: {
    title: "Chatbot pour agence & services — Votre commercial virtuel 24h/24",
    description: "Présentez votre offre, qualifiez vos prospects et prenez contact automatiquement. Même hors heures de bureau.",
    url: "https://www.botexpress.fr/chatbot-services",
  },
};

export default function ChatbotServicesPage() {
  return (
    <NichePage
      h1="Chatbot pour agence et services : votre commercial virtuel disponible 24h/24"
      subtitle="Vos prospects visitent votre site le soir, le week-end. Votre chatbot présente votre offre, répond aux questions et collecte les contacts — pendant que votre équipe se repose."
      Icon={Briefcase}
      iconColor="text-indigo-500"
      iconBg="bg-indigo-500/10"
      useCases={[
        { title: "Présentation de l'offre", desc: "Services proposés, méthodologie, secteurs d'expertise — votre chatbot présente votre agence comme un commercial senior." },
        { title: "Qualification des prospects", desc: "Budget, besoin, délai, taille d'entreprise — le chatbot pose les bonnes questions avant de vous transmettre le lead." },
        { title: "Cas clients & références", desc: "Il présente vos réalisations, études de cas et témoignages pour rassurer les prospects en phase de choix." },
        { title: "Demandes de devis", desc: "Le chatbot collecte les informations clés et vous envoie un briefing structuré pour chaque demande entrante." },
        { title: "Tarification & packages", desc: "Questions sur vos prix, forfaits, modalités de collaboration — répondues automatiquement sans négociation prématurée." },
        { title: "Prise de contact", desc: "Il collecte email et numéro, propose un appel de découverte et vous alerte en temps réel pour chaque lead chaud." },
      ]}
      testimonial={{
        quote: "On avait un formulaire de contact que personne ne remplissait. Depuis le chatbot, on reçoit 8 à 10 demandes de devis qualifiées par semaine. Le ROI est immédiat.",
        name: "Nicolas R.",
        role: "Fondateur, agence marketing digital",
      }}
      faq={[
        { q: "Le chatbot peut-il remplacer un commercial ?", a: "Il ne remplace pas mais il qualifie. Il s'occupe des 80% de questions répétitives pour que votre équipe se concentre sur les vrais prospects chauds." },
        { q: "Comment il connaît mon offre et mes tarifs ?", a: "Il analyse votre site et extrait votre contenu. Plus votre site est clair sur votre offre, plus ses réponses sont précises." },
        { q: "Est-ce que ça marche pour le B2B ?", a: "Absolument. Le B2B est même le cas d'usage idéal : les décideurs font leurs recherches en dehors des heures ouvrées, et un chatbot disponible 24h/24 capte ces visites." },
        { q: "Comment je reçois les leads collectés ?", a: "Pour l'instant, le chatbot redirige vers vos formulaires ou coordonnées existants. Une intégration webhook (plan Pro) permet d'envoyer les leads directement dans votre CRM." },
      ]}
    />
  );
}
