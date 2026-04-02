"use client";

import { useRef } from "react";
import type { DonorReceiptData, Profile } from "@/app/lib/types";
import { generateReceiptId, peekNextSequence } from "@/app/lib/utils";

interface Props {
  data: DonorReceiptData;
  profile: Profile;
  onChange: (d: DonorReceiptData) => void;
}

const labelCls = "block text-xs font-medium text-gray-600 mb-1";
const inputCls =
  "w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#096651]/30 focus:border-[#096651]";
const toggleBase =
  "px-3 py-1.5 text-xs font-medium rounded-md border transition-colors";
const toggleActive = "bg-[#096651] text-white border-[#096651]";
const toggleInactive = "bg-white text-gray-600 border-gray-200 hover:bg-gray-50";

export default function DonorForm({ data, profile, onChange }: Props) {
  const stampInputRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof DonorReceiptData>(key: K, value: DonorReceiptData[K]) {
    const next = { ...data, [key]: value };
    // Recalc fee if auto
    if (key === "grossDonation" || key === "feePercent") {
      if (next.feeMode === "auto" && next.grossDonation !== "") {
        next.feeAmount = parseFloat(
          ((Number(next.grossDonation) * next.feePercent) / 100).toFixed(2)
        );
      }
    }
    if (key === "feeMode" && value === "auto" && next.grossDonation !== "") {
      next.feeAmount = parseFloat(
        ((Number(next.grossDonation) * next.feePercent) / 100).toFixed(2)
      );
    }
    // Recalc net if auto
    if (next.netMode === "auto" && next.grossDonation !== "" && next.feeAmount !== "") {
      next.netAmount = parseFloat(
        (Number(next.grossDonation) - Number(next.feeAmount)).toFixed(2)
      );
    }
    onChange(next);
  }

  function handleStampUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) =>
      onChange({ ...data, stampDataUrl: ev.target?.result as string });
    reader.readAsDataURL(file);
  }

  function regenerateId() {
    const seq = peekNextSequence("donor");
    const id = generateReceiptId("donor", profile.shortCode, data.receiptDate, seq);
    onChange({ ...data, receiptId: id });
  }

  return (
    <div className="space-y-5">
      {/* Receipt ID */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className={labelCls}>Receipt ID</label>
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
        <label className={labelCls}>Receipt Date</label>
        <input
          type="date"
          className={inputCls}
          value={data.receiptDate}
          onChange={(e) => set("receiptDate", e.target.value)}
        />
      </div>

      {/* Donor Info */}
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 sm:col-span-1">
          <label className={labelCls}>Donor Full Name</label>
          <input
            type="text"
            className={inputCls}
            value={data.donorName}
            onChange={(e) => set("donorName", e.target.value)}
            placeholder="Juan dela Cruz"
          />
        </div>
        <div>
          <label className={labelCls}>
            Donor Email <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="email"
            className={inputCls}
            value={data.donorEmail}
            onChange={(e) => set("donorEmail", e.target.value)}
            placeholder="juan@email.com"
          />
        </div>
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
          <label className={labelCls}>Gross Donation (₱)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className={inputCls}
            value={data.grossDonation}
            onChange={(e) =>
              set("grossDonation", e.target.value === "" ? "" : parseFloat(e.target.value))
            }
            placeholder="0.00"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className={labelCls}>Fee</label>
            <div className="flex gap-1">
              {(["auto", "manual"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`${toggleBase} ${data.feeMode === m ? toggleActive : toggleInactive}`}
                  onClick={() => set("feeMode", m)}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          {data.feeMode === "auto" ? (
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                className={inputCls + " w-24"}
                value={data.feePercent}
                onChange={(e) => set("feePercent", parseFloat(e.target.value) || 0)}
              />
              <span className="text-sm text-gray-500">%</span>
              <span className="text-sm text-gray-400">
                ={" "}
                {data.grossDonation !== ""
                  ? `₱${((Number(data.grossDonation) * data.feePercent) / 100).toFixed(2)}`
                  : "—"}
              </span>
            </div>
          ) : (
            <input
              type="number"
              min="0"
              step="0.01"
              className={inputCls}
              value={data.feeAmount}
              onChange={(e) =>
                set("feeAmount", e.target.value === "" ? "" : parseFloat(e.target.value))
              }
              placeholder="0.00"
            />
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className={labelCls}>Net to Organization</label>
            <div className="flex gap-1">
              {(["auto", "manual"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`${toggleBase} ${data.netMode === m ? toggleActive : toggleInactive}`}
                  onClick={() => set("netMode", m)}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <input
            type="number"
            min="0"
            step="0.01"
            className={inputCls}
            value={data.netAmount}
            readOnly={data.netMode === "auto"}
            onChange={(e) =>
              set("netAmount", e.target.value === "" ? "" : parseFloat(e.target.value))
            }
            placeholder="0.00"
          />
        </div>
      </div>

      {/* Stamp */}
      <div>
        <label className={labelCls}>Stamp</label>
        <div className="flex gap-1 mb-2">
          {(["manual", "digital", "none"] as const).map((m) => (
            <button
              key={m}
              type="button"
              className={`${toggleBase} ${data.stampMode === m ? toggleActive : toggleInactive}`}
              onClick={() => set("stampMode", m)}
            >
              {m === "manual" ? "Manual box" : m === "digital" ? "Digital stamp" : "None"}
            </button>
          ))}
        </div>
        {data.stampMode === "digital" && (
          <div className="flex items-center gap-3">
            {data.stampDataUrl ? (
              <img
                src={data.stampDataUrl}
                alt="Stamp"
                className="h-12 w-auto max-w-[80px] object-contain rounded border border-gray-200 p-1"
              />
            ) : (
              <div className="h-12 w-20 rounded border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">
                Stamp
              </div>
            )}
            <button
              type="button"
              onClick={() => stampInputRef.current?.click()}
              className="text-xs px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {data.stampDataUrl ? "Replace" : "Upload"}
            </button>
            {data.stampDataUrl && (
              <button
                type="button"
                onClick={() => onChange({ ...data, stampDataUrl: null })}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            )}
            <input
              ref={stampInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleStampUpload}
            />
          </div>
        )}
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
          placeholder="Optional message for the donor..."
        />
      </div>
    </div>
  );
}
