import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateMentorPlan } from "@/lib/ai.functions";
import type { MentorPlan } from "@/lib/schemas";
import { PageShell, PageHeader } from "@/components/PageHeader";
import {
  Brain,
  Loader2,
  Lightbulb,
  Target,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { SaveBar } from "@/components/SaveBar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { awardXP, XP } from "@/lib/gamification";
import { toast } from "sonner";
import { z } from "zod";
import { MentorHologram } from "@/components/MentorHologram";
import { HolographicPanel } from "@/components/HolographicPanel";

type MentorRow = {
  id: string;
  created_at: string;
  topic: string;
  level: string;
  goal: string | null;
  plan: MentorPlan;
};

const mentorSearchSchema = z.object({
  node: z.string().optional(),
  restoreId: z.string().optional(),
});

export const Route = createFileRoute("/_app/mentor")({
  validateSearch: mentorSearchSchema,
  head: () => ({ meta: [{ title: "AI Mentor — ProjectSpark" }] }),
  component: MentorPage,
});

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

function MentorPage() {
  const generate = useServerFn(generateMentorPlan);
  const { user } = useAuth();
  const { node, restoreId } = Route.useSearch();

  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<MentorPlan | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (restoreId && user) {
      const loadSaved = async () => {
        const { data, error } = await supabase
          .from("mentor_plans")
          .select("*")
          .eq("id", restoreId)
          .single();
        if (error) {
          toast.error("Failed to load saved mentor plan");
          return;
        }
        if (data) {
          setTopic(data.topic);
          setLevel(data.level);
          setGoal(data.goal ?? "");
          setPlan(data.plan as any);
          setDone({});
          toast.success("Loaded saved lesson plan!");
        }
      };
      loadSaved();
    }
  }, [restoreId, user]);

  useEffect(() => {
    if (node) {
      const [domainSlug, nodeId] = node.split(":");
      const cleanTopic = nodeId
        ? nodeId
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")
        : node;
      setTopic(cleanTopic);
      const cleanGoal = `Master ${cleanTopic} inside ${domainSlug}`;
      setGoal(cleanGoal);

      setLoading(true);
      setErr(null);
      setPlan(null);
      generate({ data: { topic: cleanTopic, level, goal: cleanGoal } })
        .then((res) => setPlan(res))
        .catch((e) => setErr(e instanceof Error ? e.message : "Failed"))
        .finally(() => setLoading(false));
    }
  }, [node]);

  const onGen = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setErr(null);
    setPlan(null);
    try {
      setPlan(await generate({ data: { topic, level, goal: goal || `Learn ${topic}` } }));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const onSave = async () => {
    if (!user || !plan) return;
    const { error } = await supabase.from("mentor_plans").insert({
      user_id: user.id,
      topic,
      level,
      goal: goal || null,
      plan: plan as unknown as never,
    });
    if (error) {
      toast.error("Save failed");
      return;
    }
    await awardXP(XP.SAVE_MENTOR, "Saved mentor plan");
  };

  const SUGGESTIONS = [
    "React Hooks",
    "System Design",
    "TypeScript Generics",
    "Machine Learning Basics",
    "Docker",
    "GraphQL",
    "Postgres Indexes",
    "Tailwind CSS",
  ];

  return (
    <PageShell>
      <PageHeader
        icon={Brain}
        title="AI Mentor"
        description="A patient, structured tutor that builds you a personal lesson plan for any topic."
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/chat"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-card/60"
            >
              Open chat <ArrowRight className="h-3 w-3" />
            </Link>
            <SaveBar<MentorRow>
              canSave={!!plan}
              onSave={onSave}
              pickerTable="mentor_plans"
              pickerSelect="id, created_at, topic, level, goal, plan"
              pickerToRow={(r) => ({
                id: r.id,
                label: r.topic,
                meta: `${r.level}${r.goal ? " · " + r.goal : ""}`,
              })}
              pickerOnPick={(r) => {
                setTopic(r.topic);
                setLevel(r.level);
                setGoal(r.goal ?? "");
                setPlan(r.plan);
                setDone({});
              }}
            />
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <HolographicPanel className="space-y-4 p-6">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
              Topic
            </label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. React Server Components"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
              Your level
            </label>
            <div className="flex flex-wrap gap-1.5">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`rounded-full border px-3 py-1 text-xs ${level === l ? "border-spark bg-spark/15 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
              Goal (optional)
            </label>
            <input
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="What outcome do you want?"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <button
            onClick={onGen}
            disabled={loading || !topic.trim()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-spark px-4 py-3 text-sm font-medium text-primary-foreground shadow-glow disabled:opacity-50 cursor-pointer"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
            {loading ? "Designing lesson…" : "Generate lesson plan"}
          </button>
          {err && <p className="text-xs text-destructive">{err}</p>}

          <div>
            <div className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">
              Try
            </div>
            <div className="flex flex-wrap gap-1">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setTopic(s);
                    onGen();
                  }}
                  className="rounded-lg border border-border bg-background/30 px-2.5 py-1.5 text-xs hover:bg-white/5 transition text-left w-full truncate cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </HolographicPanel>

        <div className="min-h-[400px] space-y-4 min-w-0">
          {!plan && !loading && (
            <div className="flex h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 text-center text-sm text-muted-foreground p-8">
              <MentorHologram isTyping={false} color="#ec4899" />
              <p className="mt-5 text-sm">Pick a topic — your mentor will design the path.</p>
            </div>
          )}
          {loading && (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-20 animate-pulse rounded-2xl bg-muted/30" />
              ))}
            </div>
          )}
          {plan && (
            <>
              <div className="rounded-2xl border border-border bg-gradient-to-br from-card/80 to-card/30 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-spark">Lesson plan</div>
                    <h2 className="font-display text-2xl font-semibold">{plan.topic}</h2>
                  </div>
                  <div className="rounded-lg border border-border bg-background/40 px-3 py-1.5 text-xs">
                    ~{plan.estimatedHours}h
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{plan.overview}</p>
              </div>

              <div className="rounded-2xl border border-border bg-card/60 p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4 text-spark" />
                  <h3 className="text-sm font-medium">Prerequisites</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {plan.prerequisites.map((p, i) => (
                    <span
                      key={i}
                      className="rounded-md border border-border bg-background/40 px-2 py-1 text-xs"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {plan.concepts.map((c, i) => (
                  <div key={i} className="rounded-2xl border border-border bg-card/60 p-5">
                    <div className="flex items-start gap-3 w-full min-w-0">
                      <button
                        onClick={() => setDone((d) => ({ ...d, [i]: !d[i] }))}
                        className={`mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border ${done[i] ? "border-spark bg-spark text-primary-foreground" : "border-border"}`}
                      >
                        {done[i] ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <span className="text-[10px]">{i + 1}</span>
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <h4
                          className={`font-medium ${done[i] ? "text-muted-foreground line-through" : ""}`}
                        >
                          {c.name}
                        </h4>
                        <p className="mt-1 text-sm text-muted-foreground">{c.explanation}</p>
                        <pre className="mt-2 w-full max-w-full overflow-x-auto rounded-lg border border-border bg-background/60 p-3 font-mono text-xs leading-relaxed">
                          {c.example}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card icon={Lightbulb} title="Practice tasks" items={plan.practiceTasks} />
                <Card icon={Sparkles} title="Next steps" items={plan.nextSteps} />
              </div>
            </>
          )}
        </div>
      </div>
    </PageShell>
  );
}

function Card({
  icon: Icon,
  title,
  items,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-spark" />
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      <ul className="space-y-1.5 text-sm">
        {items.map((i, n) => (
          <li key={n} className="flex gap-2">
            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-spark" />
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}
