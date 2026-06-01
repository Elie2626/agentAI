import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre compte BotForge pour gérer vos chatbots IA.",
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
