import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Créer un compte — Chatbot IA gratuit",
  description: "Créez votre compte botexpress gratuitement et lancez votre chatbot IA personnalisé en 2 minutes. Aucune carte bancaire requise.",
  alternates: { canonical: "https://www.botexpress.fr/auth/register" },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
