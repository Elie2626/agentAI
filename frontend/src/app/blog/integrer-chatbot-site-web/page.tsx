import type { Metadata } from "next";
import Link from "next/link";
import { BlogPostLayout } from "@/components/blog-post-layout";

export const metadata: Metadata = {
  title: "Comment intégrer un chatbot sur son site web (2026) — Guide complet",
  description: "Apprenez à intégrer un chatbot IA sur votre site web en moins de 5 minutes. Guide pas à pas pour HTML, WordPress, Shopify, React et Wix. Sans code, sans développeur.",
  keywords: ["intégrer chatbot site web", "integration chatbot", "ajouter chatbot site internet", "chatbot site web", "installer chatbot", "comment intégrer chatbot"],
  alternates: { canonical: "https://www.botexpress.fr/blog/integrer-chatbot-site-web" },
  openGraph: {
    title: "Comment intégrer un chatbot sur son site web (2026)",
    description: "Guide complet pour ajouter un chatbot IA sur n'importe quel site web : HTML, WordPress, Shopify, React. Sans code, en moins de 5 minutes.",
    url: "https://www.botexpress.fr/blog/integrer-chatbot-site-web",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Comment intégrer un chatbot sur son site web",
  description: "Guide étape par étape pour ajouter un chatbot IA sur votre site web sans compétences techniques.",
  totalTime: "PT5M",
  step: [
    { "@type": "HowToStep", name: "Créer un compte botexpress", text: "Inscrivez-vous gratuitement sur botexpress.fr" },
    { "@type": "HowToStep", name: "Créer votre chatbot", text: "Entrez l'URL de votre site, notre IA l'analyse et crée votre chatbot automatiquement" },
    { "@type": "HowToStep", name: "Copier le code d'intégration", text: "Copiez le script généré depuis votre dashboard" },
    { "@type": "HowToStep", name: "Coller dans votre site", text: "Collez le script avant </body> dans le code de votre site" },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Comment intégrer un chatbot sur son site web (2026)"
        description="Un chatbot bien intégré répond à vos visiteurs 24h/24 sans aucune intervention. Voici comment l'ajouter sur n'importe quel type de site en moins de 5 minutes."
        date="Juin 2026"
        readTime="6 min"
      >
        <p>
          Vous voulez ajouter un chatbot sur votre site web mais vous ne savez pas par où commencer ? Bonne nouvelle : intégrer un chatbot ne nécessite aucune compétence technique. Une seule ligne de code suffit — et dans cet article, on vous montre exactement où la coller selon votre plateforme.
        </p>

        <h2>Pourquoi intégrer un chatbot sur votre site ?</h2>
        <p>
          Un chatbot bien configuré peut répondre à <strong>80 % des questions récurrentes</strong> de vos visiteurs sans que vous n&apos;ayez à intervenir. Résultat : moins d&apos;appels, moins d&apos;emails, et des prospects qualifiés même la nuit.
        </p>
        <ul>
          <li><strong>Disponibilité 24h/24</strong> — votre site répond même quand vous dormez</li>
          <li><strong>Qualification automatique</strong> — le chatbot collecte nom, email, téléphone avant de transmettre le lead</li>
          <li><strong>Réduction du taux de rebond</strong> — un visiteur qui obtient une réponse reste plus longtemps</li>
          <li><strong>Support client automatisé</strong> — FAQ, horaires, tarifs répondus instantanément</li>
        </ul>

        <h2>Les 4 étapes pour intégrer un chatbot sur votre site</h2>

        <h3>Étape 1 — Créer votre chatbot</h3>
        <p>
          Rendez-vous sur <Link href="/auth/register">botexpress.fr</Link> et créez un compte gratuit. Entrez l&apos;URL de votre site : notre IA analyse automatiquement toutes vos pages, extrait le contenu, vos couleurs et votre logo, puis génère un chatbot aux couleurs de votre marque.
        </p>

        <h3>Étape 2 — Personnaliser</h3>
        <p>
          Depuis le dashboard, ajustez le nom du chatbot, son message d&apos;accueil et sa couleur principale. L&apos;aperçu en temps réel vous montre exactement ce que verront vos visiteurs.
        </p>

        <h3>Étape 3 — Copier le code d&apos;intégration</h3>
        <p>
          Dans l&apos;onglet <strong>Configuration</strong> de votre chatbot, vous trouvez votre code d&apos;intégration personnalisé. Il ressemble à ceci :
        </p>
        <pre><code>{`<script
  src="https://www.botexpress.fr/widget.js"
  data-chatbot-id="votre-id-unique"
  data-api-url="https://agentai-23tt.onrender.com"
  defer
></script>`}</code></pre>

        <h3>Étape 4 — Coller dans votre site</h3>
        <p>
          Collez ce code juste avant la balise <code>&lt;/body&gt;</code> de votre site. L&apos;endroit exact dépend de votre plateforme — on vous explique ci-dessous pour chaque cas.
        </p>

        <h2>Intégration par type de site</h2>

        <h3>Site HTML classique</h3>
        <p>
          Ouvrez votre fichier <code>index.html</code> (ou le fichier de template principal). Trouvez la ligne <code>&lt;/body&gt;</code> et collez le script juste au-dessus. Enregistrez et uploadez le fichier sur votre serveur.
        </p>
        <pre><code>{`    <!-- Votre contenu -->
    <script src="https://www.botexpress.fr/widget.js"
            data-chatbot-id="votre-id"
            defer></script>
  </body>
</html>`}</code></pre>

        <h3>WordPress</h3>
        <p>
          La méthode recommandée pour WordPress est d&apos;utiliser le <strong>plugin officiel botexpress</strong>, téléchargeable depuis votre dashboard. Il suffit de l&apos;installer, de l&apos;activer, puis de coller votre Chatbot ID dans <em>Réglages → botexpress</em>. Le script s&apos;injecte automatiquement sur toutes les pages.
        </p>
        <p>
          Vous pouvez aussi l&apos;ajouter manuellement via <strong>Apparence → Éditeur → footer.php</strong> juste avant <code>&lt;/body&gt;</code>, ou via une extension comme <em>Header Footer Code Manager</em>.
        </p>

        <h3>Shopify</h3>
        <p>
          Dans votre admin Shopify, allez dans <strong>Boutique en ligne → Thèmes → Modifier le code</strong>. Ouvrez le fichier <code>layout/theme.liquid</code> et collez le script juste avant <code>&lt;/body&gt;</code>. Sauvegardez.
        </p>

        <h3>React / Next.js</h3>
        <p>
          Dans un projet Next.js App Router, ajoutez le script dans votre <code>app/layout.tsx</code> en utilisant le composant <code>Script</code> de Next.js :
        </p>
        <pre><code>{`import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Script
          src="https://www.botexpress.fr/widget.js"
          data-chatbot-id="votre-id"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}`}</code></pre>

        <h3>Webflow / Wix / Squarespace</h3>
        <p>
          Ces plateformes proposent une section <strong>Code personnalisé</strong> dans les paramètres du site. Cherchez dans <em>Paramètres → Code personnalisé → Pied de page</em> (ou équivalent selon la plateforme) et collez-y votre script.
        </p>

        <h3>Vue.js / Nuxt</h3>
        <p>
          Pour Nuxt 3, ajoutez le script dans <code>nuxt.config.ts</code> :
        </p>
        <pre><code>{`export default defineNuxtConfig({
  app: {
    head: {
      script: [{
        src: "https://www.botexpress.fr/widget.js",
        "data-chatbot-id": "votre-id",
        defer: true,
      }],
    },
  },
})`}</code></pre>

        <h2>Le chatbot s&apos;adapte-t-il au thème dark/light de mon site ?</h2>
        <p>
          Oui. Le widget botexpress détecte automatiquement si votre site est en mode sombre ou clair grâce à la classe <code>dark</code> sur votre <code>&lt;html&gt;</code> (standard Tailwind CSS et next-themes). Si votre site bascule en mode sombre, le chatbot bascule également.
        </p>
        <p>
          Vous pouvez aussi choisir une couleur de fond personnalisée depuis votre dashboard — dans ce cas, cette couleur est toujours utilisée, indépendamment du thème du site.
        </p>

        <h2>Questions fréquentes sur l&apos;intégration d&apos;un chatbot</h2>

        <h3>Faut-il un développeur pour intégrer un chatbot ?</h3>
        <p>
          Non. Une seule ligne de code à coller dans votre site suffit. Si vous savez modifier du texte dans votre CMS ou dans un fichier HTML, vous pouvez intégrer botexpress.
        </p>

        <h3>Le chatbot ralentit-il mon site ?</h3>
        <p>
          Non. Le script est chargé avec l&apos;attribut <code>defer</code>, ce qui signifie qu&apos;il ne bloque pas le chargement de votre page. Il s&apos;initialise en arrière-plan après le chargement du contenu principal.
        </p>

        <h3>Puis-je limiter le chatbot à certaines pages ?</h3>
        <p>
          Oui. Vous pouvez choisir de n&apos;intégrer le script que sur certaines pages de votre site (page de contact, page produit, etc.) plutôt que sur l&apos;ensemble du site.
        </p>

        <h3>Le chatbot fonctionne-t-il en mobile ?</h3>
        <p>
          Oui, le widget est entièrement responsive. Il s&apos;adapte à toutes les tailles d&apos;écran et respecte les zones de sécurité (notch, barre de navigation).
        </p>
      </BlogPostLayout>
    </>
  );
}
