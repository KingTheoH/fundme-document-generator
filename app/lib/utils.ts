import type { DocumentType, Profile, ReceiptHistoryEntry } from "./types";

// ── Currency ──────────────────────────────────────────────────────────────────

export function formatPHP(value: number | ""): string {
  if (value === "" || isNaN(Number(value))) return "₱0.00";
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(Number(value));
}

// ── Date ──────────────────────────────────────────────────────────────────────

export function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

export function formatDateDisplay(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  return `${months[parseInt(m) - 1]} ${parseInt(d)}, ${y}`;
}

export function dateToYMD(iso: string): string {
  return iso.replace(/-/g, "");
}

// ── ID generation ─────────────────────────────────────────────────────────────

const SEQ_KEY_DR = "fm_seq_dr";
const SEQ_KEY_PR = "fm_seq_pr";

export function getNextSequence(type: DocumentType): number {
  if (typeof window === "undefined") return 1;
  const key = type === "donor" ? SEQ_KEY_DR : SEQ_KEY_PR;
  const current = parseInt(localStorage.getItem(key) ?? "0", 10);
  const next = current + 1;
  localStorage.setItem(key, String(next));
  return next;
}

export function peekNextSequence(type: DocumentType): number {
  if (typeof window === "undefined") return 1;
  const key = type === "donor" ? SEQ_KEY_DR : SEQ_KEY_PR;
  return parseInt(localStorage.getItem(key) ?? "0", 10) + 1;
}

export function generateReceiptId(
  type: DocumentType,
  profileCode: string,
  date: string,
  seq: number
): string {
  const prefix = type === "donor" ? "DR" : "PR";
  const code = sanitizeCode(profileCode) || "FUND";
  const ymd = dateToYMD(date) || dateToYMD(todayISO());
  const num = String(seq).padStart(3, "0");
  return `${prefix}-${code}-${ymd}-${num}`;
}

function sanitizeCode(code: string): string {
  return code.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
}

// ── Filename ──────────────────────────────────────────────────────────────────

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-{2,}/g, "-");
}

export function buildDonorFilename(
  date: string,
  profileCode: string,
  donorName: string,
  fundName: string
): string {
  const ymd = dateToYMD(date);
  const code = sanitizeCode(profileCode);
  return `${ymd}_DR_${code}_${slugify(donorName)}_${slugify(fundName)}.pdf`;
}

export function buildPayoutFilename(
  date: string,
  profileCode: string,
  fundName: string
): string {
  const ymd = dateToYMD(date);
  const code = sanitizeCode(profileCode);
  return `${ymd}_PR_${code}_${slugify(fundName)}.pdf`;
}

// ── localStorage ─────────────────────────────────────────────────────────────

const PROFILE_KEY = "fm_profile";
const HISTORY_KEY = "fm_history";

export function saveProfile(profile: Profile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function loadProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearProfile(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PROFILE_KEY);
}

export function loadHistory(): ReceiptHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addHistoryEntry(entry: ReceiptHistoryEntry): void {
  if (typeof window === "undefined") return;
  const history = loadHistory();
  history.unshift(entry);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 200)));
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(HISTORY_KEY);
}
