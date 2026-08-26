import nodemailer from "nodemailer";
import type { OrderData } from "./orders";
import type { WaitlistEntry } from "./waitlist";
import type { SupportEntry } from "./support";

function getTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

function getFrom(): string {
  const gmailUser = process.env.GMAIL_USER;
  if (!gmailUser) throw new Error("GMAIL_USER is not configured");
  return `Centre Ashifa <${gmailUser}>`;
}

/** Envoie les 3 emails après un paiement confirmé */
export async function sendAllOrderEmails(
  order: OrderData,
  recipientOverride?: string
): Promise<void> {
  await Promise.all([
    sendEditorEmail(order, recipientOverride),
    sendMerchantEmail(order, recipientOverride),
    sendClientEmail(order, recipientOverride),
  ]);
}

/** Email à l'éditeur (expédition) */
async function sendEditorEmail(order: OrderData, recipientOverride?: string): Promise<void> {
  const editorEmail = recipientOverride || process.env.EDITOR_EMAIL;
  if (!editorEmail) throw new Error("EDITOR_EMAIL is not configured");

  await getTransporter().sendMail({
    from: getFrom(),
    to: editorEmail,
    subject: `📦 Expédition — ${order.quantity} livre${order.quantity > 1 ? "s" : ""} à envoyer`,
    html: buildEditorEmailHtml(order),
  });
}

/** Email au commerçant (Centre Ashifa — notification de vente) */
async function sendMerchantEmail(order: OrderData, recipientOverride?: string): Promise<void> {
  const gmailUser = recipientOverride || process.env.GMAIL_USER;
  if (!gmailUser) throw new Error("GMAIL_USER is not configured");

  await getTransporter().sendMail({
    from: getFrom(),
    to: gmailUser,
    subject: `💰 Vente confirmée — ${order.totalAmount.toFixed(2)} € (${order.firstName} ${order.lastName})`,
    html: buildMerchantEmailHtml(order),
  });
}

/** Email au client (confirmation de commande) */
async function sendClientEmail(order: OrderData, recipientOverride?: string): Promise<void> {
  await getTransporter().sendMail({
    from: getFrom(),
    to: recipientOverride || order.email,
    subject: `Confirmation de votre commande — Centre Ashifa`,
    html: buildClientEmailHtml(order),
  });
}

// ─── Liste d'attente ─────────────────────────────────────────

const LOCATION_LABELS: Record<WaitlistEntry["location"], string> = {
  cabinet: "Au cabinet",
  distance: "À distance",
  indifferent: "Indifférent",
};

const SESSION_LABELS: Record<WaitlistEntry["sessionType"], string> = {
  roqya: "Roqya-thérapie",
  tcc: "TCC",
  indifferent: "Indifférent",
};

/** Envoie la notification à Centre Ashifa + la confirmation au client */
export async function sendWaitlistEmails(entry: WaitlistEntry): Promise<void> {
  await Promise.all([
    sendWaitlistAdminEmail(entry),
    sendWaitlistClientEmail(entry),
  ]);
}

/** Email à Centre Ashifa : nouvelle inscription en liste d'attente */
async function sendWaitlistAdminEmail(entry: WaitlistEntry): Promise<void> {
  const adminEmail = process.env.GMAIL_USER;
  if (!adminEmail) throw new Error("GMAIL_USER is not configured");

  await getTransporter().sendMail({
    from: getFrom(),
    to: adminEmail,
    replyTo: entry.email,
    subject: `📝 Liste d'attente — ${entry.name}`,
    html: buildWaitlistAdminHtml(entry),
  });
}

/** Email au client : confirmation d'inscription en liste d'attente */
async function sendWaitlistClientEmail(entry: WaitlistEntry): Promise<void> {
  await getTransporter().sendMail({
    from: getFrom(),
    to: entry.email,
    subject: "Vous êtes inscrit·e sur la liste d'attente — Centre Ashifa",
    html: buildWaitlistClientHtml(entry),
  });
}

