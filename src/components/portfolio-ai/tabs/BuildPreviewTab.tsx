import { useState } from "react";
import { Wand2, Loader2, Monitor, Tablet, Smartphone, ArrowRight, Github, Linkedin, MapPin, Mail, ExternalLink } from "lucide-react";
import type { AppState, TabKey } from "../App";
import { cn } from "@/lib/utils";

type Device = "desktop" | "tablet" | "mobile";

export function BuildPreviewTab({
  state,
  update,
  onNavigate,
}: {
  state: AppState;
  update: (p: Partial<AppState>) => void;
  onNavigate: (t: TabKey) => void;
}) {
  const [building, setBuilding] = useState(false);
  const [device, setDevice] = useState<Device>("desktop");

  const handleBuild = () => {
    setBuilding(true);
    setTimeout(() => {
      setBuilding(false);
      update({ siteBuilt: true });
    }, 1800);
  };

  const needsTemplate = !state.selectedTemplate;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-accent">Step 3 of 4</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Build & Preview</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Compile your parsed data into a real portfolio site. Preview it across devices before shipping.
          </p>
        </div>

        {state.siteBuilt && (
          <button
            onClick={() => onNavigate("deploy")}
            className="inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:-translate-y-0.5"
          >
            Continue to Deployment <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </header>

      {!state.siteBuilt ? (
        <div className="panel flex flex-col items-center justify-center gap-5 p-14 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Wand2 className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Generate your portfolio site</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              We&apos;ll assemble your selected template{" "}
              <span className="font-medium text-foreground">
                {state.selectedTemplate ? `(${state.selectedTemplate})` : "(none yet)"}
              </span>{" "}
              with your parsed profile data into a deploy-ready website.
            </p>
          </div>

          {needsTemplate && (
            <button
              onClick={() => onNavigate("templates")}
              className="text-xs font-medium text-primary hover:underline"
            >
              Pick a template first →
            </button>
          )}

          <button
            onClick={handleBuild}
            disabled={building || needsTemplate}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-primary-foreground glow-primary transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {building ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Building your site…
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" /> Build Portfolio Site
              </>
            )}
          </button>

          {building && (
            <div className="w-full max-w-md space-y-2 text-left text-mono text-xs text-muted-foreground">
              <p>› Compiling components…</p>
              <p>› Injecting profile data…</p>
              <p className="text-primary">› Rendering pages with {state.selectedTemplate} theme…</p>
            </div>
          )}
        </div>
      ) : (
        <div className="panel overflow-hidden">
          {/* Browser chrome */}
          <div className="flex items-center gap-3 border-b border-border bg-muted/40 px-4 py-3">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.7_0.18_25)]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.78_0.16_60)]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.78_0.16_155)]" />
            </div>
            <div className="ml-2 flex-1">
              <div className="mx-auto max-w-md truncate rounded-md border border-border bg-card px-3 py-1 text-center text-xs text-muted-foreground">
                preview.portfolio-ai.app/ritika-chawla
              </div>
            </div>
            <div className="flex gap-1 rounded-md border border-border bg-card p-0.5">
              {([
                ["desktop", Monitor],
                ["tablet", Tablet],
                ["mobile", Smartphone],
              ] as const).map(([d, Icon]) => (
                <button
                  key={d}
                  onClick={() => setDevice(d)}
                  className={cn(
                    "rounded p-1.5 transition",
                    device === d ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>
          </div>

          {/* Preview canvas */}
          <div className="flex justify-center bg-[oklch(0.97_0.005_250)] p-6">
            <div
              className={cn(
                "overflow-hidden rounded-xl border border-border bg-white shadow-xl transition-all",
                device === "desktop" && "w-full max-w-5xl",
                device === "tablet" && "w-[640px] max-w-full",
                device === "mobile" && "w-[360px] max-w-full"
              )}
            >
              <PortfolioMock template={state.selectedTemplate ?? "minimalist"} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PortfolioMock({ template }: { template: string }) {
  const accent =
    template === "creative"
      ? "from-fuchsia-500 to-indigo-500"
      : template === "executive"
      ? "from-slate-800 to-slate-600"
      : "from-indigo-500 to-sky-500";

  return (
    <div className="text-slate-900">
      {/* Top nav */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-3 text-xs">
        <span className="font-mono font-semibold tracking-tight">ritika.dev</span>
        <div className="flex gap-4 text-slate-500">
          <span>Work</span><span>About</span><span>Writing</span><span>Contact</span>
        </div>
      </div>

      {/* Hero */}
      <div className={cn("bg-gradient-to-br px-8 py-10 text-white", accent)}>
        <p className="text-xs uppercase tracking-[0.2em] opacity-80">Developer · Cloud · ML</p>
        <h2 className="mt-2 text-3xl font-bold leading-tight">Ritika Chawla</h2>
        <p className="mt-2 max-w-md text-sm opacity-90">
          Building reliable systems at the intersection of cloud infrastructure and applied machine learning.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1">
            <MapPin className="h-3 w-3" /> Bengaluru, IN
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1">
            <Github className="h-3 w-3" /> ritika-chawla
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1">
            <Linkedin className="h-3 w-3" /> /in/ritika-chawla
          </span>
        </div>
      </div>

      {/* Projects */}
      <div className="px-8 py-6">
        <div className="flex items-baseline justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Featured Projects
          </h3>
          <span className="text-xs text-slate-400">14 repositories</span>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { name: "vision-ocr-pipeline", lang: "Python", desc: "OCR + LLM pipeline for cert parsing." },
            { name: "edge-cache-router", lang: "TypeScript", desc: "Cloudflare worker request router." },
            { name: "kube-cost-bot", lang: "Go", desc: "Slack bot for K8s cost anomalies." },
            { name: "papers-rec-engine", lang: "Python", desc: "Personalized arXiv recommender." },
          ].map((p) => (
            <div key={p.name} className="rounded-lg border border-slate-200 p-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold">{p.name}</span>
                <span className="text-[10px] text-slate-500">{p.lang}</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div className="border-t border-slate-200 px-8 py-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          Certifications
        </h3>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {["AWS Solutions Architect", "GCP Associate Engineer", "Hackathon Winner 2024"].map((c) => (
            <span key={c} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-200 px-8 py-4 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1">
          <Mail className="h-3 w-3" /> hello@ritika.dev
        </span>
        <span className="inline-flex items-center gap-1">
          Built with PortfolioAI <ExternalLink className="h-3 w-3" />
        </span>
      </div>
    </div>
  );
}
