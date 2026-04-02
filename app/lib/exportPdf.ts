import type { DonorReceiptData, PayoutReceiptData, Profile } from "./types";
import {
  buildDonorFilename,
  buildPayoutFilename,
  getNextSequence,
  generateReceiptId,
  addHistoryEntry,
} from "./utils";
import type { ReceiptHistoryEntry } from "./types";

/**
 * Capture element to canvas using html-to-image.
 * Unlike html2canvas, this library uses native browser rendering
 * and correctly handles modern CSS (oklch, lab, etc.) used by Tailwind v4.
 */
async function captureToCanvas(el: HTMLElement): Promise<HTMLCanvasElement> {
  const { toCanvas } = await import("html-to-image");
  return toCanvas(el, {
    pixelRatio: 2,
    backgroundColor: "#ffffff",
    skipFonts: false,
  });
}

async function canvasToPdf(canvas: HTMLCanvasElement) {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const maxW = pageW - margin * 2;
  const imgH = maxW * (canvas.height / canvas.width);
  const imgData = canvas.toDataURL("image/png");

  if (imgH <= pageH - margin * 2) {
    pdf.addImage(imgData, "PNG", margin, margin, maxW, imgH);
  } else {
    let yOffset = 0;
    const sliceHeightPx = Math.floor((pageH - margin * 2) * (canvas.width / maxW));
    while (yOffset < canvas.height) {
      if (yOffset > 0) pdf.addPage();
      const sliceH = Math.min(sliceHeightPx, canvas.height - yOffset);
      const sliceCanvas = document.createElement("canvas");
      sliceCanvas.width = canvas.width;
      sliceCanvas.height = sliceH;
      sliceCanvas.getContext("2d")!.drawImage(canvas, 0, -yOffset);
      pdf.addImage(sliceCanvas.toDataURL("image/png"), "PNG", margin, margin, maxW, sliceH * (maxW / canvas.width));
      yOffset += sliceH;
    }
  }
  return pdf;
}

export async function exportDonorPdf(
  data: DonorReceiptData,
  profile: Profile,
  previewEl: HTMLElement
): Promise<string> {
  const canvas = await captureToCanvas(previewEl);
  const pdf = await canvasToPdf(canvas);

  const seq = getNextSequence("donor");
  const receiptId = data.idMode === "auto"
    ? generateReceiptId("donor", profile.shortCode, data.receiptDate, seq)
    : data.receiptId;

  const filename = buildDonorFilename(
    data.receiptDate,
    profile.shortCode,
    data.donorName,
    data.fundName
  );

  const entry: ReceiptHistoryEntry = {
    id: crypto.randomUUID(),
    type: "donor",
    receiptId,
    date: data.receiptDate,
    primaryName: data.donorName,
    fundName: data.fundName,
    amount: Number(data.netAmount) || 0,
    profileCode: profile.shortCode,
    createdAt: new Date().toISOString(),
  };
  addHistoryEntry(entry);

  pdf.save(filename);
  return filename;
}

export async function exportPayoutPdf(
  data: PayoutReceiptData,
  profile: Profile,
  previewEl: HTMLElement
): Promise<string> {
  const canvas = await captureToCanvas(previewEl);
  const pdf = await canvasToPdf(canvas);

  const seq = getNextSequence("payout");
  const receiptId = data.idMode === "auto"
    ? generateReceiptId("payout", profile.shortCode, data.payoutDate, seq)
    : data.receiptId;

  const filename = buildPayoutFilename(
    data.payoutDate,
    profile.shortCode,
    data.fundName
  );

  const entry: ReceiptHistoryEntry = {
    id: crypto.randomUUID(),
    type: "payout",
    receiptId,
    date: data.payoutDate,
    primaryName: profile.name,
    fundName: data.fundName,
    amount: Number(data.netPayout) || 0,
    profileCode: profile.shortCode,
    createdAt: new Date().toISOString(),
  };
  addHistoryEntry(entry);

  pdf.save(filename);
  return filename;
}
