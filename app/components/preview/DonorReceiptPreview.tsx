"use client";

import type { DonorReceiptData, Profile } from "@/app/lib/types";
import { formatPHP, formatDateDisplay } from "@/app/lib/utils";

interface Props {
  data: DonorReceiptData;
  profile: Profile;
}

export default function DonorReceiptPreview({ data, profile }: Props) {
  const gross = Number(data.grossDonation) || 0;
  const fee =
    data.feeMode === "auto"
      ? (gross * data.feePercent) / 100
      : Number(data.feeAmount) || 0;
  const net =
    data.netMode === "auto" ? gross - fee : Number(data.netAmount) || 0;

  return (
    <div
      id="receipt-preview"
      className="bg-white w-full max-w-[680px] mx-auto"
      style={{ fontFamily: "Lato, sans-serif", padding: "12px 24px 10px 12px" }}
    >
      {/* Header */}
      <div className="border-b-2 border-[#096651] pb-5 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {profile.logoDataUrl ? (
              <img
                src={profile.logoDataUrl}
                alt={profile.name}
                className="h-12 w-auto max-w-[100px] object-contain"
              />
            ) : (
              <div className="h-12 w-12 rounded bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-[9px] text-gray-400 text-center leading-tight px-1">
                Your Logo
              </div>
            )}
            <div>
              <p className="font-bold text-gray-900 text-sm leading-tight">
                {profile.name || "Organization Name"}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Donation Receipt</p>
            </div>
          </div>
          <div className="text-right">
            {/* FundMe secondary branding */}
            <div className="flex items-center justify-end gap-1.5 mb-2">
              <span className="text-[10px] text-gray-400">Powered by</span>
              <span className="font-bold text-[#096651] text-sm">FundMe</span>
              <span className="text-[#096651]">
                <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
                  <path d="M16 27S4 19.5 4 11.5C4 8.4 6.4 6 9.5 6c1.9 0 3.6.9 4.7 2.3L16 10l1.8-1.7C18.9 6.9 20.6 6 22.5 6 25.6 6 28 8.4 28 11.5 28 19.5 16 27 16 27z" stroke="#096651" strokeWidth="2" fill="#096651" fillOpacity="0.2"/>
                </svg>
              </span>
            </div>
            <p className="text-xs font-mono text-gray-500">{data.receiptId || "DR-—"}</p>
            <p className="text-xs text-gray-500">{formatDateDisplay(data.receiptDate)}</p>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#096651]">Donation Receipt</h1>
        <p className="text-xs text-gray-500 mt-0.5">Official acknowledgment of contribution</p>
      </div>

      {/* Donor details */}
      <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Donor Information
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] text-gray-400 mb-0.5">Full Name</p>
            <p className="text-sm font-semibold text-gray-900">
              {data.donorName || "—"}
            </p>
          </div>
          {data.donorEmail && (
            <div>
              <p className="text-[10px] text-gray-400 mb-0.5">Email Address</p>
              <p className="text-sm text-gray-700">{data.donorEmail}</p>
            </div>
          )}
          <div className={data.donorEmail ? "col-span-2 sm:col-span-1" : ""}>
            <p className="text-[10px] text-gray-400 mb-0.5">Fund / Campaign</p>
            <p className="text-sm font-semibold text-gray-900">
              {data.fundName || "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Financial summary */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Financial Summary
        </p>
        <table className="w-full">
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="py-2.5 text-sm text-gray-600">Gross Donation</td>
              <td className="py-2.5 text-sm font-medium text-gray-900 text-right pr-1">
                {formatPHP(gross)}
              </td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-2.5 text-sm text-gray-600">
                Platform Fee
                {data.feeMode === "auto" && (
                  <span className="ml-1.5 text-[10px] text-gray-400">
                    ({data.feePercent}%)
                  </span>
                )}
              </td>
              <td className="py-2.5 text-sm text-gray-600 text-right pr-1">
                ({formatPHP(fee)})
              </td>
            </tr>
            <tr>
              <td className="pt-3 pb-1 text-sm font-bold text-gray-900">Net to Organization</td>
              <td className="pt-3 pb-1 text-base font-bold text-[#096651] text-right pr-1">
                {formatPHP(net)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Note */}
      {data.note && (
        <div className="mb-6 border-l-2 border-[#096651]/30 pl-3 py-1">
          <p className="text-xs text-gray-500 italic">{data.note}</p>
        </div>
      )}

      {/* Stamp area */}
      {data.stampMode !== "none" && (
        <div className="mb-6 flex justify-end">
          {data.stampMode === "manual" ? (
            <div className="w-28 h-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
              <p className="text-[10px] text-gray-400 text-center leading-tight px-2">
                School Stamp
              </p>
            </div>
          ) : data.stampDataUrl ? (
            <img
              src={data.stampDataUrl}
              alt="Stamp"
              className="w-28 h-20 object-contain"
            />
          ) : (
            <div className="w-28 h-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
              <p className="text-[10px] text-gray-400 text-center">Upload stamp</p>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-100 pt-4 mt-6 flex items-center justify-between">
        <p className="text-[10px] text-gray-400">
          {profile.footerNote || "FundMe.ph — The place for those who care."}
        </p>
        <p className="text-[10px] text-gray-400">fundme.ph</p>
      </div>
    </div>
  );
}
