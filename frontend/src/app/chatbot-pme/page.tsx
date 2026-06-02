import type { Metadata } from "next";
import { Wrench } from "lucide-react";
import { NichePage } from "@/components/niche-page";

export const metadata: Metadata = {
  title: "Chatbot pour PME et artisans — Devis & prospects automatisés | botexpress",
  description: "Chatbot IA pour PME et artisans. Qualifiez vos prospects, répondez aux demandes de devis et présentez vos services 24h/24. Sans code. Créé en 30 secondes.",
  alternates: { canonical: "https://www.botexpress.fr/chatbot-pme" },
  keywords: ["chatbot PME", "chatbot artisan", "chatbot pour PME", "chatbot pour artisan", "chatbot devis", "chatbot petite entreprise", "assistant virtuel PME"],
  openGraph: {
    title: "Chatbot pour PME et artisans — Plus de devis, moins de temps perdu",
    description: "Votre chatbot répond aux questions, qualifie les prospects et collecte les demandes de devis 24h/24. Pendant que vous travaillez.",
    url: "https://www.botexpress.fr/chatbot-pme",
  },
};

export default function ChatbotPmePage() {
  return (
    <NichePage
      h1="Chatbot pour PME et artisans : votre commercial virtuel disponible 24h/24"
      subtitle="Pendant que vous êtes sur chantier, votre chatbot présente vos services, répond aux questions et collecte les demandes de devis. Sans décrocher le téléphone."
      Icon={Wrench}
      iconColor="text-violet-500"
      iconBg="bg-violet-500/10"
      useCases={[
        { title: "Présentation des services", desc: "Plomberie, électricité, maçonnerie, peinture... votre chatbot présente votre offre et vos zones d'intervention." },
        { title: "Demandes de devis", desc: "Le chatbot collecte les informations clés (type de travaux, localisation, urgence) et vous envoie un récapitulatif structuré." },
        { title: "Questions pratiques", desc: "Délais d'intervention, zones couvertes, certifications RGE — toutes les réponses disponibles instantanément." },
        { title: "Disponibilités", desc: "Le chatbot indique vos créneaux disponibles et invite à prendre contact pour planifier." },
        { title: "Références & réalisations", desc: "Il présente vos projets passés, vos photos de réalisations et vos témoignages clients." },
        { title: "Urgences", desc: "En cas de demande urgente, il collecte les informations et vous alerte par email pour un rappel prioritaire." },
      ]}
      testimonial={{
        quote: "Je rentrais du boulot avec 8 appels manqués. La moitié posaient les mêmes questions. Maintenant le chatbot répond à leur place. Je rappelle seulement ceux qui sont vraiment intéressés.",
        name: "Marc B.",
        role: "Artisan plombier, Bordeaux",
      }}
      faq={[
        { q: "Je n'ai pas de site web très élaboré, ça marche quand même ?", a: "Oui. Même un site simple avec vos services et coordonnées suffit. Le chatbot extrait ce qu'il trouve et répond sur cette base." },
        { q: "Est-ce que ça m'amène vraiment plus de devis ?", a: "Un visiteur qui n'obtient pas de réponse dans les 30 secondes quitte votre site. Avec un chatbot, il interagit, qualifie son besoin et vous envoie une demande structurée." },
        { q: "Je ne suis pas informaticien. C'est simple à installer ?", a: "Une ligne de code à copier-coller. Si vous avez un site WordPress, c'est un copier-coller dans les paramètres. Votre webmaster peut le faire en 2 minutes." },
        { q: "Quel est le coût pour une petite entreprise ?", a: "Le plan Basic à 9,99€/mois permet 100 conversations. Pour une PME, le plan Starter à 29€/mois est le plus adapté : 1 000 conversations et personnalisation complète." },
        { q: "Et si le chatbot ne sait pas répondre à une question ?", a: "Il invite le visiteur à vous contacter directement (email ou téléphone). Vous restez toujours maître de la relation client." },
      ]}
    />
  );
}
