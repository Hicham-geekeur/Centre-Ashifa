import nodemailer from "nodemailer";
import type { OrderData } from "./orders";

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
    Paiement confirmé via SumUp le ${date} à ${time}
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
    Paiement confirmé via SumUp le ${date} à ${time}<br>
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
