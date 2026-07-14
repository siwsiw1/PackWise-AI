/**
 * PackWise AI — Pose Recommendation Engine (Rule-Based)
 *
 * Analyzes current doll skeleton keypoints and recommends the optimal
 * packaging pose to minimize displacement risk, reduce attachment points,
 * and ensure safe transit.
 *
 * Input:  17 COCO keypoints (from YOLOv8 pose) + product metadata
 * Output: Recommended keypoints, adjustment instructions, risk analysis
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Keypoint {
  id: number;
  part: string;
  x: number;
  y: number;
  confidence: number;
}

export interface PoseAdjustment {
  zone: string;
  current: string;
  recommended: string;
  reason: string;
  severity: "low" | "medium" | "high";
  icon: string; // emoji
}

export interface AttachmentPlacement {
  zone: string;
  method: string;
  keypointIndex: number; // which keypoint to anchor to
  offsetX: number; // offset from keypoint (normalized 0-1)
  offsetY: number;
  color: string;
}

export interface PoseRecommendation {
  /** Adjusted keypoints for the recommended pose */
  recommendedKeypoints: Keypoint[];
  /** Human-readable adjustment instructions */
  adjustments: PoseAdjustment[];
  /** Attachment placement positions on the recommended skeleton */
  attachmentPlacements: AttachmentPlacement[];
  /** Overall risk score of current pose (0-100, lower = better) */
  currentPoseRisk: number;
  /** Overall risk score of recommended pose */
  recommendedPoseRisk: number;
  /** Recommended pose name */
  poseName: string;
  /** Detailed text description of the recommendation */
  detailedDescription: string;
}

// ─── COCO skeleton connections ───────────────────────────────────────────────

export const SKELETON_CONNECTIONS: [number, number][] = [
  [0, 1], [0, 2], [1, 3], [2, 4],       // Head
  [5, 6],                                  // Shoulders
  [5, 7], [7, 9],                          // Left arm
  [6, 8], [8, 10],                         // Right arm
  [5, 11], [6, 12],                        // Torso
  [11, 12],                                // Hips
  [11, 13], [13, 15],                      // Left leg
  [12, 14], [14, 16],                      // Right leg
];

export const KEYPOINT_NAMES = [
  "nose", "left_eye", "right_eye", "left_ear", "right_ear",
  "left_shoulder", "right_shoulder", "left_elbow", "right_elbow",
  "left_wrist", "right_wrist", "left_hip", "right_hip",
  "left_knee", "right_knee", "left_ankle", "right_ankle"
];

// ─── Helper math ─────────────────────────────────────────────────────────────

function dist(a: Keypoint, b: Keypoint): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function angle(a: Keypoint, b: Keypoint, c: Keypoint): number {
  const rad = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let deg = Math.abs(rad * 180 / Math.PI);
  if (deg > 180) deg = 360 - deg;
  return deg;
}

