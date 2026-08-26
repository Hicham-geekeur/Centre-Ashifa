# Migration Stripe + page « Nous soutenir » — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remplacer PayPal par Stripe Checkout hébergé pour le livre, ajouter une page `/soutenir` (dons ponctuels/mensuels, cotisation mensuelle), et mettre à jour les textes légaux de l'association.

**Architecture:** Toutes les sessions de paiement sont construites par des fonctions pures dans `src/lib/stripe.ts` (testables sans réseau) puis envoyées à Stripe par les routes API. Un seul webhook `/api/checkout/webhook` reçoit `checkout.session.completed` et délègue à `handleCheckoutCompleted()` (`src/lib/checkout-events.ts`, dépendances injectées) qui met à jour `orders.json` ou `support.json` et déclenche les emails. Le front ne fait que POST → redirection vers `session.url`.

**Tech Stack:** Next.js 16 (App Router, `output: standalone`), React 19, zod 4, nodemailer, `stripe` (SDK Node), vitest pour les tests unitaires. Données en JSON dans `data/` (volume Docker `order-data`).

**Spec:** `docs/superpowers/specs/2026-08-26-stripe-soutien-design.md`

## Global Constraints

- Node 20, Next.js 16.1.6, React 19.2.3, zod ^4 (API `z.string().email()` OK).
- Aucune donnée bancaire côté serveur : uniquement Stripe Checkout hébergé.
- Prix livre `BOOK_PRICE = 12`, port `SHIPPING_PRICE = 5` (existants dans `src/lib/validations.ts`).
- Don : 10 / 20 / 50 € suggérés, libre entre 1 € et 10 000 €, ponctuel (`once`) ou mensuel (`month`).
- Cotisation : paliers 5 / 10 / 20 €/mois uniquement, toujours mensuelle, statut « membre bienfaiteur ».
- Textes en français avec accents corrects. Les pages légales existantes sont en `prose` sans accents sur certains mots (« legales ») : on corrige les accents dans les blocs modifiés.
- Variables d'env : `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_BASE_URL`, `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `EDITOR_EMAIL`. Suppression de toutes les `PAYPAL_*`.
- Commits fréquents, message au format `type: description` en français, avec `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Ne jamais toucher `/docker/centre-ashifa/.env` ni le volume `data/` en prod.

---

## Structure des fichiers

| Fichier | Rôle |
|---|---|
| `vitest.config.ts` (créer) | config tests, alias `@/` |
| `tests/stripe.test.ts` (créer) | tests des builders de session |
| `tests/validations.test.ts` (créer) | tests du schéma `supportFormSchema` |
| `tests/checkout-events.test.ts` (créer) | tests du handler webhook |
| `src/lib/stripe.ts` (créer) | client Stripe + builders purs `buildBookSessionParams`, `buildSupportSessionParams` |
| `src/lib/support.ts` (créer) | stockage `data/support.json` |
| `src/lib/checkout-events.ts` (créer) | `handleCheckoutCompleted(session, deps)` |
| `src/lib/validations.ts` (modifier) | `supportFormSchema`, constantes dons/cotisation |
| `src/lib/orders.ts` (modifier) | champ `stripeSessionId`, `attachStripeSession`, `findOrderByStripeSession` |
| `src/lib/email.ts` (modifier) | « PayPal » → « Stripe », `sendSupportEmails` |
| `src/app/api/checkout/create/route.ts` (modifier) | crée la session livre, renvoie `{ url }` |
| `src/app/api/checkout/webhook/route.ts` (réécrire) | vérification signature Stripe + délégation |
| `src/app/api/checkout/capture/route.ts` (supprimer) | PayPal |
| `src/app/api/soutenir/create/route.ts` (créer) | session don/adhésion |
| `src/app/api/soutenir/portail/route.ts` (créer) | session Customer Portal |
| `src/components/book/OrderForm.tsx` (modifier) | une seule étape, redirection Stripe |
| `src/components/book/PayPalCheckout.tsx` (supprimer) | PayPal |
| `src/lib/paypal.ts` (supprimer) | PayPal |
| `src/app/livre/merci/page.tsx` (créer) | confirmation livre (remplace `confirmation`) |
| `src/app/livre/confirmation/page.tsx` (supprimer) | ancienne confirmation |
| `src/components/support/SupportForm.tsx` (créer) | onglets Don / Adhésion |
| `src/components/support/PortalForm.tsx` (créer) | « Gérer mon adhésion » |
| `src/app/soutenir/page.tsx` (créer) | page Nous soutenir |
| `src/app/soutenir/merci/page.tsx` (créer) | confirmation don/adhésion |
| `src/config/navigation.ts`, `src/app/sitemap.ts` (modifier) | entrées « Nous soutenir » |
| `src/app/mentions-legales/page.tsx`, `src/app/cgv/page.tsx`, `src/app/faq/page.tsx`, `src/app/politique-confidentialite/page.tsx` (modifier) | textes légaux |
| `docker-compose.yml`, `Dockerfile`, `.env.example` (modifier) | variables Stripe |

---

### Task 1 : Outillage de test + dépendance Stripe

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `tests/smoke.test.ts`

**Interfaces:**
- Produces : commande `npm test` (vitest run), alias `@/` résolu dans les tests.

- [ ] **Step 1 : Installer les dépendances**

```bash
npm install stripe@^18
npm install -D vitest@^3
```

- [ ] **Step 2 : Ajouter le script test**

Dans `package.json`, section `scripts`, ajouter :
```json
"test": "vitest run"
```

- [ ] **Step 3 : Créer `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
```

- [ ] **Step 4 : Test fumée**

`tests/smoke.test.ts` :
```ts
import { describe, it, expect } from "vitest";
import { calculateTotal } from "@/lib/validations";

describe("smoke", () => {
  it("résout l'alias @/ et calcule un total", () => {
    expect(calculateTotal(2)).toBe(29);
  });
});
```

- [ ] **Step 5 : Lancer**

Run: `npm test`
Expected: 1 test PASS.

- [ ] **Step 6 : Commit**

```bash
git add package.json package-lock.json vitest.config.ts tests/smoke.test.ts
git commit -m "chore: ajoute vitest et le SDK stripe

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2 : Schéma de validation « soutenir » + constantes

**Files:**
- Modify: `src/lib/validations.ts`
- Test: `tests/validations.test.ts`

**Interfaces:**
- Produces :
  ```ts
  export const DONATION_PRESETS = [10, 20, 50] as const;
  export const DONATION_MIN = 1; export const DONATION_MAX = 10000;
  export const MEMBERSHIP_TIERS = [5, 10, 20] as const;
  export const supportFormSchema: z.ZodType<SupportFormData>;
  export type SupportFormData = {
    kind: "donation" | "membership";
    interval: "once" | "month";
    amount: number;          // euros, entier
    firstName: string; lastName: string; email: string;
  };
  ```

- [ ] **Step 1 : Test**

`tests/validations.test.ts` :
```ts
import { describe, it, expect } from "vitest";
import { supportFormSchema } from "@/lib/validations";

const base = { firstName: "Ali", lastName: "Ben", email: "ali@example.com" };

describe("supportFormSchema", () => {
  it("accepte un don ponctuel libre", () => {
    const r = supportFormSchema.safeParse({ ...base, kind: "donation", interval: "once", amount: 37 });
    expect(r.success).toBe(true);
  });
  it("accepte un don mensuel", () => {
    const r = supportFormSchema.safeParse({ ...base, kind: "donation", interval: "month", amount: 10 });
    expect(r.success).toBe(true);
  });
  it("refuse un don < 1 € ou > 10 000 €", () => {
    expect(supportFormSchema.safeParse({ ...base, kind: "donation", interval: "once", amount: 0 }).success).toBe(false);
    expect(supportFormSchema.safeParse({ ...base, kind: "donation", interval: "once", amount: 10001 }).success).toBe(false);
  });
  it("refuse un don non entier", () => {
    expect(supportFormSchema.safeParse({ ...base, kind: "donation", interval: "once", amount: 10.5 }).success).toBe(false);
  });
  it("accepte une adhésion à un palier mensuel", () => {
    expect(supportFormSchema.safeParse({ ...base, kind: "membership", interval: "month", amount: 10 }).success).toBe(true);
  });
  it("refuse une adhésion hors palier ou ponctuelle", () => {
    expect(supportFormSchema.safeParse({ ...base, kind: "membership", interval: "month", amount: 7 }).success).toBe(false);
    expect(supportFormSchema.safeParse({ ...base, kind: "membership", interval: "once", amount: 10 }).success).toBe(false);
  });
  it("refuse un email invalide", () => {
    expect(supportFormSchema.safeParse({ ...base, email: "nope", kind: "donation", interval: "once", amount: 10 }).success).toBe(false);
  });
});
```

