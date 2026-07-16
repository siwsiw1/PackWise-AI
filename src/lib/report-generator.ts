/**
 * PackWise AI — Shared Engineering Report HTML Generator
 * Used by:
 *   - PE submit page (PDF / print export)
 *   - Manager approval "View Report" (opens in new tab)
 */

export interface ReportSnapshotInput {
  // from ApprovalRequest
  reqId?: string;
  sku?: string;
  engineer?: string;
  date?: string;
  feedback?: string;
  status?: string;

  // from reportSnapshot
  grade?: string;
  overallRisk?: string;
  dropSurvival?: number;
  movementRisk?: number;
  accessoryLoss?: number;
  zones?: Array<{
    zone: string;
    recommendedMethod: string;
    action: string;
    cost: number;
    laborMins: number;
    sustainability: number;
  }>;
  finalRecommendation?: {
    packaging?: string;
    cushion?: string;
    attachment?: string;
    support?: string;
    ista?: string;
    status?: string;
  };
  imageDataUrl?: string;
  annotatedImageDataUrl?: string;
  accessories?: string[];
  detectedPoses?: string[];
}

export function generateReportHtml(data: ReportSnapshotInput): string {
  const risk = (data.overallRisk || "LOW").toUpperCase();
  const grade = data.grade || "B";
  const activeZones = (data.zones || []).filter(
    (z) => z.recommendedMethod !== "No Attachment Required" && z.recommendedMethod !== "Not needed"
  );
  const totalCost   = activeZones.reduce((s, z) => s + (z.cost || 0), 0);
  const totalLabor  = activeZones.reduce((s, z) => s + (z.laborMins || 0), 0);
  const avgSustain  = activeZones.length > 0
    ? Math.round(activeZones.reduce((s, z) => s + (z.sustainability || 100), 0) / activeZones.length)
    : 100;

  const showOriginal  = !!data.imageDataUrl;
  const showAnnotated = !!data.annotatedImageDataUrl && data.annotatedImageDataUrl !== data.imageDataUrl;

  const zonesHtml = (data.zones || [])
    .map((z) => `<tr>
      <td><strong>${z.zone}</strong></td>
      <td>${z.recommendedMethod}</td>
      <td>${z.action}</td>
      <td>$${Number(z.cost || 0).toFixed(2)}</td>
      <td>${z.laborMins || 0} min</td>
      <td>${z.sustainability || 0}%</td>
    </tr>`).join("");

  const rec = data.finalRecommendation || {};
  const runId = `PW-${data.reqId || "RPT"}-${Date.now().toString(36).toUpperCase()}`;
  const generatedAt = new Date().toLocaleString("en-US", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const statusBannerHtml = data.status && data.status !== "Pending"
    ? `<div class="status-banner ${data.status === "Approved" ? "status-approved" : "status-rejected"}">
        <span class="status-icon">${data.status === "Approved" ? "✓" : "✗"}</span>
        <div>
          <strong>${data.status === "Approved" ? "Plan Approved" : "Plan Rejected"}</strong>
          ${data.feedback ? `<div class="status-feedback">"${data.feedback}"</div>` : ""}
        </div>
       </div>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PackWise AI — Engineering Report ${runId}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Inter','Segoe UI',sans-serif;
    color: #1e293b;
    background: #f8fafc;
    font-size: 13px;
    line-height: 1.6;
  }

  /* ── Layout ── */
  .wrapper { max-width: 960px; margin: 0 auto; padding: 32px 24px 64px; }

  /* ── Header ── */
  .header {
    display: flex; justify-content: space-between; align-items: flex-end;
    padding-bottom: 20px; border-bottom: 3px solid #ec4899; margin-bottom: 28px;
  }
  .header h1 { font-size: 22px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; }
  .header p  { font-size: 12px; color: #64748b; margin-top: 4px; }
  .header-meta { text-align: right; font-size: 11px; color: #94a3b8; line-height: 1.9; font-family: monospace; }

  /* ── Status Banner ── */
  .status-banner {
    display: flex; align-items: flex-start; gap: 14px;
    padding: 14px 18px; border-radius: 10px; margin-bottom: 24px;
    font-size: 13px; font-weight: 600;
  }
  .status-approved { background: #d1fae5; border: 1px solid #6ee7b7; color: #065f46; }
  .status-rejected { background: #fee2e2; border: 1px solid #fca5a5; color: #991b1b; }
  .status-icon { font-size: 20px; line-height: 1; }
  .status-feedback { font-weight: 400; font-style: italic; margin-top: 4px; opacity: 0.85; }

  /* ── Dashboard row ── */
  .dash { display: grid; grid-template-columns: 160px 1fr; gap: 20px; margin-bottom: 28px; }
  .grade-card {
    background: linear-gradient(135deg,#fdf2f8,#fce7f3);
    border: 1px solid #fbcfe8; border-radius: 14px;
    padding: 22px; display: flex; flex-direction: column;
    align-items: center; gap: 8px; text-align: center;
  }
  .grade-letter { font-size: 56px; font-weight: 900; color: #ec4899; line-height: 1; }
  .grade-sub { font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; }

  .badge { display: inline-block; padding: 4px 12px; border-radius: 99px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }
  .badge-low    { background: #d1fae5; color: #065f46; }
  .badge-medium { background: #fef3c7; color: #92400e; }
  .badge-high   { background: #fee2e2; color: #991b1b; }

  .metrics { display: grid; grid-template-columns: repeat(2,1fr); gap: 12px; }
  .mc { background: #fff; border: 1px solid #f1f5f9; border-radius: 10px; padding: 14px 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
  .mc-lbl { font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #be185d; font-weight: 700; margin-bottom: 4px; }
  .mc-val { font-size: 22px; font-weight: 900; color: #0f172a; }
  .mc-unit { font-size: 12px; color: #94a3b8; font-weight: 500; }

  /* ── Sections ── */
  .section { background: #fff; border: 1px solid #f1f5f9; border-radius: 12px; padding: 20px 22px; margin-bottom: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
  .stitle { font-size: 10px; font-weight: 900; color: #ec4899; text-transform: uppercase; letter-spacing: 0.14em; padding-bottom: 10px; border-bottom: 1px solid #fce7f3; margin-bottom: 16px; }

  /* ── Key-Value grid ── */
  .kv { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
  .ki { padding: 10px 12px; background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 8px; }
  .ki-lbl { font-size: 9px; text-transform: uppercase; letter-spacing: 0.07em; color: #94a3b8; font-weight: 700; margin-bottom: 3px; }
  .ki-val { font-size: 13px; font-weight: 600; color: #0f172a; }

  /* ── Photos ── */
  .photo-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 14px; }
  .photo-box { border: 1px solid #fce7f3; border-radius: 10px; overflow: hidden; }
  .photo-lbl { font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #be185d; font-weight: 700; padding: 8px 12px; border-bottom: 1px solid #fce7f3; background: #fdf2f8; }
  .photo-box img { width: 100%; max-height: 240px; object-fit: contain; display: block; background: #fff; padding: 8px; }

  /* ── Table ── */
  table { width: 100%; border-collapse: collapse; }
  th { background: #fdf2f8; color: #be185d; font-weight: 700; font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; padding: 10px 12px; text-align: left; border-bottom: 2px solid #fbcfe8; }
  td { padding: 10px 12px; border-bottom: 1px solid #f8fafc; color: #334155; vertical-align: top; font-size: 13px; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: #fdf2f8; }

  /* ── Recommendation ── */
  .rec { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; }
  .ri { background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 8px; padding: 12px 14px; }
  .ri-lbl { font-size: 9px; text-transform: uppercase; letter-spacing: 0.08em; color: #be185d; font-weight: 700; margin-bottom: 4px; }
  .ri-val { font-size: 13px; font-weight: 700; color: #831843; }

  /* ── Footer ── */
  .footer { margin-top: 36px; padding-top: 16px; border-top: 1px solid #fce7f3; display: flex; justify-content: space-between; font-size: 11px; color: #94a3b8; }

  /* ── Print button (hidden when printing) ── */
  .print-bar {
    position: sticky; top: 0; z-index: 10;
    background: #fff; border-bottom: 1px solid #f1f5f9;
    padding: 10px 24px; display: flex; align-items: center; justify-content: space-between;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }
  .print-bar span { font-size: 13px; font-weight: 600; color: #0f172a; }
  .btn-print {
    background: #ec4899; color: #fff; border: none; border-radius: 8px;
    padding: 8px 20px; font-size: 13px; font-weight: 700; cursor: pointer;
    display: flex; align-items: center; gap: 8px;
  }
  .btn-print:hover { background: #db2777; }
  @media print {
    .print-bar { display: none; }
    body { background: #fff; }
    .wrapper { padding: 0; }
  }
</style>
</head>
<body>

<!-- Sticky toolbar (hidden on print) -->
<div class="print-bar">
  <span>📦 PackWise AI — Engineering Report · ${runId}</span>
  <button class="btn-print" onclick="window.print()">🖨️ Save as PDF / Print</button>
</div>

<div class="wrapper">

  <!-- Header -->
  <div class="header">
    <div>
      <h1>PackWise AI &mdash; Engineering Report</h1>
      <p>${data.sku || "Packaging Plan"} &nbsp;&middot;&nbsp; Submitted by ${data.engineer || "Packaging Engineer"} &nbsp;&middot;&nbsp; ${data.date || generatedAt}</p>
    </div>
    <div class="header-meta">
      <div>RUN ID: ${runId}</div>
      <div>Generated: ${generatedAt}</div>
    </div>
  </div>

  ${statusBannerHtml}

  <!-- Grade + Key Metrics -->
  <div class="dash">
    <div class="grade-card">
      <div class="grade-letter">${grade}</div>
      <div class="grade-sub">AI Readiness</div>
      <div class="badge badge-${risk.toLowerCase()}">${risk} RISK</div>
    </div>
    <div class="metrics">
      <div class="mc"><div class="mc-lbl">Packaging Cost</div><div class="mc-val">$${totalCost.toFixed(2)}</div></div>
      <div class="mc"><div class="mc-lbl">Labor Time</div><div class="mc-val">${totalLabor}<span class="mc-unit"> min</span></div></div>
      <div class="mc"><div class="mc-lbl">Drop Survival</div><div class="mc-val">${data.dropSurvival ?? 0}<span class="mc-unit">/100</span></div></div>
      <div class="mc"><div class="mc-lbl">Sustainability</div><div class="mc-val">${avgSustain}<span class="mc-unit">%</span></div></div>
      <div class="mc"><div class="mc-lbl">Movement Risk</div><div class="mc-val">${data.movementRisk ?? 0}<span class="mc-unit">%</span></div></div>
      <div class="mc"><div class="mc-lbl">Accessory Loss</div><div class="mc-val">${data.accessoryLoss ?? 0}<span class="mc-unit">%</span></div></div>
    </div>
  </div>

  <!-- CV / Images -->
  ${(showOriginal || showAnnotated) ? `
  <div class="section">
    <div class="stitle">Computer Vision Analysis</div>
    <div class="photo-row">
      ${showOriginal ? `<div class="photo-box"><div class="photo-lbl">Detected Product Image</div><img src="${data.imageDataUrl}" alt="Original"/></div>` : ""}
      ${showAnnotated ? `<div class="photo-box"><div class="photo-lbl">YOLOv8 Skeleton &amp; Zones</div><img src="${data.annotatedImageDataUrl}" alt="Annotated"/></div>` : ""}
    </div>
    <div class="kv">
      <div class="ki"><div class="ki-lbl">Detected Poses</div><div class="ki-val">${(data.detectedPoses || []).join(", ") || "—"}</div></div>
      <div class="ki"><div class="ki-lbl">Accessories Detected</div><div class="ki-val">${(data.accessories || []).join(", ") || "None"}</div></div>
    </div>
  </div>` : ""}

  <!-- Attachment Plan -->
  ${zonesHtml ? `
  <div class="section">
    <div class="stitle">DFA / MTM Attachment Plan</div>
    <table>
      <thead><tr><th>Zone</th><th>Recommended Method</th><th>Action</th><th>Cost / Unit</th><th>Labor</th><th>Eco %</th></tr></thead>
      <tbody>${zonesHtml}</tbody>
    </table>
  </div>` : ""}

  <!-- Final Recommendation -->
  ${rec.packaging ? `
  <div class="section">
    <div class="stitle">Final Implementation Recommendation</div>
    <div class="rec">
      <div class="ri"><div class="ri-lbl">Packaging</div><div class="ri-val">${rec.packaging || "—"}</div></div>
      <div class="ri"><div class="ri-lbl">Cushion</div><div class="ri-val">${rec.cushion || "—"}</div></div>
      <div class="ri"><div class="ri-lbl">Attachment</div><div class="ri-val">${rec.attachment || "—"}</div></div>
      <div class="ri"><div class="ri-lbl">Support</div><div class="ri-val">${rec.support || "—"}</div></div>
      <div class="ri"><div class="ri-lbl">ISTA Standard</div><div class="ri-val">${rec.ista || "—"}</div></div>
      <div class="ri"><div class="ri-lbl">Status</div><div class="ri-val" style="color:#ec4899;">&#10004; ${rec.status || "READY"}</div></div>
    </div>
  </div>` : ""}

  <!-- Footer -->
  <div class="footer">
    <div>PackWise AI &middot; Powered by YOLOv8 &amp; Expert System</div>
    <div>Strictly Confidential &middot; Internal Engineering Document</div>
  </div>

</div>
</body>
</html>`;
}

/** Opens the report in a new browser tab (no print dialog) */
export function openReportInNewTab(data: ReportSnapshotInput): void {
  if (typeof window === "undefined") return;
  const html = generateReportHtml(data);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url  = URL.createObjectURL(blob);
  const tab  = window.open(url, "_blank");
  if (tab) {
    tab.addEventListener("load", () => URL.revokeObjectURL(url), { once: true });
  } else {
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }
}

/** Opens the print dialog directly (used by PE submit page) */
export function printReport(data: ReportSnapshotInput): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  const html   = generateReportHtml(data);
  const iframe = document.createElement("iframe");
  iframe.style.cssText = "position:fixed;width:0;height:0;border:0;left:-9999px;top:0;visibility:hidden;";
  document.body.appendChild(iframe);
  const doc = iframe.contentWindow?.document;
  if (!doc) { document.body.removeChild(iframe); return; }
  doc.open(); doc.write(html); doc.close();
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch {
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url  = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    }
    setTimeout(() => {
      if (document.body.contains(iframe)) document.body.removeChild(iframe);
    }, 1500);
  }, 1000);
}
