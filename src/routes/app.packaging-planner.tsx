import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft, Eye, CheckCircle2, Sparkles, BarChart3, Brain, ChevronRight, Info,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/page-header";
import { Progress } from "@/components/ui/progress";
import { loadAnalysis, DEMO_RESULT, type AnalysisResult } from "@/lib/workflow-store";
import { ATTACHMENT_METHODS } from "@/lib/mock-data";

export const Route = createFileRoute("/app/packaging-planner")({
  head: () => ({ meta: [{ title: "Attachment Planner — PackWise AI" }] }),
  component: AttachmentPlannerPage,
});

const WORKFLOW_STEPS = [
  { label: "Pose & Doll Analysis", active: false },
  { label: "Attachment Planner",    active: true  },
  { label: "Attachment Visualizer", active: false },
  { label: "Risk Assessment",      active: false },
  { label: "Cost & Sustainability", active: false },
];

const ZONE_PLAN = [
  { zone: "Hair",        method: "Elastic Strap",           cost: 0.08, labor: "Low",    sustainability: 68, stability: 85, riskReduction: 62 },
  { zone: "Waist",       method: "PET Support",             cost: 0.18, labor: "Medium", sustainability: 78, stability: 94, riskReduction: 81 },
  { zone: "Right Wrist", method: "EVA Strap",               cost: 0.12, labor: "Low",    sustainability: 82, stability: 90, riskReduction: 74 },
  { zone: "Left Foot",   method: "No Attachment Required",   cost: 0.00, labor: "None",   sustainability: 100,stability: 100,riskReduction: 0  },
];

const comparisonData = ATTACHMENT_METHODS.map((m) => ({
  name: m.method.replace(" Support", "").replace(" Strap", " Str."),
  stability: m.poseStability,
  sustainability: m.sustainability,
  riskReduction: m.riskReduction,
}));

const radialData = [
  { name: "Pose Quality", value: 88, fill: "var(--color-chart-1)" },
  { name: "Drop Test",    value: 84, fill: "var(--color-chart-2)" },
  { name: "Cost Score",   value: 72, fill: "var(--color-chart-3)" },
  { name: "Sustain.",     value: 80, fill: "var(--color-chart-4)" },
];

const RISK_COLOR: Record<string, string> = {
  low:    "bg-[color:var(--success)]/10 text-[color:var(--success)] border-transparent",
  medium: "bg-[color:var(--warning)]/15 text-[color:var(--warning-foreground)] border-transparent",
  high:   "bg-destructive/10 text-destructive border-transparent",
};