- [ ] **Step 2 : Vérifier l'échec** — Run: `npm test` → FAIL (`supportFormSchema` non exporté).

- [ ] **Step 3 : Implémenter** — ajouter à la fin de `src/lib/validations.ts` :

```ts
// ─── Nous soutenir ───────────────────────────────────────────

export const DONATION_PRESETS = [10, 20, 50] as const;
export const DONATION_MIN = 1;
export const DONATION_MAX = 10000;
export const MEMBERSHIP_TIERS = [5, 10, 20] as const;

const supportBase = {
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
};

export const supportFormSchema = z.discriminatedUnion("kind", [
  z.object({
    ...supportBase,
    kind: z.literal("donation"),
    interval: z.enum(["once", "month"]),
    amount: z
      .number()
      .int("Montant entier requis")
      .min(DONATION_MIN, `Montant minimum : ${DONATION_MIN} €`)
      .max(DONATION_MAX, `Montant maximum : ${DONATION_MAX} €`),
  }),
  z.object({
    ...supportBase,
    kind: z.literal("membership"),
    interval: z.literal("month"),
    amount: z.union([z.literal(5), z.literal(10), z.literal(20)]),
  }),
]);

export type SupportFormData = z.infer<typeof supportFormSchema>;
```

- [ ] **Step 4 : Run** `npm test` → PASS.

- [ ] **Step 5 : Commit**

```bash
git add src/lib/validations.ts tests/validations.test.ts
git commit -m "feat: schéma de validation dons et cotisations

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3 : Builders de session Stripe (purs) + client

**Files:**
- Create: `src/lib/stripe.ts`
- Test: `tests/stripe.test.ts`

**Interfaces:**
- Consumes : `OrderData` (`src/lib/orders.ts`), `SupportFormData`, `BOOK_PRICE`, `SHIPPING_PRICE`.
- Produces :
  ```ts
  export function getStripe(): Stripe;                       // singleton, lit STRIPE_SECRET_KEY
  export function buildBookSessionParams(order: OrderData, baseUrl: string): Stripe.Checkout.SessionCreateParams;
  export function buildSupportSessionParams(input: SupportFormData & { supportId: string }, baseUrl: string): Stripe.Checkout.SessionCreateParams;
  export const BOOK_TITLE = "La Roqya à la lumière du Tawhid";
  ```
  Métadonnées : livre → `{ kind: "book", checkoutReference }` ; soutien → `{ kind: "donation"|"membership", supportId, interval, amount }` (toutes en string).

- [ ] **Step 1 : Test**

`tests/stripe.test.ts` :
```ts
import { describe, it, expect } from "vitest";
import { buildBookSessionParams, buildSupportSessionParams } from "@/lib/stripe";
import type { OrderData } from "@/lib/orders";

const order: OrderData = {
  checkoutReference: "ASHIFA-abc-123",
  firstName: "Ali", lastName: "Ben", email: "ali@example.com", phone: "",
  address: "1 rue X", city: "Strasbourg", postalCode: "67000",
  quantity: 2, bookPrice: 12, shippingPrice: 5, totalAmount: 29,
  createdAt: "2026-08-26T00:00:00.000Z", status: "pending",
};

describe("buildBookSessionParams", () => {
  const p = buildBookSessionParams(order, "https://centre-ashifa.fr");
  it("est en mode payment, EUR, fr", () => {
    expect(p.mode).toBe("payment");
    expect(p.locale).toBe("fr");
    expect(p.customer_email).toBe("ali@example.com");
    expect(p.client_reference_id).toBe("ASHIFA-abc-123");
  });
  it("facture livre x quantité + port", () => {
    const items = p.line_items!;
    expect(items).toHaveLength(2);
    expect(items[0].quantity).toBe(2);
    expect(items[0].price_data!.unit_amount).toBe(1200);
    expect(items[0].price_data!.currency).toBe("eur");
    expect(items[1].quantity).toBe(1);
    expect(items[1].price_data!.unit_amount).toBe(500);
  });
  it("porte les métadonnées et les URLs de retour", () => {
    expect(p.metadata).toEqual({ kind: "book", checkoutReference: "ASHIFA-abc-123" });
    expect(p.success_url).toBe("https://centre-ashifa.fr/livre/merci?session_id={CHECKOUT_SESSION_ID}");
    expect(p.cancel_url).toBe("https://centre-ashifa.fr/livre?annule=1");
  });
});

describe("buildSupportSessionParams", () => {
  const base = { firstName: "Ali", lastName: "Ben", email: "ali@example.com", supportId: "SUP-1" };
  it("don ponctuel → mode payment, montant en centimes", () => {
    const p = buildSupportSessionParams({ ...base, kind: "donation", interval: "once", amount: 37 }, "https://x.fr");
    expect(p.mode).toBe("payment");
    expect(p.line_items![0].price_data!.unit_amount).toBe(3700);
    expect(p.line_items![0].price_data!.recurring).toBeUndefined();
    expect(p.metadata).toEqual({ kind: "donation", supportId: "SUP-1", interval: "once", amount: "37" });
    expect(p.success_url).toBe("https://x.fr/soutenir/merci?session_id={CHECKOUT_SESSION_ID}");
    expect(p.cancel_url).toBe("https://x.fr/soutenir");
  });
  it("don mensuel → mode subscription avec recurring month", () => {
    const p = buildSupportSessionParams({ ...base, kind: "donation", interval: "month", amount: 10 }, "https://x.fr");
    expect(p.mode).toBe("subscription");
    expect(p.line_items![0].price_data!.recurring).toEqual({ interval: "month" });
  });
  it("adhésion → subscription, libellé membre bienfaiteur", () => {
    const p = buildSupportSessionParams({ ...base, kind: "membership", interval: "month", amount: 20 }, "https://x.fr");
    expect(p.mode).toBe("subscription");
    expect(p.line_items![0].price_data!.unit_amount).toBe(2000);
    expect(p.line_items![0].price_data!.product_data!.name).toContain("Cotisation");
    expect(p.metadata!.kind).toBe("membership");
  });
});
```

- [ ] **Step 2 : Run** `npm test` → FAIL (module introuvable).

- [ ] **Step 3 : Implémenter `src/lib/stripe.ts`**

```ts
import Stripe from "stripe";
import type { OrderData } from "./orders";
import type { SupportFormData } from "./validations";

export const BOOK_TITLE = "La Roqya à la lumière du Tawhid";

let stripeSingleton: Stripe | null = null;

/** Client Stripe (serveur uniquement). */
export function getStripe(): Stripe {
  if (!stripeSingleton) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
    stripeSingleton = new Stripe(key);
  }
  return stripeSingleton;
}

function toCents(euros: number): number {
  return Math.round(euros * 100);
}

/** Paramètres de session Checkout pour l'achat du livre. */
export function buildBookSessionParams(
  order: OrderData,
  baseUrl: string
): Stripe.Checkout.SessionCreateParams {
  return {
    mode: "payment",
    locale: "fr",
    customer_email: order.email,
    client_reference_id: order.checkoutReference,
    line_items: [
      {
        quantity: order.quantity,
        price_data: {
          currency: "eur",
          unit_amount: toCents(order.bookPrice),
          product_data: { name: `Livre « ${BOOK_TITLE} »` },
        },
      },
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: toCents(order.shippingPrice),
          product_data: { name: "Frais de livraison (France)" },
        },
      },
    ],
    metadata: { kind: "book", checkoutReference: order.checkoutReference },
    success_url: `${baseUrl}/livre/merci?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/livre?annule=1`,
  };
}

/** Paramètres de session Checkout pour un don ou une cotisation. */
export function buildSupportSessionParams(
  input: SupportFormData & { supportId: string },
  baseUrl: string
): Stripe.Checkout.SessionCreateParams {
  const recurring = input.interval === "month";
  const name =
    input.kind === "membership"
      ? "Cotisation mensuelle — membre bienfaiteur"
      : recurring
        ? "Don mensuel à l'association Ashifa"
        : "Don à l'association Ashifa";

  return {
    mode: recurring ? "subscription" : "payment",
    locale: "fr",
    customer_email: input.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: toCents(input.amount),
          product_data: { name },
          ...(recurring ? { recurring: { interval: "month" as const } } : {}),
        },
      },
    ],
    metadata: {
      kind: input.kind,
      supportId: input.supportId,
      interval: input.interval,
      amount: String(input.amount),
    },
    success_url: `${baseUrl}/soutenir/merci?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/soutenir`,
  };
}
```

- [ ] **Step 4 : Run** `npm test` → PASS.

- [ ] **Step 5 : Commit**

```bash
git add src/lib/stripe.ts tests/stripe.test.ts
git commit -m "feat: builders de session Stripe Checkout

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 4 : Stockage des soutiens + champ Stripe sur les commandes

