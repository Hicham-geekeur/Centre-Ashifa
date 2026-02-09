import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente",
  description:
    "Conditions generales de vente du Centre Ashifa pour l'achat de produits en ligne.",
};

export default function CGVPage() {
  return (
    <section className="pt-32 pb-20 sm:pt-40">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 prose prose-gray max-w-none">
        <h1>Conditions Générales de Vente</h1>
        <p>
          <em>Derniere mise a jour : {new Date().toLocaleDateString("fr-FR")}</em>
        </p>

        <h2>1. Objet</h2>
        <p>
          Les presentes conditions generales de vente (CGV) regissent les ventes
          de produits effectuees sur le site centre-ashifa.fr, edite par le
          Centre Ashifa.
        </p>

        <h2>2. Produits</h2>
        <p>
          Les produits proposes a la vente sont decrits avec la plus grande
          exactitude possible. Les photographies et descriptions sont fournies a
          titre indicatif.
        </p>

        <h2>3. Prix</h2>
        <p>
          Les prix sont indiques en euros (EUR) toutes taxes comprises (TTC). Le
          Centre Ashifa se reserve le droit de modifier ses prix a tout moment,
          les produits etant factures au tarif en vigueur au moment de la
          commande.
        </p>

        <h2>4. Commande</h2>
        <p>
          La validation de la commande vaut acceptation des presentes CGV. Le
          Centre Ashifa confirmera la commande par email a l&apos;adresse
          fournie.
        </p>

        <h2>5. Paiement</h2>
        <p>
          Le paiement s&apos;effectue en ligne par carte bancaire via la
          plateforme sécurisée SumUp. Le débit est effectué au moment de la
          validation de la commande.
        </p>

        <h2>6. Livraison</h2>
        <p>
          Les produits sont livres en France metropolitaine. Les delais de
          livraison sont donnes a titre indicatif. En cas de pré-commande, la
          livraison s&apos;effectuera dans les meilleurs délais.
        </p>

        <h2>7. Droit de retractation</h2>
        <p>
          Conformement a la legislation francaise, vous disposez d&apos;un delai
          de 14 jours a compter de la reception du produit pour exercer votre
          droit de retractation, sans avoir a justifier de motifs ni a payer de
          penalites.
        </p>

        <h2>8. Reclamations</h2>
        <p>
          Pour toute reclamation, vous pouvez nous contacter au 07 68 84 84 83
          ou via notre formulaire de contact.
        </p>

        <h2>9. Droit applicable</h2>
        <p>
          Les presentes CGV sont soumises au droit francais. En cas de litige,
          les tribunaux de Strasbourg seront seuls competents.
        </p>
      </div>
    </section>
  );
}