function buildWaitlistAdminHtml(entry: WaitlistEntry): string {
  const { date, time } = formatDate();
  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <h1 style="color: #1e40af; margin: 0 0 8px 0; font-size: 20px;">📝 Nouvelle inscription en liste d'attente</h1>
    <p style="color: #2563eb; margin: 0; font-size: 14px;">Référence : ${entry.id}</p>
  </div>

  <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; width: 40%;">Nom</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${entry.name}</td>
    </tr>
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600;">Email</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${entry.email}">${entry.email}</a></td>
    </tr>
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600;">Téléphone</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;"><a href="tel:${entry.phone}">${entry.phone}</a></td>
    </tr>
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600;">Type de séance</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${SESSION_LABELS[entry.sessionType]}</td>
    </tr>
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600;">Lieu</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${LOCATION_LABELS[entry.location]}</td>
    </tr>
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; vertical-align: top;">Disponibilités</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${entry.availability || "Non précisé"}</td>
    </tr>
  </table>

  <p style="font-size: 14px; color: #6b7280;">
    Rappelez cette personne dès qu'un créneau se libère. Vous pouvez répondre
    directement à cet email pour la recontacter par email.
  </p>

  <p style="font-size: 12px; color: #9ca3af; text-align: center;">
    Inscription enregistrée le ${date} à ${time}
  </p>
</body>
</html>`;
}

function buildWaitlistClientHtml(entry: WaitlistEntry): string {
  const { date } = formatDate();
  const firstName = entry.name.split(" ")[0];
  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <h1 style="color: #166534; margin: 0 0 8px 0; font-size: 20px;">Vous êtes sur la liste d'attente</h1>
  </div>

  <p style="font-size: 16px; line-height: 1.6;">
    Assalamu alaykum ${firstName},<br><br>
    Nous avons bien enregistré votre demande de rendez-vous. Pour le moment nos
    créneaux sont complets, mais nous vous contacterons dès qu'une place se
    libère, en fonction des disponibilités que vous nous avez indiquées.
  </p>

  <div style="background: #f9fafb; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
    <h3 style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">Votre demande</h3>
    <p style="margin: 0; font-size: 14px; line-height: 1.6;">
      Type de séance : <strong>${SESSION_LABELS[entry.sessionType]}</strong><br>
      Lieu : <strong>${LOCATION_LABELS[entry.location]}</strong><br>
      ${entry.availability ? `Disponibilités : <strong>${entry.availability}</strong>` : ""}
    </p>
  </div>

  <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
    Pour toute question, contactez-nous à
    <a href="mailto:centre.ashifa67@gmail.com">centre.ashifa67@gmail.com</a>
    ou au 07 68 84 84 83.
  </p>

  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
  <p style="font-size: 12px; color: #9ca3af; text-align: center;">
    Centre Ashifa — ${date}<br>
    Strasbourg, France
  </p>
</body>
</html>`;
}

// ─── Templates ───────────────────────────────────────────────

function formatDate(): { date: string; time: string } {
  const now = new Date();
  return {
    date: now.toLocaleDateString("fr-FR"),
    time: now.toLocaleTimeString("fr-FR"),
  };
}

function priceBlock(order: OrderData): string {
  const bookTotal = (order.bookPrice * order.quantity).toFixed(2);
  return `
  <div style="background: #fafafa; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
    <h2 style="margin: 0 0 16px 0; font-size: 16px;">Détail de la commande</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0;">La Roqya à la lumière du Tawhid x${order.quantity}</td>
        <td style="padding: 8px 0; text-align: right;">${bookTotal} €</td>
      </tr>
      <tr>
        <td style="padding: 8px 0;">Frais de livraison</td>
        <td style="padding: 8px 0; text-align: right;">${order.shippingPrice.toFixed(2)} €</td>
      </tr>
      <tr style="border-top: 2px solid #333;">
        <td style="padding: 12px 0; font-weight: 700; font-size: 18px;">Total</td>
        <td style="padding: 12px 0; text-align: right; font-weight: 700; font-size: 18px;">${order.totalAmount.toFixed(2)} €</td>
      </tr>
    </table>
  </div>`;
}