**Files:**
- Create: `src/lib/support.ts`
- Modify: `src/lib/orders.ts`
- Test: `tests/support.test.ts`

**Interfaces:**
- Produces (`support.ts`) :
  ```ts
  export interface SupportEntry {
    id: string; kind: "donation" | "membership"; interval: "once" | "month";
    amount: number; firstName: string; lastName: string; email: string;
    status: "pending" | "paid"; createdAt: string;
    stripeSessionId?: string; stripeCustomerId?: string; stripeSubscriptionId?: string;
  }
  export function saveSupportEntry(e: SupportEntry): void;
  export function getSupportEntry(id: string): SupportEntry | null;
  export function markSupportPaid(id: string, ids: { stripeCustomerId?: string; stripeSubscriptionId?: string }): void;
  export function findLatestCustomerIdByEmail(email: string): string | null;
  export function generateSupportId(): string;   // "SUP-<ts36>-<rand>"
  ```
- Produces (`orders.ts`) : `OrderData.stripeSessionId?: string`, `attachStripeSession(ref, sessionId)`. La signature de `updateOrderStatus` reste `(ref, status, paypalOrderId?)`.
- Les tests pointent `process.cwd()` vers un dossier temporaire : les modules lisent `join(process.cwd(), "data")` au chargement, donc utiliser `vi.spyOn(process, "cwd")` **avant** l'import dynamique.

- [ ] **Step 1 : Test**

`tests/support.test.ts` :
```ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

async function loadFresh() {
  vi.resetModules();
  const dir = mkdtempSync(join(tmpdir(), "ashifa-"));
  vi.spyOn(process, "cwd").mockReturnValue(dir);
  return await import("@/lib/support");
}

describe("support storage", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("sauvegarde puis relit une entrée", async () => {
    const s = await loadFresh();
    s.saveSupportEntry({
      id: "SUP-1", kind: "donation", interval: "once", amount: 20,
      firstName: "Ali", lastName: "Ben", email: "ali@example.com",
      status: "pending", createdAt: "2026-08-26T00:00:00.000Z",
    });
    expect(s.getSupportEntry("SUP-1")?.amount).toBe(20);
    expect(s.getSupportEntry("nope")).toBeNull();
  });

  it("marque payé avec les identifiants Stripe", async () => {
    const s = await loadFresh();
    s.saveSupportEntry({
      id: "SUP-2", kind: "membership", interval: "month", amount: 10,
      firstName: "Ali", lastName: "Ben", email: "ali@example.com",
      status: "pending", createdAt: "2026-08-26T00:00:00.000Z",
    });
    s.markSupportPaid("SUP-2", { stripeCustomerId: "cus_1", stripeSubscriptionId: "sub_1" });
    const e = s.getSupportEntry("SUP-2")!;
    expect(e.status).toBe("paid");
    expect(e.stripeCustomerId).toBe("cus_1");
    expect(e.stripeSubscriptionId).toBe("sub_1");
  });

  it("retrouve le dernier customer payé par email (insensible à la casse)", async () => {
    const s = await loadFresh();
    const base = { kind: "donation" as const, interval: "month" as const, amount: 10, firstName: "A", lastName: "B", status: "paid" as const };
    s.saveSupportEntry({ ...base, id: "SUP-a", email: "ali@example.com", createdAt: "2026-01-01T00:00:00.000Z", stripeCustomerId: "cus_old" });
    s.saveSupportEntry({ ...base, id: "SUP-b", email: "ALI@example.com", createdAt: "2026-02-01T00:00:00.000Z", stripeCustomerId: "cus_new" });
    s.saveSupportEntry({ ...base, id: "SUP-c", email: "ali@example.com", createdAt: "2026-03-01T00:00:00.000Z", status: "pending" });
    expect(s.findLatestCustomerIdByEmail("Ali@Example.com")).toBe("cus_new");
    expect(s.findLatestCustomerIdByEmail("x@y.z")).toBeNull();
  });

  it("génère un id préfixé SUP-", async () => {
    const s = await loadFresh();
    expect(s.generateSupportId()).toMatch(/^SUP-[a-z0-9]+-[a-z0-9]{6}$/);
  });
});
```

- [ ] **Step 2 : Run** `npm test` → FAIL.

- [ ] **Step 3 : Implémenter `src/lib/support.ts`**

```ts
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

export interface SupportEntry {
  id: string;
  kind: "donation" | "membership";
  interval: "once" | "month";
  /** Montant en euros */
  amount: number;
  firstName: string;
  lastName: string;
  email: string;
  status: "pending" | "paid";
  createdAt: string;
  stripeSessionId?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

const DATA_DIR = join(process.cwd(), "data");
const SUPPORT_FILE = join(DATA_DIR, "support.json");

function ensureDataDir(): void {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

function readAll(): Record<string, SupportEntry> {
  ensureDataDir();
  if (!existsSync(SUPPORT_FILE)) return {};
  return JSON.parse(readFileSync(SUPPORT_FILE, "utf-8"));
}

function writeAll(entries: Record<string, SupportEntry>): void {
  ensureDataDir();
  writeFileSync(SUPPORT_FILE, JSON.stringify(entries, null, 2), "utf-8");
}

export function saveSupportEntry(entry: SupportEntry): void {
  const all = readAll();
  all[entry.id] = entry;
  writeAll(all);
}

export function getSupportEntry(id: string): SupportEntry | null {
  return readAll()[id] ?? null;
}

export function markSupportPaid(
  id: string,
  ids: { stripeCustomerId?: string; stripeSubscriptionId?: string }
): void {
  const all = readAll();
  const entry = all[id];
  if (!entry) return;
  entry.status = "paid";
  if (ids.stripeCustomerId) entry.stripeCustomerId = ids.stripeCustomerId;
  if (ids.stripeSubscriptionId) entry.stripeSubscriptionId = ids.stripeSubscriptionId;
  writeAll(all);
}

/** Dernier customer Stripe connu pour cet email (entrées payées uniquement). */
export function findLatestCustomerIdByEmail(email: string): string | null {
  const wanted = email.trim().toLowerCase();
  const match = Object.values(readAll())
    .filter((e) => e.status === "paid" && e.stripeCustomerId && e.email.toLowerCase() === wanted)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  return match?.stripeCustomerId ?? null;
}

export function generateSupportId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `SUP-${timestamp}-${random}`;
}
```

- [ ] **Step 4 : Modifier `src/lib/orders.ts`**

Dans `OrderData`, après `paypalOrderId?: string;` ajouter :
```ts
  stripeSessionId?: string;
```
Après `updateOrderStatus`, ajouter :
```ts
export function attachStripeSession(checkoutReference: string, sessionId: string): void {
  const orders = readOrders();
  if (orders[checkoutReference]) {
    orders[checkoutReference].stripeSessionId = sessionId;
    writeOrders(orders);
  }
}
```

- [ ] **Step 5 : Run** `npm test` → PASS.

- [ ] **Step 6 : Commit**

```bash
git add src/lib/support.ts src/lib/orders.ts tests/support.test.ts
git commit -m "feat: stockage des dons et cotisations, session Stripe sur les commandes

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5 : Emails — Stripe + dons/cotisations

**Files:**
- Modify: `src/lib/email.ts`

**Interfaces:**
- Produces : `export async function sendSupportEmails(entry: SupportEntry): Promise<void>` (mail au donateur/adhérent + mail interne à `GMAIL_USER`).
- Aucun test unitaire (nodemailer) ; vérifié par `npx tsc --noEmit`.

- [ ] **Step 1 : Remplacer « PayPal » par « Stripe »**

Dans `src/lib/email.ts`, les deux occurrences `Paiement confirmé via PayPal` → `Paiement confirmé via Stripe`.

- [ ] **Step 2 : Ajouter les emails de soutien** — en haut, ajouter `import type { SupportEntry } from "./support";` puis à la fin du fichier :

```ts
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
    ${isMembership
      ? `Votre cotisation de <strong>${entry.amount} €/mois</strong> à l'association ASHIFA BIEN-ÊTRE ET ÉQUILIBRE est confirmée. Vous êtes désormais membre bienfaiteur de l'association.`
      : recurring
        ? `Votre don mensuel de <strong>${entry.amount} €</strong> à l'association ASHIFA BIEN-ÊTRE ET ÉQUILIBRE est confirmé.`
        : `Votre don de <strong>${entry.amount} €</strong> à l'association ASHIFA BIEN-ÊTRE ET ÉQUILIBRE est confirmé.`}
  </p>
  <p>
    Grâce à vous, nous pouvons continuer à proposer des séances entièrement gratuites à celles et ceux qui en ont besoin.
  </p>
  ${recurring ? `<p style="font-size: 14px; color: #6b7280;">Vous pouvez modifier ou arrêter ce prélèvement à tout moment depuis la page <a href="https://centre-ashifa.fr/soutenir">Nous soutenir</a> (« Gérer mon soutien »).</p>` : ""}
  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
  <p style="font-size: 12px; color: #9ca3af; text-align: center;">
    Centre Ashifa — ${date}<br>
    8 avenue de l'Énergie, 67800 Bischheim
  </p>
