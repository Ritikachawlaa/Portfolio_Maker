import { useEffect } from "react";
import { Check, Eye } from "lucide-react";
import type { AppState, TabKey } from "../App";
import { cn } from "@/lib/utils";

function MinimalistPreview() {
  return (
    <div className="flex h-full flex-col gap-2 p-5 text-mono">
      <div className="h-2 w-16 rounded-full bg-foreground/80" />
      <div className="h-2 w-28 rounded-full bg-muted-foreground/60" />
      <div className="mt-4 space-y-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-1.5 rounded-full bg-border" style={{ width: `${100 - i * 10}%` }} />
        ))}
      </div>
      <div className="mt-auto flex gap-2">
        <span className="rounded-md bg-foreground/80 px-2 py-0.5 text-[10px] text-background">py</span>
        <span className="rounded-md border border-border px-2 py-0.5 text-[10px] text-muted-foreground">ts</span>
      </div>
    </div>
  );
}

function CreativePreview() {
  return (
    <div className="relative h-full overflow-hidden p-5">
      <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-primary/40 blur-2xl" />
      <div className="absolute -bottom-10 -right-6 h-32 w-32 rounded-full bg-accent/40 blur-2xl" />
      <div className="relative space-y-3">
        <div className="h-3 w-24 rounded-full bg-gradient-to-r from-primary to-accent" />
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-lg border border-border bg-card/80 shadow-[0_0_20px_oklch(0.62_0.19_277/0.25)]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ExecutivePreview() {
  return (
    <div className="h-full p-5">
      <div className="grid h-full grid-cols-3 gap-2">
        <div className="col-span-1 space-y-2">
          <div className="h-3 rounded bg-foreground/70" />
          <div className="h-2 rounded bg-muted-foreground/40" />
          <div className="h-2 rounded bg-muted-foreground/40" />
        </div>
        <div className="col-span-2 grid grid-cols-2 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded border border-border bg-secondary/50" />
          ))}
        </div>
      </div>
    </div>
  );
}

const templates = [
  { id: "minimalist", name: "Minimalist Dev", tagline: "Clean typography · monospace highlights", preview: <MinimalistPreview /> },
  { id: "creative", name: "Creative Engineer", tagline: "Glowing canvas · animated layers", preview: <CreativePreview /> },
  { id: "executive", name: "Executive Researcher", tagline: "Grid layout · publications focus", preview: <ExecutivePreview /> },
];

export function TemplatesTab({
  state,
  update,
  onNavigate,
}: {
  state: AppState;
  update: (p: Partial<AppState>) => void;
  onNavigate: (t: TabKey) => void;
}) {
  useEffect(() => {
    if (state.selectedTemplate && !state.siteBuilt) {
      const id = setTimeout(() => onNavigate("build"), 800);
      return () => clearTimeout(id);
    }
  }, [state.selectedTemplate, state.siteBuilt, onNavigate]);

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-medium text-accent">Step 2 of 3</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Template Selection</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Pick a foundation. Every template is responsive, themeable, and pre-wired to your data.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {templates.map((t) => {
          const selected = state.selectedTemplate === t.id;
          return (
            <div
              key={t.id}
              className={cn(
                "panel hover-lift overflow-hidden transition-all",
                selected && "ring-2 ring-primary glow-primary"
              )}
            >
              <div className="aspect-[4/3] overflow-hidden border-b border-border bg-secondary/40">
                {t.preview}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold">{t.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{t.tagline}</p>
                  </div>
                  {selected && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary">
                      <Check className="h-3 w-3" /> Selected
                    </span>
                  )}
                </div>
                <div className="mt-5 flex gap-2">
                  <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-4 py-2 text-xs font-medium transition hover:bg-secondary/70">
                    <Eye className="h-3.5 w-3.5" /> Preview
                  </button>
                  <button
                    onClick={() => update({ selectedTemplate: t.id })}
                    className={cn(
                      "inline-flex flex-1 items-center justify-center rounded-xl px-4 py-2 text-xs font-medium transition",
                      selected
                        ? "bg-primary/15 text-primary"
                        : "bg-primary text-primary-foreground hover:opacity-90"
                    )}
                  >
                    {selected ? "Theme Selected" : "Select Theme"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
