import { useEffect, useRef, useState } from "react";
import { ExternalLink, Loader2, Rocket, Terminal as TerminalIcon } from "lucide-react";
import type { AppState } from "../App";
import { cn } from "@/lib/utils";

const logLines = [
  "[INFO] Parsing resume_2026.pdf...",
  "[INFO] Executing Vision AI OCR on aws_cloud_cert.jpeg...",
  "[INFO] Mapping data schema to JSON structure...",
  "[INFO] Compiling Next.js frontend code assets...",
  "[INFO] Optimizing static assets & sitemap...",
  "[INFO] Pipeline ready. Awaiting deploy trigger.",
];

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 truncate font-medium">{value}</p>
    </div>
  );
}

export function DeploymentTab({
  state,
  update,
}: {
  state: AppState;
  update: (p: Partial<AppState>) => void;
}) {
  const [visible, setVisible] = useState<string[]>([]);
  const [platform, setPlatform] = useState("vercel");
  const [deploying, setDeploying] = useState(false);
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setVisible((v) => (i < logLines.length ? [...v, logLines[i]] : v));
      i++;
      if (i > logLines.length) clearInterval(id);
    }, 500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    termRef.current?.scrollTo({ top: termRef.current.scrollHeight });
  }, [visible]);

  const handleDeploy = () => {
    setDeploying(true);
    setVisible((v) => [
      ...v,
      "[DEPLOY] Uploading build to " + (platform === "vercel" ? "Vercel" : "GitHub Pages") + "...",
    ]);
    setTimeout(() => {
      setVisible((v) => [...v, "[DEPLOY] Build live. URL provisioned."]);
      update({ deployedUrl: "https://ritika-chawla.vercel.app" });
      setDeploying(false);
    }, 3000);
  };

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-medium text-accent">Step 3 of 3</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Deployment & Live Preview</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Watch the build pipeline assemble your site, then push it to the platform of your choice.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Terminal */}
        <div className="panel overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border bg-secondary/40 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.7_0.18_25)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.78_0.16_60)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.78_0.16_155)]" />
            <div className="ml-3 flex items-center gap-2 text-xs text-muted-foreground">
              <TerminalIcon className="h-3.5 w-3.5" />
              pipeline.log
            </div>
          </div>
          <div
            ref={termRef}
            className="h-80 overflow-y-auto bg-[oklch(0.18_0.025_260)] p-4 text-xs leading-relaxed text-mono"
          >
            {visible.map((line, i) => (
              <div
                key={i}
                className={cn(
                  "whitespace-pre-wrap",
                  line.startsWith("[DEPLOY]") ? "text-accent" : "text-[oklch(0.85_0.05_155)]"
                )}
              >
                {line}
              </div>
            ))}
            <div className="mt-1 flex items-center gap-2 text-muted-foreground">
              <span className="text-primary">$</span>
              <span className="pulse-dot">▍</span>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="panel p-6">
          <h3 className="text-base font-semibold">Deployment Settings</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Choose a target. Configuration is auto-generated.
          </p>

          <label className="mt-6 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Platform
          </label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-input/40 px-4 py-2.5 text-sm outline-none focus:border-primary"
          >
            <option value="vercel">Vercel Hosted (Recommended)</option>
            <option value="github">GitHub Pages</option>
          </select>

          <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
            <Info label="Template" value={state.selectedTemplate ?? "Not selected"} />
            <Info label="Resume" value={state.resumeUploaded ? "Ready" : "Pending"} />
            <Info label="GitHub" value={state.githubConnected ? "Synced" : "—"} />
            <Info label="LinkedIn" value={state.linkedinConnected ? "Parsed" : "—"} />
          </div>

          <button
            onClick={handleDeploy}
            disabled={deploying}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-4 text-base font-semibold text-primary-foreground glow-primary transition hover:-translate-y-0.5 disabled:opacity-70"
          >
            {deploying ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Deploying…
              </>
            ) : (
              <>
                <Rocket className="h-5 w-5" /> Deploy to Production
              </>
            )}
          </button>

          {state.deployedUrl && (
            <a
              href={state.deployedUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-[oklch(0.78_0.16_155/0.4)] bg-[oklch(0.78_0.16_155/0.08)] p-4 text-sm transition hover:-translate-y-0.5"
            >
              <div>
                <p className="text-xs uppercase tracking-wider text-[oklch(0.78_0.16_155)]">Live</p>
                <p className="mt-0.5 font-mono text-sm">{state.deployedUrl}</p>
              </div>
              <ExternalLink className="h-4 w-4 text-[oklch(0.78_0.16_155)]" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