</body>
</html>`;
}
```

- [ ] **Step 3 : Vérifier** — Run: `npx tsc --noEmit` → aucune erreur dans `email.ts` (les erreurs liées à `paypal.ts` encore présent sont attendues jusqu'à la Task 8 ; ne corriger que celles de `email.ts`).

- [ ] **Step 4 : Commit**

```bash
git add src/lib/email.ts
git commit -m "feat: emails de confirmation pour dons et cotisations

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6 : Handler du webhook (pur, testé)

**Files:**
- Create: `src/lib/checkout-events.ts`
- Test: `tests/checkout-events.test.ts`

**Interfaces:**
- Produces :
  ```ts
  export interface CompletedSession {
    id: string;
    metadata: Record<string, string> | null;
    customer: string | null;        // cus_…
    subscription: string | null;    // sub_…
  }
  export interface CheckoutDeps {
    getOrder: (ref: string) => OrderData | null;
    updateOrderStatus: (ref: string, status: OrderData["status"]) => void;
    sendOrderEmails: (order: OrderData) => Promise<void>;
    getSupportEntry: (id: string) => SupportEntry | null;
    markSupportPaid: (id: string, ids: { stripeCustomerId?: string; stripeSubscriptionId?: string }) => void;
    sendSupportEmails: (entry: SupportEntry) => Promise<void>;
  }
  export type CheckoutResult = "book-paid" | "support-paid" | "already-paid" | "not-found" | "ignored";
  export async function handleCheckoutCompleted(session: CompletedSession, deps: CheckoutDeps): Promise<CheckoutResult>;
  ```
- Les erreurs d'email sont attrapées et loguées ; elles ne font pas échouer le handler.

- [ ] **Step 1 : Test**

`tests/checkout-events.test.ts` :
```ts
import { describe, it, expect, vi } from "vitest";
import { handleCheckoutCompleted, type CheckoutDeps } from "@/lib/checkout-events";
import type { OrderData } from "@/lib/orders";
import type { SupportEntry } from "@/lib/support";

const order: OrderData = {
  checkoutReference: "ASHIFA-1", firstName: "A", lastName: "B", email: "a@b.c", phone: "",
  address: "x", city: "y", postalCode: "67000", quantity: 1, bookPrice: 12, shippingPrice: 5,
  totalAmount: 17, createdAt: "", status: "pending",
};
const support: SupportEntry = {
  id: "SUP-1", kind: "membership", interval: "month", amount: 10,
  firstName: "A", lastName: "B", email: "a@b.c", status: "pending", createdAt: "",
};

function deps(over: Partial<CheckoutDeps> = {}): CheckoutDeps {
  return {
    getOrder: vi.fn(() => order),
    updateOrderStatus: vi.fn(),
    sendOrderEmails: vi.fn(async () => {}),
    getSupportEntry: vi.fn(() => support),
    markSupportPaid: vi.fn(),
    sendSupportEmails: vi.fn(async () => {}),
    ...over,
  };
}

describe("handleCheckoutCompleted", () => {
  it("livre : passe en paid et envoie les emails", async () => {
    const d = deps();
    const r = await handleCheckoutCompleted(
      { id: "cs_1", metadata: { kind: "book", checkoutReference: "ASHIFA-1" }, customer: null, subscription: null }, d);
    expect(r).toBe("book-paid");
    expect(d.updateOrderStatus).toHaveBeenCalledWith("ASHIFA-1", "paid");
    expect(d.sendOrderEmails).toHaveBeenCalledTimes(1);
  });

  it("livre : idempotent si déjà payé", async () => {
    const d = deps({ getOrder: vi.fn(() => ({ ...order, status: "paid" })) });
    const r = await handleCheckoutCompleted(
      { id: "cs_1", metadata: { kind: "book", checkoutReference: "ASHIFA-1" }, customer: null, subscription: null }, d);
    expect(r).toBe("already-paid");
    expect(d.updateOrderStatus).not.toHaveBeenCalled();
    expect(d.sendOrderEmails).not.toHaveBeenCalled();
  });

  it("livre : commande introuvable", async () => {
    const d = deps({ getOrder: vi.fn(() => null) });
    const r = await handleCheckoutCompleted(
      { id: "cs_1", metadata: { kind: "book", checkoutReference: "nope" }, customer: null, subscription: null }, d);
    expect(r).toBe("not-found");
  });

  it("adhésion : marque payé avec customer/subscription et envoie les emails", async () => {
    const d = deps();
    const r = await handleCheckoutCompleted(
      { id: "cs_2", metadata: { kind: "membership", supportId: "SUP-1" }, customer: "cus_1", subscription: "sub_1" }, d);
    expect(r).toBe("support-paid");
    expect(d.markSupportPaid).toHaveBeenCalledWith("SUP-1", { stripeCustomerId: "cus_1", stripeSubscriptionId: "sub_1" });
    expect(d.sendSupportEmails).toHaveBeenCalledWith(expect.objectContaining({ id: "SUP-1", status: "paid", stripeCustomerId: "cus_1" }));
  });

  it("don : idempotent si déjà payé", async () => {
    const d = deps({ getSupportEntry: vi.fn(() => ({ ...support, status: "paid" })) });
    const r = await handleCheckoutCompleted(
      { id: "cs_2", metadata: { kind: "donation", supportId: "SUP-1" }, customer: "cus_1", subscription: null }, d);
    expect(r).toBe("already-paid");
    expect(d.markSupportPaid).not.toHaveBeenCalled();
  });

  it("kind inconnu ou métadonnées absentes → ignored", async () => {
    const d = deps();
    expect(await handleCheckoutCompleted({ id: "cs", metadata: null, customer: null, subscription: null }, d)).toBe("ignored");
    expect(await handleCheckoutCompleted({ id: "cs", metadata: { kind: "autre" }, customer: null, subscription: null }, d)).toBe("ignored");
  });

  it("une erreur d'email ne fait pas échouer le traitement", async () => {
    const d = deps({ sendOrderEmails: vi.fn(async () => { throw new Error("smtp"); }) });
    const r = await handleCheckoutCompleted(
      { id: "cs_1", metadata: { kind: "book", checkoutReference: "ASHIFA-1" }, customer: null, subscription: null }, d);
    expect(r).toBe("book-paid");
    expect(d.updateOrderStatus).toHaveBeenCalledWith("ASHIFA-1", "paid");
  });
});
```

- [ ] **Step 2 : Run** `npm test` → FAIL.

- [ ] **Step 3 : Implémenter `src/lib/checkout-events.ts`**

```ts
import type { OrderData } from "./orders";
import type { SupportEntry } from "./support";

export interface CompletedSession {
  id: string;
  metadata: Record<string, string> | null;
  customer: string | null;
  subscription: string | null;
}

export interface CheckoutDeps {
  getOrder: (ref: string) => OrderData | null;
  updateOrderStatus: (ref: string, status: OrderData["status"]) => void;
  sendOrderEmails: (order: OrderData) => Promise<void>;
  getSupportEntry: (id: string) => SupportEntry | null;
  markSupportPaid: (
    id: string,
    ids: { stripeCustomerId?: string; stripeSubscriptionId?: string }
  ) => void;
  sendSupportEmails: (entry: SupportEntry) => Promise<void>;
}

export type CheckoutResult =
  | "book-paid"
  | "support-paid"
  | "already-paid"
  | "not-found"
  | "ignored";

/**
 * Traite un événement `checkout.session.completed`.
 * Idempotent : une commande/un soutien déjà payé n'est pas retraité.
 */
export async function handleCheckoutCompleted(
  session: CompletedSession,
  deps: CheckoutDeps
): Promise<CheckoutResult> {
  const kind = session.metadata?.kind;

  if (kind === "book") {
    const ref = session.metadata?.checkoutReference;
    const order = ref ? deps.getOrder(ref) : null;
    if (!order || !ref) return "not-found";
    if (order.status === "paid") return "already-paid";

    deps.updateOrderStatus(ref, "paid");
    try {
      await deps.sendOrderEmails({ ...order, status: "paid", stripeSessionId: session.id });
    } catch (err) {
      console.error(`Webhook: échec envoi emails commande ${ref}:`, err);
    }
    return "book-paid";
  }

  if (kind === "donation" || kind === "membership") {
    const id = session.metadata?.supportId;
    const entry = id ? deps.getSupportEntry(id) : null;
    if (!entry || !id) return "not-found";
    if (entry.status === "paid") return "already-paid";

    const ids = {
      stripeCustomerId: session.customer ?? undefined,
      stripeSubscriptionId: session.subscription ?? undefined,
    };
    deps.markSupportPaid(id, ids);
    try {
      await deps.sendSupportEmails({ ...entry, ...ids, status: "paid", stripeSessionId: session.id });
    } catch (err) {
      console.error(`Webhook: échec envoi emails soutien ${id}:`, err);
    }
    return "support-paid";
  }

  return "ignored";
}
```

- [ ] **Step 4 : Run** `npm test` → PASS.

- [ ] **Step 5 : Commit**

```bash
git add src/lib/checkout-events.ts tests/checkout-events.test.ts
git commit -m "feat: traitement idempotent des sessions Checkout complétées

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 7 : Routes API Stripe (create livre, webhook, soutenir/create, soutenir/portail)

**Files:**
- Modify: `src/app/api/checkout/create/route.ts`
- Rewrite: `src/app/api/checkout/webhook/route.ts`
- Create: `src/app/api/soutenir/create/route.ts`
- Create: `src/app/api/soutenir/portail/route.ts`

**Interfaces:**
- Consumes : `getStripe`, `buildBookSessionParams`, `buildSupportSessionParams`, `handleCheckoutCompleted`, `support.ts`, `orders.ts`, `email.ts`.
- Produces :
  - `POST /api/checkout/create` body = `orderFormSchema` → `{ url: string }`
  - `POST /api/checkout/webhook` (raw body, header `stripe-signature`) → `{ received: true }`
  - `POST /api/soutenir/create` body = `supportFormSchema` → `{ url: string }`
  - `POST /api/soutenir/portail` body = `{ email: string }` → `{ url: string }` ou `{ url: null }` (réponse 200 dans les deux cas — pas de fuite d'info)

- [ ] **Step 1 : Réécrire `src/app/api/checkout/create/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";
import {
  orderFormSchema,
  BOOK_PRICE,
  SHIPPING_PRICE,
  calculateTotal,
} from "@/lib/validations";
import { getStripe, buildBookSessionParams } from "@/lib/stripe";
import {
  saveOrder,
  generateCheckoutReference,
  attachStripeSession,
  type OrderData,
} from "@/lib/orders";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = orderFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, phone, address, city, postalCode, quantity } = parsed.data;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const order: OrderData = {
      checkoutReference: generateCheckoutReference(),
      firstName,
      lastName,
      email,
      phone: phone || "",
      address,
      city,
      postalCode,
      quantity,
      bookPrice: BOOK_PRICE,
      shippingPrice: SHIPPING_PRICE,
      totalAmount: calculateTotal(quantity),
      createdAt: new Date().toISOString(),
      status: "pending",
    };
    saveOrder(order);

    const session = await getStripe().checkout.sessions.create(
      buildBookSessionParams(order, baseUrl)
    );
    attachStripeSession(order.checkoutReference, session.id);

    if (!session.url) throw new Error("Stripe session without url");
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout creation error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la commande" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2 : Réécrire `src/app/api/checkout/webhook/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { handleCheckoutCompleted } from "@/lib/checkout-events";
import { getOrder, updateOrderStatus } from "@/lib/orders";
import { getSupportEntry, markSupportPaid } from "@/lib/support";
import { sendAllOrderEmails, sendSupportEmails } from "@/lib/email";

/**
 * Webhook Stripe — événement `checkout.session.completed`.
 * Le corps brut est nécessaire pour vérifier la signature.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get("stripe-signature");
  if (!secret || !signature) {
    return NextResponse.json({ error: "Webhook non configuré" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const rawBody = await req.text();
    event = getStripe().webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const customer = typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;
  const subscription =
    typeof session.subscription === "string" ? session.subscription : session.subscription?.id ?? null;

  try {
    const result = await handleCheckoutCompleted(
      { id: session.id, metadata: session.metadata, customer, subscription },
      {
        getOrder,
        updateOrderStatus,
        sendOrderEmails: sendAllOrderEmails,
        getSupportEntry,
        markSupportPaid,
        sendSupportEmails,
      }
    );
    console.log(`Stripe webhook ${session.id}: ${result}`);
    return NextResponse.json({ received: true, result });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook processing error" }, { status: 500 });
  }
}
```

- [ ] **Step 3 : Créer `src/app/api/soutenir/create/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";
import { supportFormSchema } from "@/lib/validations";
import { getStripe, buildSupportSessionParams } from "@/lib/stripe";
import { saveSupportEntry, generateSupportId } from "@/lib/support";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = supportFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const supportId = generateSupportId();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const session = await getStripe().checkout.sessions.create(
      buildSupportSessionParams({ ...data, supportId }, baseUrl)
    );

    saveSupportEntry({
      id: supportId,
      kind: data.kind,
      interval: data.interval,
      amount: data.amount,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      status: "pending",
      createdAt: new Date().toISOString(),
      stripeSessionId: session.id,
    });

    if (!session.url) throw new Error("Stripe session without url");
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Support checkout error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du paiement" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 4 : Créer `src/app/api/soutenir/portail/route.ts`**

```ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getStripe } from "@/lib/stripe";
import { findLatestCustomerIdByEmail } from "@/lib/support";

const schema = z.object({ email: z.string().email() });

/**
 * Ouvre le portail client Stripe pour gérer un don mensuel / une cotisation.
 * Répond toujours 200 : `{ url: null }` si aucun client connu (pas de fuite d'info).
 */
export async function POST(req: NextRequest) {
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    const customerId = findLatestCustomerIdByEmail(parsed.data.email);
    if (!customerId) return NextResponse.json({ url: null });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const portal = await getStripe().billingPortal.sessions.create({
      customer: customerId,
      return_url: `${baseUrl}/soutenir`,
    });
    return NextResponse.json({ url: portal.url });
  } catch (error) {
    console.error("Portal session error:", error);
    return NextResponse.json({ error: "Erreur lors de l'ouverture du portail" }, { status: 500 });
  }
}
```

- [ ] **Step 5 : Vérifier** — Run: `npx tsc --noEmit` → seules les erreurs concernant `paypal.ts` / `capture/route.ts` / `PayPalCheckout.tsx` peuvent subsister (supprimés en Task 8).

- [ ] **Step 6 : Commit**

```bash
git add src/app/api/checkout/create/route.ts src/app/api/checkout/webhook/route.ts src/app/api/soutenir
git commit -m "feat: routes API Stripe (livre, webhook, dons, portail)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 8 : Front livre — OrderForm redirige vers Stripe, page merci, suppression PayPal

**Files:**
- Modify: `src/components/book/OrderForm.tsx`
- Delete: `src/components/book/PayPalCheckout.tsx`, `src/lib/paypal.ts`, `src/app/api/checkout/capture/route.ts`, `src/app/livre/confirmation/page.tsx`
- Create: `src/app/livre/merci/page.tsx`
- Modify: `src/app/livre/page.tsx` (bandeau si `?annule=1`)

**Interfaces:**
- Consumes : `POST /api/checkout/create` → `{ url }`.
- `/livre/merci?session_id=cs_…` : côté serveur, `getStripe().checkout.sessions.retrieve(id)` → `client_reference_id` → `getOrder(ref)`.

- [ ] **Step 1 : Supprimer les fichiers PayPal**

```bash
git rm src/components/book/PayPalCheckout.tsx src/lib/paypal.ts src/app/api/checkout/capture/route.ts src/app/livre/confirmation/page.tsx
```

- [ ] **Step 2 : Réécrire `src/components/book/OrderForm.tsx`**

Garder tout le formulaire (champs, quantité, récap prix) et remplacer l'état à deux étapes par un envoi direct :

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Minus, Plus, Lock, AlertCircle, Loader2 } from "lucide-react";
import { BOOK_PRICE, SHIPPING_PRICE, calculateTotal } from "@/lib/validations";

