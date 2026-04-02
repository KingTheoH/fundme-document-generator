import type { DonorReceiptData, PayoutReceiptData, Profile } from "./types";
import {
  buildDonorFilename,
  buildPayoutFilename,
  getNextSequence,
  generateReceiptId,
  addHistoryEntry,
} from "./utils";
import type { ReceiptHistoryEntry } from "./types";

export async function exportDonorPdf(
  data: DonorReceiptData,
  profile: Profile,
  previewEl: HTMLElement
): Promise<string> {
  const { default: html2canvas } = await import("html2canvas");
  const { default: jsPDF } = await import("jspdf");

  const canvas = await html2canvas(previewEl, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const maxW = pageWidth - margin * 2;
  const imgRatio = canvas.height / canvas.width;
  const imgH = maxW * imgRatio;

  // If content exceeds one page, paginate
  if (imgH <= pageHeight - margin * 2) {
    pdf.addImage(imgData, "PNG", margin, margin, maxW, imgH);
  } else {
    let yOffset = 0;
    const pageContentH = (pageHeight - margin * 2) * (canvas.width / maxW);
    while (yOffset < canvas.height) {
      if (yOffset > 0) pdf.addPage();
      const sliceH = Math.min(pageContentH, canvas.height - yOffset);
      const sliceCanvas = document.createElement("canvas");
      sliceCanvas.width = canvas.width;
      sliceCanvas.height = sliceH;
      const ctx = sliceCanvas.getContext("2d")!;
      ctx.drawImage(canvas, 0, -yOffset);
      pdf.addImage(sliceCanvas.toDataURL("image/png"), "PNG", margin, margin, maxW, sliceH * (maxW / canvas.width));
      yOffset += sliceH;
    }
  }

  // Consume sequence and record history
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
  const { default: html2canvas } = await import("html2canvas");
  const { default: jsPDF } = await import("jspdf");

  const canvas = await html2canvas(previewEl, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const maxW = pageWidth - margin * 2;
  const imgRatio = canvas.height / canvas.width;
  const imgH = maxW * imgRatio;

  if (imgH <= pageHeight - margin * 2) {
    pdf.addImage(imgData, "PNG", margin, margin, maxW, imgH);
  } else {
    let yOffset = 0;
    const pageContentH = (pageHeight - margin * 2) * (canvas.width / maxW);
    while (yOffset < canvas.height) {
      if (yOffset > 0) pdf.addPage();
      const sliceH = Math.min(pageContentH, canvas.height - yOffset);
      const sliceCanvas = document.createElement("canvas");
      sliceCanvas.width = canvas.width;
      sliceCanvas.height = sliceH;
      const ctx = sliceCanvas.getContext("2d")!;
      ctx.drawImage(canvas, 0, -yOffset);
      pdf.addImage(sliceCanvas.toDataURL("image/png"), "PNG", margin, margin, maxW, sliceH * (maxW / canvas.width));
      yOffset += sliceH;
    }
  }

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
