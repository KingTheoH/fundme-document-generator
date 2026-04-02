"use client";

import type { PayoutReceiptData, Profile } from "@/app/lib/types";
import { generateReceiptId, peekNextSequence } from "@/app/lib/utils";

interface Props {
  data: PayoutReceiptData;
  profile: Profile;
  onChange: (d: PayoutReceiptData) => void;
}

const labelCls = "block text-xs font-medium text-gray-600 mb-1";
const inputCls =
  "w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#096651]/30 focus:border-[#096651]";
const toggleBase =
  "px-3 py-1.5 text-xs font-medium rounded-md border transition-colors";
const toggleActive = "bg-[#096651] text-white border-[#096651]";
const toggleInactive = "bg-white text-gray-600 border-gray-200 hover:bg-gray-50";

export default function PayoutForm({ data, profile, onChange }: Props) {
  function set<K extends keyof PayoutReceiptData>(key: K, value: PayoutReceiptData[K]) {
    const next = { ...data, [key]: value };
    // Auto-calc net payout
    if (
      (key === "totalRaised" || key === "totalFees") &&
      next.totalRaised !== "" &&
      next.totalFees !== ""
    ) {
      next.netPayout = parseFloat(
        (Number(next.totalRaised) - Number(next.totalFees)).toFixed(2)
      );
    }
    onChange(next);
  }

  function regenerateId() {
    const seq = peekNextSequence("payout");
    const id = generateReceiptId("payout", profile.shortCode, data.payoutDate, seq);
    onChange({ ...data, receiptId: id });
  }

  return (
    <div className="space-y-5">
      {/* Receipt ID */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className={labelCls}>Payout Receipt ID</label>
          <div className="flex gap-1">
            {(["auto", "manual"] as const).map((m) => (
              <button
                key={m}
                type="button"
                className={`${toggleBase} ${data.idMode === m ? toggleActive : toggleInactive}`}
                onClick={() => {
                  if (m === "auto") regenerateId();
                  set("idMode", m);
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <input
          type="text"
          className={inputCls + " font-mono"}
          value={data.receiptId}
          readOnly={data.idMode === "auto"}
          onChange={(e) => set("receiptId", e.target.value)}
        />
      </div>

      {/* Date */}
      <div>
        <label className={labelCls}>Payout Date</label>
        <input
          type="date"
          className={inputCls}
          value={data.payoutDate}
          onChange={(e) => set("payoutDate", e.target.value)}
        />
      </div>

      {/* Fund Name */}
      <div>
        <label className={labelCls}>Fund / Campaign Name</label>
        <input
          type="text"
          className={inputCls}
          value={data.fundName}
          onChange={(e) => set("fundName", e.target.value)}
          placeholder="Tuition Relief Fund"
        />
      </div>

      {/* Financials */}
      <div className="space-y-3">
        <div>
          <label className={labelCls}>Total Raised (₱)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className={inputCls}
            value={data.totalRaised}
            onChange={(e) =>
              set("totalRaised", e.target.value === "" ? "" : parseFloat(e.target.value))
            }
            placeholder="0.00"
          />
        </div>
        <div>
          <label className={labelCls}>Total Fees (₱)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className={inputCls}
            value={data.totalFees}
            onChange={(e) =>
              set("totalFees", e.target.value === "" ? "" : parseFloat(e.target.value))
            }
            placeholder="0.00"
          />
        </div>
        <div>
          <label className={labelCls}>Net Payout Amount (₱)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className={inputCls}
            value={data.netPayout}
            onChange={(e) =>
              set("netPayout", e.target.value === "" ? "" : parseFloat(e.target.value))
            }
            placeholder="0.00"
          />
          <p className="text-xs text-gray-400 mt-1">Auto-calculated from Total Raised − Total Fees</p>
        </div>
      </div>

      {/* Optional fields */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>
            Payment Method <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            className={inputCls}
            value={data.paymentMethod}
            onChange={(e) => set("paymentMethod", e.target.value)}
            placeholder="Bank Transfer"
          />
        </div>
        <div>
          <label className={labelCls}>
            Payout Reference <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            className={inputCls}
            value={data.payoutReference}
            onChange={(e) => set("payoutReference", e.target.value)}
            placeholder="BT-2026-04-001"
          />
        </div>
      </div>

      {/* Representatives */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>FundMe Representative</label>
          <input
            type="text"
            className={inputCls}
            value={data.fundmeRepName}
            onChange={(e) => set("fundmeRepName", e.target.value)}
            placeholder="Andrea C. Reyes"
          />
        </div>
        <div>
          <label className={labelCls}>School Administrator</label>
          <input
            type="text"
            className={inputCls}
            value={data.schoolAdminName}
            onChange={(e) => set("schoolAdminName", e.target.value)}
            placeholder="Ma. Teresa R. Santos"
          />
        </div>
      </div>

      {/* Note */}
      <div>
        <label className={labelCls}>
          Note <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          rows={2}
          className={inputCls + " resize-none"}
          value={data.note}
          onChange={(e) => set("note", e.target.value)}
          placeholder="Optional notes about this payout..."
        />
      </div>
    </div>
  );
}