export function OrderForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", postalCode: "",
  });

  const total = calculateTotal(quantity);
  const update = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, quantity }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) {
        setError(data.error || "Une erreur est survenue. Veuillez réessayer.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg border border-border">
      <h3 className="text-lg font-semibold mb-4">Commander le livre</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* … reprendre À L'IDENTIQUE les blocs Name / Email & Phone / Address / City & Postal code / Quantity / Price breakdown du fichier actuel … */}

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <Button type="submit" className="w-full h-12 text-base" size="lg" disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ShoppingBag className="mr-2 h-4 w-4" />
          )}
          {loading ? "Redirection vers le paiement…" : `Procéder au paiement — ${total.toFixed(2)} €`}
        </Button>

        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <Lock className="h-3 w-3" />
          <span>Paiement sécurisé via Stripe (CB, Apple Pay, Google Pay, PayPal)</span>
          <span className="mx-1">·</span>
          <span>Livraison en France</span>
        </div>
      </form>
    </div>
  );
}
```
Le commentaire « reprendre à l'identique » désigne les JSX déjà présents dans le fichier (lignes `{/* Name */}` à `{/* Price breakdown */}`) : les copier tels quels, sans les modifier.

- [ ] **Step 3 : Créer `src/app/livre/merci/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, ArrowRight, Home } from "lucide-react";
import { getStripe } from "@/lib/stripe";
import { getOrder } from "@/lib/orders";

