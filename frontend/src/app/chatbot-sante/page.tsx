import type { Metadata } from "next";
import { HeartPulse } from "lucide-react";
import { NichePage } from "@/components/niche-page";

export const metadata: Metadata = {
  title: "Chatbot pour cabinet médical & santé — RDV automatisés | botexpress",
  description: "Chatbot IA pour professionnels de santé. Répondez aux questions patients, gérez les demandes de rendez-vous et informez sur vos soins 24h/24. Essai gratuit.",
  alternates: { canonical: "https://www.botexpress.fr/chatbot-sante" },
  keywords: ["chatbot santé", "chatbot cabinet médical", "chatbot médecin", "chatbot ostéopathe", "chatbot kiné", "chatbot prise de rendez-vous", "assistant virtuel santé"],
  openGraph: {
    title: "Chatbot pour cabinet médical — Patients informés 24h/24",
    description: "Votre chatbot répond aux questions patients, présente vos soins et gère les demandes de RDV hors heures d'ouverture.",
    url: "https://www.botexpress.fr/chatbot-sante",
  },
};

export default function ChatbotSantePage() {
  return (
    <NichePage
      h1="Chatbot pour professionnel de santé : patients informés 24h/24"
      subtitle="Vos patients cherchent des informations le soir et le week-end. Votre chatbot répond sur vos soins, vos tarifs et vos disponibilités — même quand votre cabinet est fermé."
      Icon={HeartPulse}
      iconColor="text-rose-500"
      iconBg="bg-rose-500/10"
      useCases={[
        { title: "Informations sur les soins", desc: "Déroulé d'une séance, préparation, durée, contre-indications — vos patients arrivent informés et rassurés." },
        { title: "Tarifs & remboursements", desc: "Prix des consultations, prise en charge mutuelle, secteur — répondus automatiquement sans appel téléphonique." },
        { title: "Demandes de rendez-vous", desc: "Le chatbot collecte les disponibilités souhaitées et redirige vers votre agenda en ligne ou votre secrétariat." },
        { title: "Nouveau patient", desc: "Localisation, accès, parking, documents à apporter — toutes les informations pratiques disponibles instantanément." },
        { title: "Urgences & orientation", desc: "En cas de demande urgente, le chatbot oriente vers les bons contacts et évite les appels non nécessaires." },
        { title: "Suivi & rappels", desc: "Informations post-séance, conseils généraux, prochain rendez-vous — le chatbot prolonge la relation patient." },
      ]}
      testimonial={{
        quote: "Mes patients appelaient pour des questions simples : est-ce que vous prenez la mutuelle X ? Depuis le chatbot, ces appels ont quasiment disparu. Ma secrétaire se concentre sur l'accueil.",
        name: "Dr. Isabelle M.",
        role: "Médecin généraliste, Nantes",
      }}
      faq={[
        { q: "Est-ce conforme au RGPD pour un cabinet médical ?", a: "botexpress ne stocke pas de données médicales. Le chatbot répond sur la base de votre contenu public. Aucune information sensible n'est collectée par défaut." },
        { q: "Fonctionne-t-il avec Doctolib ?", a: "Oui, le chatbot peut rediriger les patients vers votre page Doctolib pour la prise de rendez-vous. Il ne remplace pas Doctolib mais le complète." },
        { q: "Je n'ai pas de site très élaboré. Ça marche quand même ?", a: "Oui. Même une page simple avec vos soins, tarifs et coordonnées suffit. Le chatbot extrait et répond sur cette base." },
        { q: "Puis-je l'utiliser pour plusieurs praticiens au cabinet ?", a: "Oui, vous pouvez créer un chatbot par praticien ou un chatbot global pour le cabinet selon votre organisation." },
      ]}
    />
  );
}
