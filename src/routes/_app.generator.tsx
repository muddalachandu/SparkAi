import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateProjectIdea } from "@/lib/ai.functions";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PageShell, PageHeader } from "@/components/PageHeader";
import { unlockAchievement } from "@/lib/gamification";
import type { ProjectIdea } from "@/lib/schemas";
import {
  Sparkles,
  Loader2,
  Bookmark,
  BookmarkCheck,
  Cpu,
  Wrench,
  Network,
  CalendarDays,
  Rocket,
  Trophy,
  Hammer,
} from "lucide-react";

export const Route = createFileRoute("/_app/generator")({
  head: () => ({ meta: [{ title: "Project Generator — ProjectSpark" }] }),
  component: GeneratorPage,
});

const DOMAINS = [
  "AI/ML",
  "Web",
  "Mobile",
  "IoT",
  "Blockchain",
  "AR/VR",
  "Cybersecurity",
  "Data Science",
  "DevOps",
  "Robotics",
];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];
const TYPES = ["Mini Project", "Major Project", "Research", "Hackathon"];
const DURATIONS = ["1 week", "2-4 weeks", "1-2 months", "3+ months"];
const TEAMS = ["Solo", "2-3", "4-6", "7+"];

function GeneratorPage() {
  const { user } = useAuth();
  const generate = useServerFn(generateProjectIdea);
  const [domains, setDomains] = useState<string[]>(["AI/ML"]);
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [projectType, setProjectType] = useState("Major Project");
  const [duration, setDuration] = useState("1-2 months");
  const [teamSize, setTeamSize] = useState("Solo");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [idea, setIdea] = useState<ProjectIdea | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  const toggleDomain = (d: string) =>
    setDomains((arr) => (arr.includes(d) ? arr.filter((x) => x !== d) : [...arr, d]));

  const onGenerate = async () => {
    setLoading(true);
    setError(null);
    setIdea(null);
    setSavedId(null);
    try {
      const result = await generate({
        data: { domains, difficulty, projectType, duration, teamSize },
      });
      setIdea(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate idea");
    } finally {
      setLoading(false);
    }
  };

  const onSave = async (bookmark: boolean) => {
    if (!idea || !user) return;
    const sanitize = (n: unknown) => {
      const v = Number(n);
      return Number.isFinite(v) ? Math.max(0, Math.min(10, v)) : 0;
    };
    try {
      const { data, error } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          title: idea.title,
          problem_statement: idea.problemStatement,
          solution_overview: idea.solutionOverview,
          technologies: idea.technologies,
          requirements: idea.requirements,
          architecture: idea.architecture,
          timeline: idea.timeline,
          future_scope: idea.futureScope,
          resume_value_score: sanitize(idea.resumeValueScore),
          innovation_score: sanitize(idea.innovationScore),
          tech_depth_score: sanitize(idea.techDepthScore),
          market_potential: idea.marketPotential,
          difficulty: idea.difficulty,
          domains: idea.domains,
          bookmarked: bookmark,
        })
        .select("id")
        .single();
      if (error) throw error;
      setSavedId(data.id);
      await unlockAchievement({
        code: "first-project",
        title: "First Spark",
        description: "Generate your first AI project idea.",
        icon: "Sparkles",
        xp: 50,
      });
      const { toast } = await import("sonner");
      toast.success(bookmark ? "Bookmarked!" : "Project saved!");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save project";
      console.error("[save project]", err);
      setError(msg);
      const { toast } = await import("sonner");
      toast.error(msg);
    }
  };

  return (
    <PageShell>
      <PageHeader
        icon={Sparkles}
        title="AI Project Generator"
        description="Tell us your constraints — get a fully-architected, original project idea in seconds."
      />

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="space-y-5 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur">
          <Field label="Domains (multi)">
            <div className="flex flex-wrap gap-1.5">
              {DOMAINS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDomain(d)}
                  className={`rounded-full border px-3 py-1 text-xs transition ${domains.includes(d) ? "border-spark bg-spark/15 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Difficulty">
            <Pills value={difficulty} setValue={setDifficulty} options={DIFFICULTIES} />
          </Field>
          <Field label="Type">
            <Pills value={projectType} setValue={setProjectType} options={TYPES} />
          </Field>
          <Field label="Duration">
            <Pills value={duration} setValue={setDuration} options={DURATIONS} />
          </Field>
          <Field label="Team size">
            <Pills value={teamSize} setValue={setTeamSize} options={TEAMS} />
          </Field>

          <button
            onClick={onGenerate}
            disabled={loading || domains.length === 0}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-spark px-4 py-3 text-sm font-medium text-primary-foreground shadow-glow transition hover:opacity-95 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {loading ? "Generating…" : "Generate idea"}
          </button>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <div className="min-h-[400px] rounded-2xl border border-border bg-card/40 p-6 backdrop-blur">
          {!idea && !loading && (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-muted-foreground">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-spark text-primary-foreground shadow-glow animate-float">
                <Sparkles className="h-6 w-6" />
              </div>
              <p className="text-sm">
                Configure your constraints and let ProjectSpark conjure something brilliant.
              </p>
            </div>
          )}
          {loading && (
            <div className="space-y-3">
              <div className="h-7 w-2/3 animate-pulse rounded bg-muted/60" />
              <div className="h-4 w-full animate-pulse rounded bg-muted/40" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-muted/40" />
              <div className="mt-6 grid grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-24 animate-pulse rounded-xl bg-muted/30" />
                ))}
              </div>
            </div>
          )}
          {idea && <IdeaView idea={idea} onSave={onSave} savedId={savedId} />}
        </div>
      </div>
    </PageShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}
function Pills({
  value,
  setValue,
  options,
}: {
  value: string;
  setValue: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => setValue(o)}
          className={`rounded-full border px-3 py-1 text-xs transition ${value === o ? "border-spark bg-spark/15 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function IdeaView({
  idea,
  onSave,
  savedId,
}: {
  idea: ProjectIdea;
  onSave: (b: boolean) => void;
  savedId: string | null;
}) {
  const navigate = useNavigate();
  const buildThis = () => {
    sessionStorage.setItem("ps:buildIdea", JSON.stringify(idea));
    navigate({ to: "/builder" });
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold">{idea.title}</h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {idea.domains.map((d) => (
              <span
                key={d}
                className="rounded-full border border-spark/40 bg-spark/10 px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-spark"
              >
                {d}
              </span>
            ))}
            <span className="rounded-full border border-border px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
              {idea.difficulty}
            </span>
            <span className="rounded-full border border-border px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
              {idea.marketPotential} market
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onSave(false)}
            disabled={!!savedId}
            className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-card/60 disabled:opacity-50"
          >
            Save
          </button>
          <button
            onClick={() => onSave(true)}
            disabled={!!savedId}
            className="inline-flex items-center gap-1.5 rounded-lg border border-spark/50 bg-spark/10 px-3 py-1.5 text-xs font-medium text-spark disabled:opacity-50"
          >
            {savedId ? (
              <BookmarkCheck className="h-3.5 w-3.5" />
            ) : (
              <Bookmark className="h-3.5 w-3.5" />
            )}
            {savedId ? "Saved" : "Bookmark"}
          </button>
          <button
            onClick={buildThis}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-spark px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-glow transition hover:opacity-95"
          >
            <Hammer className="h-3.5 w-3.5" />
            Build this project
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat
          icon={Trophy}
          label="Resume value"
          value={`${Number(idea.resumeValueScore).toFixed(1)}/10`}
        />
        <Stat
          icon={Rocket}
          label="Innovation"
          value={`${Number(idea.innovationScore).toFixed(1)}/10`}
        />
        <Stat
          icon={Network}
          label="Tech depth"
          value={`${Number(idea.techDepthScore).toFixed(1)}/10`}
        />
      </div>

      <Section title="Problem" body={idea.problemStatement} />
      <Section title="Solution" body={idea.solutionOverview} />

      <div>
        <SectionTitle>Tech stack</SectionTitle>
        <div className="flex flex-wrap gap-1.5">
          {idea.technologies.map((t) => (
            <span
              key={t}
              className="rounded-md border border-border bg-card/60 px-2 py-1 font-mono text-[11px]"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ListBlock icon={Cpu} title="Hardware" items={idea.requirements.hardware} />
        <ListBlock icon={Wrench} title="Software" items={idea.requirements.software} />
      </div>

      <ListBlock icon={Network} title="Architecture" items={idea.architecture} ordered />
      <ListBlock icon={CalendarDays} title="Timeline" items={idea.timeline} ordered />
      <ListBlock icon={Rocket} title="Future scope" items={idea.futureScope} />
    </div>
  );
}
function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-3">
      <Icon className="h-3.5 w-3.5 text-spark" />
      <div className="mt-2 font-display text-lg">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
      {children}
    </h3>
  );
}
function Section({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <SectionTitle>{title}</SectionTitle>
      <p className="text-sm leading-relaxed text-foreground/90">{body}</p>
    </div>
  );
}
function ListBlock({
  icon: Icon,
  title,
  items,
  ordered,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  items: string[];
  ordered?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card/40 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-spark" />
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      <ul className="space-y-1.5 text-sm text-foreground/90">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-spark/20 text-[10px] text-spark">
              {ordered ? i + 1 : "•"}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