export const metadata: Metadata = {
  title: "Commande confirmée",
  description: "Votre commande a été enregistrée avec succès.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

async function loadOrder(sessionId?: string) {
  if (!sessionId) return { ref: null, paid: false };
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    const ref = session.client_reference_id;
    const order = ref ? getOrder(ref) : null;
    const paid = session.payment_status === "paid" || order?.status === "paid";
    return { ref, paid };
  } catch (err) {
    console.error("Merci page: session retrieve failed", err);
    return { ref: null, paid: false };
  }
}

export default async function MerciPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const { ref, paid } = await loadOrder(session_id);

  return (
    <section className="min-h-screen flex items-center justify-center py-32">
      <div className="mx-auto max-w-lg px-4 text-center">
        <div className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${paid ? "bg-green-100" : "bg-amber-100"}`}>
          {paid ? <CheckCircle className="h-10 w-10 text-green-600" /> : <Clock className="h-10 w-10 text-amber-600" />}
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          {paid ? "Merci pour votre commande !" : "Paiement en cours de confirmation"}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {paid
            ? "Votre commande a été enregistrée avec succès. Le livre vous sera expédié dans les meilleurs délais."
            : "Votre paiement est en cours de validation. Vous recevrez un email de confirmation dès qu'il sera confirmé."}
        </p>
        {ref && (
          <p className="mt-2 text-sm text-muted-foreground">
            Référence : <span className="font-mono font-medium">{ref}</span>
          </p>
        )}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild>
            <Link href="/"><Home className="mr-2 h-4 w-4" />Retour à l&apos;accueil</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/rendez-vous">Prendre rendez-vous<ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4 : Bandeau d'annulation sur `/livre`**

Dans `src/app/livre/page.tsx`, transformer la page en composant async recevant `searchParams` et afficher un bandeau au-dessus de `<OrderForm />` :
```tsx
export default async function LivrePage({
  searchParams,
}: {
  searchParams: Promise<{ annule?: string }>;
}) {
  const { annule } = await searchParams;
  // … JSX existant ; juste avant <OrderForm /> :
  //   {annule && (
  //     <p className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
  //       Paiement annulé — aucun montant n&apos;a été débité. Vous pouvez réessayer ci-dessous.
  //     </p>
  //   )}
```

- [ ] **Step 5 : Vérifier**

Run: `npx tsc --noEmit && npm run lint && npm test`
Expected: 0 erreur, tests PASS.

- [ ] **Step 6 : Commit**

```bash
git add -A src
git commit -m "feat: paiement du livre via Stripe Checkout, suppression de PayPal

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 9 : Page « Nous soutenir »

**Files:**
- Create: `src/components/support/SupportForm.tsx`
- Create: `src/components/support/PortalForm.tsx`
- Create: `src/app/soutenir/page.tsx`
- Create: `src/app/soutenir/merci/page.tsx`
- Modify: `src/config/navigation.ts`, `src/app/sitemap.ts`

**Interfaces:**
- Consumes : `POST /api/soutenir/create` → `{ url }`, `POST /api/soutenir/portail` → `{ url | null }`, constantes `DONATION_PRESETS`, `DONATION_MIN`, `DONATION_MAX`, `MEMBERSHIP_TIERS`.
- `SupportForm` props : `{ initialTab?: "don" | "adhesion" }`.

- [ ] **Step 1 : `src/components/support/SupportForm.tsx`**

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Users, Lock, AlertCircle, Loader2 } from "lucide-react";
import {
  DONATION_PRESETS,
  DONATION_MIN,
  DONATION_MAX,
  MEMBERSHIP_TIERS,
} from "@/lib/validations";

type Tab = "don" | "adhesion";
type Interval = "once" | "month";

const IDENTITY = { firstName: "", lastName: "", email: "" };

export function SupportForm({ initialTab = "don" }: { initialTab?: Tab }) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [interval, setInterval_] = useState<Interval>("once");
  const [donation, setDonation] = useState<number>(20);
  const [customDonation, setCustomDonation] = useState("");
  const [tier, setTier] = useState<number>(10);
  const [identity, setIdentity] = useState(IDENTITY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isCustom = customDonation !== "";
  const donationAmount = isCustom ? Number(customDonation) : donation;
  const amount = tab === "don" ? donationAmount : tier;
  const effectiveInterval: Interval = tab === "don" ? interval : "month";

  const update = (field: keyof typeof IDENTITY, value: string) =>
    setIdentity((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (tab === "don" && (!Number.isInteger(amount) || amount < DONATION_MIN || amount > DONATION_MAX)) {
      setError(`Le montant doit être un nombre entier entre ${DONATION_MIN} € et ${DONATION_MAX} €.`);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/soutenir/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...identity,
          kind: tab === "don" ? "donation" : "membership",
          interval: effectiveInterval,
          amount,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) {
        setError(data.error || "Une erreur est survenue. Veuillez réessayer.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
      setLoading(false);
    }
  };

  const tabClass = (active: boolean) =>
    `flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
      active ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:bg-accent"
    }`;
  const pillClass = (active: boolean) =>
    `rounded-lg border px-4 py-3 text-sm font-semibold transition-colors ${
      active ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-accent"
    }`;

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg border border-border">
      {/* Onglets */}
      <div className="mb-6 flex gap-2 rounded-xl bg-accent/50 p-1" role="tablist">
        <button type="button" role="tab" aria-selected={tab === "don"} className={tabClass(tab === "don")} onClick={() => setTab("don")}>
          <Heart className="h-4 w-4" /> Faire un don
        </button>
        <button type="button" role="tab" aria-selected={tab === "adhesion"} className={tabClass(tab === "adhesion")} onClick={() => setTab("adhesion")}>
          <Users className="h-4 w-4" /> Adhérer
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {tab === "don" ? (
          <>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" className={pillClass(interval === "once")} onClick={() => setInterval_("once")}>Don ponctuel</button>
              <button type="button" className={pillClass(interval === "month")} onClick={() => setInterval_("month")}>Don mensuel</button>
            </div>
            <div>
              <span className="text-sm font-medium mb-2 block">Montant</span>
              <div className="grid grid-cols-3 gap-2">
                {DONATION_PRESETS.map((v) => (
                  <button key={v} type="button" className={pillClass(!isCustom && donation === v)} onClick={() => { setDonation(v); setCustomDonation(""); }}>
                    {v} €
                  </button>
                ))}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Input
                  type="number" inputMode="numeric" min={DONATION_MIN} max={DONATION_MAX} step={1}
                  placeholder="Montant libre" value={customDonation}
                  onChange={(e) => setCustomDonation(e.target.value)}
                />
                <span className="text-sm text-muted-foreground">€{interval === "month" ? "/mois" : ""}</span>
              </div>
            </div>
          </>
        ) : (
          <div>
            <span className="text-sm font-medium mb-2 block">Cotisation mensuelle</span>
            <div className="grid grid-cols-3 gap-2">
              {MEMBERSHIP_TIERS.map((v) => (
                <button key={v} type="button" className={pillClass(tier === v)} onClick={() => setTier(v)}>
                  {v} €/mois
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              L&apos;adhésion en ligne vous confère le statut de membre bienfaiteur de l&apos;association (statuts, art. 5).
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="s-firstName" className="text-sm font-medium mb-1.5 block">Prénom *</label>
            <Input id="s-firstName" value={identity.firstName} onChange={(e) => update("firstName", e.target.value)} required />
          </div>
          <div>
            <label htmlFor="s-lastName" className="text-sm font-medium mb-1.5 block">Nom *</label>
            <Input id="s-lastName" value={identity.lastName} onChange={(e) => update("lastName", e.target.value)} required />
          </div>
        </div>
        <div>
          <label htmlFor="s-email" className="text-sm font-medium mb-1.5 block">Email *</label>
          <Input id="s-email" type="email" value={identity.email} onChange={(e) => update("email", e.target.value)} required />
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />{error}
          </div>
        )}

        <Button type="submit" className="w-full h-12 text-base" size="lg" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : tab === "don" ? <Heart className="mr-2 h-4 w-4" /> : <Users className="mr-2 h-4 w-4" />}
          {loading
            ? "Redirection vers le paiement…"
            : tab === "don"
              ? `Donner ${Number.isFinite(amount) && amount > 0 ? amount : "…"} €${interval === "month" ? " / mois" : ""}`
              : `Adhérer — ${tier} € / mois`}
        </Button>

        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <Lock className="h-3 w-3" />
          <span>Paiement sécurisé via Stripe — résiliable à tout moment</span>
        </div>
      </form>
    </div>
  );
}
```

- [ ] **Step 2 : `src/components/support/PortalForm.tsx`**

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Settings } from "lucide-react";

export function PortalForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/soutenir/portail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setMessage(
        "Si un soutien mensuel est associé à cette adresse, vous pouvez aussi le gérer depuis le lien présent dans vos reçus Stripe. Sinon, contactez-nous."
      );
    } catch {
      setMessage("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-accent/30 p-6">
      <h3 className="flex items-center gap-2 text-base font-semibold">
        <Settings className="h-4 w-4" /> Gérer mon soutien mensuel
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Modifier votre moyen de paiement ou arrêter votre don mensuel / cotisation.
      </p>
      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <Input type="email" placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Button type="submit" variant="outline" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Accéder"}
        </Button>
      </div>
      {message && <p className="mt-3 text-sm text-muted-foreground">{message}</p>}
    </form>
  );
}
```

- [ ] **Step 3 : `src/app/soutenir/page.tsx`**

```tsx
import type { Metadata } from "next";
import { HeartHandshake, Gift, Users, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { SupportForm } from "@/components/support/SupportForm";
import { PortalForm } from "@/components/support/PortalForm";

export const metadata: Metadata = {
  title: "Nous soutenir — Dons et adhésion",
  description:
    "Soutenez l'association ASHIFA BIEN-ÊTRE ET ÉQUILIBRE par un don ponctuel, un don mensuel ou une cotisation de membre bienfaiteur. Nos séances restent gratuites grâce à vous.",
};

const reasons = [
  { icon: Gift, title: "Des séances gratuites", text: "Vos dons financent l'accueil gratuit de toutes les personnes accompagnées." },
  { icon: Users, title: "Une association", text: "ASHIFA BIEN-ÊTRE ET ÉQUILIBRE est une association à but non lucratif de droit local." },
  { icon: ShieldCheck, title: "Paiement sécurisé", text: "Paiement par Stripe, résiliable à tout moment pour les soutiens mensuels." },
];

export default async function SoutenirPage({
  searchParams,
}: {
  searchParams: Promise<{ onglet?: string }>;
}) {
  const { onglet } = await searchParams;
  const initialTab = onglet === "adhesion" ? "adhesion" : "don";

  return (
    <>
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 bg-gradient-to-b from-accent to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <AnimatedSection>
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <HeartHandshake className="h-8 w-8 text-primary" />
              </div>
              <Badge variant="outline" className="mb-4">Nous soutenir</Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Aidez-nous à garder nos séances gratuites
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Le Centre Ashifa est porté par une association. Chaque don et chaque adhésion
                permet d&apos;accueillir gratuitement celles et ceux qui en ont besoin.
              </p>
              <ul className="mt-8 space-y-4">
                {reasons.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex gap-3">
                    <Icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">{title}</p>
                      <p className="text-sm text-muted-foreground">{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <SupportForm initialTab={initialTab} />
            </AnimatedSection>
          </div>
        </div>
      </section>
      <section className="pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <PortalForm />
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 4 : `src/app/soutenir/merci/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home } from "lucide-react";
import { getStripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Merci pour votre soutien",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function SoutenirMerciPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  let kind: string | undefined;
  let interval: string | undefined;
  let amount: string | undefined;
  if (session_id) {
    try {
      const s = await getStripe().checkout.sessions.retrieve(session_id);
      kind = s.metadata?.kind;
      interval = s.metadata?.interval;
      amount = s.metadata?.amount;
    } catch (err) {
      console.error("Soutenir merci: retrieve failed", err);
    }
  }
  const isMembership = kind === "membership";

  return (
    <section className="min-h-screen flex items-center justify-center py-32">
      <div className="mx-auto max-w-lg px-4 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isMembership ? "Bienvenue parmi nos membres bienfaiteurs !" : "Merci pour votre don !"}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {amount ? `${amount} €${interval === "month" ? " par mois" : ""} — ` : ""}
          un email de confirmation vous a été envoyé. Grâce à vous, nos séances restent gratuites.
        </p>
        <div className="mt-10">
          <Button asChild>
            <Link href="/"><Home className="mr-2 h-4 w-4" />Retour à l&apos;accueil</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5 : Navigation et sitemap**

`src/config/navigation.ts` : dans `mainNavItems`, après `{ label: "Le Livre", href: "/livre" }`, ajouter `{ label: "Nous soutenir", href: "/soutenir" }`. Dans `footerNavItems.informations`, ajouter `{ label: "Nous soutenir", href: "/soutenir" }` après « Le Livre ».

`src/app/sitemap.ts` : ajouter après l'entrée `/livre` :
```ts
    {
      url: `${baseUrl}/soutenir`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
```

- [ ] **Step 6 : Vérifier**

Run: `npx tsc --noEmit && npm run lint && npm test` → OK.
Run: `npm run dev` puis ouvrir `http://localhost:3000/soutenir` et `/soutenir?onglet=adhesion` : les onglets basculent, les montants se sélectionnent, le bouton affiche le bon libellé. (Sans clé Stripe, la soumission renvoie l'erreur 500 attendue « Erreur lors de la création du paiement ».)

- [ ] **Step 7 : Commit**

```bash
git add src/components/support src/app/soutenir src/config/navigation.ts src/app/sitemap.ts
git commit -m "feat: page Nous soutenir (dons et adhésion via Stripe)

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 10 : Textes légaux

**Files:**
- Modify: `src/app/mentions-legales/page.tsx`, `src/app/cgv/page.tsx`, `src/app/faq/page.tsx`, `src/app/politique-confidentialite/page.tsx`

- [ ] **Step 1 : Mentions légales** — remplacer les blocs « Editeur du site » et « Hebergement », et ajouter « Nature de l'activité » :

```tsx
        <h1>Mentions légales</h1>

        <h2>Éditeur du site</h2>
        <p>
          <strong>ASHIFA BIEN-ÊTRE ET ÉQUILIBRE</strong><br />
          Association à but non lucratif de droit local, régie par les articles 21 à 79-III
          du Code civil local (Alsace-Moselle), inscrite au registre des associations du
          Tribunal de proximité de Schiltigheim.<br />
          SIREN : 101 659 753 — SIRET : 101 659 753 00012<br />
          Siège social : 8 avenue de l&apos;Énergie, 67800 Bischheim, France<br />
          Président et responsable de la publication : Larbi DJEDADOUA<br />
          Téléphone : 07 68 84 84 83<br />
          Nom commercial / enseigne : Centre Ashifa
        </p>

        <h2>Hébergement</h2>
        <p>
          Ce site est hébergé sur un serveur privé virtuel fourni par<br />
          Hostinger International Ltd.<br />
          61 Lordou Vironos Street, 6023 Larnaca, Chypre<br />
          <a href="https://www.hostinger.fr" rel="noopener noreferrer" target="_blank">www.hostinger.fr</a>
        </p>

        <h2>Nature de l&apos;activité</h2>
        <p>
          Le Centre Ashifa est géré par une association à but non lucratif.{" "}
          <strong>Toutes les consultations et séances proposées (Roqya-thérapie, TCC,
          accompagnement) sont entièrement gratuites.</strong> Aucun paiement n&apos;est
          demandé pour prendre rendez-vous ou bénéficier d&apos;une séance. Seuls
          l&apos;achat du livre, les dons et les cotisations d&apos;adhésion, effectués
          librement sur ce site, donnent lieu à un paiement en ligne.
        </p>
```
Conserver les sections « Propriété intellectuelle », « Responsabilité », « Avertissement », « Données personnelles » en corrigeant leurs titres avec accents (`Propriété intellectuelle`, `Responsabilité`, `Données personnelles`) et les mots « né » → « ne », « precises » → « précises », « diffusees » → « diffusées », « medical » → « médical », « proposees » → « proposées », « a un traitement » → « à un traitement ».

- [ ] **Step 2 : CGV** — remplacer l'article 1 et l'article 5, et ajouter un article « Dons et cotisations » avant « Réclamations » (renuméroter) :

Article 1 :
```tsx
        <h2>1. Objet</h2>
        <p>
          Les présentes conditions générales de vente (CGV) régissent les ventes de
          produits, les dons et les cotisations effectués sur le site centre-ashifa.fr,
          édité par l&apos;association ASHIFA BIEN-ÊTRE ET ÉQUILIBRE (Centre Ashifa),
          8 avenue de l&apos;Énergie, 67800 Bischheim. Les séances et consultations
          proposées par l&apos;association sont gratuites et ne relèvent pas des présentes CGV.
        </p>
```
Article 5 :
```tsx
        <h2>5. Paiement</h2>
        <p>
          Le paiement s&apos;effectue en ligne via la plateforme sécurisée Stripe (carte
          bancaire, Apple Pay, Google Pay, PayPal selon disponibilité). Aucune donnée
          bancaire n&apos;est stockée par l&apos;association. Le débit est effectué au
          moment de la validation du paiement.
        </p>
```
Nouvel article 8 (les anciens 8 et 9 deviennent 9 et 10) :
```tsx
        <h2>8. Dons et cotisations</h2>
        <p>
          Les dons et cotisations d&apos;adhésion (membre bienfaiteur) sont effectués
          librement, sans contrepartie matérielle. Un don ou une cotisation mensuelle
          constitue un paiement récurrent, prélevé chaque mois à la date anniversaire
          du premier paiement. Le donateur ou l&apos;adhérent peut modifier ou arrêter
          ce prélèvement à tout moment depuis la page « Nous soutenir » (portail de
          gestion Stripe) ; l&apos;arrêt prend effet pour les échéances suivantes, les
          mois déjà prélevés n&apos;étant pas remboursés. Les dons ponctuels ne sont
          pas remboursables. L&apos;association ne délivre pas de reçu fiscal.
        </p>
```

- [ ] **Step 3 : FAQ** — remplacer la réponse « Combien coute une séance de Roqya ? » :

```ts
        question: "Combien coûte une séance de Roqya ?",
        answer:
          "Toutes nos séances sont entièrement gratuites, au cabinet comme à distance. Le Centre Ashifa est porté par une association : si vous souhaitez nous aider, vous pouvez faire un don ou adhérer sur la page « Nous soutenir ».",
```

- [ ] **Step 4 : Politique de confidentialité** — remplacer les mentions PayPal :
  - ligne 30 : `Informations de paiement (traitées exclusivement par Stripe)`
  - ligne 57 : `Les paiements en ligne sont gérés exclusivement par Stripe`
  - lien : `href="https://stripe.com/fr/privacy"` et texte `politique de confidentialité de Stripe`.

- [ ] **Step 5 : Vérifier** — `npx tsc --noEmit && npm run lint` → OK ; `grep -rni paypal src` → seules occurrences restantes : le champ `paypalOrderId` dans `orders.ts` et la mention « PayPal selon disponibilité » des CGV.

- [ ] **Step 6 : Commit**

```bash
git add src/app/mentions-legales src/app/cgv src/app/faq src/app/politique-confidentialite
git commit -m "feat: mentions légales de l'association, séances gratuites, Stripe dans les CGV

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 11 : Configuration Docker / env + test bout en bout en mode test Stripe

**Files:**
- Modify: `docker-compose.yml`, `Dockerfile`, `.env.example`

- [ ] **Step 1 : `.env.example`**

```
# Stripe (https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Site
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Email (Gmail SMTP)
GMAIL_USER=
GMAIL_APP_PASSWORD=
EDITOR_EMAIL=
```

- [ ] **Step 2 : `docker-compose.yml`** — supprimer le bloc `args` du `build` et toutes les lignes `PAYPAL_*` / `NEXT_PUBLIC_PAYPAL_CLIENT_ID` ; ajouter dans `environment` :
```yaml
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
      - STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}
```

- [ ] **Step 3 : `Dockerfile`** — supprimer `ARG NEXT_PUBLIC_PAYPAL_CLIENT_ID` et `ENV NEXT_PUBLIC_PAYPAL_CLIENT_ID=...`.

- [ ] **Step 4 : Test bout en bout local (mode test Stripe)**

Prérequis : `.env.local` avec `STRIPE_SECRET_KEY=sk_test_…` et `STRIPE_WEBHOOK_SECRET` fourni par `stripe listen`.
```bash
stripe listen --forward-to localhost:3000/api/checkout/webhook   # terminal 1, copier le whsec_ dans .env.local
npm run dev                                                        # terminal 2
```
Scénarios (carte `4242 4242 4242 4242`, date future, CVC 123) :
1. `/livre` → commander 1 ex. → page Stripe → payer → retour `/livre/merci` « Merci » + référence ; `data/orders.json` : statut `paid` ; 3 emails reçus.
2. `/soutenir` → don ponctuel 20 € → payer → `/soutenir/merci` ; `data/support.json` : `paid` avec `stripeCustomerId`.
3. `/soutenir?onglet=adhesion` → 10 €/mois → payer → `stripeSubscriptionId` renseigné ; email « Bienvenue parmi les membres bienfaiteurs ».
4. `/soutenir` → « Gérer mon soutien » avec l'email du scénario 3 → redirection vers le portail Stripe (activer le portail dans le dashboard test : *Settings → Billing → Customer portal* si nécessaire).
5. Annuler depuis la page Stripe → retour `/livre?annule=1` avec bandeau ambre.

- [ ] **Step 5 : Build Docker local**

Run: `docker build -t ashifa-test .` → succès.

- [ ] **Step 6 : Commit**

```bash
git add docker-compose.yml Dockerfile .env.example
git commit -m "chore: variables Stripe dans Docker, suppression PayPal

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 12 : Déploiement (après réception des clés live)

- [ ] **Step 1** : l'utilisateur ajoute dans `/docker/centre-ashifa/.env` : `STRIPE_SECRET_KEY=sk_live_…` et (après création du webhook) `STRIPE_WEBHOOK_SECRET=whsec_…` ; supprime les lignes `PAYPAL_*`.
- [ ] **Step 2** : Dashboard Stripe (live) → *Développeurs → Webhooks → Ajouter un endpoint* : URL `https://centre-ashifa.fr/api/checkout/webhook`, événement `checkout.session.completed` → copier le secret de signature dans `.env`.
- [ ] **Step 3** : Dashboard Stripe → *Paramètres → Facturation → Portail client* : activer, autoriser « annuler l'abonnement » et « mettre à jour le moyen de paiement ».
- [ ] **Step 4** : déployer selon la mémoire `deploiement-vps` :
```bash
rsync -az --delete --rsync-path="sudo rsync" src/ cloudsiv-vps:/docker/centre-ashifa/src/
rsync -az --rsync-path="sudo rsync" package.json package-lock.json Dockerfile docker-compose.yml vitest.config.ts cloudsiv-vps:/docker/centre-ashifa/
ssh cloudsiv-vps 'cd /docker/centre-ashifa && sudo docker compose up -d --build'
curl -I https://centre-ashifa.fr/soutenir
```
- [ ] **Step 5** : achat réel du livre (17 €) puis remboursement depuis le dashboard Stripe ; vérifier l'événement webhook « 200 » dans le dashboard.

---

## Calendly (hors code — instructions pour l'utilisateur)

1. calendly.com → *Event types* → « rokya » → **Edit**.
2. Onglet *Booking page options* → vérifier qu'aucun texte de description ne mentionne un tarif ou une politique d'annulation payante.
3. Section *Collect payment* (ou *Payments*) → doit être **désactivée** ; si un compte PayPal/Stripe y est connecté, le déconnecter.
4. *Notifications and workflows* → ouvrir chaque email (confirmation, rappel, annulation) et supprimer toute phrase relative au paiement/frais d'annulation ; remplacer par « Séance gratuite — merci de prévenir 24 h à l'avance en cas d'empêchement ».
5. *Booking page options → Cancellation policy* : mettre le même texte, sans mention d'argent.
6. Faire un rendez-vous test avec sa propre adresse pour relire les emails reçus.

## Self-review

- Spec coverage : livre (T3, T7, T8), soutenir (T2, T3, T4, T7, T9), webhook idempotent (T6), portail (T7, T9), textes légaux (T10), config (T11), Calendly (section finale), tests unitaires (T2, T3, T4, T6), test manuel (T11). Hors périmètre respecté (pas de Cerfa).
- Cohérence des noms : `attachStripeSession`, `markSupportPaid`, `findLatestCustomerIdByEmail`, `handleCheckoutCompleted`, `sendSupportEmails`, `buildBookSessionParams`, `buildSupportSessionParams` utilisés à l'identique dans T4→T9.
