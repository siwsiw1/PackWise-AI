import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { B as ChevronRight, G as Brain, M as Eye, R as CircleCheck, Y as ArrowLeft, l as Sparkles } from "../_libs/lucide-react.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CtX3ithx.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as PageHeader } from "./page-header-CpKc4QBw.mjs";
import { n as loadAnalysis, t as DEMO_RESULT } from "./workflow-store-B5nKZOBb.mjs";
import { _ as Legend, d as Bar, f as RadialBar, g as Tooltip, h as ResponsiveContainer, i as BarChart, o as YAxis, s as XAxis, t as RadialBarChart, u as CartesianGrid } from "../_libs/recharts+[...].mjs";
import { t as Progress } from "./progress-DOIEKRJF.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { t as ATTACHMENT_METHODS } from "./mock-data-CDSDiqKg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.packaging-planner-DgRAEBD5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var WORKFLOW_STEPS = [
	{
		label: "Pose & Doll Analysis",
		active: false
	},
	{
		label: "Attachment Planner",
		active: true
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
var ZONE_PLAN = [
	{
		zone: "Hair",
		method: "Elastic Strap",
		cost: .08,
		labor: "Low",
		sustainability: 68,
		stability: 85,
		riskReduction: 62
	},
	{
		zone: "Waist",
		method: "PET Support",
		cost: .18,
		labor: "Medium",
		sustainability: 78,
		stability: 94,
		riskReduction: 81
	},
	{
		zone: "Right Wrist",
		method: "EVA Strap",
		cost: .12,
		labor: "Low",
		sustainability: 82,
		stability: 90,
		riskReduction: 74
	},
	{
		zone: "Left Foot",
		method: "No Attachment Required",
		cost: 0,
		labor: "None",
		sustainability: 100,
		stability: 100,
		riskReduction: 0
	}
];
var comparisonData = ATTACHMENT_METHODS.map((m) => ({
	name: m.method.replace(" Support", "").replace(" Strap", " Str."),
	stability: m.poseStability,
	sustainability: m.sustainability,
	riskReduction: m.riskReduction
}));
var radialData = [
	{
		name: "Pose Quality",
		value: 88,
		fill: "var(--color-chart-1)"
	},
	{
		name: "Drop Test",
		value: 84,
		fill: "var(--color-chart-2)"
	},
	{
		name: "Cost Score",
		value: 72,
		fill: "var(--color-chart-3)"
	},
	{
		name: "Sustain.",
		value: 80,
		fill: "var(--color-chart-4)"
	}
];
function WorkflowBar({ steps }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center rounded-xl border border-border/70 bg-muted/30 px-4 py-3",
		children: steps.map((s, i, arr) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${s.active ? "bg-primary text-primary-foreground" : i < steps.findIndex((x) => x.active) ? "bg-[color:var(--success)] text-white" : "bg-muted text-muted-foreground"}`,
					children: i < steps.findIndex((x) => x.active) ? "✓" : i + 1
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `hidden text-[9px] font-medium sm:block ${s.active ? "text-primary" : "text-muted-foreground"}`,
					children: s.label
				})]
			}), i < arr.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `mx-1 h-px flex-1 ${i < steps.findIndex((x) => x.active) ? "bg-[color:var(--success)]" : s.active ? "bg-primary" : "bg-border"}` })]
		}, s.label))
	});
}
function AttachmentPlannerPage() {
	const navigate = useNavigate();
	const [analysis, setAnalysis] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setAnalysis(loadAnalysis() ?? DEMO_RESULT);
	}, []);
	const productName = analysis?.productName ?? "Glamour Doll – Sparkle Edition";
	const zones = analysis?.attachmentZones ?? DEMO_RESULT.attachmentZones;
	const totalCost = ZONE_PLAN.reduce((s, z) => s + z.cost, 0).toFixed(2);
	const avgStability = Math.round(ZONE_PLAN.filter((z) => z.stability < 100).reduce((s, z, _, a) => s + z.stability / a.length, 0));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Attachment Planner",
				description: `AI-recommended attachment methods for each attachment zone — ${productName}`,
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: () => navigate({ to: "/app/product-analysis" }),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Back to Analysis"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					onClick: () => navigate({ to: "/app/packaging-preview" }),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" }), " View Visualizer"]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkflowBar, { steps: WORKFLOW_STEPS }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "border-[color:var(--primary)]/30 bg-gradient-to-br from-[color:var(--primary-soft)] to-[color:var(--primary-soft)]/20 shadow-none",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-4 md:flex-row md:items-center md:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										className: "bg-primary/20 text-primary border-primary/30 text-xs",
										children: "AI Recommended Plan"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-xl font-semibold",
									children: "Mixed Attachment Strategy"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: "EVA strap at high-risk wrist zone, PET support at waist — optimized for pose quality and sustainability balance."
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-3 gap-6",
							children: [
								{
									label: "Avg. Pose Stability",
									value: `${avgStability}%`
								},
								{
									label: "Total Cost / Unit",
									value: `$${totalCost}`
								},
								{
									label: "Zones Covered",
									value: `${zones.length}`
								}
							].map(({ label, value }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
									children: label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-lg font-bold text-foreground",
									children: value
								})]
							}, label))
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					{
						label: "Avg. Pose Stability",
						value: `${avgStability}%`,
						hint: "Across retained zones"
					},
					{
						label: "Total Cost / Unit",
						value: `$${totalCost}`,
						hint: "All attachment elements"
					},
					{
						label: "Est. Labor Time",
						value: "2.3 min",
						hint: "Per unit on production line"
					},
					{
						label: "Sustainability Score",
						value: "78/100",
						hint: "Weighted by material usage"
					}
				].map(({ label, value, hint }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "border-border/70 shadow-none",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
								children: label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-2xl font-bold tracking-tight text-foreground",
								children: value
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-xs text-muted-foreground",
								children: hint
							})
						]
					})
				}, label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border/70 shadow-none",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "flex flex-row items-center justify-between space-y-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: "Zone-by-Zone Attachment Plan"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "AI-assigned attachment method for each identified attachment zone" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						className: "border-border/70 text-xs font-normal",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, { className: "mr-1 h-3 w-3" }), " AI Generated"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Zone" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Method" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Cost/Unit"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Labor"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Sustainability"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Pose Stability"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Risk Reduction"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: ZONE_PLAN.map((z) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "font-medium",
						children: z.zone
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2",
						children: z.method === "No Attachment Required" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm text-muted-foreground italic",
							children: z.method
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							className: "bg-[color:var(--success)]/10 text-[color:var(--success)] border-transparent text-[10px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mr-1 h-2.5 w-2.5" }), " Recommended"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-medium",
							children: z.method
						})] })
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right tabular-nums font-medium",
						children: z.cost === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "—"
						}) : `$${z.cost.toFixed(2)}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: `text-[10px] font-normal border-border/70 ${z.labor === "None" ? "text-muted-foreground" : ""}`,
							children: z.labor
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
								value: z.sustainability,
								className: "h-1.5 w-12"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums text-xs",
								children: z.sustainability
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
								value: z.stability,
								className: "h-1.5 w-12"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "tabular-nums text-xs",
								children: [z.stability, "%"]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right",
						children: z.riskReduction > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs font-semibold text-[color:var(--success)]",
							children: [
								"-",
								z.riskReduction,
								"%"
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "—"
						})
					})
				] }, z.zone)) })] }) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "border-border/70 shadow-none lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: "Attachment Method Comparison"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Pose stability, risk reduction & sustainability across all available methods" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-64",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: comparisonData,
								margin: {
									top: 4,
									right: 12,
									left: -16,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										stroke: "var(--color-border)",
										vertical: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "name",
										stroke: "var(--color-muted-foreground)",
										fontSize: 10,
										tickLine: false,
										axisLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										stroke: "var(--color-muted-foreground)",
										fontSize: 11,
										tickLine: false,
										axisLine: false,
										domain: [0, 100]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
										borderRadius: 8,
										border: "1px solid var(--color-border)",
										background: "var(--color-card)",
										fontSize: 12
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "stability",
										name: "Pose Stability %",
										fill: "var(--color-chart-1)",
										radius: [
											3,
											3,
											0,
											0
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "riskReduction",
										name: "Risk Reduction %",
										fill: "var(--color-chart-2)",
										radius: [
											3,
											3,
											0,
											0
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "sustainability",
										name: "Sustainability",
										fill: "var(--color-chart-3)",
										radius: [
											3,
											3,
											0,
											0
										]
									})
								]
							})
						})
					}) })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "border-border/70 shadow-none",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: "Plan Score Breakdown"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Recommended plan evaluation across 4 dimensions" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-48",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadialBarChart, {
								innerRadius: "25%",
								outerRadius: "100%",
								data: radialData,
								startAngle: 180,
								endAngle: 0,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadialBar, {
									dataKey: "value",
									background: { fill: "var(--color-muted)" }
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
									borderRadius: 8,
									border: "1px solid var(--color-border)",
									background: "var(--color-card)",
									fontSize: 12
								} })]
							})
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 grid grid-cols-2 gap-2",
						children: radialData.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-2 w-2 rounded-full",
								style: { background: d.fill }
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground",
								children: [
									d.name,
									": ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
										className: "text-foreground",
										children: [d.value, "%"]
									})
								]
							})]
						}, d.name))
					})] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border/70 shadow-none",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Full Method Catalog"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "All available attachment methods — select alternatives per zone in the Attachment Visualizer" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Method" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Material" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Cost/Unit"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Sustainability"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Labor (min)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Pose Stability"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Risk Reduction"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: [...ATTACHMENT_METHODS].map((m) => {
					const isRec = [
						"Elastic Strap",
						"PET Support",
						"EVA Strap"
					].includes(m.method);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
						className: isRec ? "bg-[color:var(--primary-soft)]/20" : "",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "font-medium",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [isRec && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1.5 w-1.5 rounded-full bg-primary" }), m.method]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-sm text-muted-foreground",
								children: m.material
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
								className: "text-right tabular-nums",
								children: ["$", m.costPerUnit.toFixed(2)]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-end gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
										value: m.sustainability,
										className: "h-1.5 w-12"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "tabular-nums text-xs",
										children: m.sustainability
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-right tabular-nums text-sm",
								children: m.laborMins
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
								className: "text-right tabular-nums font-medium",
								children: [m.poseStability, "%"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-semibold text-[color:var(--success)]",
									children: [
										"-",
										m.riskReduction,
										"%"
									]
								})
							})
						]
					}, m.method);
				}) })] }) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "border-[color:var(--primary)]/30 bg-[color:var(--primary-soft)]/50 shadow-none",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "flex items-center justify-between gap-4 p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold",
						children: "View the attachment layout visualization"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 text-xs text-muted-foreground",
						children: "See attachment markers, zone details, and inside-box placement diagram."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => navigate({ to: "/app/packaging-preview" }),
						className: "shrink-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" }),
							" Attachment Visualizer ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
						]
					})]
				})
			})
		]
	});
}
//#endregion
export { AttachmentPlannerPage as component };
