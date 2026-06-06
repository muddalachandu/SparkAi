import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateBuildBlueprint, generateProjectPrototypeCode, updateProjectPrototypeCode } from "@/lib/ai.functions";
import type { BuildBlueprint, ProjectIdea } from "@/lib/schemas";
import { PageShell, PageHeader } from "@/components/PageHeader";
import {
  Code2,
  Loader2,
  FolderTree,
  Database,
  Server,
  Cloud,
  Wrench,
  GitBranch,
  Beaker,
  Rocket,
  Layers,
  Copy,
  Check,
  FileCode,
  Sparkles,
  Cpu,
  Monitor,
  X
} from "lucide-react";
import { SaveBar } from "@/components/SaveBar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { awardXP, XP, unlockAchievement } from "@/lib/gamification";
import { toast } from "sonner";
import { z } from "zod";

type BlueprintRow = {
  id: string;
  created_at: string;
  title: string;
  description: string | null;
  technologies: string[];
  blueprint: BuildBlueprint;
};

const builderSearchSchema = z.object({
  seed: z.string().optional(),
  restoreId: z.string().optional(),
});

export const Route = createFileRoute("/_app/builder")({
  validateSearch: builderSearchSchema,
  head: () => ({ meta: [{ title: "AI Project Builder — ProjectSpark" }] }),
  component: BuilderPage,
});

