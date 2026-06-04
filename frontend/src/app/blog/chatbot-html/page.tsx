import type { Metadata } from "next";
import Link from "next/link";
import { BlogPostLayout } from "@/components/blog-post-layout";

export const metadata: Metadata = {
  title: "Ajouter un chatbot sur un site HTML — 1 ligne de code (2026)",
  description: "Intégrez un chatbot IA sur n'importe quel site HTML statique en 1 minute. Copier-coller une ligne de script. Compatible Webflow, Wix, sites codés à la main.",
  keywords: ["chatbot html", "ajouter chatbot html", "intégrer chatbot html", "chatbot site statique", "widget chat html", "chatbot javascript", "chatbot sans cms"],
  alternates: { canonical: "https://www.botexpress.fr/blog/chatbot-html" },
  openGraph: {
    title: "Ajouter un chatbot sur un site HTML en 1 ligne de code",
    description: "Intégrez un chatbot IA sur n'importe quel site HTML statique. Une seule ligne de script, aucune dépendance, aucun serveur requis.",
    url: "https://www.botexpress.fr/blog/chatbot-html",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Ajouter un chatbot sur un site HTML",
  totalTime: "PT2M",
  step: [
    { "@type": "HowToStep", name: "Créer le chatbot", text: "Créez votre chatbot sur botexpress.fr" },
    { "@type": "HowToStep", name: "Copier le script", text: "Copiez le code d'intégration depuis votre dashboard" },
    { "@type": "HowToStep", name: "Ouvrir votre fichier HTML", text: "Ouvrez le fichier index.html ou votre template principal" },
    { "@type": "HowToStep", name: "Coller avant </body>", text: "Collez le script juste avant </body> et enregistrez" },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Ajouter un chatbot sur un site HTML — 1 ligne de code"
        description="Vous avez un site HTML statique et vous voulez y intégrer un chatbot ? C'est probablement l'intégration la plus simple qui existe. Voici exactement comment faire."
        date="Juin 2026"
        readTime="3 min"
      >
        <p>
          Un site HTML classique, un site Webflow exporté, une page de vente codée à la main — peu importe la structure, intégrer un chatbot ne prend que <strong>2 minutes et une ligne de code</strong>. Pas de plugin, pas de dépendance, pas de reconfiguration de votre stack technique.
        </p>

        <h2>Le code à copier-coller</h2>
        <p>
          Voici le seul code dont vous avez besoin. Remplacez <code>votre-chatbot-id</code> par l&apos;identifiant disponible dans votre dashboard botexpress.
        </p>
        <pre><code>{`<script
  src="https://www.botexpress.fr/widget.js"
  data-chatbot-id="votre-chatbot-id"
  data-api-url="https://agentai-23tt.onrender.com"
  defer
></script>`}</code></pre>
        <p>
          Collez-le juste avant la balise <code>&lt;/body&gt;</code> dans votre fichier HTML. C&apos;est tout.
        </p>

        <h2>Exemple complet</h2>
        <pre><code>{`<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8">
    <title>Mon site</title>
  </head>
  <body>

    <!-- Votre contenu existant -->
    <h1>Bienvenue sur mon site</h1>

    <!-- Script botexpress — juste avant </body> -->
    <script
      src="https://www.botexpress.fr/widget.js"
      data-chatbot-id="votre-chatbot-id"
      data-api-url="https://agentai-23tt.onrender.com"
      defer
    ></script>
  </body>
</html>`}</code></pre>

        <h2>Compatibilité</h2>
        <p>Le widget botexpress fonctionne sur :</p>
        <ul>
          <li><strong>Sites HTML statiques</strong> — pages codées à la main, sites exportés</li>
          <li><strong>Webflow</strong> — via Paramètres du projet → Code personnalisé → Pied de page</li>
          <li><strong>Wix</strong> — via Paramètres → Code personnalisé (plan Premium requis sur Wix)</li>
          <li><strong>Squarespace</strong> — via Paramètres → Avancé → Injection de code → Pied de page</li>
          <li><strong>Jimdo</strong> — via Paramètres → Modèle → Éditer le code HTML</li>
          <li><strong>Sites hébergés sur GitHub Pages, Netlify, Vercel</strong> — oui, compatibles</li>
        </ul>

        <h2>Pourquoi mettre le script avant &lt;/body&gt; et pas dans &lt;head&gt; ?</h2>
        <p>
          Placer le script avant <code>&lt;/body&gt;</code> (avec l&apos;attribut <code>defer</code>) garantit que votre page se charge entièrement avant que le widget ne s&apos;initialise. Cela évite tout ralentissement du chargement de votre contenu principal et améliore votre score Core Web Vitals.
        </p>
        <p>
          Vous pouvez également le placer dans <code>&lt;head&gt;</code> avec l&apos;attribut <code>defer</code> ou <code>async</code> — le comportement sera identique.
        </p>

        <h2>Installer sur plusieurs pages vs une seule</h2>
        <p>
          Si vous voulez le chatbot sur <strong>toutes les pages</strong> : ajoutez le script dans votre template ou layout principal (le fichier inclus sur toutes les pages).
        </p>
        <p>
          Si vous voulez le chatbot sur <strong>une seule page</strong> (page de contact, page produit) : ajoutez le script uniquement dans ce fichier HTML spécifique.
        </p>

        <h2>Vérifier que l&apos;intégration fonctionne</h2>
        <p>
          Après avoir sauvegardé et déployé votre fichier :
        </p>
        <ol>
          <li>Ouvrez votre site dans un navigateur</li>
          <li>Un bouton de chat doit apparaître en bas à droite de la page</li>
          <li>Cliquez dessus — la fenêtre de chat doit s&apos;ouvrir avec votre message d&apos;accueil</li>
        </ol>
        <p>
          Si le bouton n&apos;apparaît pas, vérifiez que le <code>data-chatbot-id</code> est correct (disponible dans votre dashboard botexpress) et que vous avez bien un abonnement actif.
        </p>

        <h2>Questions fréquentes</h2>

        <h3>Le chatbot fonctionne-t-il sans backend ni base de données ?</h3>
        <p>
          Oui. Le widget communique directement avec les serveurs botexpress. Votre site HTML n&apos;a besoin d&apos;aucun backend. Tout est géré côté botexpress.
        </p>

        <h3>Le chatbot est-il responsive sur mobile ?</h3>
        <p>
          Oui. Le widget s&apos;adapte automatiquement à toutes les tailles d&apos;écran. Sur mobile, il respecte les zones de sécurité (notch, barre de navigation) et s&apos;affiche correctement sur iOS et Android.
        </p>

        <h3>Puis-je avoir le chatbot sur un site en HTTPS et HTTP ?</h3>
        <p>
          Le widget fonctionne sur les deux protocoles. Cependant, nous recommandons HTTPS pour des raisons de sécurité et de référencement.
        </p>

        <h3>Comment mettre à jour le chatbot sans toucher au code HTML ?</h3>
        <p>
          Toutes les modifications (couleurs, message d&apos;accueil, contenu) se font depuis votre dashboard botexpress. Le code HTML reste identique — seul l&apos;identifiant du chatbot compte.
        </p>
      </BlogPostLayout>
    </>
  );
}
