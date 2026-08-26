# Migration Stripe + page « Nous soutenir » + textes légaux

Date : 2026-08-26

## Objectifs

1. Remplacer PayPal par **Stripe Checkout hébergé** pour l'achat du livre.
2. Ajouter une page **/soutenir** (dons ponctuels ou mensuels, cotisation mensuelle d'adhérent).
3. Mettre à jour les textes légaux : association loi 1901 (droit local), consultations gratuites, hébergeur, Stripe.
4. Guider la suppression de la mention de paiement / annulation dans Calendly (hors code).

## Contraintes

- Next.js 16 / React 19, données en fichiers JSON dans le volume Docker `order-data` (`/app/data`).
- Aucune donnée bancaire côté serveur : tout passe par Stripe Checkout.
- Emails via Gmail (lib `email.ts` existante).
- Déploiement VPS par rsync + `docker compose up -d --build`.

## 1. Achat du livre

### Flux
1. `OrderForm` (inchangé côté champs) POST `/api/checkout/create`.
2. Le serveur valide (zod), crée la commande `pending` dans `orders.json` avec `stripeSessionId`, crée une Checkout Session :
   - `mode: "payment"`, `currency: eur`, `locale: fr`
   - line items : livre 12 € × quantité, port 5 € (`price_data` à la volée)
   - `client_reference_id` = référence `ASHIFA-…`
   - `customer_email` prérempli
   - `success_url` = `/livre/merci?session_id={CHECKOUT_SESSION_ID}`, `cancel_url` = `/livre?annule=1`
   - `metadata: { kind: "book", checkoutReference }`
3. Réponse `{ url }` → redirection navigateur.
4. Webhook `/api/checkout/webhook` (`checkout.session.completed`, signature vérifiée avec `STRIPE_WEBHOOK_SECRET`) : si `metadata.kind === "book"` et commande encore `pending` → `paid` + envoi des 3 mails existants. Idempotent (une commande déjà `paid` est ignorée).
5. Page `/livre/merci` : lit la commande via `session_id` (appel Stripe côté serveur) et affiche la confirmation ; si le webhook n'est pas encore passé, affiche « paiement en cours de confirmation ».

### Suppression
`src/lib/paypal.ts`, `src/components/book/PayPalCheckout.tsx`, `/api/checkout/capture`, script PayPal, variables `PAYPAL_*` (`.env.example`, `docker-compose.yml`, `Dockerfile`). Le champ `paypalOrderId` reste optionnel dans `OrderData` pour l'historique.

## 2. Page « Nous soutenir » (`/soutenir`)

- Entrée « Nous soutenir » dans le menu principal et le footer.
- Deux onglets (état client, `?onglet=don|adhesion` pour lien direct) :
  - **Faire un don** : 10 / 20 / 50 € + montant libre (min 1 €, max 10 000 €), choix ponctuel / mensuel.
  - **Adhérer** : paliers 5 / 10 / 20 €/mois.
- Champs : prénom, nom, email (le reste est collecté par Stripe).
- POST `/api/soutenir/create` → Checkout Session :
  - don ponctuel : `mode: "payment"`
  - don mensuel / cotisation : `mode: "subscription"`, `price_data.recurring.interval = "month"`
  - `metadata: { kind: "donation" | "membership", amount, interval }`
  - `success_url` = `/soutenir/merci?session_id=…`, `cancel_url` = `/soutenir`
- Webhook commun : `checkout.session.completed` avec `kind` don/adhésion → enregistrement dans `data/support.json` (`{ id, kind, interval, amount, firstName, lastName, email, stripeCustomerId, stripeSubscriptionId?, createdAt }`) + mail au donateur/adhérent + mail interne au centre.
- « Gérer mon adhésion / mon don mensuel » : POST `/api/soutenir/portail` avec l'email → si un client Stripe existe, création d'une session **Customer Portal** et redirection ; sinon message neutre (pas de fuite d'info).
- Les reçus Stripe restent activés côté dashboard (recommandé).

## 3. Textes légaux

- **Mentions légales** : éditeur = « ASHIFA BIEN-ÊTRE ET ÉQUILIBRE, association de droit local (Alsace-Moselle), SIREN 101 659 753, siège 8 avenue de l'Énergie, 67800 Bischheim, responsable de publication Larbi DJEDADOUA » ; hébergeur = Hostinger International Ltd (VPS) ; paragraphe « Nature de l'activité » : association à but non lucratif, **consultations et séances entièrement gratuites**, seuls la vente du livre, les dons et les cotisations donnent lieu à un paiement.
- **CGV** : PayPal → Stripe ; nouvel article « Dons et cotisations » (paiement récurrent mensuel, résiliation à tout moment via le portail, pas de remboursement des mois échus).
- **FAQ** : réponse tarifs → « Toutes nos séances sont gratuites ».
- **Politique de confidentialité** : PayPal → Stripe (sous-traitant paiement).

## 4. Calendly (hors code)

Pas-à-pas fourni à l'utilisateur : Event type « rokya » → *Booking page options* / *Notifications* : retirer toute mention de paiement, désactiver « Collect payment » s'il est actif, vérifier les textes de confirmation / annulation.

## Configuration

`.env` (VPS) :
```
STRIPE_SECRET_KEY=sk_live_…
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_…   # réservé, non requis par Checkout hébergé
STRIPE_WEBHOOK_SECRET=whsec_…
```
Webhook Stripe à créer : `https://centre-ashifa.fr/api/checkout/webhook`, événement `checkout.session.completed`.

## Tests

- Unitaires (vitest) : construction des paramètres de session (livre / don / adhésion), validation zod des montants, traitement du webhook (idempotence, kind inconnu ignoré).
- Manuel en mode test Stripe (`sk_test_`, carte 4242 4242 4242 4242, `stripe listen` pour le webhook), puis passage en live et un achat réel remboursé.

## Hors périmètre

Reçus fiscaux Cerfa, espace adhérent, migration des anciennes commandes PayPal.
