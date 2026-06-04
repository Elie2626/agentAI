import type { Metadata } from "next";
import Link from "next/link";
import { BlogPostLayout } from "@/components/blog-post-layout";

export const metadata: Metadata = {
  title: "Chatbot Shopify : automatiser le support de votre boutique en 10 min",
  description: "Ajoutez un chatbot IA sur votre boutique Shopify en 10 minutes. Répondez aux questions produits, suivi commande et retours 24h/24. Compatible tous les thèmes Shopify.",
  keywords: ["chatbot shopify", "installer chatbot shopify", "chatbot ia shopify", "ajouter chatbot boutique shopify", "support automatique shopify", "chatbot e-commerce shopify"],
  alternates: { canonical: "https://www.botexpress.fr/blog/chatbot-shopify" },
  openGraph: {
    title: "Chatbot Shopify : automatiser votre support en 10 minutes",
    description: "Ajoutez un chatbot IA sur votre boutique Shopify. Répondez aux questions produits, livraisons et retours 24h/24 sans effort.",
    url: "https://www.botexpress.fr/blog/chatbot-shopify",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Ajouter un chatbot IA sur Shopify",
  description: "Guide complet pour installer un chatbot IA sur votre boutique Shopify avec botexpress.",
  totalTime: "PT10M",
  step: [
    { "@type": "HowToStep", name: "Créer votre chatbot", text: "Créez votre chatbot sur botexpress.fr en entrant l'URL de votre boutique Shopify" },
    { "@type": "HowToStep", name: "Copier le snippet", text: "Copiez le code d'intégration depuis votre dashboard botexpress" },
    { "@type": "HowToStep", name: "Accéder au code du thème", text: "Shopify Admin → Boutique en ligne → Thèmes → Modifier le code → layout/theme.liquid" },
    { "@type": "HowToStep", name: "Coller avant </body>", text: "Collez le script juste avant la balise </body> et sauvegardez" },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Chatbot Shopify : automatiser le support de votre boutique en 10 min"
        description="Un visiteur Shopify qui n'obtient pas de réponse part chez un concurrent. Voici comment ajouter un chatbot IA sur votre boutique pour répondre à toutes les questions, 24h/24."
        date="Juin 2026"
        readTime="5 min"
      >
        <p>
          Les boutiques Shopify reçoivent souvent les mêmes questions en boucle : <em>&quot;Où est ma commande ?&quot;</em>, <em>&quot;Vous livrez en Belgique ?&quot;</em>, <em>&quot;C&apos;est quelle taille ?&quot;</em>. Un chatbot IA peut répondre à ces questions instantanément, 7j/7, et libérer votre temps pour ce qui compte vraiment.
        </p>

        <h2>Pourquoi ajouter un chatbot sur votre boutique Shopify ?</h2>
        <ul>
          <li><strong>Réduire les tickets de support</strong> — jusqu&apos;à 70 % des questions fréquentes sont traitées automatiquement</li>
          <li><strong>Augmenter les conversions</strong> — un visiteur qui obtient une réponse immédiate a 3× plus de chances d&apos;acheter</li>
          <li><strong>Qualifier les leads B2B</strong> — collectez automatiquement nom, email et téléphone des prospects</li>
          <li><strong>Support hors horaires</strong> — votre boutique répond la nuit, le week-end, les jours fériés</li>
        </ul>

        <h2>Installer un chatbot sur Shopify — Méthode officielle</h2>

        <h3>Étape 1 — Créer votre chatbot botexpress</h3>
        <p>
          Créez un compte gratuit sur <Link href="/auth/register">botexpress.fr</Link>. Entrez l&apos;URL de votre boutique Shopify. Notre IA va analyser vos pages produits, votre FAQ, vos CGV et votre politique de retour pour entraîner le chatbot sur votre contenu.
        </p>

        <h3>Étape 2 — Copier le snippet Shopify</h3>
        <p>
          Dans votre dashboard botexpress, allez sur la page de configuration de votre chatbot, section <strong>Plugins CMS → Shopify</strong>. Copiez le snippet en un clic.
        </p>
        <p>Il ressemble à ceci :</p>
        <pre><code>{`<script
  src="https://www.botexpress.fr/widget.js"
  data-chatbot-id="votre-chatbot-id"
  data-api-url="https://agentai-23tt.onrender.com"
  defer
></script>`}</code></pre>

        <h3>Étape 3 — Accéder au code de votre thème</h3>
        <p>Dans votre admin Shopify :</p>
        <ol>
          <li>Allez dans <strong>Boutique en ligne → Thèmes</strong></li>
          <li>Cliquez sur <strong>Actions → Modifier le code</strong> à côté de votre thème actif</li>
          <li>Dans la liste des fichiers à gauche, ouvrez <strong>Layout → theme.liquid</strong></li>
        </ol>

        <h3>Étape 4 — Coller et sauvegarder</h3>
        <p>
          Trouvez la balise <code>&lt;/body&gt;</code> (généralement en fin de fichier) et collez le snippet juste avant elle. Cliquez sur <strong>Enregistrer</strong>. Votre chatbot est maintenant actif sur toute votre boutique.
        </p>

        <h2>Compatibilité avec les thèmes Shopify</h2>
        <p>
          Le widget botexpress est compatible avec <strong>tous les thèmes Shopify</strong> : Dawn, Debut, Brooklyn, Narrative, Minimal, Impulse, Turbo, Out of the Sandbox, et les thèmes personnalisés. Il s&apos;affiche en superposition, sans modifier la mise en page de votre boutique.
        </p>

        <h2>Ce que le chatbot sait sur votre boutique</h2>
        <p>
          Lors de la création, notre IA analyse automatiquement votre site Shopify et apprend :
        </p>
        <ul>
          <li>Vos produits, descriptions, prix et variantes</li>
          <li>Votre politique de livraison et les délais</li>
          <li>Votre politique de retour et de remboursement</li>
          <li>Vos FAQ existantes</li>
          <li>Vos CGV et mentions légales</li>
          <li>Vos informations de contact</li>
        </ul>

        <h2>Activation de la capture de leads</h2>
        <p>
          Depuis votre dashboard botexpress, vous pouvez activer la <strong>capture de leads</strong> : le chatbot demande automatiquement le nom, l&apos;email et/ou le téléphone du visiteur avant de commencer la conversation. Idéal pour les boutiques B2B ou les produits à forte valeur.
        </p>

        <h2>Questions fréquentes</h2>

        <h3>Le chatbot peut-il gérer le suivi de commande ?</h3>
        <p>
          Le chatbot peut répondre aux questions générales sur les délais et processus de livraison. Pour un suivi de commande personnalisé (numéro de commande spécifique), une intégration avec votre système de gestion des commandes est nécessaire.
        </p>

        <h3>Fonctionne-t-il avec Shopify 2.0 ?</h3>
        <p>
          Oui, le widget fonctionne parfaitement avec Shopify 2.0 et ses nouveaux thèmes basés sur des sections. L&apos;intégration via <code>theme.liquid</code> est compatible avec toutes les versions.
        </p>

        <h3>Puis-je choisir sur quelles pages le chatbot s&apos;affiche ?</h3>
        <p>
          Par défaut, le chatbot s&apos;affiche sur toutes les pages de votre boutique. Vous pouvez le restreindre à certaines pages en utilisant des conditions Liquid dans votre <code>theme.liquid</code>.
        </p>

        <h3>Le chatbot ralentit-il mon score PageSpeed ?</h3>
        <p>
          Non. Le script est chargé de manière asynchrone avec <code>defer</code>, ce qui n&apos;impacte pas le temps de chargement initial de vos pages produits.
        </p>
      </BlogPostLayout>
    </>
  );
}
