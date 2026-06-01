import type { Metadata } from "next";
import Link from "next/link";
import { Bot, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité et protection des données personnelles de BotForge. Conformité RGPD.",
  alternates: { canonical: "https://botforge.app/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh bg-background">
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">BotForge</span>
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <Button variant="ghost" asChild className="mb-8">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>
        </Button>

        <h1 className="text-3xl font-bold tracking-tight">Politique de confidentialité</h1>
        <p className="mt-2 text-muted-foreground">Dernière mise à jour : 1 juin 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">1. Responsable du traitement</h2>
            <p>
              Le responsable du traitement des données personnelles est :<br />
              <strong className="text-foreground">[Nom de la société]</strong><br />
              Adresse : [Adresse complète]<br />
              Contact : privacy@botforge.app
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">2. Données collectées</h2>
            <p>Nous collectons les données suivantes :</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li><strong className="text-foreground">Données de compte :</strong> adresse email, nom (via Google ou inscription manuelle)</li>
              <li><strong className="text-foreground">Données de paiement :</strong> traitées exclusivement par Stripe. Nous ne stockons aucun numéro de carte bancaire</li>
              <li><strong className="text-foreground">Données d&apos;utilisation :</strong> nombre de messages envoyés, chatbots créés, pages analysées</li>
              <li><strong className="text-foreground">Données de conversation :</strong> messages échangés entre les visiteurs et les chatbots pour assurer le fonctionnement du service</li>
              <li><strong className="text-foreground">Données techniques :</strong> adresse IP (anonymisée par hachage), type de navigateur, horaires d&apos;utilisation</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">3. Finalités du traitement</h2>
            <p>Les données sont collectées pour :</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Fournir et améliorer le service BotForge</li>
              <li>Gérer les comptes utilisateurs et les abonnements</li>
              <li>Générer les réponses des chatbots via l&apos;intelligence artificielle</li>
              <li>Produire des statistiques anonymisées d&apos;utilisation</li>
              <li>Assurer la sécurité et prévenir les abus (limitation de débit)</li>
              <li>Respecter nos obligations légales</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">4. Base légale</h2>
            <p>Les traitements reposent sur :</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li><strong className="text-foreground">L&apos;exécution du contrat</strong> pour la fourniture du service et la gestion des abonnements</li>
              <li><strong className="text-foreground">L&apos;intérêt légitime</strong> pour la sécurité, la prévention des abus et l&apos;amélioration du service</li>
              <li><strong className="text-foreground">Le consentement</strong> pour l&apos;envoi de communications marketing (le cas échéant)</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">5. Sous-traitants et transferts</h2>
            <p>Vos données peuvent être traitées par les prestataires suivants :</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li><strong className="text-foreground">Google Firebase</strong> (hébergement, authentification, base de données) — Irlande/UE</li>
              <li><strong className="text-foreground">Stripe</strong> (paiements) — États-Unis, clauses contractuelles types</li>
              <li><strong className="text-foreground">Anthropic</strong> (intelligence artificielle Claude) — États-Unis, clauses contractuelles types</li>
            </ul>
            <p className="mt-2">
              Les transferts vers les États-Unis sont encadrés par des clauses contractuelles
              types conformes au RGPD. Aucune donnée n&apos;est vendue à des tiers.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">6. Durée de conservation</h2>
            <ul className="list-inside list-disc space-y-1">
              <li><strong className="text-foreground">Données de compte :</strong> conservées pendant la durée de l&apos;inscription, puis 3 ans après la suppression du compte</li>
              <li><strong className="text-foreground">Données de conversation :</strong> conservées 12 mois puis supprimées automatiquement</li>
              <li><strong className="text-foreground">Données de facturation :</strong> conservées 10 ans conformément aux obligations comptables</li>
              <li><strong className="text-foreground">Logs techniques :</strong> conservés 6 mois</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">7. Vos droits</h2>
            <p>
              Conformément au RGPD, vous disposez des droits suivants sur vos données
              personnelles :
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li><strong className="text-foreground">Droit d&apos;accès :</strong> obtenir une copie de vos données</li>
              <li><strong className="text-foreground">Droit de rectification :</strong> corriger des données inexactes</li>
              <li><strong className="text-foreground">Droit à l&apos;effacement :</strong> demander la suppression de vos données</li>
              <li><strong className="text-foreground">Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
              <li><strong className="text-foreground">Droit d&apos;opposition :</strong> vous opposer au traitement de vos données</li>
              <li><strong className="text-foreground">Droit à la limitation :</strong> restreindre le traitement de vos données</li>
            </ul>
            <p className="mt-2">
              Pour exercer ces droits, contactez-nous à :{" "}
              <strong className="text-foreground">privacy@botforge.app</strong>
            </p>
            <p className="mt-2">
              Vous pouvez également introduire une réclamation auprès de la CNIL :{" "}
              <a
                href="https://www.cnil.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline-offset-2 hover:underline"
              >
                www.cnil.fr
              </a>
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">8. Cookies</h2>
            <p>
              BotForge utilise uniquement des cookies strictement nécessaires au
              fonctionnement du service (authentification, préférences de session).
              Aucun cookie publicitaire ou de suivi n&apos;est utilisé.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">9. Sécurité</h2>
            <p>
              Nous mettons en oeuvre les mesures techniques et organisationnelles appropriées
              pour protéger vos données : chiffrement en transit (HTTPS/TLS), authentification
              sécurisée (Firebase Auth), hachage des adresses IP, limitation de débit, et
              contrôle d&apos;accès strict aux données.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">10. Modifications</h2>
            <p>
              Cette politique peut être mise à jour. En cas de modification substantielle,
              nous vous en informerons par email ou via une notification dans le service.
              La date de dernière mise à jour figure en haut de cette page.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