/** Email éditeur : focus sur l'adresse de livraison */
function buildEditorEmailHtml(order: OrderData): string {
  const { date, time } = formatDate();
  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <h1 style="color: #1e40af; margin: 0 0 8px 0; font-size: 20px;">📦 Nouvelle expédition à préparer</h1>
    <p style="color: #2563eb; margin: 0; font-size: 14px;">Référence : ${order.checkoutReference}</p>
  </div>

  <div style="background: #fef3c7; border: 1px solid #fcd34d; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
    <h2 style="margin: 0 0 12px 0; font-size: 16px; color: #92400e;">Adresse de livraison</h2>
    <p style="margin: 0; font-size: 16px; line-height: 1.6;">
      <strong>${order.firstName} ${order.lastName}</strong><br>
      ${order.address}<br>
      ${order.postalCode} ${order.city}
    </p>
    ${order.phone ? `<p style="margin: 8px 0 0 0; font-size: 14px;">Tél : ${order.phone}</p>` : ""}
    <p style="margin: 8px 0 0 0; font-size: 14px;">Email : <a href="mailto:${order.email}">${order.email}</a></p>
  </div>

  ${priceBlock(order)}

  <p style="font-size: 12px; color: #9ca3af; text-align: center;">
    Paiement confirmé via Stripe le ${date} à ${time}
  </p>
</body>
</html>`;
}

/** Email commerçant : récapitulatif de la vente */
function buildMerchantEmailHtml(order: OrderData): string {
  const { date, time } = formatDate();
  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <h1 style="color: #166534; margin: 0 0 8px 0; font-size: 20px;">💰 Vente confirmée</h1>
    <p style="color: #15803d; margin: 0; font-size: 14px;">Référence : ${order.checkoutReference}</p>
  </div>

  <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; width: 40%;">Client</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${order.firstName} ${order.lastName}</td>
    </tr>
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600;">Email</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${order.email}">${order.email}</a></td>
    </tr>
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600;">Téléphone</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${order.phone || "Non renseigné"}</td>
    </tr>
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600;">Livraison</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${order.address}, ${order.postalCode} ${order.city}</td>
    </tr>
  </table>

  ${priceBlock(order)}

  <p style="font-size: 12px; color: #9ca3af; text-align: center;">
    Paiement confirmé via Stripe le ${date} à ${time}<br>
    L'éditeur (${process.env.EDITOR_EMAIL}) a été notifié pour l'expédition.
  </p>
</body>
</html>`;
}