function midpoint(a: Keypoint, b: Keypoint): { x: number; y: number } {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// ─── Pose analysis helpers ───────────────────────────────────────────────────

function isArmRaised(shoulder: Keypoint, wrist: Keypoint): boolean {
  return wrist.y < shoulder.y && Math.abs(wrist.y - shoulder.y) > 10;
}

function isArmWide(shoulder: Keypoint, wrist: Keypoint, torsoWidth: number): boolean {
  return Math.abs(wrist.x - shoulder.x) > torsoWidth * 1.5;
}

function isLegSpread(leftAnkle: Keypoint, rightAnkle: Keypoint, hipWidth: number): boolean {
  return Math.abs(leftAnkle.x - rightAnkle.x) > hipWidth * 1.8;
}

function isHeadTilted(nose: Keypoint, shoulderMid: { x: number; y: number }): boolean {
  return Math.abs(nose.x - shoulderMid.x) > 15;
}

function isElbowBent(shoulder: Keypoint, elbow: Keypoint, wrist: Keypoint): boolean {
  const interiorAng = angle(shoulder, elbow, wrist);
  const bendAngle = 180 - interiorAng; // 0 means perfectly straight
  return bendAngle > 40; // If it's bent more than 40 degrees from straight
}

// ─── Recommended pose generator ──────────────────────────────────────────────

function generateRecommendedPose(
  kps: Keypoint[],
  productWeight: number,
  accessoryCount: number,
  hairLength: string,
): { recommended: Keypoint[]; adjustments: PoseAdjustment[] } {
  // Deep copy keypoints
  const rec: Keypoint[] = kps.map(k => ({ ...k }));
  const adj: PoseAdjustment[] = [];

  // Guard: need at least basic keypoints
  if (kps.length < 17) {
    return { recommended: rec, adjustments: [{ zone: "General", current: "Incomplete skeleton", recommended: "Re-scan with better image", reason: "Less than 17 keypoints detected", severity: "high", icon: "⚠️" }] };
  }

  const lShoulder = kps[5], rShoulder = kps[6];
  const lElbow = kps[7], rElbow = kps[8];
  const lWrist = kps[9], rWrist = kps[10];
  const lHip = kps[11], rHip = kps[12];
  const lKnee = kps[13], rKnee = kps[14];
  const lAnkle = kps[15], rAnkle = kps[16];
  const nose = kps[0];

  const shoulderMid = midpoint(lShoulder, rShoulder);
  const hipMid = midpoint(lHip, rHip);
  const torsoWidth = dist(lShoulder, rShoulder);
  const torsoHeight = dist(lShoulder, lHip);
  const hipWidth = dist(lHip, rHip);

  // ── Rule 1: Left arm position ──
  if (isArmRaised(lShoulder, lWrist)) {
    // Move left arm down: wrist at hip level, slightly away from body
    rec[9] = { ...lWrist, x: lHip.x - torsoWidth * 0.3, y: lHip.y };
    rec[7] = { ...lElbow, x: lerp(lShoulder.x, rec[9].x, 0.5), y: lerp(lShoulder.y, rec[9].y, 0.5) };
    adj.push({
      zone: "Left Arm", current: "Arm raised ↑", recommended: "Arm down, close to body ↓",
      reason: "Raised arms increase displacement risk and require extra attachment points. Lowering reduces box size and strap count.",
      severity: "high", icon: "💪"
    });
  } else if (isArmWide(lShoulder, lWrist, torsoWidth)) {
    rec[9] = { ...lWrist, x: lHip.x - torsoWidth * 0.2, y: lHip.y * 0.95 };
    rec[7] = { ...lElbow, x: lerp(lShoulder.x, rec[9].x, 0.5), y: lerp(lShoulder.y, rec[9].y, 0.5) };
    adj.push({
      zone: "Left Arm", current: "Arm extended outward ←", recommended: "Arm closer to body",
      reason: "Wide arm span increases box width and creates protruding limbs that can break during transit.",
      severity: "medium", icon: "💪"
    });
  } else if (isElbowBent(lShoulder, lElbow, lWrist)) {
    const interiorAng = angle(lShoulder, lElbow, lWrist);
    const bendAngle = 180 - interiorAng;
    rec[9] = { ...lWrist, x: lShoulder.x - torsoWidth * 0.15, y: lHip.y };
    rec[7] = { ...lElbow, x: lerp(lShoulder.x, rec[9].x, 0.45), y: lerp(lShoulder.y, rec[9].y, 0.45) };
    adj.push({
      zone: "Left Arm", current: `Elbow bent by ${Math.round(bendAngle)}°`, recommended: "Arm straightened down (0° bend)",
      reason: "Bent elbows protrude from the body and require wrist straps. Straightening reduces attachment count.",
      severity: "low", icon: "💪"
    });
  }

  // ── Rule 2: Right arm position ──
  if (isArmRaised(rShoulder, rWrist)) {
    rec[10] = { ...rWrist, x: rHip.x + torsoWidth * 0.3, y: rHip.y };
    rec[8] = { ...rElbow, x: lerp(rShoulder.x, rec[10].x, 0.5), y: lerp(rShoulder.y, rec[10].y, 0.5) };
    adj.push({
      zone: "Right Arm", current: "Arm raised ↑", recommended: "Arm down, close to body ↓",
      reason: "Raised arms increase displacement risk and require extra attachment points. Lowering reduces box size and strap count.",
      severity: "high", icon: "💪"
    });
  } else if (isArmWide(rShoulder, rWrist, torsoWidth)) {
    rec[10] = { ...rWrist, x: rHip.x + torsoWidth * 0.2, y: rHip.y * 0.95 };
    rec[8] = { ...rElbow, x: lerp(rShoulder.x, rec[10].x, 0.5), y: lerp(rShoulder.y, rec[10].y, 0.5) };
    adj.push({
      zone: "Right Arm", current: "Arm extended outward →", recommended: "Arm closer to body",
      reason: "Wide arm span increases box width and creates protruding limbs that can break during transit.",
      severity: "medium", icon: "💪"
    });
  } else if (isElbowBent(rShoulder, rElbow, rWrist)) {
    const interiorAng = angle(rShoulder, rElbow, rWrist);
    const bendAngle = 180 - interiorAng;
    rec[10] = { ...rWrist, x: rShoulder.x + torsoWidth * 0.15, y: rHip.y };
    rec[8] = { ...rElbow, x: lerp(rShoulder.x, rec[10].x, 0.45), y: lerp(rShoulder.y, rec[10].y, 0.45) };
    adj.push({
      zone: "Right Arm", current: `Elbow bent by ${Math.round(bendAngle)}°`, recommended: "Arm straightened down (0° bend)",
      reason: "Bent elbows protrude from the body and require wrist straps. Straightening reduces attachment count.",
      severity: "low", icon: "💪"
    });
  }

  // ── Rule 3: Leg spread ──
  if (isLegSpread(lAnkle, rAnkle, hipWidth)) {
    const ankleMidX = (lAnkle.x + rAnkle.x) / 2;
    rec[15] = { ...lAnkle, x: ankleMidX - hipWidth * 0.4 };
    rec[16] = { ...rAnkle, x: ankleMidX + hipWidth * 0.4 };
    rec[13] = { ...lKnee, x: lerp(lHip.x, rec[15].x, 0.5) };
    rec[14] = { ...rKnee, x: lerp(rHip.x, rec[16].x, 0.5) };
    adj.push({
      zone: "Legs", current: "Legs spread apart", recommended: "Legs together, parallel",
      reason: "Spread legs require a wider box and additional leg straps. Bringing legs together reduces packaging size by up to 30% and eliminates leg attachment points.",
      severity: "medium", icon: "🦵"
    });
  }

  // ── Rule 4: Head tilt ──
  if (isHeadTilted(nose, shoulderMid)) {
    const tiltDir = nose.x > shoulderMid.x ? "right" : "left";
    rec[0] = { ...nose, x: shoulderMid.x };
    // Adjust eyes and ears proportionally
    const headShift = shoulderMid.x - nose.x;
    for (let i = 1; i <= 4; i++) {
      rec[i] = { ...kps[i], x: kps[i].x + headShift };
    }
    adj.push({
      zone: "Head", current: `Head tilted to ${tiltDir}`, recommended: "Head centered, straight",
      reason: "A tilted head can cause hair tangling with straps and creates uneven weight distribution. Centering ensures symmetrical support.",
      severity: "low", icon: "🗣️"
    });
  }

  // ── Rule 5: Weight-based recommendations ──
  if (productWeight > 200) {
    adj.push({
      zone: "Base", current: `Heavy product (${productWeight}g)`, recommended: "Add base/stand support",
      reason: "Products over 200g need rigid base support (cardboard or PET tray) to prevent sagging and shifting during vertical storage.",
      severity: "high", icon: "⚖️"
    });
  }

  // ── Rule 6: Accessory-based ──
  if (accessoryCount > 3) {
    adj.push({
      zone: "General", current: `${accessoryCount} accessories`, recommended: "Arms close to body, separate accessory tray",
      reason: "Multiple loose accessories increase loss risk. Keep arms close to body and use a separate compartment or blister for accessories.",
      severity: "medium", icon: "👜"
    });
  }

  // ── Rule 7: Hair length ──
  if (hairLength === "Long" || hairLength === "Very Long") {
    adj.push({
      zone: "Hair", current: `${hairLength} hair`, recommended: "Lay hair flat behind head, use soft foam guard",
      reason: "Long hair tangles with straps during assembly. Lay flat behind the head on a smooth surface and avoid head straps crossing hair.",
      severity: "low", icon: "💇"
    });
  }

  // If no adjustments needed, the current pose is already optimal
  if (adj.length === 0) {
    adj.push({
      zone: "Overall", current: "Neutral standing pose", recommended: "No changes needed ✓",
      reason: "The current pose is already optimal for packaging. Arms are down, legs together, head centered.",
      severity: "low", icon: "✅"
    });
  }

  return { recommended: rec, adjustments: adj };
}

// ─── Risk scoring ────────────────────────────────────────────────────────────

function scorePoseRisk(kps: Keypoint[]): number {
  if (kps.length < 17) return 50;

  let risk = 10; // base risk

  const lShoulder = kps[5], rShoulder = kps[6];
  const lWrist = kps[9], rWrist = kps[10];
  const lAnkle = kps[15], rAnkle = kps[16];
  const nose = kps[0];
  const torsoWidth = dist(lShoulder, rShoulder);
  const hipWidth = dist(kps[11], kps[12]);
  const shoulderMid = midpoint(lShoulder, rShoulder);

  if (isArmRaised(lShoulder, lWrist)) risk += 25;
  if (isArmRaised(rShoulder, rWrist)) risk += 25;
  if (isArmWide(lShoulder, lWrist, torsoWidth)) risk += 15;
  if (isArmWide(rShoulder, rWrist, torsoWidth)) risk += 15;
  if (isLegSpread(lAnkle, rAnkle, hipWidth)) risk += 15;
  if (isHeadTilted(nose, shoulderMid)) risk += 5;
  if (isElbowBent(lShoulder, kps[7], lWrist)) risk += 8;
  if (isElbowBent(rShoulder, kps[8], rWrist)) risk += 8;

  return Math.min(100, risk);
}

// ─── Attachment placements ───────────────────────────────────────────────────

function buildAttachmentPlacements(
  xgbData: Record<string, any> | null,
  zonePlan: { zone: string; recommendedMethod: string; action: string }[],
): AttachmentPlacement[] {
  const placements: AttachmentPlacement[] = [];

  const zoneToKeypoint: Record<string, { idx: number; ox: number; oy: number }> = {
    "Head/Hair":     { idx: 0,  ox: 0,    oy: -0.03 },
    "Waist":         { idx: 11, ox: 0.02, oy: 0 },
    "Hands/Wrists":  { idx: 9,  ox: -0.02, oy: 0 },
    "Legs/Feet":     { idx: 15, ox: 0,    oy: 0.02 },
    "Back":          { idx: 6,  ox: 0.03, oy: 0.02 },
    "Base":          { idx: 15, ox: 0,    oy: 0.04 },
  };

  const methodColors: Record<string, string> = {
    "Elastic Strap": "#22c55e",
    "PET Support": "#3b82f6",
    "EVA Strap": "#a855f7",
    "Cardboard Support": "#f59e0b",
    "No Attachment Required": "#6b7280",
  };

  for (const zone of zonePlan) {
    if (zone.action === "Remove" || zone.recommendedMethod === "Not needed" || zone.recommendedMethod === "No Attachment Required") continue;
    const mapping = zoneToKeypoint[zone.zone];
    if (!mapping) continue;

    placements.push({
      zone: zone.zone,
      method: zone.recommendedMethod,
      keypointIndex: mapping.idx,
      offsetX: mapping.ox,
      offsetY: mapping.oy,
      color: methodColors[zone.recommendedMethod] ?? "#22c55e",
    });
  }

  return placements;
}

// ─── Main entry point ────────────────────────────────────────────────────────

export function recommendPose(
  rawKeypoints: any[],
  xgbData: Record<string, any> | null,
  zonePlan: { zone: string; recommendedMethod: string; action: string }[],
  productWeight: number,
  accessoryCount: number,
  hairLength: string,
): PoseRecommendation {
  // Normalize keypoints
  const kps: Keypoint[] = rawKeypoints.map((kp: any, i: number) => ({
    id: kp.id ?? i,
    part: kp.part ?? KEYPOINT_NAMES[i] ?? `pt_${i}`,
    x: kp.x ?? 0,
    y: kp.y ?? 0,
    confidence: kp.confidence ?? 0,
  }));

  const currentRisk = scorePoseRisk(kps);
  const { recommended, adjustments } = generateRecommendedPose(kps, productWeight, accessoryCount, hairLength);
  const recommendedRisk = scorePoseRisk(recommended);
  const attachmentPlacements = buildAttachmentPlacements(xgbData, zonePlan);

  // Determine pose name
  let poseName = "Neutral Standing";
  const hasArmAdj = adjustments.some(a => a.zone.includes("Arm"));
  const hasLegAdj = adjustments.some(a => a.zone === "Legs");
  if (!hasArmAdj && !hasLegAdj) poseName = "Current Pose (Optimal)";
  else if (hasArmAdj && hasLegAdj) poseName = "Compact Neutral Standing";
  else if (hasArmAdj) poseName = "Arms-Down Neutral";
  else if (hasLegAdj) poseName = "Legs-Together Standing";

  // Build detailed description
  const descParts: string[] = [];
  descParts.push(`📋 POSE RECOMMENDATION: "${poseName}"`);
  descParts.push(`Current pose risk score: ${currentRisk}/100 → Recommended: ${recommendedRisk}/100 (${Math.round(((currentRisk - recommendedRisk) / Math.max(currentRisk, 1)) * 100)}% improvement)`);
  descParts.push("");
  descParts.push("ADJUSTMENTS:");
  for (const a of adjustments) {
    descParts.push(`${a.icon} [${a.zone}] ${a.current} → ${a.recommended}`);
    descParts.push(`   Reason: ${a.reason}`);
  }
  if (attachmentPlacements.length > 0) {
    descParts.push("");
    descParts.push("ATTACHMENT PLACEMENTS:");
    for (const p of attachmentPlacements) {
      descParts.push(`🟢 ${p.zone}: ${p.method} (anchored at keypoint ${p.keypointIndex})`);
    }
  }

  return {
    recommendedKeypoints: recommended,
    adjustments,
    attachmentPlacements,
    currentPoseRisk: currentRisk,
    recommendedPoseRisk: recommendedRisk,
    poseName,
    detailedDescription: descParts.join("\n"),
  };
}
