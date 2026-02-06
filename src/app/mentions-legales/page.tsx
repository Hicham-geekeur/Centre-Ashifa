import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions legales",
  description: "Mentions legales du site Centre Ashifa.",
};

export default function MentionsLegalesPage() {
  return (
    <section className="pt-32 pb-20 sm:pt-40">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 prose prose-gray max-w-none">
        <h1>Mentions legales</h1>

        <h2>Editeur du site</h2>
        <p>
          Centre Ashifa<br />
          Responsable de la publication : Larbi DJEDADOUA<br />
          Telephone : 07 68 84 84 83<br />
          Zone d&apos;intervention : Strasbourg et sa région, France
        </p>

        <h2>Hebergement</h2>
        <p>
          Ce site est heberge par Vercel Inc.<br />
          440 N Bayard St Suite 201<br />
          Wilmington, DE 19801, Etats-Unis
        </p>

        <h2>Propriete intellectuelle</h2>
        <p>
          L&apos;ensemble du contenu de ce site (textes, images, videos, logos) est
          la propriete exclusive du Centre Ashifa, sauf mention contraire. Toute
          reproduction, representation, modification ou exploitation de tout ou
          partie du contenu de ce site, sans autorisation prealable, est
          interdite.
        </p>

        <h2>Responsabilite</h2>
        <p>
          Le Centre Ashifa s&apos;efforce de fournir des informations aussi
          precises que possible. Toutefois, il né pourra etre tenu responsable
          des omissions, inexactitudes ou lacunes dans les informations
          diffusees sur le site.
        </p>

        <h2>Avertissement</h2>
        <p>
          Le Centre Ashifa n&apos;est pas un établissement medical et né peut en
          aucun cas prescrire de médicaments ou d&apos;ordonnances. Le centre
          n&apos;est ni un établissement d&apos;enseignement religieux ni un lieu
          de culte. Les thérapies proposees sont complémentaires et né se
          substituent en aucun cas a un traitement medical.
        </p>

        <h2>Donnees personnelles</h2>
        <p>
          Pour plus d&apos;informations sur la gestion de vos donnees
          personnelles, consultez notre{" "}
          <a href="/politique-confidentialite">politique de confidentialite</a>.
        </p>
      </div>
    </section>
  );
}