/** Email client : confirmation de commande */
function buildClientEmailHtml(order: OrderData): string {
  const { date } = formatDate();
  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <h1 style="color: #166534; margin: 0 0 8px 0; font-size: 20px;">Merci pour votre commande !</h1>
    <p style="color: #15803d; margin: 0; font-size: 14px;">Référence : ${order.checkoutReference}</p>
  </div>

  <p style="font-size: 16px; line-height: 1.6;">
    Assalamu alaykum ${order.firstName},<br><br>
    Votre commande a bien été enregistrée et votre paiement confirmé.
    Votre livre vous sera expédié dans les meilleurs délais.
  </p>

  ${priceBlock(order)}

  <div style="background: #f9fafb; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
    <h3 style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280;">Adresse de livraison</h3>
    <p style="margin: 0; font-size: 14px; line-height: 1.5;">
      ${order.firstName} ${order.lastName}<br>
      ${order.address}<br>
      ${order.postalCode} ${order.city}
    </p>
  </div>

  <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
    Pour toute question, contactez-nous à
    <a href="mailto:centre.ashifa67@gmail.com">centre.ashifa67@gmail.com</a>
    ou au 07 68 84 84 83.
  </p>

  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
  <p style="font-size: 12px; color: #9ca3af; text-align: center;">
    Centre Ashifa — ${date}<br>
    Strasbourg, France
  </p>
</body>
</html>`;
}

// ─── Dons & cotisations ──────────────────────────────────────

function supportLabel(entry: SupportEntry): string {
  if (entry.kind === "membership") return `Cotisation membre bienfaiteur — ${entry.amount} €/mois`;
  return entry.interval === "month" ? `Don mensuel — ${entry.amount} €/mois` : `Don — ${entry.amount} €`;
}

/** Envoie la confirmation au donateur/adhérent + la notification interne */
export async function sendSupportEmails(entry: SupportEntry): Promise<void> {
  await Promise.all([sendSupportAdminEmail(entry), sendSupportClientEmail(entry)]);
}

async function sendSupportAdminEmail(entry: SupportEntry): Promise<void> {
  const adminEmail = process.env.GMAIL_USER;
  if (!adminEmail) throw new Error("GMAIL_USER is not configured");
  const icon = entry.kind === "membership" ? "🤝" : "💚";
  await getTransporter().sendMail({
    from: getFrom(),
    to: adminEmail,
    replyTo: entry.email,
    subject: `${icon} ${supportLabel(entry)} (${entry.firstName} ${entry.lastName})`,
    html: buildSupportAdminHtml(entry),
  });
}

async function sendSupportClientEmail(entry: SupportEntry): Promise<void> {
  await getTransporter().sendMail({
    from: getFrom(),
    to: entry.email,
    subject:
      entry.kind === "membership"
        ? "Bienvenue parmi les membres bienfaiteurs — Centre Ashifa"
        : "Merci pour votre don — Centre Ashifa",
    html: buildSupportClientHtml(entry),
  });
}

function buildSupportAdminHtml(entry: SupportEntry): string {
  const { date, time } = formatDate();
  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <h1 style="color: #065f46; margin: 0 0 8px 0; font-size: 20px;">${supportLabel(entry)}</h1>
    <p style="color: #047857; margin: 0; font-size: 14px;">Référence : ${entry.id}</p>
  </div>
  <div style="background: #fafafa; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
    <p style="margin: 0; line-height: 1.6;">
      <strong>${entry.firstName} ${entry.lastName}</strong><br>
      Email : <a href="mailto:${entry.email}">${entry.email}</a><br>
      ${entry.stripeCustomerId ? `Client Stripe : ${entry.stripeCustomerId}<br>` : ""}
      ${entry.stripeSubscriptionId ? `Abonnement Stripe : ${entry.stripeSubscriptionId}<br>` : ""}
    </p>
  </div>
  <p style="font-size: 12px; color: #9ca3af; text-align: center;">
    Paiement confirmé via Stripe le ${date} à ${time}
  </p>
</body>
</html>`;
}

function buildSupportClientHtml(entry: SupportEntry): string {
  const { date } = formatDate();
  const isMembership = entry.kind === "membership";
  const recurring = entry.interval === "month";
  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <h1 style="color: #065f46; margin: 0 0 8px 0; font-size: 20px;">
      ${isMembership ? "Bienvenue parmi nos membres bienfaiteurs" : "Merci du fond du cœur"}
    </h1>
    <p style="color: #047857; margin: 0; font-size: 14px;">Référence : ${entry.id}</p>
  </div>
  <p>Bonjour ${entry.firstName},</p>
  <p>
    ${
      isMembership
        ? `Votre cotisation de <strong>${entry.amount} €/mois</strong> à l'association ASHIFA BIEN-ÊTRE ET ÉQUILIBRE est confirmée. Vous êtes désormais membre bienfaiteur de l'association.`
        : recurring
          ? `Votre don mensuel de <strong>${entry.amount} €</strong> à l'association ASHIFA BIEN-ÊTRE ET ÉQUILIBRE est confirmé.`
          : `Votre don de <strong>${entry.amount} €</strong> à l'association ASHIFA BIEN-ÊTRE ET ÉQUILIBRE est confirmé.`
    }
  </p>
  <p>
    Grâce à vous, nous pouvons continuer à proposer des séances entièrement gratuites à celles et ceux qui en ont besoin.
  </p>
  ${recurring ? `<p style="font-size: 14px; color: #6b7280;">Vous pouvez modifier ou arrêter ce prélèvement à tout moment depuis la page <a href="https://centre-ashifa.fr/soutenir">Nous soutenir</a> (« Gérer mon soutien mensuel »).</p>` : ""}
  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
  <p style="font-size: 12px; color: #9ca3af; text-align: center;">
    Centre Ashifa — ${date}<br>
    8 avenue de l'Énergie, 67800 Bischheim
  </p>
</body>
</html>`;
}
