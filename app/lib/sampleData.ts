import type { DonorReceiptData, PayoutReceiptData, Profile } from "./types";

export const SAMPLE_PROFILE: Profile = {
  name: "University of St. La Salle",
  shortCode: "USLS",
  logoDataUrl: null,
  defaultIssuerName: "Ma. Teresa R. Santos",
  footerNote: "FundMe.ph — The place for those who care.",
};

export const SAMPLE_DONOR: DonorReceiptData = {
  receiptId: "DR-USLS-20260401-001",
  idMode: "manual",
  receiptDate: "2026-04-01",
  donorName: "Juan dela Cruz",
  donorEmail: "juan.delacruz@email.com",
  fundName: "Tuition Relief Fund",
  grossDonation: 5000,
  feeMode: "auto",
  feePercent: 2.5,
  feeAmount: 125,
  netMode: "auto",
  netAmount: 4875,
  stampMode: "manual",
  stampDataUrl: null,
  note: "Thank you for your generous contribution to the Tuition Relief Fund.",
};

export const SAMPLE_PAYOUT: PayoutReceiptData = {
  receiptId: "PR-USLS-20260430-001",
  idMode: "manual",
  payoutDate: "2026-04-30",
  fundName: "Tuition Relief Fund",
  totalRaised: 250000,
  totalFees: 6250,
  netPayout: 243750,
  paymentMethod: "Bank Transfer",
  payoutReference: "BT-2026-04-USLS-001",
  fundmeRepName: "Andrea C. Reyes",
  schoolAdminName: "Ma. Teresa R. Santos",
  note: "Funds have been remitted to the school's official bank account.",
};
