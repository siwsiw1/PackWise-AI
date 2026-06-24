import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { B as ChevronRight, D as Image, G as Brain, R as CircleCheck, a as Upload, d as ShieldAlert, g as RotateCcw, h as Ruler, l as Sparkles, m as ScanLine, o as TriangleAlert, t as Zap } from "../_libs/lucide-react.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as PageHeader } from "./page-header-CpKc4QBw.mjs";
import { r as saveAnalysis } from "./workflow-store-B5nKZOBb.mjs";
import { t as Progress } from "./progress-DOIEKRJF.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.product-analysis-YYcST0Y-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CATEGORIES = [
	"Collectible Doll",
	"Fashion Doll",
	"Action Figure",
	"Plush Toy",
	"Playset",
	"Electronic Toy",
	"Other"
];
var WORKFLOW_STEPS = [
	{
		label: "Pose & Doll Analysis",
		active: true
	},
	{
		label: "Attachment Planner",
		active: false
	},
	{
		label: "Attachment Visualizer",
		active: false
	},
	{
		label: "Risk Assessment",
		active: false
	},
	{
		label: "Cost & Sustainability",
		active: false
	}
];
var ANALYSIS_STEPS = [
	"Detecting doll body regions",
	"Mapping pose geometry",
	"Identifying accessories",
	"Estimating attachment zones",
	"Computing movement risk",
	"Predicting accessory loss risk"
];
var RISK_COLOR = {
	low: "bg-[color:var(--success)]/10 text-[color:var(--success)] border-transparent",
	medium: "bg-[color:var(--warning)]/15 text-[color:var(--warning-foreground)] border-transparent",
	high: "bg-destructive/10 text-destructive border-transparent"
};
var RISK_DOT = {
	low: "bg-[color:var(--success)]",
	medium: "bg-[color:var(--warning)]",
	high: "bg-destructive"
};
function WorkflowBar({ steps }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center rounded-xl border border-border/70 bg-muted/30 px-4 py-3",
		children: steps.map((s, i, arr) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${s.active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`,
					children: i + 1
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `hidden text-[9px] font-medium sm:block ${s.active ? "text-primary" : "text-muted-foreground"}`,
					children: s.label
				})]
			}), i < arr.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `mx-1 h-px flex-1 ${s.active ? "bg-primary" : "bg-border"}` })]
		}, s.label))
	});
}
function ScoreBar({ label, value, color }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-between text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted-foreground",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-semibold",
				children: value
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-1.5 w-full overflow-hidden rounded-full bg-muted",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `h-full rounded-full ${color}`,
				style: { width: `${value}%` }
			})
		})]
	});
}
function ProductAnalysisPage() {
	const navigate = useNavigate();
	const fileRef = (0, import_react.useRef)(null);
	const [stage, setStage] = (0, import_react.useState)("form");
	const [productName, setProductName] = (0, import_react.useState)("");
	const [sku, setSku] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)(CATEGORIES[0]);
	const [imageFile, setImageFile] = (0, import_react.useState)(null);
	const [imageDataUrl, setImageDataUrl] = (0, import_react.useState)(null);
	const [progress, setProgress] = (0, import_react.useState)(0);
	const [result, setResult] = (0, import_react.useState)(null);
	const handleFile = (f) => {
		setImageFile(f);
		const reader = new FileReader();
		reader.onload = (ev) => setImageDataUrl(ev.target?.result);
		reader.readAsDataURL(f);
	};
	const handleAnalyse = () => {
		if (!productName.trim()) return;
		setStage("analysing");
		setProgress(0);
		[
			15,
			32,
			50,
			66,
			82,
			100
		].forEach((p, i) => setTimeout(() => setProgress(p), (i + 1) * 520));
		setTimeout(() => {
			const r = {
				productName: productName.trim(),
				category,
				imageDataUrl,
				productType: category,
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
			saveAnalysis(r);
			setResult(r);
			setStage("results");
		}, 3600);
	};
	const handleReset = () => {
		setStage("form");
		setProductName("");
		setSku("");
		setCategory(CATEGORIES[0]);
		setImageFile(null);
		setImageDataUrl(null);
		setProgress(0);
		setResult(null);
	};
	if (stage === "form") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Pose & Doll Analysis",
				description: "Upload a doll image and enter product details — PackWise AI will detect body regions, attachment zones, and risk scores.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					variant: "outline",
					className: "border-border/70 font-normal",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mr-1 h-3 w-3 text-primary" }), "AI-Powered"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkflowBar, { steps: WORKFLOW_STEPS }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5 lg:col-span-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "border-border/70 shadow-none",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-base",
								children: "Product Details"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Enter the product information to identify the packaging context." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-4 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "product-name",
											children: "Product Name"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "product-name",
											placeholder: "e.g. Glamour Doll – Sparkle Edition",
											value: productName,
											onChange: (e) => setProductName(e.target.value)
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "product-sku",
											children: "SKU / Product Code"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "product-sku",
											placeholder: "e.g. GD-SPK-2025",
											value: sku,
											onChange: (e) => setSku(e.target.value)
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "product-category",
										children: "Product Category"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										id: "product-category",
										value: category,
										onChange: (e) => setCategory(e.target.value),
										className: "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring",
										children: CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: c,
											children: c
										}, c))
									})]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "border-border/70 shadow-none",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-base",
								children: "Doll Image"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Upload a clear front-facing photo. AI will detect body regions and pose geometry." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								onClick: () => fileRef.current?.click(),
								onDrop: (e) => {
									e.preventDefault();
									const f = e.dataTransfer.files?.[0];
									if (f?.type.startsWith("image/")) handleFile(f);
								},
								onDragOver: (e) => e.preventDefault(),
								className: "relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/70 bg-muted/30 px-6 py-12 text-center transition hover:border-primary/50 hover:bg-[color:var(--primary-soft)]/30",
								children: [imageDataUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: imageDataUrl,
									alt: "Preview",
									className: "max-h-48 rounded-lg object-contain"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--primary-soft)] text-primary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-6 w-6" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-3 text-sm font-medium",
										children: ["Drop your image here, or ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-primary underline underline-offset-2",
											children: "browse"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: "PNG, JPG, WEBP up to 10 MB"
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									ref: fileRef,
									type: "file",
									accept: "image/*",
									className: "hidden",
									onChange: (e) => {
										const f = e.target.files?.[0];
										if (f) handleFile(f);
									}
								})]
							}), imageFile && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mr-1 inline h-3.5 w-3.5 text-[color:var(--success)]" }),
									imageFile.name,
									" ready for analysis"
								]
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "lg",
							className: "w-full",
							onClick: handleAnalyse,
							disabled: !productName.trim(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanLine, { className: "h-4 w-4" }), " Run Pose & Doll Analysis"]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border/70 shadow-none bg-[color:var(--primary-soft)]/40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-base mt-2",
							children: "What AI detects"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
							className: "space-y-3",
							children: [
								{
									icon: ScanLine,
									label: "Body Regions",
									desc: "Head, torso, arms, legs — 6 primary zones mapped"
								},
								{
									icon: Zap,
									label: "Attachment Zones",
									desc: "Specific points where attachment elements are required"
								},
								{
									icon: Ruler,
									label: "Pose Complexity",
									desc: "0–100 score based on pose geometry and risk factors"
								},
								{
									icon: ShieldAlert,
									label: "Movement Risk",
									desc: "Probability of pose distortion during shipping & display"
								},
								{
									icon: TriangleAlert,
									label: "Accessory Loss Risk",
									desc: "Predicted loss probability per detected accessory"
								}
							].map(({ icon: Icon, label, desc }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold",
									children: label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: desc
								})] })]
							}, label))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "border-border/70 shadow-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
								children: "Recent Analyses"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 space-y-2",
								children: [
									{
										name: "Glamour Doll Ltd. Ed.",
										zones: 4,
										risk: "medium"
									},
									{
										name: "Action Hero Series 7",
										zones: 3,
										risk: "high"
									},
									{
										name: "Princess Castle Playset",
										zones: 6,
										risk: "low"
									}
								].map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-foreground truncate",
										children: a.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 shrink-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											variant: "secondary",
											className: "text-[10px]",
											children: [a.zones, " zones"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-1.5 w-1.5 rounded-full ${RISK_DOT[a.risk]}` })]
									})]
								}, a.name))
							})]
						})
					})]
				})]
			})
		]
	});
	if (stage === "analysing") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Pose & Doll Analysis",
				description: "AI is processing your doll image — this takes about 3 seconds."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkflowBar, { steps: WORKFLOW_STEPS }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-[55vh] flex-col items-center justify-center gap-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex h-24 w-24 items-center justify-center rounded-full bg-[color:var(--primary-soft)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanLine, { className: "h-10 w-10 animate-pulse text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 animate-ping rounded-full bg-primary/10" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-full max-w-md space-y-4 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xl font-semibold",
								children: "Analysing doll pose…"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Detecting body regions, mapping attachment zones, and computing risk scores."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
								value: progress,
								className: "h-2"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [progress, "% complete"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-3 sm:grid-cols-3",
						children: ANALYSIS_STEPS.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `flex items-center gap-2 rounded-lg border border-border/70 px-3 py-2 text-xs transition ${progress >= (i + 1) * 16 ? "border-[color:var(--success)]/40 bg-[color:var(--success)]/5 text-[color:var(--success)]" : "text-muted-foreground"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5 shrink-0" }), step]
						}, step))
					})
				]
			})
		]
	});
	if (!result) return null;
	const riskLabel = (s) => s < 35 ? "Low" : s < 65 ? "Medium" : "High";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Pose & Doll Analysis",
				description: `Analysis complete for: ${result.productName}`,
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: handleReset,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4" }), " New Analysis"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkflowBar, { steps: [{
				label: "Pose & Doll Analysis",
				active: true
			}, ...WORKFLOW_STEPS.slice(1)] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					{
						label: "Pose Complexity",
						value: `${result.poseComplexityScore}/100`,
						sub: result.poseComplexityScore > 70 ? "High complexity" : "Moderate",
						color: "text-[color:var(--warning-foreground)]"
					},
					{
						label: "Movement Risk",
						value: `${result.movementRiskScore}/100`,
						sub: riskLabel(result.movementRiskScore),
						color: result.movementRiskScore >= 65 ? "text-destructive" : result.movementRiskScore >= 35 ? "text-[color:var(--warning-foreground)]" : "text-[color:var(--success)]"
					},
					{
						label: "Accessory Loss Risk",
						value: `${result.accessoryLossRisk}/100`,
						sub: riskLabel(result.accessoryLossRisk),
						color: result.accessoryLossRisk >= 65 ? "text-destructive" : result.accessoryLossRisk >= 35 ? "text-[color:var(--warning-foreground)]" : "text-[color:var(--success)]"
					},
					{
						label: "Pose Stability",
						value: `${result.poseStabilityScore}/100`,
						sub: result.poseStabilityScore >= 80 ? "Good" : "Needs improvement",
						color: result.poseStabilityScore >= 80 ? "text-[color:var(--success)]" : "text-[color:var(--warning-foreground)]"
					}
				].map(({ label, value, sub, color }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "border-border/70 shadow-none",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
								children: label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: `mt-1 text-2xl font-bold tracking-tight ${color}`,
								children: value
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-xs text-muted-foreground",
								children: sub
							})
						]
					})
				}, label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 lg:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "border-border/70 shadow-none",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-base",
								children: "Product Preview"
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [imageDataUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: imageDataUrl,
								alt: result.productName,
								className: "w-full rounded-lg object-contain max-h-56"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-48 items-center justify-center rounded-lg bg-[color:var(--primary-soft)]/40",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "mx-auto h-10 w-10 text-primary/40" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-xs text-muted-foreground",
											children: "No image uploaded"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Analysed from product data"
										})
									]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold",
										children: result.productName
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [
											result.category,
											" · ",
											result.dimensions
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: ["Analysed ", new Date(result.analysedAt).toLocaleString()]
									})
								]
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "border-border/70 shadow-none",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-base",
								children: "Detected Accessories"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, { children: [result.accessories.length, " items identified — see accessory loss risk below"] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: result.accessories.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									className: "bg-[color:var(--primary-soft)] text-primary",
									children: a
								}, a))
							}) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "border-border/70 shadow-none",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-base",
								children: "Detected Body Regions"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, { children: [result.bodyRegions.length, " regions mapped"] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: result.bodyRegions.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "border-border/70 text-xs font-normal",
									children: r
								}, r))
							}) })]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 lg:col-span-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "border-border/70 shadow-none",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-base",
								children: "Attachment Zones"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "AI-identified zones requiring attachment elements, sorted by risk level." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-3",
								children: result.attachmentZones.map((z) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 rounded-lg border border-border/60 p-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-2.5 w-2.5 shrink-0 rounded-full ${RISK_DOT[z.riskLevel]}` }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1 min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm font-semibold",
													children: z.zone
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
													variant: "outline",
													className: `text-[10px] font-medium ${RISK_COLOR[z.riskLevel]}`,
													children: [z.riskLevel, " risk"]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: z.bodyRegion
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-right shrink-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-medium text-foreground",
												children: z.recommendedMethod
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] text-muted-foreground",
												children: "AI recommended"
											})]
										})
									]
								}, z.zone))
							}) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "border-border/70 shadow-none",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-base",
								children: "Score Breakdown"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "AI-computed scores across pose quality dimensions." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreBar, {
										label: "Pose Complexity",
										value: result.poseComplexityScore,
										color: "bg-[color:var(--warning)]"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreBar, {
										label: "Movement Risk",
										value: result.movementRiskScore,
										color: "bg-[color:var(--chart-3)]"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreBar, {
										label: "Accessory Loss Risk",
										value: result.accessoryLossRisk,
										color: "bg-[color:var(--chart-4)]"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreBar, {
										label: "Pose Stability",
										value: result.poseStabilityScore,
										color: "bg-[color:var(--success)]"
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "border-[color:var(--primary)]/20 bg-[color:var(--primary-soft)]/30 shadow-none",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, { className: "h-3.5 w-3.5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
									className: "text-base",
									children: "AI Insights"
								})]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
								className: "space-y-3",
								children: [
									{
										level: "high",
										text: "High movement risk at Right Wrist — elevated pose angle increases displacement probability. EVA strap recommended."
									},
									{
										level: "medium",
										text: "Hair zone shows medium risk due to styling height. Elastic strap will maintain pose without damaging styling texture."
									},
									{
										level: "low",
										text: "Waist region is geometrically stable. PET support provides sufficient attachment at minimal material cost."
									},
									{
										level: "medium",
										text: "Crown accessory has 81% predicted loss risk. Consider dedicated blister support or compartment for this item."
									}
								].map((ins, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2.5 rounded-lg border border-border/60 bg-background p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `mt-0.5 h-2 w-2 shrink-0 rounded-full ${RISK_DOT[ins.level]}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs leading-relaxed text-foreground",
										children: ins.text
									})]
								}, i))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "border-[color:var(--primary)]/30 bg-[color:var(--primary-soft)]/50 shadow-none",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "flex items-center justify-between gap-4 p-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold",
									children: "Ready to generate an attachment plan?"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-0.5 text-xs text-muted-foreground",
									children: "AI will assign an attachment method to each identified zone."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									onClick: () => navigate({ to: "/app/packaging-planner" }),
									className: "shrink-0",
									children: ["Attachment Planner ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })]
								})]
							})
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { ProductAnalysisPage as component };
