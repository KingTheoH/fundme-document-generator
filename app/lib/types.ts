export type DocumentType = "donor" | "payout";
export type StampMode = "manual" | "digital" | "none";
export type FeeMode = "auto" | "manual";
export type NetMode = "auto" | "manual";
export type IdMode = "auto" | "manual";

export interface Profile {
  name: string;
  shortCode: string;
  logoDataUrl: string | null;
  defaultIssuerName: string;
  footerNote: string;
}

export interface DonorReceiptData {
  receiptId: string;
  idMode: IdMode;
  receiptDate: string;
  donorName: string;
  donorEmail: string;
  fundName: string;
  grossDonation: number | "";
  feeMode: FeeMode;
  feePercent: number;
  feeAmount: number | "";
  netMode: NetMode;
  netAmount: number | "";
  stampMode: StampMode;
  stampDataUrl: string | null;
  note: string;
}

export interface PayoutReceiptData {
  receiptId: string;
  idMode: IdMode;
  payoutDate: string;
  fundName: string;
  totalRaised: number | "";
  totalFees: number | "";
  netPayout: number | "";
  paymentMethod: string;
  payoutReference: string;
  fundmeRepName: string;
  schoolAdminName: string;
  note: string;
}

export interface ReceiptHistoryEntry {
  id: string;
  type: DocumentType;
  receiptId: string;
  date: string;
  primaryName: string; // donor name or fund name
  fundName: string;
  amount: number | "";
  profileCode: string;
  createdAt: string;
}
