import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

export interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  phone: string;
  /** "cabinet" | "distance" — préférence de lieu */
  location: "cabinet" | "distance" | "indifferent";
  /** "roqya" | "tcc" — type de séance */
  sessionType: "roqya" | "tcc" | "indifferent";
  /** Disponibilités préférées saisies librement (ex. "soirées en semaine, samedi matin") */
  availability: string;
  createdAt: string;
}

const DATA_DIR = join(process.cwd(), "data");
const WAITLIST_FILE = join(DATA_DIR, "waitlist.json");

function ensureDataDir(): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readWaitlist(): WaitlistEntry[] {
  ensureDataDir();
  if (!existsSync(WAITLIST_FILE)) return [];
  const raw = readFileSync(WAITLIST_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeWaitlist(entries: WaitlistEntry[]): void {
  ensureDataDir();
  writeFileSync(WAITLIST_FILE, JSON.stringify(entries, null, 2), "utf-8");
}

export function saveWaitlistEntry(entry: WaitlistEntry): void {
  const entries = readWaitlist();
  entries.push(entry);
  writeWaitlist(entries);
}

export function generateWaitlistId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `WAIT-${timestamp}-${random}`;
}
