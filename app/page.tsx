"use client";

import { useState, useEffect, useRef } from "react";
import type {
  DocumentType,
  Profile,
  DonorReceiptData,
  PayoutReceiptData,
  ReceiptHistoryEntry,
} from "@/app/lib/types";
import {
  todayISO,
  saveProfile,
  loadProfile,
  clearProfile,
  loadHistory,
  clearHistory,
  generateReceiptId,
  peekNextSequence,
} from "@/app/lib/utils";
import { exportDonorPdf, exportPayoutPdf } from "@/app/lib/exportPdf";
import { SAMPLE_DONOR, SAMPLE_PAYOUT, SAMPLE_PROFILE } from "@/app/lib/sampleData";
import ProfilePanel from "@/app/components/form/ProfilePanel";
import DonorForm from "@/app/components/form/DonorForm";
import PayoutForm from "@/app/components/form/PayoutForm";
import DonorReceiptPreview from "@/app/components/preview/DonorReceiptPreview";
import PayoutReceiptPreview from "@/app/components/preview/PayoutReceiptPreview";
import HistoryPanel from "@/app/components/ui/HistoryPanel";
import FundMeLogo from "@/app/components/ui/FundMeLogo";

const DEFAULT_PROFILE: Profile = {
  name: "",
  shortCode: "",
  logoDataUrl: null,
  defaultIssuerName: "",
  footerNote: "FundMe.ph — The place for those who care.",
};

function defaultDonor(profile: Profile): DonorReceiptData {
  const today = todayISO();
  const seq = peekNextSequence("donor");
  return {
    receiptId: generateReceiptId("donor", profile.shortCode, today, seq),
    idMode: "auto",
    receiptDate: today,
    donorName: "",
    donorEmail: "",
    fundName: "",
    grossDonation: "",
    feeMode: "auto",
    feePercent: 2.5,
    feeAmount: "",
    netMode: "auto",
    netAmount: "",
    stampMode: "manual",
    stampDataUrl: null,
    note: "",
  };
}

function defaultPayout(profile: Profile): PayoutReceiptData {
  const today = todayISO();
  const seq = peekNextSequence("payout");
  return {
    receiptId: generateReceiptId("payout", profile.shortCode, today, seq),
    idMode: "auto",
    payoutDate: today,
    fundName: "",
    totalRaised: "",
    totalFees: "",
    netPayout: "",
    paymentMethod: "",
    payoutReference: "",
    fundmeRepName: "",
    schoolAdminName: profile.defaultIssuerName,
    note: "",
  };
}

