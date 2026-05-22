import { ArrowRight, CheckCircle2, Activity, Plug } from "lucide-react";
import type { AppState, TabKey } from "../App";
import { cn } from "@/lib/utils";

const steps = [
  { key: "connect", label: "Connect Data" },
  { key: "template", label: "Pick Template" },
  { key: "deploy", label: "Go Live" },
];

export function DashboardTab({
  state,
  onNavigate,
}: {
  state: AppState;
  onNavigate: (t: TabKey) => void;
}) {
  const connected =
    Number(state.githubConnected) +
    Number(state.linkedinConnected) +
    Number(state.resumeUploaded) +
    Number(state.certsCount > 0);

  const currentStep = state.deployedUrl
    ? 3
    : state.selectedTemplate
    ? 2
    : connected > 0
    ? 1
    : 0;

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-primary/10 p-8">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-24 right-32 h-48 w-48 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative">
          <p className="text-sm font-medium text-accent">Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight lg:text-4xl">
            Welcome, Ritika! Let&apos;s build your live portfolio.
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Connect your developer profiles, upload your documents, and let our AI pipeline
            assemble a deploy-ready portfolio site in minutes.
          </p>
          <button
            onClick={() => onNavigate("data")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground glow-primary transition-transform hover:-translate-y-0.5"
          >
            Start Processing
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Stepper */}
      <section className="panel p-6">
        <div className="flex items-center justify-between gap-4">
          {steps.map((s, i) => {
            const done = i < currentStep;
            const active = i === currentStep;
            return (
              <div key={s.key} className="flex flex-1 items-center gap-3">
                <div
                  className={cn(
                    "grid h-10 w-10 shrink-0 place-items-center rounded-full border text-sm font-semibold transition-all",
                    done && "border-primary bg-primary text-primary-foreground glow-primary",
                    active && !done && "border-accent text-accent",
                    !done && !active && "border-border text-muted-foreground"
                  )}
                >
                  {done ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
                </div>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Step {i + 1}
                  </p>
                  <p className="truncate text-sm font-medium">{s.label}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="mx-2 hidden h-px flex-1 bg-border sm:block" />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Metrics */}
      <section className="grid gap-6 md:grid-cols-2">
        <MetricCard
          icon={<Plug className="h-5 w-5" />}
          label="Total Connected Sources"
          value={`${connected}/4 connected`}
          tone="warning"
          hint="GitHub · LinkedIn · Resume · Certs"
        />
        <MetricCard
          icon={<Activity className="h-5 w-5" />}
          label="System Status"
          value="Pipeline Idle"
          tone="success"
          hint="Ready to run hybrid AI parsing"
        />
      </section>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  tone,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "warning" | "success";
  hint: string;
}) {
  const toneClasses =
    tone === "warning"
      ? "text-[oklch(0.78_0.16_60)] bg-[oklch(0.78_0.16_60/0.12)]"
      : "text-[oklch(0.78_0.16_155)] bg-[oklch(0.78_0.16_155/0.12)]";
  return (
    <div className="panel hover-lift p-6">
      <div className="flex items-center justify-between">
        <div className={cn("grid h-10 w-10 place-items-center rounded-xl", toneClasses)}>
          {icon}
        </div>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium",
            toneClasses
          )}
        >
          {tone === "warning" ? "Action needed" : "Healthy"}
        </span>
      </div>
      <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}