function WorkflowBar({ steps }: { steps: typeof WORKFLOW_STEPS }) {
  return (
    <div className="flex items-center rounded-xl border border-border/70 bg-muted/30 px-4 py-3">
      {steps.map((s, i, arr) => (
        <div key={s.label} className="flex flex-1 items-center">
          <div className="flex flex-col items-center gap-1">
            <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${s.active ? "bg-primary text-primary-foreground" : i < steps.findIndex(x => x.active) ? "bg-[color:var(--success)] text-white" : "bg-muted text-muted-foreground"}`}>
              {i < steps.findIndex(x => x.active) ? "✓" : i + 1}
            </div>
            <span className={`hidden text-[9px] font-medium sm:block ${s.active ? "text-primary" : "text-muted-foreground"}`}>{s.label}</span>
          </div>
          {i < arr.length - 1 && <div className={`mx-1 h-px flex-1 ${i < steps.findIndex(x => x.active) ? "bg-[color:var(--success)]" : s.active ? "bg-primary" : "bg-border"}`} />}
        </div>
      ))}
    </div>
  );
}

function AttachmentPlannerPage() {
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  useEffect(() => { setAnalysis(loadAnalysis() ?? DEMO_RESULT); }, []);

  const productName = analysis?.productName ?? "Glamour Doll – Sparkle Edition";
  const zones = analysis?.attachmentZones ?? DEMO_RESULT.attachmentZones;

  const totalCost = ZONE_PLAN.reduce((s, z) => s + z.cost, 0).toFixed(2);
  const avgStability = Math.round(ZONE_PLAN.filter(z => z.stability < 100).reduce((s, z, _, a) => s + z.stability / a.length, 0));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attachment Planner"
        description={`AI-recommended attachment methods for each attachment zone — ${productName}`}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => navigate({ to: "/app/product-analysis" })}>
              <ArrowLeft className="h-4 w-4" /> Back to Analysis
            </Button>
            <Button size="sm" onClick={() => navigate({ to: "/app/packaging-preview" })}>
              <Eye className="h-4 w-4" /> View Visualizer
            </Button>
          </>
        }
      />
      <WorkflowBar steps={WORKFLOW_STEPS} />

      {/* AI Recommendation Hero */}
      <Card className="border-[color:var(--primary)]/30 bg-gradient-to-br from-[color:var(--primary-soft)] to-[color:var(--primary-soft)]/20 shadow-none">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <Sparkles className="h-4 w-4" />
                </div>
                <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">AI Recommended Plan</Badge>
              </div>
              <h2 className="text-xl font-semibold">Mixed Attachment Strategy</h2>
              <p className="text-sm text-muted-foreground">EVA strap at high-risk wrist zone, PET support at waist — optimized for pose quality and sustainability balance.</p>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {[
                { label: "Avg. Pose Stability", value: `${avgStability}%` },
                { label: "Total Cost / Unit",   value: `$${totalCost}`   },
                { label: "Zones Covered",       value: `${zones.length}` },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
                  <p className="mt-1 text-lg font-bold text-foreground">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Avg. Pose Stability",  value: `${avgStability}%`,  hint: "Across retained zones"        },
          { label: "Total Cost / Unit",    value: `$${totalCost}`,     hint: "All attachment elements"       },
          { label: "Est. Labor Time",      value: "2.3 min",           hint: "Per unit on production line"  },
          { label: "Sustainability Score", value: "78/100",            hint: "Weighted by material usage"   },
        ].map(({ label, value, hint }) => (
          <Card key={label} className="border-border/70 shadow-none">
            <CardContent className="p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">{value}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Zone-by-Zone Plan */}
      <Card className="border-border/70 shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Zone-by-Zone Attachment Plan</CardTitle>
            <CardDescription>AI-assigned attachment method for each identified attachment zone</CardDescription>
          </div>
          <Badge variant="outline" className="border-border/70 text-xs font-normal">
            <Brain className="mr-1 h-3 w-3" /> AI Generated
          </Badge>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Zone</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Cost/Unit</TableHead>
                <TableHead className="text-right">Labor</TableHead>
                <TableHead className="text-right">Sustainability</TableHead>
                <TableHead className="text-right">Pose Stability</TableHead>
                <TableHead className="text-right">Risk Reduction</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ZONE_PLAN.map((z) => (
                <TableRow key={z.zone}>
                  <TableCell className="font-medium">{z.zone}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {z.method === "No Attachment Required" ? (
                        <span className="text-sm text-muted-foreground italic">{z.method}</span>
                      ) : (
                        <>
                          <Badge className="bg-[color:var(--success)]/10 text-[color:var(--success)] border-transparent text-[10px]">
                            <CheckCircle2 className="mr-1 h-2.5 w-2.5" /> Recommended
                          </Badge>
                          <span className="text-sm font-medium">{z.method}</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-medium">
                    {z.cost === 0 ? <span className="text-muted-foreground">—</span> : `$${z.cost.toFixed(2)}`}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className={`text-[10px] font-normal border-border/70 ${z.labor === "None" ? "text-muted-foreground" : ""}`}>{z.labor}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Progress value={z.sustainability} className="h-1.5 w-12" />
                      <span className="tabular-nums text-xs">{z.sustainability}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Progress value={z.stability} className="h-1.5 w-12" />
                      <span className="tabular-nums text-xs">{z.stability}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {z.riskReduction > 0 ? (
                      <span className="text-xs font-semibold text-[color:var(--success)]">-{z.riskReduction}%</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Comparison Bar Chart */}
        <Card className="border-border/70 shadow-none lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Attachment Method Comparison</CardTitle>
            <CardDescription>Pose stability, risk reduction & sustainability across all available methods</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 4, right: 12, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", background: "var(--color-card)", fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="stability"     name="Pose Stability %"   fill="var(--color-chart-1)" radius={[3,3,0,0]} />
                  <Bar dataKey="riskReduction" name="Risk Reduction %"   fill="var(--color-chart-2)" radius={[3,3,0,0]} />
                  <Bar dataKey="sustainability" name="Sustainability"     fill="var(--color-chart-3)" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Radial Chart */}
        <Card className="border-border/70 shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Plan Score Breakdown</CardTitle>
            <CardDescription>Recommended plan evaluation across 4 dimensions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="25%" outerRadius="100%" data={radialData} startAngle={180} endAngle={0}>
                  <RadialBar dataKey="value" background={{ fill: "var(--color-muted)" }} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", background: "var(--color-card)", fontSize: 12 }} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {radialData.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full" style={{ background: d.fill }} />
                  <span className="text-xs text-muted-foreground">{d.name}: <strong className="text-foreground">{d.value}%</strong></span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Methods Table */}
      <Card className="border-border/70 shadow-none">
        <CardHeader>
          <CardTitle className="text-base">Full Method Catalog</CardTitle>
          <CardDescription>All available attachment methods — select alternatives per zone in the Attachment Visualizer</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Method</TableHead>
                <TableHead>Material</TableHead>
                <TableHead className="text-right">Cost/Unit</TableHead>
                <TableHead className="text-right">Sustainability</TableHead>
                <TableHead className="text-right">Labor (min)</TableHead>
                <TableHead className="text-right">Pose Stability</TableHead>
                <TableHead className="text-right">Risk Reduction</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...ATTACHMENT_METHODS].map((m) => {
                const isRec = ["Elastic Strap", "PET Support", "EVA Strap"].includes(m.method);
                return (
                  <TableRow key={m.method} className={isRec ? "bg-[color:var(--primary-soft)]/20" : ""}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {isRec && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
                        {m.method}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{m.material}</TableCell>
                    <TableCell className="text-right tabular-nums">${m.costPerUnit.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Progress value={m.sustainability} className="h-1.5 w-12" />
                        <span className="tabular-nums text-xs">{m.sustainability}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-sm">{m.laborMins}</TableCell>
                    <TableCell className="text-right tabular-nums font-medium">{m.poseStability}%</TableCell>
                    <TableCell className="text-right">
                      <span className="text-xs font-semibold text-[color:var(--success)]">-{m.riskReduction}%</span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card className="border-[color:var(--primary)]/30 bg-[color:var(--primary-soft)]/50 shadow-none">
        <CardContent className="flex items-center justify-between gap-4 p-5">
          <div>
            <p className="text-sm font-semibold">View the attachment layout visualization</p>
            <p className="mt-0.5 text-xs text-muted-foreground">See attachment markers, zone details, and inside-box placement diagram.</p>
          </div>
          <Button size="sm" onClick={() => navigate({ to: "/app/packaging-preview" })} className="shrink-0">
            <Eye className="h-4 w-4" /> Attachment Visualizer <ChevronRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
