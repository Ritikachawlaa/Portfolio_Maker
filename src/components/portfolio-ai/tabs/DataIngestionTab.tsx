import { useRef, useState } from "react";
import {
  Github,
  Linkedin,
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  Sparkles,
  FileBadge,
} from "lucide-react";
import type { AppState } from "../App";
import { cn } from "@/lib/utils";

interface QueueItem {
  name: string;
  type: "PDF" | "Image";
  status: "Queued" | "Processing" | "Success - Text Extracted via OCR" | "Parsed";
}

export function DataIngestionTab({
  state,
  update,
}: {
  state: AppState;
  update: (p: Partial<AppState>) => void;
}) {
  const [ghUser, setGhUser] = useState("ritika-chawla");
  const [ghLoading, setGhLoading] = useState(false);
  const [liText, setLiText] = useState("");
  const [liLoading, setLiLoading] = useState(false);
  const [resumeProgress, setResumeProgress] = useState(0);
  const [queue, setQueue] = useState<QueueItem[]>([
    { name: "aws_cloud_cert.jpeg", type: "Image", status: "Success - Text Extracted via OCR" },
  ]);
  const [parsing, setParsing] = useState(false);
  const certInputRef = useRef<HTMLInputElement>(null);

  const handleSyncGithub = () => {
    setGhLoading(true);
    setTimeout(() => {
      setGhLoading(false);
      update({ githubConnected: true });
    }, 1400);
  };

  const handleParseLinkedin = () => {
    setLiLoading(true);
    setTimeout(() => {
      setLiLoading(false);
      update({ linkedinConnected: true });
    }, 1400);
  };

  const simulateResumeUpload = () => {
    setResumeProgress(0);
    const id = setInterval(() => {
      setResumeProgress((p) => {
        if (p >= 100) {
          clearInterval(id);
          update({ resumeUploaded: true });
          setQueue((q) => {
            if (q.find((i) => i.name === "resume_2026.pdf")) return q;
            return [{ name: "resume_2026.pdf", type: "PDF", status: "Parsed" }, ...q];
          });
          return 100;
        }
        return p + 12;
      });
    }, 90);
  };

  const addCertFiles = () => {
    const newFiles: QueueItem[] = [
      { name: "gcp_associate.pdf", type: "PDF", status: "Queued" },
      { name: "hackathon_winner.png", type: "Image", status: "Queued" },
    ];
    setQueue((q) => [...newFiles, ...q]);
    update({ certsCount: state.certsCount + newFiles.length });
  };

  const runParser = () => {
    setParsing(true);
    setQueue((q) => q.map((i) => ({ ...i, status: "Processing" as const })));
    setTimeout(() => {
      setQueue((q) =>
        q.map((i) => ({
          ...i,
          status:
            i.type === "Image"
              ? ("Success - Text Extracted via OCR" as const)
              : ("Parsed" as const),
        }))
      );
      setParsing(false);
    }, 2200);
  };

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-medium text-accent">Step 1 of 3</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Data Ingestion</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Connect your professional profiles and feed documents into the hybrid AI parsing engine.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* LEFT: Profile connections */}
        <div className="space-y-6">
          {/* GitHub */}
          <div className="panel hover-lift p-6">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary">
                <Github className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">GitHub</p>
                <p className="text-xs text-muted-foreground">Sync repositories & languages</p>
              </div>
              {state.githubConnected && (
                <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-[oklch(0.78_0.16_155/0.12)] px-3 py-1 text-xs font-medium text-[oklch(0.78_0.16_155)]">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Connected
                </span>
              )}
            </div>

            {!state.githubConnected ? (
              <div className="mt-5 space-y-3">
                <label className="block text-xs font-medium text-muted-foreground">
                  GitHub Username
                </label>
                <input
                  value={ghUser}
                  onChange={(e) => setGhUser(e.target.value)}
                  className="w-full rounded-xl border border-border bg-input/40 px-4 py-2.5 text-sm outline-none transition focus:border-primary"
                  placeholder="e.g. ritika-chawla"
                />
                <button
                  onClick={handleSyncGithub}
                  disabled={ghLoading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
                >
                  {ghLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Syncing…
                    </>
                  ) : (
                    "Sync Repository Data"
                  )}
                </button>
              </div>
            ) : (
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Stat label="Repositories" value="14" />
                <Stat label="Top Language" value="Python" />
                <Stat label="Stars" value="328" />
                <Stat label="Pinned" value="6" />
              </div>
            )}
          </div>

          {/* LinkedIn */}
          <div className="panel hover-lift p-6">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary">
                <Linkedin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">LinkedIn</p>
                <p className="text-xs text-muted-foreground">Parse career history & skills</p>
              </div>
              {state.linkedinConnected && (
                <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-[oklch(0.78_0.16_155/0.12)] px-3 py-1 text-xs font-medium text-[oklch(0.78_0.16_155)]">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Parsed
                </span>
              )}
            </div>

            <textarea
              value={liText}
              onChange={(e) => setLiText(e.target.value)}
              placeholder="Drop your LinkedIn Profile PDF or paste profile text…"
              className="mt-5 h-28 w-full resize-none rounded-xl border border-dashed border-border bg-input/30 p-4 text-sm outline-none transition focus:border-primary"
            />
            <button
              onClick={handleParseLinkedin}
              disabled={liLoading}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm font-medium transition hover:bg-secondary/70 disabled:opacity-60"
            >
              {liLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Parsing…
                </>
              ) : (
                "Parse Profile History"
              )}
            </button>
          </div>
        </div>

        {/* RIGHT: Documents */}
        <div className="space-y-6">
          <Dropzone
            title="Upload Resume (PDF)"
            subtitle="Drag-and-drop or click to upload"
            onClick={simulateResumeUpload}
            primary
          />
          {(resumeProgress > 0 || state.resumeUploaded) && (
            <div className="panel p-4">
              <div className="flex items-center gap-3 text-sm">
                <FileText className="h-4 w-4 text-primary" />
                <span className="font-medium">resume_2026.pdf</span>
                <span className="text-xs text-muted-foreground">1.2 MB</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {resumeProgress}%
                </span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
                  style={{ width: `${resumeProgress}%` }}
                />
              </div>
            </div>
          )}

          <Dropzone
            title="Upload Certifications & Project Reports"
            subtitle="Supports PDF, JPEG, PNG"
            onClick={() => {
              addCertFiles();
              certInputRef.current?.click();
            }}
          />
          <input ref={certInputRef} type="file" hidden />
        </div>
      </div>

      {/* Processing Queue */}
      <div className="panel overflow-hidden">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h3 className="text-base font-semibold">Processing Queue</h3>
            <p className="text-xs text-muted-foreground">
              {queue.length} file{queue.length === 1 ? "" : "s"} ready for hybrid parsing
            </p>
          </div>
          <button
            onClick={runParser}
            disabled={parsing || queue.length === 0}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground glow-primary transition hover:-translate-y-0.5 disabled:opacity-60"
          >
            {parsing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Running Engine…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Run Hybrid AI Parsing Engine
              </>
            )}
          </button>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">File Name</th>
              <th className="px-5 py-3 font-medium">Type</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {queue.map((item) => (
              <tr key={item.name} className="border-t border-border">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    {item.type === "PDF" ? (
                      <FileText className="h-4 w-4 text-primary" />
                    ) : (
                      <ImageIcon className="h-4 w-4 text-accent" />
                    )}
                    {item.name}
                  </div>
                </td>
                <td className="px-5 py-3 text-muted-foreground">
                  {item.type === "PDF" ? "PDF" : "JPEG Image"}
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={item.status} />
                </td>
              </tr>
            ))}
            {queue.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-10 text-center text-sm text-muted-foreground">
                  <FileBadge className="mx-auto mb-2 h-6 w-6 opacity-50" />
                  No files yet — upload to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-base font-semibold">{value}</p>
    </div>
  );
}

function Dropzone({
  title,
  subtitle,
  onClick,
  primary,
}: {
  title: string;
  subtitle: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition-all hover:-translate-y-0.5",
        primary
          ? "border-primary/50 bg-primary/5 hover:border-primary hover:bg-primary/10"
          : "border-border bg-card/60 hover:border-accent/60 hover:bg-accent/5"
      )}
    >
      <div
        className={cn(
          "grid h-12 w-12 place-items-center rounded-xl",
          primary ? "bg-primary/15 text-primary" : "bg-secondary text-accent"
        )}
      >
        <UploadCloud className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </button>
  );
}

function StatusBadge({ status }: { status: QueueItem["status"] }) {
  const success = status.startsWith("Success") || status === "Parsed";
  const processing = status === "Processing";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        success && "bg-[oklch(0.78_0.16_155/0.12)] text-[oklch(0.78_0.16_155)]",
        processing && "bg-primary/15 text-primary",
        !success && !processing && "bg-secondary text-muted-foreground"
      )}
    >
      {processing && <Loader2 className="h-3 w-3 animate-spin" />}
      {success && <CheckCircle2 className="h-3 w-3" />}
      {status}
    </span>
  );
}