function BuilderPage() {
  const generate = useServerFn(generateBuildBlueprint);
  const generatePrototype = useServerFn(generateProjectPrototypeCode);
  const updatePrototype = useServerFn(updateProjectPrototypeCode);
  const { user } = useAuth();
  const { seed, restoreId } = Route.useSearch();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tech, setTech] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bp, setBp] = useState<BuildBlueprint | null>(null);
  const [tab, setTab] = useState<"prototype" | "overview" | "structure" | "schema" | "api" | "code" | "deploy">(
    "overview",
  );

  const [prototypeHtml, setPrototypeHtml] = useState<string | null>(null);
  const [updatingPrototype, setUpdatingPrototype] = useState(false);
  const [prototypePrompt, setPrototypePrompt] = useState("");
  const [showSandboxCodeModal, setShowSandboxCodeModal] = useState(false);

  useEffect(() => {
    if (seed) {
      setTitle(seed);
      setDescription(`Build a production-ready application for ${seed}.`);
      setTech("React, Node, Postgres");
    }
  }, [seed]);

  useEffect(() => {
    const raw = sessionStorage.getItem("ps:buildIdea");
    if (raw) {
      try {
        const idea = JSON.parse(raw) as ProjectIdea;
        setTitle(idea.title);
        setDescription(idea.solutionOverview);
        setTech(idea.technologies.join(", "));
      } catch {
        /* ignore */
      }
    }
  }, []);

  useEffect(() => {
    if (restoreId && user) {
      const loadSaved = async () => {
        const { data, error } = await supabase
          .from("build_blueprints")
          .select("*")
          .eq("id", restoreId)
          .single();
        if (error) {
          toast.error("Failed to load blueprint");
          return;
        }
        if (data) {
          setTitle(data.title);
          setDescription(data.description ?? "");
          setTech((data.technologies as string[] ?? []).join(", "));
          const blueprintData = data.blueprint as any;
          setBp(blueprintData);
          if (blueprintData && blueprintData.sandboxCode) {
            setPrototypeHtml(blueprintData.sandboxCode);
            setTab("prototype");
          } else {
            setTab("overview");
          }
          toast.success("Loaded saved blueprint!");
        }
      };
      loadSaved();
    }
  }, [restoreId, user]);

  const onGen = async () => {
    if (!title.trim()) return;
    setLoading(true);
    setError(null);
    setBp(null);
    setPrototypeHtml(null);
    try {
      const technologies = tech
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const [blueprintResult, prototypeResult] = await Promise.all([
        generate({ data: { title, description, technologies } }),
        generatePrototype({ data: { title, description, technologies } })
      ]);

      setBp(blueprintResult);
      setPrototypeHtml(prototypeResult.html);
      setTab("prototype");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const exportJson = () => {
    if (!bp) return;
    const blob = new Blob([JSON.stringify(bp, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${bp.title.replace(/\s+/g, "-").toLowerCase()}-blueprint.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onSave = async () => {
    if (!user || !bp) return;
    const technologies = tech
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const { error } = await supabase.from("build_blueprints").insert({
      user_id: user.id,
      title: bp.title,
      description,
      technologies: technologies as unknown as never,
      blueprint: {
        ...bp,
        category: "project",
        sandboxCode: prototypeHtml
      } as unknown as never,
    });
    if (error) {
      toast.error("Save failed: " + error.message);
      return;
    }
    await awardXP(XP.SAVE_BLUEPRINT, "Saved blueprint");
    await unlockAchievement({
      code: "save-blueprint",
      title: "AI Builder Pro",
      description: "Generate a production code blueprint.",
      icon: "Code2",
      xp: 75,
    });
    toast.success("Saved blueprint and interactive sandbox to Saved items!");
  };

  return (
    <PageShell>
      <PageHeader
        icon={Code2}
        title="AI Project Builder"
        description="Turn any idea into a production-ready blueprint — folders, schema, APIs, code, and deploy steps."
        actions={
          <SaveBar<BlueprintRow>
            canSave={!!bp}
            onSave={onSave}
            pickerTable="build_blueprints"
            pickerSelect="id, created_at, title, description, technologies, blueprint"
            pickerToRow={(r) => ({
              id: r.id,
              label: r.title,
              meta: (r.technologies ?? []).slice(0, 4).join(", "),
            })}
            pickerOnPick={(r) => {
              setTitle(r.title);
              setDescription(r.description ?? "");
              setTech((r.technologies ?? []).join(", "));
              const blueprintData = r.blueprint as any;
              setBp(blueprintData);
              if (blueprintData && blueprintData.sandboxCode) {
                setPrototypeHtml(blueprintData.sandboxCode);
                setTab("prototype");
              } else {
                setTab("overview");
              }
            }}
          />
        }
      />

      <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        <div className="space-y-4 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
              Project title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AI Recipe Generator"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="What does it do?"
              className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
              Preferred tech (comma sep)
            </label>
            <input
              value={tech}
              onChange={(e) => setTech(e.target.value)}
              placeholder="React, Node, Postgres"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <button
            onClick={onGen}
            disabled={loading || !title.trim()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-spark px-4 py-3 text-sm font-medium text-primary-foreground shadow-glow disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Rocket className="h-4 w-4" />
            )}
            {loading ? "Architecting…" : "Generate blueprint"}
          </button>
          {error && <p className="text-xs text-destructive">{error}</p>}
          {bp && (
            <button
              onClick={exportJson}
              className="w-full rounded-lg border border-border px-3 py-2 text-xs hover:bg-card/60"
            >
              Export blueprint (.json)
            </button>
          )}
        </div>

        <div className="min-h-[400px] space-y-4 min-w-0">
          {!bp && !loading && (
            <div className="flex h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 text-center text-sm text-muted-foreground">
              <Code2 className="mb-3 h-8 w-8 text-spark animate-float" />
              Describe a project — get a full architecture in seconds.
            </div>
          )}
          {loading && (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted/30" />
              ))}
            </div>
          )}
          {bp && (
            <>
              <div className="rounded-2xl border border-border bg-gradient-to-br from-card/80 to-card/30 p-5">
                <div className="text-xs uppercase tracking-widest text-spark">Blueprint</div>
                <h2 className="font-display text-2xl font-semibold">{bp.title}</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Estimated timeline: {bp.estimatedTimeline}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {prototypeHtml && (
                  <button
                    onClick={() => setTab("prototype")}
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize flex items-center gap-1 border ${tab === "prototype" ? "bg-gradient-spark border-spark text-primary-foreground shadow-glow" : "border-spark/30 text-spark hover:bg-spark/10 hover:text-foreground"}`}
                  >
                    <Sparkles className="h-3.5 w-3.5 animate-pulse text-spark" />
                    <span>Live Sandbox Prototype</span>
                  </button>
                )}
                {(["overview", "structure", "schema", "api", "code", "deploy"] as const).map(
                  (t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`rounded-full px-3 py-1 text-xs capitalize ${tab === t ? "bg-gradient-spark text-primary-foreground" : "border border-border text-muted-foreground hover:text-foreground"}`}
                    >
                      {t}
                    </button>
                  ),
                )}
              </div>

              {tab === "prototype" && prototypeHtml && (
                <div className="grid gap-4 lg:grid-cols-[280px_1fr] h-[550px] min-h-[500px]">
                  {/* Left Chat Sidebar */}
                  <div className="flex flex-col justify-between rounded-2xl border border-border bg-card/40 p-4 h-full overflow-y-auto" data-lenis-prevent="true">
                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                        <Sparkles className="h-4 w-4 text-spark animate-pulse" />
                        <span>Prompt AI Sandbox</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-normal">
                        Iterate on your project prototype just like in Bolt, Lovable, or v0! Ask the AI to change styles, add features, or refine behaviors.
                      </p>
                      <textarea
                        value={prototypePrompt}
                        onChange={(e) => setPrototypePrompt(e.target.value)}
                        placeholder="e.g. Add a clear all button or make it responsive..."
                        rows={4}
                        className="w-full rounded-lg border border-white/10 bg-background px-2.5 py-1.5 text-xs text-foreground outline-none focus:border-spark resize-none"
                      />
                    </div>
                    
                    <button
                      onClick={async () => {
                        if (!prototypePrompt.trim() || !prototypeHtml) return;
                        setUpdatingPrototype(true);
                        toast.info("AI Sandbox modifying code...");
                        try {
                          const res = await updatePrototype({
                            data: {
                              currentHtml: prototypeHtml,
                              prompt: prototypePrompt,
                            }
                          });
                          setPrototypeHtml(res.html);
                          setPrototypePrompt("");
                          toast.success("Sandbox code updated!");
                          awardXP(20, "Updated project sandbox");
                        } catch (err) {
                          toast.error("Failed to update sandbox");
                        } finally {
                          setUpdatingPrototype(false);
                        }
                      }}
                      disabled={updatingPrototype || !prototypePrompt.trim()}
                      className="w-full py-2 rounded-xl bg-gradient-spark text-primary-foreground font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 hover:scale-[1.02] transition disabled:opacity-50 shadow-glow cursor-none"
                    >
                      {updatingPrototype ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Cpu className="h-3.5 w-3.5" />
                      )}
                      <span>{updatingPrototype ? "Updating..." : "Update Sandbox"}</span>
                    </button>
                  </div>

                  {/* Right simulated browser */}
                  <div className="rounded-2xl border border-white/10 overflow-hidden bg-white/5 flex flex-col h-full">
                    <div className="flex justify-between items-center px-4 py-2 border-b border-white/5 bg-black/40 text-[10px]">
                      <div className="flex gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                      </div>
                      <div className="text-[9px] uppercase tracking-wider opacity-60 font-mono text-spark">
                        http://localhost:3000/app-sandbox
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => {
                            if (prototypeHtml) {
                              navigator.clipboard.writeText(prototypeHtml);
                              toast.success("Sandbox HTML copied to clipboard!");
                            }
                          }}
                          className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[9px] text-muted-foreground hover:bg-white/10 transition cursor-none"
                        >
                          Copy Code
                        </button>
                        <button
                          onClick={() => {
                            setShowSandboxCodeModal(true);
                          }}
                          className="rounded bg-spark/20 border border-spark/30 px-2 py-0.5 text-spark hover:bg-spark/30 transition text-[9px] cursor-none"
                        >
                          Code View
                        </button>
                      </div>
                    </div>
                    
                    <iframe
                      title="AI App Sandbox Preview"
                      srcDoc={prototypeHtml}
                      className="flex-1 w-full bg-white border-0"
                    />
                  </div>
                </div>
              )}

              {tab === "overview" && (
                <div className="grid gap-4 md:grid-cols-2">
                  <BlueprintCard
                    icon={Layers}
                    title="Frontend stack"
                    items={bp.techStack.frontend}
                  />
                  <BlueprintCard icon={Server} title="Backend stack" items={bp.techStack.backend} />
                  <BlueprintCard icon={Database} title="Database" items={bp.techStack.database} />
                  <BlueprintCard icon={Cloud} title="DevOps" items={bp.techStack.devops} />
                  <BlueprintCard
                    icon={Wrench}
                    title="Frontend architecture"
                    items={bp.frontendArchitecture}
                  />
                  <BlueprintCard
                    icon={Wrench}
                    title="Backend architecture"
                    items={bp.backendArchitecture}
                  />
                  <BlueprintCard icon={Beaker} title="MVP plan" items={bp.mvpPlan} />
                  <BlueprintCard
                    icon={Beaker}
                    title="Testing strategy"
                    items={bp.testingStrategy}
                  />
                  <BlueprintCard
                    icon={Wrench}
                    title="Recommended libraries"
                    items={bp.recommendedLibraries}
                  />
                  <BlueprintCard icon={Wrench} title="Env variables" items={bp.envVariables} mono />
                </div>
              )}

              {tab === "structure" && (
                <div className="rounded-2xl border border-border bg-card/60 p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <FolderTree className="h-4 w-4 text-spark" />
                    <h3 className="text-sm font-medium">Folder structure</h3>
                  </div>
                  <pre className="overflow-x-auto rounded-lg bg-background/60 p-4 font-mono text-xs leading-relaxed">
                    {bp.folderStructure.join("\n")}
                  </pre>
                </div>
              )}

              {tab === "schema" && (
                <div className="space-y-3">
                  {bp.databaseSchema.map((t, i) => (
                    <div key={i} className="rounded-2xl border border-border bg-card/60 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Database className="h-4 w-4 text-spark" />
                        <h3 className="font-mono text-sm">{t.table}</h3>
                      </div>
                      <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                        {t.columns.map((c, n) => (
                          <li
                            key={n}
                            className="rounded border border-border bg-background/40 px-2 py-1 font-mono text-xs"
                          >
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {tab === "api" && (
                <div className="rounded-2xl border border-border bg-card/60 p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <Server className="h-4 w-4 text-spark" />
                    <h3 className="text-sm font-medium">API routes</h3>
                  </div>
                  <ul className="divide-y divide-border">
                    {bp.apiRoutes.map((r, i) => (
                      <li
                        key={i}
                        className="flex flex-wrap items-center gap-3 py-2 font-mono text-xs"
                      >
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold ${methodColor(r.method)}`}
                        >
                          {r.method.toUpperCase()}
                        </span>
                        <span className="text-foreground">{r.path}</span>
                        <span className="text-muted-foreground">— {r.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {tab === "code" && (
                <div className="space-y-4">
                  {bp.starterSnippets.map((s, i) => (
                    <CodeBlock key={i} {...s} />
                  ))}
                  <BlueprintCard
                    icon={GitBranch}
                    title="GitHub workflow"
                    items={bp.githubWorkflow}
                  />
                </div>
              )}

              {tab === "deploy" && (
                <div className="grid gap-4 md:grid-cols-2">
                  <BlueprintCard
                    icon={Rocket}
                    title="Deployment steps"
                    items={bp.deploymentSteps}
                    ordered
                  />
                  <BlueprintCard icon={GitBranch} title="CI/CD" items={bp.cicd} />
                  <BlueprintCard icon={FileCode} title="Auth setup" items={bp.authSetup} ordered />
                  <BlueprintCard
                    icon={Layers}
                    title="Implementation steps"
                    items={bp.implementationSteps.map((s) => `${s.step}. ${s.title} — ${s.detail}`)}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showSandboxCodeModal && prototypeHtml && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="relative w-full max-w-[640px] rounded-3xl border border-white/10 bg-card p-6 shadow-glow">
            <button
              onClick={() => setShowSandboxCodeModal(false)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground transition cursor-none"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="font-display text-base font-bold text-foreground mb-2 flex items-center gap-2">
              <FileCode className="h-5 w-5 text-spark" /> Sandbox Prototype Code View
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Here is the HTML/CSS/JS source code generated for your sandbox web prototype.
            </p>
            
            <textarea
              readOnly
              value={prototypeHtml}
              rows={12}
              className="w-full rounded-xl border border-white/10 bg-background/50 p-4 font-mono text-[10px] leading-relaxed text-spark outline-none"
            />

            <div className="mt-4 flex gap-2 justify-end">
              <button
                onClick={() => setShowSandboxCodeModal(false)}
                className="px-4 py-2 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-xs font-semibold text-foreground transition cursor-none"
              >
                Close
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(prototypeHtml);
                  toast.success("Code copied!");
                }}
                className="px-4.5 py-2 rounded-xl bg-gradient-spark text-primary-foreground font-semibold shadow-glow hover:opacity-95 transition text-xs flex items-center gap-1.5 cursor-none"
              >
                <Copy className="h-4 w-4" />
                <span>Copy Code</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </PageShell>
  );
}

function methodColor(m: string) {
  const x = m.toUpperCase();
  if (x === "GET") return "bg-emerald-500/20 text-emerald-400";
  if (x === "POST") return "bg-blue-500/20 text-blue-400";
  if (x === "PUT" || x === "PATCH") return "bg-amber-500/20 text-amber-400";
  if (x === "DELETE") return "bg-red-500/20 text-red-400";
  return "bg-muted text-foreground";
}

function BlueprintCard({
  icon: Icon,
  title,
  items,
  mono,
  ordered,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  items: string[];
  mono?: boolean;
  ordered?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-spark" />
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      <ul className={`space-y-1.5 ${mono ? "font-mono text-xs" : "text-sm"}`}>
        {items.map((i, n) => (
          <li key={n} className="flex gap-2">
            <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-spark/20 text-[10px] text-spark">
              {ordered ? n + 1 : "•"}
            </span>
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CodeBlock({
  filename,
  language,
  code,
}: {
  filename: string;
  language: string;
  code: string;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card/60">
      <div className="flex items-center justify-between border-b border-border bg-background/40 px-4 py-2">
        <div className="flex items-center gap-2 text-xs">
          <FileCode className="h-3.5 w-3.5 text-spark" />
          <span className="font-mono">{filename}</span>
          <span className="text-muted-foreground">· {language}</span>
        </div>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1 rounded px-2 py-1 text-[10px] text-muted-foreground hover:bg-card hover:text-foreground"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed">{code}</pre>
    </div>
  );
}
