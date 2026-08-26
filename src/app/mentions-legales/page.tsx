import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site Centre Ashifa.",
};

export default function MentionsLegalesPage() {
  return (
    <section className="pt-32 pb-20 sm:pt-40">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 prose prose-gray max-w-none">
        <h1>Mentions légales</h1>

        <h2>Éditeur du site</h2>
        <p>
          <strong>ASHIFA BIEN-ÊTRE ET ÉQUILIBRE</strong>
          <br />
          Association à but non lucratif de droit local, régie par les
          articles 21 à 79-III du Code civil local (Alsace-Moselle), inscrite
          au registre des associations du Tribunal de proximité de
          Schiltigheim.
          <br />
          SIREN : 101 659 753 — SIRET : 101 659 753 00012
          <br />
          Siège social : 8 avenue de l&apos;Énergie, 67800 Bischheim, France
          <br />
          Président et responsable de la publication : Larbi DJEDADOUA
          <br />
          Téléphone : 07 68 84 84 83
          <br />
          Nom d&apos;usage : Centre Ashifa
        </p>

        <h2>Hébergement</h2>
        <p>
          Ce site est hébergé sur un serveur privé virtuel fourni par
          <br />
          Hostinger International Ltd.
          <br />
          61 Lordou Vironos Street, 6023 Larnaca, Chypre
          <br />
          <a
            href="https://www.hostinger.fr"
            rel="noopener noreferrer"
            target="_blank"
          >
            www.hostinger.fr
          </a>
        </p>

        <h2>Nature de l&apos;activité</h2>
        <p>
          Le Centre Ashifa est géré par une association à but non lucratif.{" "}
          <strong>
            Toutes les consultations et séances proposées (Roqya-thérapie,
            TCC, accompagnement) sont entièrement gratuites.
          </strong>{" "}
          Aucun paiement n&apos;est demandé pour prendre rendez-vous ou
          bénéficier d&apos;une séance. Seuls l&apos;achat du livre, les dons
          et les cotisations d&apos;adhésion, effectués librement sur ce site,
          donnent lieu à un paiement en ligne.
        </p>

        <h2>Propriété intellectuelle</h2>
        <p>
          L&apos;ensemble du contenu de ce site (textes, images, videos, logos) est
          la propriété exclusive du Centre Ashifa, sauf mention contraire. Toute
          reproduction, représentation, modification ou exploitation de tout ou
          partie du contenu de ce site, sans autorisation préalable, est
          interdite.
        </p>

        <h2>Responsabilité</h2>
        <p>
          L&apos;association s&apos;efforce de fournir des informations aussi
          précises que possible. Toutefois, il ne pourra être tenu responsable
          des omissions, inexactitudes ou lacunes dans les informations
          diffusées sur le site.
        </p>

        <h2>Avertissement</h2>
        <p>
          Le Centre Ashifa n&apos;est pas un établissement médical et ne peut en
          aucun cas prescrire de médicaments ou d&apos;ordonnances. Le centre
          n&apos;est ni un établissement d&apos;enseignement religieux ni un lieu
          de culte. Les thérapies proposées sont complémentaires et ne se
          substituent en aucun cas à un traitement médical.
        </p>

        <h2>Données personnelles</h2>
        <p>
          Pour plus d&apos;informations sur la gestion de vos données
          personnelles, consultez notre{" "}
          <a href="/politique-confidentialite">politique de confidentialité</a>.
        </p>
      </div>
    </section>
  );
}
