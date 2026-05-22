import { useState } from "react";
import { Home, Database, Palette, Rocket, Sparkles, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardTab } from "./tabs/DashboardTab";
import { DataIngestionTab } from "./tabs/DataIngestionTab";
import { TemplatesTab } from "./tabs/TemplatesTab";
import { BuildPreviewTab } from "./tabs/BuildPreviewTab";
import { DeploymentTab } from "./tabs/DeploymentTab";

export type TabKey = "dashboard" | "data" | "templates" | "build" | "deploy";

export interface AppState {
  githubConnected: boolean;
  linkedinConnected: boolean;
  resumeUploaded: boolean;
  certsCount: number;
  selectedTemplate: string | null;
  siteBuilt: boolean;
  deployedUrl: string | null;
}

const navItems: { key: TabKey; label: string; icon: typeof Home }[] = [
  { key: "dashboard", label: "Dashboard", icon: Home },
  { key: "data", label: "Data Ingestion", icon: Database },
  { key: "templates", label: "Templates", icon: Palette },
  { key: "build", label: "Build & Preview", icon: Wand2 },
  { key: "deploy", label: "Deployment", icon: Rocket },
];

export function PortfolioAIApp() {
  const [tab, setTab] = useState<TabKey>("dashboard");
  const [state, setState] = useState<AppState>({
    githubConnected: false,
    linkedinConnected: false,
    resumeUploaded: false,
    certsCount: 0,
    selectedTemplate: null,
    siteBuilt: false,
    deployedUrl: null,
  });

  const update = (patch: Partial<AppState>) => setState((s) => ({ ...s, ...patch }));

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary glow-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-base font-semibold tracking-tight">PortfolioAI</p>
            <p className="text-xs text-muted-foreground">Generator</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 pt-4">
          {navItems.map(({ key, label, icon: Icon }) => {
            const active = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-primary/15 text-foreground shadow-[inset_0_0_0_1px_var(--color-border)]"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4", active && "text-primary")} strokeWidth={1.75} />
                <span>{label}</span>
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary glow-primary" />}
              </button>
            );
          })}
        </nav>

        <div className="m-3 rounded-xl border border-sidebar-border bg-sidebar-accent/60 p-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-semibold text-primary-foreground">
              RC
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">Ritika Chawla</p>
              <p className="truncate text-xs text-muted-foreground">Developer</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 md:pl-64">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-10">
          {tab === "dashboard" && (
            <DashboardTab state={state} onNavigate={setTab} />
          )}
          {tab === "data" && <DataIngestionTab state={state} update={update} />}
          {tab === "templates" && <TemplatesTab state={state} update={update} />}
          {tab === "build" && <BuildPreviewTab state={state} update={update} onNavigate={setTab} />}
          {tab === "deploy" && <DeploymentTab state={state} update={update} />}
        </div>
      </main>
    </div>
  );
}
