import type { Metadata } from "next";
import Link from "next/link";
import { Bot, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales de botexpress, plateforme de création de chatbots IA pour sites web.",
  alternates: { canonical: "https://www.botexpress.fr/legal" },
};

export default function LegalPage() {
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

        <h1 className="text-3xl font-bold tracking-tight">Mentions légales</h1>
        <p className="mt-2 text-muted-foreground">Dernière mise à jour : 1 juin 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">1. Éditeur du site</h2>
            <p>
              Le site botexpress est édité par :<br />
              <strong className="text-foreground">[Nom de la société]</strong><br />
              Forme juridique : [SAS / SARL / Auto-entrepreneur]<br />
              Capital social : [Montant] euros<br />
              Siège social : [Adresse complète]<br />
              RCS : [Ville] [Numéro]<br />
              SIRET : [Numéro SIRET]<br />
              Numéro de TVA intracommunautaire : [Numéro]<br />
              Directeur de la publication : [Nom du responsable]<br />
              Contact : contact@botexpress.fr
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">2. Hébergement</h2>
            <p>
              Le site est hébergé par :<br />
              <strong className="text-foreground">Google Cloud Platform (Firebase)</strong><br />
              Google Ireland Limited<br />
              Gordon House, Barrow Street, Dublin 4, Irlande<br />
              Téléphone : +353 1 543 1000
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">3. Propriété intellectuelle</h2>
            <p>
              L&apos;ensemble du contenu du site botexpress (textes, images, graphismes, logo,
              icones, logiciels, base de données) est la propriété exclusive de l&apos;éditeur
              ou de ses partenaires et est protégé par les lois françaises et internationales
              relatives à la propriété intellectuelle.
            </p>
            <p className="mt-2">
              Toute reproduction, représentation, modification, publication ou adaptation de
              tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé,
              est interdite sans l&apos;autorisation écrite préalable de l&apos;éditeur.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">4. Responsabilité</h2>
            <p>
              L&apos;éditeur s&apos;efforce de fournir des informations aussi précises que
              possible. Toutefois, il ne pourra être tenu responsable des omissions, des
              inexactitudes et des carences dans la mise à jour, qu&apos;elles soient de son
              fait ou du fait des tiers partenaires qui lui fournissent ces informations.
            </p>
            <p className="mt-2">
              Le service botexpress utilise l&apos;intelligence artificielle pour générer des
              réponses. Ces réponses sont fournies à titre informatif et ne sauraient
              constituer un conseil professionnel. L&apos;éditeur décline toute responsabilité
              quant à l&apos;exactitude des réponses générées par les chatbots.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">5. Liens hypertextes</h2>
            <p>
              Le site peut contenir des liens vers d&apos;autres sites web. L&apos;éditeur
              n&apos;exerce aucun contrôle sur ces sites et décline toute responsabilité quant
              à leur contenu et aux traitements de données personnelles qu&apos;ils opèrent.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">6. Droit applicable</h2>
            <p>
              Les présentes mentions légales sont régies par le droit français. En cas de
              litige, les tribunaux français seront seuls compétents.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
