import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  Upload, Sparkles, CheckCircle2, Ruler, Zap, ChevronRight, RotateCcw,
  ImageIcon, ScanLine, ShieldAlert, AlertTriangle, Info, Brain,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { Progress } from "@/components/ui/progress";
import { saveAnalysis, type AnalysisResult, type AttachmentZone } from "@/lib/workflow-store";

export const Route = createFileRoute("/app/product-analysis")({
  head: () => ({ meta: [{ title: "Pose & Doll Analysis — PackWise AI" }] }),
  component: ProductAnalysisPage,
});

const CATEGORIES = [
  "Collectible Doll", "Fashion Doll", "Action Figure",
  "Plush Toy", "Playset", "Electronic Toy", "Other",
];

const WORKFLOW_STEPS = [
  { label: "Pose & Doll Analysis", active: true  },
  { label: "Attachment Planner",    active: false },
  { label: "Attachment Visualizer", active: false },
  { label: "Risk Assessment",      active: false },
  { label: "Cost & Sustainability", active: false },
];

const ANALYSIS_STEPS = [
  "Detecting doll body regions",
  "Mapping pose geometry",
  "Identifying accessories",
  "Estimating attachment zones",
  "Computing movement risk",
  "Predicting accessory loss risk",
];

const RISK_COLOR: Record<string, string> = {
  low:    "bg-[color:var(--success)]/10 text-[color:var(--success)] border-transparent",
  medium: "bg-[color:var(--warning)]/15 text-[color:var(--warning-foreground)] border-transparent",
  high:   "bg-destructive/10 text-destructive border-transparent",
};
const RISK_DOT: Record<string, string> = {
  low: "bg-[color:var(--success)]", medium: "bg-[color:var(--warning)]", high: "bg-destructive",
};

type Stage = "form" | "analysing" | "results";

