/**
 * Lightweight client-side store for the PackWise AI workflow.
 * Persists the analysis result so that downstream pages (Attachment Planner,
 * Attachment Visualizer, Risk Assessment, Cost & Sustainability) can read it.
 */

const KEY = "packwise_analysis";

export interface AttachmentZone {
  zone: string;
  bodyRegion: string;
  riskLevel: "low" | "medium" | "high";
  recommendedMethod: string;
}

export interface AnalysisResult {
  // Core identity
  productName: string;
  category: string;
  imageDataUrl: string | null;
  productType: string;
  dimensions: string;
  analysedAt: string;

  // Detected elements
  accessories: string[];
  bodyRegions: string[];
  attachmentZones: AttachmentZone[];

  // Risk & quality scores (0–100)
  poseComplexityScore: number;
  poseStabilityScore: number;
  movementRiskScore: number;
  accessoryLossRisk: number;
}

export const DEMO_RESULT: AnalysisResult = {
  productName: "Glamour Doll – Sparkle Edition",
  category: "Collectible Doll",
  imageDataUrl: null,
  productType: "Collectible Doll",
  dimensions: "28 × 8 × 5 cm",
  analysedAt: new Date().toISOString(),

  accessories: ["Handbag", "Shoes", "Glasses", "Crown", "Dress Stand"],
  bodyRegions: ["Head / Hair", "Torso / Waist", "Right Arm", "Left Arm", "Right Leg", "Left Leg"],

  attachmentZones: [
    { zone: "Hair",        bodyRegion: "Head / Hair",   riskLevel: "medium", recommendedMethod: "Elastic Strap" },
    { zone: "Waist",       bodyRegion: "Torso / Waist", riskLevel: "low",    recommendedMethod: "PET Support" },
    { zone: "Right Wrist", bodyRegion: "Right Arm",     riskLevel: "high",   recommendedMethod: "EVA Strap" },
    { zone: "Left Foot",   bodyRegion: "Left Leg",      riskLevel: "low",    recommendedMethod: "No Attachment Required" },
  ],

  poseComplexityScore: 82,
  poseStabilityScore:  76,
  movementRiskScore:   44,
  accessoryLossRisk:   61,
};

export function saveAnalysis(result: AnalysisResult) {
  try { localStorage.setItem(KEY, JSON.stringify(result)); } catch {}
}

export function loadAnalysis(): AnalysisResult | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Backward compatibility if user has old localStorage state
    if (parsed.retentionZones && !parsed.attachmentZones) {
      parsed.attachmentZones = parsed.retentionZones;
    }
    // Return null to reset if state is still invalid
    if (!parsed.attachmentZones || !Array.isArray(parsed.attachmentZones)) {
      return null;
    }
    return parsed as AnalysisResult;
  } catch { return null; }
}

export function clearAnalysis() {
  try { localStorage.removeItem(KEY); } catch {}
}
