import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialite",
  description:
    "Politique de confidentialite du Centre Ashifa - Protection de vos donnees personnelles.",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <section className="pt-32 pb-20 sm:pt-40">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 prose prose-gray max-w-none">
        <h1>Politique de confidentialite</h1>
        <p>
          <em>Derniere mise a jour : {new Date().toLocaleDateString("fr-FR")}</em>
        </p>

        <h2>1. Collecte des donnees</h2>
        <p>
          Le Centre Ashifa collecte les donnees personnelles suivantes dans le
          cadre de ses services :
        </p>
        <ul>
          <li>Nom et prenom (formulaire de contact et prise de rendez-vous)</li>
          <li>Adresse email (formulaire de contact)</li>
          <li>Numero de telephone (formulaire de contact)</li>
          <li>
            Adresse postale (en cas de commande de livre)
          </li>
          <li>Informations de paiement (traitées exclusivement par PayPal)</li>
        </ul>

        <h2>2. Utilisation des donnees</h2>
        <p>Vos donnees sont utilisees pour :</p>
        <ul>
          <li>Repondre a vos demandes de contact</li>
          <li>Gerer vos rendez-vous</li>
          <li>Traiter vos commandes de livre</li>
          <li>Vous envoyer des informations relatives a nos services</li>
        </ul>

        <h2>3. Protection des donnees</h2>
        <p>
          Conformement au Reglement Général sur la Protection des Donnees
          (RGPD), vous disposez des droits suivants :
        </p>
        <ul>
          <li>Droit d&apos;acces a vos donnees personnelles</li>
          <li>Droit de rectification</li>
          <li>Droit a l&apos;effacement</li>
          <li>Droit a la portabilite</li>
          <li>Droit d&apos;opposition</li>
        </ul>

        <h2>4. Paiement en ligne</h2>
        <p>
          Les paiements en ligne sont gérés exclusivement par PayPal
          (Europe) S.à r.l. et Cie, S.C.A. Nous ne stockons aucune
          information bancaire sur nos serveurs. Pour plus
          d&apos;informations, consultez la{" "}
          <a
            href="https://www.paypal.com/fr/legalhub/privacy-full"
            target="_blank"
            rel="noopener noreferrer"
          >
            politique de confidentialité de PayPal
          </a>
          .
        </p>

        <h2>5. Cookies</h2>
        <p>
          Ce site utilise des cookies techniques nécessaires au fonctionnement
          du site. Des cookies d&apos;analyse peuvent etre utilises pour
          améliorer l&apos;expérience utilisateur.
        </p>

        <h2>6. Contact</h2>
        <p>
          Pour toute question relative a vos donnees personnelles, contactez-nous
          au 07 68 84 84 83.
        </p>
      </div>
    </section>
  );
}
