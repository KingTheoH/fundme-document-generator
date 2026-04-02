"use client";

import type { PayoutReceiptData, Profile } from "@/app/lib/types";
import { formatPHP, formatDateDisplay } from "@/app/lib/utils";

interface Props {
  data: PayoutReceiptData;
  profile: Profile;
}

export default function PayoutReceiptPreview({ data, profile }: Props) {
  const raised = Number(data.totalRaised) || 0;
  const fees = Number(data.totalFees) || 0;
  const net = Number(data.netPayout) || 0;

  return (
    <div
      id="receipt-preview"
      className="bg-white w-full max-w-[680px] mx-auto"
      style={{ fontFamily: "Lato, sans-serif", padding: "12px 24px 10px 12px" }}
    >
      {/* Header */}
      <div className="pb-5 mb-6 border-b-2 border-[#096651]">
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
              <p className="text-xs text-gray-500 mt-0.5">Payout Receipt</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-1.5 mb-2">
              <span className="text-[10px] text-gray-400">Powered by</span>
              <span className="font-bold text-[#096651] text-sm">FundMe</span>
              <span className="text-[#096651]">
                <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
                  <path d="M16 27S4 19.5 4 11.5C4 8.4 6.4 6 9.5 6c1.9 0 3.6.9 4.7 2.3L16 10l1.8-1.7C18.9 6.9 20.6 6 22.5 6 25.6 6 28 8.4 28 11.5 28 19.5 16 27 16 27z" stroke="#096651" strokeWidth="2" fill="#096651" fillOpacity="0.2"/>
                </svg>
              </span>
            </div>
            <p className="text-xs font-mono text-gray-500">{data.receiptId || "PR-—"}</p>
            <p className="text-xs text-gray-500">{formatDateDisplay(data.payoutDate)}</p>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">School Payout Receipt</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Official confirmation of fundraiser remittance
        </p>
      </div>

      {/* Payout details */}
      <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          Payout Details
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] text-gray-400 mb-0.5">Fund / Campaign</p>
            <p className="text-sm font-semibold text-gray-900">{data.fundName || "—"}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 mb-0.5">Payout Date</p>
            <p className="text-sm text-gray-900">{formatDateDisplay(data.payoutDate)}</p>
          </div>
          {data.paymentMethod && (
            <div>
              <p className="text-[10px] text-gray-400 mb-0.5">Payment Method</p>
              <p className="text-sm text-gray-900">{data.paymentMethod}</p>
            </div>
          )}
          {data.payoutReference && (
            <div>
              <p className="text-[10px] text-gray-400 mb-0.5">Reference No.</p>
              <p className="text-sm font-mono text-gray-900">{data.payoutReference}</p>
            </div>
          )}
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
              <td className="py-2.5 text-sm text-gray-600">Total Raised</td>
              <td className="py-2.5 text-sm font-medium text-gray-900 text-right pr-1">
                {formatPHP(raised)}
              </td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-2.5 text-sm text-gray-600">Total Fees</td>
              <td className="py-2.5 text-sm text-gray-600 text-right pr-1">
                ({formatPHP(fees)})
              </td>
            </tr>
            <tr>
              <td className="pt-3 pb-1 text-sm font-bold text-gray-900">Net Payout Amount</td>
              <td className="pt-3 pb-1 text-lg font-bold text-[#096651] text-right pr-1">
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

      {/* Signatures */}
      <div className="mb-8 mt-8">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-5">
          Authorized Signatures
        </p>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="border-b-2 border-gray-800 mb-2 h-10" />
            <p className="text-sm font-semibold text-gray-900">
              {data.fundmeRepName || "FundMe Representative"}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">FundMe.ph Representative</p>
          </div>
          <div>
            <div className="border-b-2 border-gray-800 mb-2 h-10" />
            <p className="text-sm font-semibold text-gray-900">
              {data.schoolAdminName || "School Administrator"}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">School / Organization Administrator</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
        <p className="text-[10px] text-gray-400">
          {profile.footerNote || "FundMe.ph — The place for those who care."}
        </p>
        <p className="text-[10px] text-gray-400">fundme.ph</p>
      </div>
    </div>
  );
}
