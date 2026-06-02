import type { Metadata } from "next";
import Link from "next/link";
import { Bot, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité et protection des données personnelles de botexpress. Conformité RGPD.",
  alternates: { canonical: "https://www.botexpress.fr/privacy" },
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
            <span className="text-xl font-bold">botexpress</span>
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
        <p className="mt-2 text-muted-foreground">Dernière mise à jour : 2 juin 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">1. Responsable du traitement</h2>
            <p>
              Le responsable du traitement des données personnelles est :<br />
              <strong className="text-foreground">[Nom de la société]</strong><br />
              Adresse : [Adresse complète]<br />
              Contact : <a href="mailto:privacy@botexpress.fr" className="text-primary hover:underline">privacy@botexpress.fr</a>
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">2. Données collectées</h2>
            <p className="mb-3">Nous collectons les données suivantes selon votre usage :</p>

            <p className="mb-1 font-medium text-foreground">Utilisateurs du dashboard (clients botexpress)</p>
            <ul className="mb-4 list-inside list-disc space-y-1">
              <li><strong className="text-foreground">Données de compte :</strong> adresse email, nom (via Google ou inscription manuelle)</li>
              <li><strong className="text-foreground">Données de paiement :</strong> traitées exclusivement par Stripe — nous ne stockons aucun numéro de carte</li>
              <li><strong className="text-foreground">IBAN :</strong> uniquement si vous participez au programme d&apos;affiliation et saisissez vos coordonnées bancaires pour recevoir des commissions</li>
              <li><strong className="text-foreground">Données d&apos;utilisation :</strong> nombre de messages, chatbots créés, pages analysées</li>
              <li><strong className="text-foreground">Code de parrainage :</strong> si vous participez au programme d&apos;affiliation</li>
            </ul>

            <p className="mb-1 font-medium text-foreground">Visiteurs des sites utilisant un chatbot botexpress</p>
            <ul className="mb-4 list-inside list-disc space-y-1">
              <li><strong className="text-foreground">Messages de conversation :</strong> échanges avec le chatbot, nécessaires au fonctionnement du service</li>
              <li><strong className="text-foreground">Données de leads :</strong> nom, email, téléphone — uniquement si le propriétaire du chatbot a activé la capture de leads et que vous avez rempli le formulaire</li>
              <li><strong className="text-foreground">Données techniques :</strong> adresse IP, type de navigateur, heure d&apos;utilisation</li>
            </ul>

            <p className="mb-1 font-medium text-foreground">Visiteurs de botexpress.fr</p>
            <ul className="list-inside list-disc space-y-1">
              <li><strong className="text-foreground">Consentement cookies :</strong> votre choix d&apos;acceptation ou de refus</li>
              <li><strong className="text-foreground">Adresse IP :</strong> pour la sécurité et la prévention des abus</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">3. Finalités du traitement</h2>
            <ul className="list-inside list-disc space-y-1">
              <li>Fournir et améliorer le service botexpress</li>
              <li>Gérer les comptes utilisateurs et les abonnements</li>
              <li>Traiter les paiements et les périodes d&apos;essai</li>
              <li>Générer les réponses des chatbots via l&apos;intelligence artificielle</li>
              <li>Gérer le programme d&apos;affiliation et verser les commissions</li>
              <li>Permettre la capture de leads pour les clients qui l&apos;activent</li>
              <li>Produire des statistiques d&apos;utilisation anonymisées</li>
              <li>Assurer la sécurité et prévenir les abus</li>
              <li>Respecter nos obligations légales</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">4. Base légale</h2>
            <ul className="list-inside list-disc space-y-1">
              <li><strong className="text-foreground">Exécution du contrat :</strong> fourniture du service, gestion des abonnements, paiement des commissions d&apos;affiliation</li>
              <li><strong className="text-foreground">Intérêt légitime :</strong> sécurité, prévention des abus, amélioration du service</li>
              <li><strong className="text-foreground">Consentement :</strong> stockage local non essentiel (parrainage, onboarding), capture de leads par les chatbots</li>
              <li><strong className="text-foreground">Obligation légale :</strong> conservation des données de facturation</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">5. Cookies et stockage local</h2>
            <p className="mb-3">
              botexpress n&apos;utilise <strong className="text-foreground">pas de cookies publicitaires ou de suivi tiers</strong>.
              Le service utilise le <strong className="text-foreground">stockage local (localStorage)</strong> de votre navigateur pour les finalités suivantes :
            </p>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-xs">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-foreground">Clé</th>
                    <th className="px-3 py-2 text-left font-medium text-foreground">Finalité</th>
                    <th className="px-3 py-2 text-left font-medium text-foreground">Durée</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="px-3 py-2 font-mono">be_cookie_consent</td>
                    <td className="px-3 py-2">Mémoriser votre choix d&apos;acceptation ou refus des cookies</td>
                    <td className="px-3 py-2">Permanent</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono">be_session_id</td>
                    <td className="px-3 py-2">Identifiant anonyme pour le suivi du consentement RGPD</td>
                    <td className="px-3 py-2">Permanent</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono">bf_session</td>
                    <td className="px-3 py-2">Identifiant de session pour le widget chatbot (sur les sites clients)</td>
                    <td className="px-3 py-2">Permanent</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono">bf_lead_*</td>
                    <td className="px-3 py-2">Mémorise que vous avez rempli le formulaire de capture de leads d&apos;un chatbot</td>
                    <td className="px-3 py-2">Permanent</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono">be_ref_code</td>
                    <td className="px-3 py-2">Code de parrainage si vous avez cliqué sur un lien affilié</td>
                    <td className="px-3 py-2">Jusqu&apos;à inscription</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono">Firebase Auth</td>
                    <td className="px-3 py-2">Token d&apos;authentification à votre compte dashboard</td>
                    <td className="px-3 py-2">Jusqu&apos;à déconnexion</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3">
              Vous pouvez vider le stockage local à tout moment via les paramètres de votre navigateur.
              Les données de consentement peuvent être réinitialisées en cliquant sur
              &quot;Gérer mes cookies&quot; dans la bannière en bas de page.
            </p>
            <p className="mt-2">
              <strong className="text-foreground">Stripe</strong> peut déposer des cookies sur son propre domaine lors du paiement,
              soumis à sa propre politique de confidentialité.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">6. Sous-traitants et transferts</h2>
            <ul className="list-inside list-disc space-y-1">
              <li><strong className="text-foreground">Google Firebase</strong> — authentification, base de données Firestore — Irlande (UE)</li>
              <li><strong className="text-foreground">Vercel</strong> — hébergement du frontend — États-Unis (CCT RGPD)</li>
              <li><strong className="text-foreground">Render</strong> — hébergement du backend API — États-Unis (CCT RGPD)</li>
              <li><strong className="text-foreground">Stripe</strong> — paiements et abonnements — États-Unis (CCT RGPD)</li>
              <li><strong className="text-foreground">Anthropic</strong> — intelligence artificielle Claude pour les réponses — États-Unis (CCT RGPD)</li>
              <li><strong className="text-foreground">Resend</strong> — envoi d&apos;emails transactionnels — États-Unis (CCT RGPD)</li>
            </ul>
            <p className="mt-2">
              Les transferts hors UE sont encadrés par des clauses contractuelles types (CCT) conformes au RGPD.
              Aucune donnée n&apos;est vendue à des tiers.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">7. Durée de conservation</h2>
            <ul className="list-inside list-disc space-y-1">
              <li><strong className="text-foreground">Données de compte :</strong> durée de l&apos;inscription + 3 ans après suppression</li>
              <li><strong className="text-foreground">Données de conversation :</strong> 12 mois</li>
              <li><strong className="text-foreground">Données de leads :</strong> jusqu&apos;à suppression par le propriétaire du chatbot</li>
              <li><strong className="text-foreground">IBAN affilié :</strong> durée de participation au programme d&apos;affiliation</li>
              <li><strong className="text-foreground">Données de facturation :</strong> 10 ans (obligation légale)</li>
              <li><strong className="text-foreground">Logs techniques :</strong> 6 mois</li>
              <li><strong className="text-foreground">Consentements cookies :</strong> 13 mois</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">8. Vos droits</h2>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li><strong className="text-foreground">Accès :</strong> obtenir une copie de vos données</li>
              <li><strong className="text-foreground">Rectification :</strong> corriger des données inexactes</li>
              <li><strong className="text-foreground">Effacement :</strong> demander la suppression de vos données</li>
              <li><strong className="text-foreground">Portabilité :</strong> recevoir vos données dans un format structuré</li>
              <li><strong className="text-foreground">Opposition :</strong> vous opposer à certains traitements</li>
              <li><strong className="text-foreground">Limitation :</strong> restreindre le traitement de vos données</li>
              <li><strong className="text-foreground">Retrait du consentement :</strong> à tout moment pour les traitements basés sur le consentement</li>
            </ul>
            <p className="mt-3">
              Pour exercer ces droits :{" "}
              <a href="mailto:privacy@botexpress.fr" className="text-primary hover:underline">privacy@botexpress.fr</a>
              {" "}— réponse sous 30 jours.
            </p>
            <p className="mt-2">
              Réclamation auprès de la CNIL :{" "}
              <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                www.cnil.fr
              </a>
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">9. Sécurité</h2>
            <p>
              Mesures mises en œuvre : chiffrement HTTPS/TLS en transit, authentification
              Firebase Auth, stockage sécurisé des mots de passe, limitation de débit sur
              toutes les API publiques, validation stricte des entrées (format IBAN, taille
              des champs), contrôle d&apos;accès par token sur toutes les routes authentifiées,
              vérification de signature cryptographique sur les webhooks Stripe.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">10. Modifications</h2>
            <p>
              Cette politique peut être mise à jour. En cas de modification substantielle,
              vous serez informé par email ou via une notification dans le service.
              La date de dernière mise à jour figure en haut de cette page.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
