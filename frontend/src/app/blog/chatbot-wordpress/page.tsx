import type { Metadata } from "next";
import Link from "next/link";
import { BlogPostLayout } from "@/components/blog-post-layout";

export const metadata: Metadata = {
  title: "Chatbot WordPress : ajouter un chatbot IA en 5 minutes (2026)",
  description: "Installez un chatbot IA sur votre site WordPress sans coder. Plugin officiel botexpress, compatible avec tous les thèmes. Répond aux visiteurs 24h/24. Essai gratuit 7 jours.",
  keywords: ["chatbot wordpress", "plugin chatbot wordpress", "installer chatbot wordpress", "ajouter chatbot wordpress", "chatbot ia wordpress", "widget chat wordpress"],
  alternates: { canonical: "https://www.botexpress.fr/blog/chatbot-wordpress" },
  openGraph: {
    title: "Chatbot WordPress : installer un chatbot IA en 5 minutes",
    description: "Plugin officiel botexpress pour WordPress. Installez un chatbot IA en 3 clics, sans coder. Compatible avec tous les thèmes et constructeurs de page.",
    url: "https://www.botexpress.fr/blog/chatbot-wordpress",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Installer un chatbot IA sur WordPress",
  description: "Guide complet pour ajouter un chatbot IA à votre site WordPress avec le plugin botexpress.",
  totalTime: "PT5M",
  step: [
    { "@type": "HowToStep", name: "Créer votre chatbot sur botexpress", text: "Inscrivez-vous et créez votre chatbot depuis le dashboard botexpress" },
    { "@type": "HowToStep", name: "Télécharger le plugin", text: "Téléchargez le plugin WordPress depuis votre dashboard botexpress" },
    { "@type": "HowToStep", name: "Installer le plugin", text: "Dans WordPress Admin, allez dans Extensions → Ajouter → Téléverser le fichier .zip" },
    { "@type": "HowToStep", name: "Configurer", text: "Réglages → botexpress → collez votre Chatbot ID → Enregistrer" },
  ],
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPostLayout
        title="Chatbot WordPress : ajouter un chatbot IA en 5 minutes"
        description="Vous avez un site WordPress et vous voulez y ajouter un chatbot intelligent ? Voici le guide complet — avec plugin officiel et méthode manuelle."
        date="Juin 2026"
        readTime="5 min"
      >
        <p>
          WordPress représente <strong>43 % des sites web mondiaux</strong>. Ajouter un chatbot IA à votre site WordPress est l&apos;un des moyens les plus rapides d&apos;automatiser votre support client et de qualifier des leads sans effort. Dans ce guide, on vous montre exactement comment faire avec botexpress.
        </p>

        <h2>Méthode 1 — Plugin officiel botexpress (recommandé)</h2>
        <p>
          C&apos;est la méthode la plus simple. Elle prend moins de 3 minutes et ne nécessite aucune modification de code.
        </p>

        <h3>Étape 1 — Créer votre chatbot</h3>
        <p>
          Rendez-vous sur <Link href="/auth/register">botexpress.fr</Link>, créez un compte et configurez votre chatbot. Entrez l&apos;URL de votre site WordPress : notre IA va automatiquement analyser toutes vos pages, extraire votre contenu, vos couleurs et votre logo.
        </p>

        <h3>Étape 2 — Télécharger le plugin</h3>
        <p>
          Dans votre dashboard botexpress, allez dans la page de configuration de votre chatbot, section <strong>Plugins CMS → WordPress</strong>. Téléchargez le fichier <code>.zip</code> du plugin.
        </p>

        <h3>Étape 3 — Installer le plugin WordPress</h3>
        <p>
          Dans votre administration WordPress :
        </p>
        <ol>
          <li>Allez dans <strong>Extensions → Ajouter une extension</strong></li>
          <li>Cliquez sur <strong>Téléverser une extension</strong></li>
          <li>Sélectionnez le fichier <code>.zip</code> téléchargé</li>
          <li>Cliquez sur <strong>Installer maintenant</strong> puis <strong>Activer l&apos;extension</strong></li>
        </ol>

        <h3>Étape 4 — Configurer le plugin</h3>
        <p>
          Dans votre admin WordPress, allez dans <strong>Réglages → botexpress</strong>. Collez votre <strong>Chatbot ID</strong> (disponible dans votre dashboard botexpress) et cliquez sur <strong>Enregistrer</strong>. C&apos;est tout — votre chatbot apparaît immédiatement sur toutes les pages de votre site.
        </p>

        <h2>Méthode 2 — Ajout manuel du script</h2>
        <p>
          Si vous préférez ne pas installer de plugin, vous pouvez ajouter le script directement dans le code de votre thème.
        </p>

        <h3>Via l&apos;éditeur de thème</h3>
        <p>
          Dans votre admin WordPress, allez dans <strong>Apparence → Éditeur de thème</strong>. Sélectionnez le fichier <code>footer.php</code> et collez le script juste avant <code>&lt;/body&gt;</code>.
        </p>

        <h3>Via une extension de code</h3>
        <p>
          La méthode la plus sûre sans toucher aux fichiers du thème : installez l&apos;extension gratuite <strong>Header Footer Code Manager</strong> ou <strong>Insert Headers and Footers</strong>. Ajoutez votre script dans la section &quot;Footer&quot; et enregistrez.
        </p>

        <h3>Via functions.php</h3>
        <p>
          Ajoutez ce code dans le fichier <code>functions.php</code> de votre thème enfant :
        </p>
        <pre><code>{`function botexpress_widget() {
    echo '<script src="https://www.botexpress.fr/widget.js"
          data-chatbot-id="votre-chatbot-id"
          data-api-url="https://agentai-23tt.onrender.com"
          defer></script>';
}
add_action('wp_footer', 'botexpress_widget');`}</code></pre>

        <h2>Le chatbot fonctionne-t-il avec tous les thèmes WordPress ?</h2>
        <p>
          Oui. Le widget botexpress fonctionne avec <strong>tous les thèmes WordPress</strong> sans exception : Astra, Divi, Elementor, Avada, OceanWP, GeneratePress, Kadence... Il s&apos;affiche en superposition, indépendamment du design de votre thème.
        </p>
        <p>
          Le widget s&apos;adapte automatiquement au mode sombre/clair de votre thème.
        </p>

        <h2>Compatibilité avec les constructeurs de pages</h2>
        <ul>
          <li><strong>Elementor</strong> — compatible, ajoutez le script via les paramètres du thème ou un widget HTML</li>
          <li><strong>Divi</strong> — compatible, via Thème Options → Intégration → Code avant &lt;/body&gt;</li>
          <li><strong>Beaver Builder</strong> — compatible</li>
          <li><strong>WPBakery</strong> — compatible</li>
          <li><strong>Gutenberg</strong> — compatible, utilisez un bloc HTML personnalisé</li>
        </ul>

        <h2>Performances : impact sur la vitesse du site</h2>
        <p>
          Le script botexpress est chargé avec l&apos;attribut <code>defer</code>, ce qui signifie qu&apos;il ne bloque <strong>pas</strong> le rendu de votre page. Votre score Google PageSpeed ne sera pas impacté. Le widget s&apos;initialise après le chargement complet de la page.
        </p>

        <h2>Questions fréquentes</h2>

        <h3>Le chatbot s&apos;affiche-t-il sur toutes les pages WordPress ?</h3>
        <p>
          Oui, par défaut il s&apos;affiche sur toutes les pages. Vous pouvez le restreindre à certaines pages en intégrant le script uniquement dans les templates ou pages souhaités.
        </p>

        <h3>Le chatbot fonctionne-t-il avec WooCommerce ?</h3>
        <p>
          Oui. Le chatbot analyse votre site WooCommerce et peut répondre aux questions sur vos produits, vos catégories, votre politique de retour et votre FAQ. C&apos;est particulièrement utile pour réduire les demandes de support e-commerce.
        </p>

        <h3>Puis-je changer l&apos;apparence du chatbot ?</h3>
        <p>
          Oui, depuis votre dashboard botexpress vous pouvez modifier les couleurs, la taille du widget, le message d&apos;accueil et activer la capture de leads. Les modifications s&apos;appliquent en temps réel sans avoir à modifier quoi que ce soit dans WordPress.
        </p>
      </BlogPostLayout>
    </>
  );
}