function WorkflowBar({ steps }: { steps: typeof WORKFLOW_STEPS }) {
  return (
    <div className="flex items-center rounded-xl border border-border/70 bg-muted/30 px-4 py-3">
      {steps.map((s, i, arr) => (
        <div key={s.label} className="flex flex-1 items-center">
          <div className="flex flex-col items-center gap-1">
            <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${s.active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {i + 1}
            </div>
            <span className={`hidden text-[9px] font-medium sm:block ${s.active ? "text-primary" : "text-muted-foreground"}`}>{s.label}</span>
          </div>
          {i < arr.length - 1 && <div className={`mx-1 h-px flex-1 ${s.active ? "bg-primary" : "bg-border"}`} />}
        </div>
      ))}
    </div>
  );
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function ProductAnalysisPage() {
  const navigate   = useNavigate();
  const fileRef    = useRef<HTMLInputElement>(null);
  const [stage, setStage]         = useState<Stage>("form");
  const [productName, setProductName] = useState("");
  const [sku, setSku]             = useState("");
  const [category, setCategory]   = useState(CATEGORIES[0]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [progress, setProgress]   = useState(0);
  const [result, setResult]       = useState<AnalysisResult | null>(null);

  const handleFile = (f: File) => {
    setImageFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => setImageDataUrl(ev.target?.result as string);
    reader.readAsDataURL(f);
  };

  const handleAnalyse = () => {
    if (!productName.trim()) return;
    setStage("analysing");
    setProgress(0);
    const ticks = [15, 32, 50, 66, 82, 100];
    ticks.forEach((p, i) => setTimeout(() => setProgress(p), (i + 1) * 520));
    setTimeout(() => {
      const r: AnalysisResult = {
        productName: productName.trim(),
        category,
        imageDataUrl,
        productType: category,
        dimensions: "28 × 8 × 5 cm",
        analysedAt: new Date().toISOString(),
        accessories: ["Handbag", "Shoes", "Glasses", "Crown", "Dress Stand"],
        bodyRegions: ["Head / Hair", "Torso / Waist", "Right Arm", "Left Arm", "Right Leg", "Left Leg"],
        attachmentZones: [
          { zone: "Hair",        bodyRegion: "Head / Hair",   riskLevel: "medium", recommendedMethod: "Elastic Strap" },
          { zone: "Waist",       bodyRegion: "Torso / Waist", riskLevel: "low",    recommendedMethod: "PET Support"   },
          { zone: "Right Wrist", bodyRegion: "Right Arm",     riskLevel: "high",   recommendedMethod: "EVA Strap"     },
          { zone: "Left Foot",   bodyRegion: "Left Leg",      riskLevel: "low",    recommendedMethod: "No Attachment Required" },
        ],
        poseComplexityScore: 82,
        poseStabilityScore:  76,
        movementRiskScore:   44,
        accessoryLossRisk:   61,
      };
      saveAnalysis(r);
      setResult(r);
      setStage("results");
    }, 3600);
  };

  const handleReset = () => {
    setStage("form"); setProductName(""); setSku(""); setCategory(CATEGORIES[0]);
    setImageFile(null); setImageDataUrl(null); setProgress(0); setResult(null);
  };

  // ─── Form ──────────────────────────────────────────────────────────────────
  if (stage === "form") return (
    <div className="space-y-6">
      <PageHeader
        title="Pose & Doll Analysis"
        description="Upload a doll image and enter product details — PackWise AI will detect body regions, attachment zones, and risk scores."
        actions={<Badge variant="outline" className="border-border/70 font-normal"><Sparkles className="mr-1 h-3 w-3 text-primary" />AI-Powered</Badge>}
      />
      <WorkflowBar steps={WORKFLOW_STEPS} />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-5 lg:col-span-3">
          {/* Product Details */}
          <Card className="border-border/70 shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Product Details</CardTitle>
              <CardDescription>Enter the product information to identify the packaging context.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="product-name">Product Name</Label>
                  <Input id="product-name" placeholder="e.g. Glamour Doll – Sparkle Edition" value={productName} onChange={(e) => setProductName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-sku">SKU / Product Code</Label>
                  <Input id="product-sku" placeholder="e.g. GD-SPK-2025" value={sku} onChange={(e) => setSku(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-category">Product Category</Label>
                <select id="product-category" value={category} onChange={(e) => setCategory(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card className="border-border/70 shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Doll Image</CardTitle>
              <CardDescription>Upload a clear front-facing photo. AI will detect body regions and pose geometry.</CardDescription>
            </CardHeader>
            <CardContent>
              <div onClick={() => fileRef.current?.click()}
                onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f?.type.startsWith("image/")) handleFile(f); }}
                onDragOver={(e) => e.preventDefault()}
                className="relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/70 bg-muted/30 px-6 py-12 text-center transition hover:border-primary/50 hover:bg-[color:var(--primary-soft)]/30">
                {imageDataUrl ? (
                  <img src={imageDataUrl} alt="Preview" className="max-h-48 rounded-lg object-contain" />
                ) : (
                  <>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--primary-soft)] text-primary">
                      <Upload className="h-6 w-6" />
                    </div>
                    <p className="mt-3 text-sm font-medium">Drop your image here, or <span className="text-primary underline underline-offset-2">browse</span></p>
                    <p className="mt-1 text-xs text-muted-foreground">PNG, JPG, WEBP up to 10 MB</p>
                  </>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              </div>
              {imageFile && (
                <p className="mt-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="mr-1 inline h-3.5 w-3.5 text-[color:var(--success)]" />
                  {imageFile.name} ready for analysis
                </p>
              )}
            </CardContent>
          </Card>

          <Button size="lg" className="w-full" onClick={handleAnalyse} disabled={!productName.trim()}>
            <ScanLine className="h-4 w-4" /> Run Pose & Doll Analysis
          </Button>
        </div>

        {/* Info Panel */}
        <div className="space-y-4 lg:col-span-2">
          <Card className="border-border/70 shadow-none bg-[color:var(--primary-soft)]/40">
            <CardHeader>
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Brain className="h-4 w-4" />
              </div>
              <CardTitle className="text-base mt-2">What AI detects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { icon: ScanLine,     label: "Body Regions",      desc: "Head, torso, arms, legs — 6 primary zones mapped" },
                { icon: Zap,          label: "Attachment Zones",   desc: "Specific points where attachment elements are required" },
                { icon: Ruler,        label: "Pose Complexity",    desc: "0–100 score based on pose geometry and risk factors" },
                { icon: ShieldAlert,  label: "Movement Risk",      desc: "Probability of pose distortion during shipping & display" },
                { icon: AlertTriangle,label: "Accessory Loss Risk",desc: "Predicted loss probability per detected accessory" },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/70 shadow-none">
            <CardContent className="p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recent Analyses</p>
              <div className="mt-3 space-y-2">
                {[
                  { name: "Glamour Doll Ltd. Ed.", zones: 4, risk: "medium" },
                  { name: "Action Hero Series 7",  zones: 3, risk: "high"   },
                  { name: "Princess Castle Playset",zones: 6, risk: "low"   },
                ].map((a) => (
                  <div key={a.name} className="flex items-center justify-between gap-2">
                    <p className="text-xs text-foreground truncate">{a.name}</p>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Badge variant="secondary" className="text-[10px]">{a.zones} zones</Badge>
                      <div className={`h-1.5 w-1.5 rounded-full ${RISK_DOT[a.risk]}`} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  // ─── Analysing ─────────────────────────────────────────────────────────────
  if (stage === "analysing") return (
    <div className="space-y-6">
      <PageHeader title="Pose & Doll Analysis" description="AI is processing your doll image — this takes about 3 seconds." />
      <WorkflowBar steps={WORKFLOW_STEPS} />
      <div className="flex min-h-[55vh] flex-col items-center justify-center gap-8">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[color:var(--primary-soft)]">
          <ScanLine className="h-10 w-10 animate-pulse text-primary" />
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/10" />
        </div>
        <div className="w-full max-w-md space-y-4 text-center">
          <h2 className="text-xl font-semibold">Analysing doll pose…</h2>
          <p className="text-sm text-muted-foreground">Detecting body regions, mapping attachment zones, and computing risk scores.</p>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground">{progress}% complete</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {ANALYSIS_STEPS.map((step, i) => (
            <div key={step} className={`flex items-center gap-2 rounded-lg border border-border/70 px-3 py-2 text-xs transition ${progress >= (i + 1) * 16 ? "border-[color:var(--success)]/40 bg-[color:var(--success)]/5 text-[color:var(--success)]" : "text-muted-foreground"}`}>
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />{step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ─── Results ───────────────────────────────────────────────────────────────
  if (!result) return null;

  const riskLabel = (s: number) => s < 35 ? "Low" : s < 65 ? "Medium" : "High";
  const riskBadge = (s: number) => s < 35 ? RISK_COLOR.low : s < 65 ? RISK_COLOR.medium : RISK_COLOR.high;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pose & Doll Analysis"
        description={`Analysis complete for: ${result.productName}`}
        actions={
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" /> New Analysis
          </Button>
        }
      />
      <WorkflowBar steps={[{ label: "Pose & Doll Analysis", active: true }, ...WORKFLOW_STEPS.slice(1)]} />

      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Pose Complexity",    value: `${result.poseComplexityScore}/100`, sub: result.poseComplexityScore > 70 ? "High complexity" : "Moderate", color: "text-[color:var(--warning-foreground)]" },
          { label: "Movement Risk",      value: `${result.movementRiskScore}/100`,   sub: riskLabel(result.movementRiskScore), color: result.movementRiskScore >= 65 ? "text-destructive" : result.movementRiskScore >= 35 ? "text-[color:var(--warning-foreground)]" : "text-[color:var(--success)]" },
          { label: "Accessory Loss Risk",value: `${result.accessoryLossRisk}/100`,   sub: riskLabel(result.accessoryLossRisk), color: result.accessoryLossRisk >= 65 ? "text-destructive" : result.accessoryLossRisk >= 35 ? "text-[color:var(--warning-foreground)]" : "text-[color:var(--success)]" },
          { label: "Pose Stability",     value: `${result.poseStabilityScore}/100`,  sub: result.poseStabilityScore >= 80 ? "Good" : "Needs improvement", color: result.poseStabilityScore >= 80 ? "text-[color:var(--success)]" : "text-[color:var(--warning-foreground)]" },
        ].map(({ label, value, sub, color }) => (
          <Card key={label} className="border-border/70 shadow-none">
            <CardContent className="p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
              <p className={`mt-1 text-2xl font-bold tracking-tight ${color}`}>{value}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left: Image + Accessories */}
        <div className="space-y-4 lg:col-span-2">
          <Card className="border-border/70 shadow-none">
            <CardHeader><CardTitle className="text-base">Product Preview</CardTitle></CardHeader>
            <CardContent>
              {imageDataUrl ? (
                <img src={imageDataUrl} alt={result.productName} className="w-full rounded-lg object-contain max-h-56" />
              ) : (
                <div className="flex h-48 items-center justify-center rounded-lg bg-[color:var(--primary-soft)]/40">
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-10 w-10 text-primary/40" />
                    <p className="mt-2 text-xs text-muted-foreground">No image uploaded</p>
                    <p className="text-xs text-muted-foreground">Analysed from product data</p>
                  </div>
                </div>
              )}
              <div className="mt-4 space-y-1">
                <p className="text-sm font-semibold">{result.productName}</p>
                <p className="text-xs text-muted-foreground">{result.category} · {result.dimensions}</p>
                <p className="text-xs text-muted-foreground">Analysed {new Date(result.analysedAt).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Detected Accessories</CardTitle>
              <CardDescription>{result.accessories.length} items identified — see accessory loss risk below</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {result.accessories.map((a) => (
                  <Badge key={a} variant="secondary" className="bg-[color:var(--primary-soft)] text-primary">{a}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Detected Body Regions</CardTitle>
              <CardDescription>{result.bodyRegions.length} regions mapped</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {result.bodyRegions.map((r) => (
                  <Badge key={r} variant="outline" className="border-border/70 text-xs font-normal">{r}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Zones + Insights */}
        <div className="space-y-4 lg:col-span-3">
          <Card className="border-border/70 shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Attachment Zones</CardTitle>
              <CardDescription>AI-identified zones requiring attachment elements, sorted by risk level.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.attachmentZones.map((z: AttachmentZone) => (
                  <div key={z.zone} className="flex items-center gap-3 rounded-lg border border-border/60 p-3">
                    <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${RISK_DOT[z.riskLevel]}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{z.zone}</p>
                        <Badge variant="outline" className={`text-[10px] font-medium ${RISK_COLOR[z.riskLevel]}`}>
                          {z.riskLevel} risk
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{z.bodyRegion}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-medium text-foreground">{z.recommendedMethod}</p>
                      <p className="text-[10px] text-muted-foreground">AI recommended</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Score Breakdown */}
          <Card className="border-border/70 shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Score Breakdown</CardTitle>
              <CardDescription>AI-computed scores across pose quality dimensions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ScoreBar label="Pose Complexity"     value={result.poseComplexityScore} color="bg-[color:var(--warning)]" />
              <ScoreBar label="Movement Risk"        value={result.movementRiskScore}   color="bg-[color:var(--chart-3)]" />
              <ScoreBar label="Accessory Loss Risk"  value={result.accessoryLossRisk}   color="bg-[color:var(--chart-4)]" />
              <ScoreBar label="Pose Stability"       value={result.poseStabilityScore}  color="bg-[color:var(--success)]" />
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className="border-[color:var(--primary)]/20 bg-[color:var(--primary-soft)]/30 shadow-none">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <Brain className="h-3.5 w-3.5" />
                </div>
                <CardTitle className="text-base">AI Insights</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { level: "high",   text: "High movement risk at Right Wrist — elevated pose angle increases displacement probability. EVA strap recommended." },
                { level: "medium", text: "Hair zone shows medium risk due to styling height. Elastic strap will maintain pose without damaging styling texture." },
                { level: "low",    text: "Waist region is geometrically stable. PET support provides sufficient attachment at minimal material cost." },
                { level: "medium", text: "Crown accessory has 81% predicted loss risk. Consider dedicated blister support or compartment for this item." },
              ].map((ins, i) => (
                <div key={i} className="flex items-start gap-2.5 rounded-lg border border-border/60 bg-background p-3">
                  <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${RISK_DOT[ins.level]}`} />
                  <p className="text-xs leading-relaxed text-foreground">{ins.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="border-[color:var(--primary)]/30 bg-[color:var(--primary-soft)]/50 shadow-none">
            <CardContent className="flex items-center justify-between gap-4 p-5">
              <div>
                <p className="text-sm font-semibold">Ready to generate an attachment plan?</p>
                <p className="mt-0.5 text-xs text-muted-foreground">AI will assign an attachment method to each identified zone.</p>
              </div>
              <Button size="sm" onClick={() => navigate({ to: "/app/packaging-planner" })} className="shrink-0">
                Attachment Planner <ChevronRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