export default function Home() {
  const [docType, setDocType] = useState<DocumentType>("donor");
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [donorData, setDonorData] = useState<DonorReceiptData>(defaultDonor(DEFAULT_PROFILE));
  const [payoutData, setPayoutData] = useState<PayoutReceiptData>(defaultPayout(DEFAULT_PROFILE));
  const [history, setHistory] = useState<ReceiptHistoryEntry[]>([]);
  const [profileOpen, setProfileOpen] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = loadProfile();
    if (saved) {
      setProfile(saved);
      setDonorData(defaultDonor(saved));
      setPayoutData(defaultPayout(saved));
    }
    setHistory(loadHistory());
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function handleSaveProfile() {
    saveProfile(profile);
    showToast("Profile saved.");
  }

  function handleClearProfile() {
    clearProfile();
    setProfile(DEFAULT_PROFILE);
    showToast("Profile cleared.");
  }

  function handleLoadSample() {
    setProfile(SAMPLE_PROFILE);
    setDonorData(SAMPLE_DONOR);
    setPayoutData(SAMPLE_PAYOUT);
    showToast("Sample data loaded.");
  }

  function handleReset() {
    if (docType === "donor") setDonorData(defaultDonor(profile));
    else setPayoutData(defaultPayout(profile));
    showToast("Form reset.");
  }

  async function handleDownload() {
    const el = previewRef.current?.querySelector<HTMLElement>("#receipt-preview");
    if (!el) return;
    setExporting(true);
    try {
      let filename: string;
      if (docType === "donor") {
        filename = await exportDonorPdf(donorData, profile, el);
      } else {
        filename = await exportPayoutPdf(payoutData, profile, el);
      }
      setHistory(loadHistory());
      showToast("Downloaded: " + filename);
    } catch (err) {
      showToast("Export failed. Please try again.");
      console.error(err);
    } finally {
      setExporting(false);
    }
  }

  const tabCls = (t: DocumentType) =>
    "px-4 py-2 text-sm font-medium rounded-md transition-colors " +
    (docType === t ? "bg-[#096651] text-white" : "text-gray-600 hover:bg-gray-100");

  const sectionHeader = (label: string, open: boolean, toggle: () => void) => (
    <button
      type="button"
      onClick={toggle}
      className="w-full flex items-center justify-between py-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
    >
      <span>{label}</span>
      <span className="text-gray-400 text-xs">{open ? "▲" : "▼"}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f7f8fa]" style={{ fontFamily: "Lato, sans-serif" }}>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <FundMeLogo size={24} />
            <span className="text-gray-300 text-lg">|</span>
            <span className="text-sm font-semibold text-gray-700">Document Generator</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button className={tabCls("donor")} onClick={() => setDocType("donor")}>
              Donor Receipt
            </button>
            <button className={tabCls("payout")} onClick={() => setDocType("payout")}>
              School Payout Receipt
            </button>
          </div>
        </div>
      </header>

      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg">
          {toast}
        </div>
      )}

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-[420px] shrink-0 space-y-3">
            <div className="bg-white rounded-xl border border-gray-200 px-4 py-3">
              <div className="border-b border-gray-100 mb-3">
                {sectionHeader("Profile", profileOpen, () => setProfileOpen((v) => !v))}
              </div>
              {profileOpen && (
                <ProfilePanel
                  profile={profile}
                  onChange={setProfile}
                  onSave={handleSaveProfile}
                  onClear={handleClearProfile}
                />
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 px-4 py-3">
              <div className="border-b border-gray-100 mb-4">
                <h2 className="py-2 text-sm font-semibold text-gray-700">
                  {docType === "donor" ? "Donor Receipt Details" : "Payout Receipt Details"}
                </h2>
              </div>
              {docType === "donor" ? (
                <DonorForm data={donorData} profile={profile} onChange={setDonorData} />
              ) : (
                <PayoutForm data={payoutData} profile={profile} onChange={setPayoutData} />
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 px-4 py-4 space-y-2">
              <button
                type="button"
                onClick={handleDownload}
                disabled={exporting}
                className="w-full bg-[#FFC300] text-gray-900 font-bold py-2.5 rounded-lg text-sm hover:bg-[#e6b000] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {exporting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download PDF
                  </>
                )}
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="flex-1 text-sm py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
                >
                  Load Sample
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 text-sm py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
                >
                  Reset Form
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 px-4 py-3">
              <div className="border-b border-gray-100 mb-3">
                {sectionHeader(
                  "Receipt History" + (history.length > 0 ? " (" + history.length + ")" : ""),
                  historyOpen,
                  () => setHistoryOpen((v) => !v)
                )}
              </div>
              {historyOpen && (
                <HistoryPanel
                  history={history}
                  onClear={() => {
                    clearHistory();
                    setHistory([]);
                  }}
                />
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="sticky top-[72px]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Live Preview
                </span>
                <span className="text-xs text-gray-400">Approximate — final PDF may vary slightly</span>
              </div>
              <div
                ref={previewRef}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 overflow-auto"
                style={{ maxHeight: "calc(100vh - 120px)" }}
              >
                {docType === "donor" ? (
                  <DonorReceiptPreview data={donorData} profile={profile} />
                ) : (
                  <PayoutReceiptPreview data={payoutData} profile={profile} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
