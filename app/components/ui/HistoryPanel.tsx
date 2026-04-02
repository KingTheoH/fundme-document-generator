"use client";

import type { ReceiptHistoryEntry } from "@/app/lib/types";
import { formatPHP } from "@/app/lib/utils";

interface Props {
  history: ReceiptHistoryEntry[];
  onClear: () => void;
}

export default function HistoryPanel({ history, onClear }: Props) {
  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        No receipts generated yet.
        <br />
        <span className="text-xs">Downloaded receipts will appear here.</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-400">{history.length} receipt{history.length !== 1 ? "s" : ""}</span>
        <button
          onClick={onClear}
          className="text-xs text-red-400 hover:text-red-600"
        >
          Clear all
        </button>
      </div>
      <div className="space-y-2">
        {history.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md border border-gray-100 hover:border-gray-200 transition-colors"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide ${
                    entry.type === "donor"
                      ? "bg-[#096651]/10 text-[#096651]"
                      : "bg-[#FFC300]/20 text-[#8a6c00]"
                  }`}
                >
                  {entry.type === "donor" ? "DR" : "PR"}
                </span>
                <span className="text-xs font-mono text-gray-600 truncate">
                  {entry.receiptId}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5 truncate">
                {entry.type === "donor" ? entry.primaryName : entry.fundName}
                {entry.fundName && entry.type === "donor" && (
                  <span className="text-gray-400"> · {entry.fundName}</span>
                )}
              </p>
            </div>
            <div className="text-right ml-3 shrink-0">
              <p className="text-xs font-semibold text-gray-700">
                {formatPHP(entry.amount)}
              </p>
              <p className="text-[10px] text-gray-400">{entry.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
