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
    .filter(
      (e) =>
        e.status === "paid" &&
        e.stripeCustomerId &&
        e.email.toLowerCase() === wanted
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  return match?.stripeCustomerId ?? null;
}

export function generateSupportId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `SUP-${timestamp}-${random}`;
}
