//#region node_modules/.nitro/vite/services/ssr/assets/workflow-store-B5nKZOBb.js
/**
* Lightweight client-side store for the PackWise AI workflow.
* Persists the analysis result so that downstream pages (Attachment Planner,
* Attachment Visualizer, Risk Assessment, Cost & Sustainability) can read it.
*/
var KEY = "packwise_analysis";
var DEMO_RESULT = {
	productName: "Glamour Doll – Sparkle Edition",
	category: "Collectible Doll",
	imageDataUrl: null,
	productType: "Collectible Doll",
	dimensions: "28 × 8 × 5 cm",
	analysedAt: (/* @__PURE__ */ new Date()).toISOString(),
	accessories: [
		"Handbag",
		"Shoes",
		"Glasses",
		"Crown",
		"Dress Stand"
	],
	bodyRegions: [
		"Head / Hair",
		"Torso / Waist",
		"Right Arm",
		"Left Arm",
		"Right Leg",
		"Left Leg"
	],
	attachmentZones: [
		{
			zone: "Hair",
			bodyRegion: "Head / Hair",
			riskLevel: "medium",
			recommendedMethod: "Elastic Strap"
		},
		{
			zone: "Waist",
			bodyRegion: "Torso / Waist",
			riskLevel: "low",
			recommendedMethod: "PET Support"
		},
		{
			zone: "Right Wrist",
			bodyRegion: "Right Arm",
			riskLevel: "high",
			recommendedMethod: "EVA Strap"
		},
		{
			zone: "Left Foot",
			bodyRegion: "Left Leg",
			riskLevel: "low",
			recommendedMethod: "No Attachment Required"
		}
	],
	poseComplexityScore: 82,
	poseStabilityScore: 76,
	movementRiskScore: 44,
	accessoryLossRisk: 61
};
function saveAnalysis(result) {
	try {
		localStorage.setItem(KEY, JSON.stringify(result));
	} catch {}
}
function loadAnalysis() {
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (parsed.retentionZones && !parsed.attachmentZones) parsed.attachmentZones = parsed.retentionZones;
		if (!parsed.attachmentZones || !Array.isArray(parsed.attachmentZones)) return null;
		return parsed;
	} catch {
		return null;
	}
}
//#endregion
export { loadAnalysis as n, saveAnalysis as r, DEMO_RESULT as t };
