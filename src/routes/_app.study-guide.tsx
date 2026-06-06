import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateStudyGuide } from "@/lib/ai.functions";
import type { StudyGuide } from "@/lib/schemas";
import { PageShell, PageHeader } from "@/components/PageHeader";
import { GraduationCap, Loader2, BookOpen, FlaskConical, Brain, Bookmark, Cpu } from "lucide-react";
import { SaveBar } from "@/components/SaveBar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { awardXP, XP, unlockAchievement } from "@/lib/gamification";
import { toast } from "sonner";
import { z } from "zod";
import { StudyGuideUniverse } from "@/components/StudyGuideUniverse";
import { HolographicPanel } from "@/components/HolographicPanel";
import { getBYOXLinkForTask } from "@/lib/byox-link";

type StudyRow = {
  id: string;
  created_at: string;
  domain: string;
  skill_level: string;
  goal: string;
  daily_minutes: number;
  content: StudyGuide;
};

const studySearchSchema = z.object({
  node: z.string().optional(),
  restoreId: z.string().optional(),
});

export const Route = createFileRoute("/_app/study-guide")({
  validateSearch: studySearchSchema,
  head: () => ({ meta: [{ title: "Study Guide — ProjectSpark" }] }),
  component: StudyPage,
});

const DOMAINS = [
  "Web Dev",
  "AI/ML",
  "Data Science",
  "Mobile",
  "Cybersecurity",
  "Cloud",
  "DevOps",
  "Blockchain",
];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];

function StudyPage() {
  const generate = useServerFn(generateStudyGuide);
  const { user } = useAuth();
  const { node, restoreId } = Route.useSearch();

  const [domain, setDomain] = useState(DOMAINS[0]);
  const [skillLevel, setSkillLevel] = useState("Beginner");
  const [goal, setGoal] = useState("Land first dev job");
  const [dailyMinutes, setDailyMinutes] = useState(60);
  const [loading, setLoading] = useState(false);
  const [guide, setGuide] = useState<StudyGuide | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");

  useEffect(() => {
    if (node) {
      const [domainSlug, nodeId] = node.split(":");
      const cleanTopic = nodeId
        ? nodeId
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")
        : node;
      setDomain(cleanTopic);
      const cleanGoal = `Learn ${cleanTopic} inside ${domainSlug}`;
      setGoal(cleanGoal);

      setLoading(true);
      setErr(null);
      setGuide(null);
      generate({ data: { domain: cleanTopic, skillLevel, goal: cleanGoal, dailyMinutes } })
        .then((res) => setGuide(res))
        .catch((e) => setErr(e instanceof Error ? e.message : "Failed"))
        .finally(() => setLoading(false));
    }
  }, [node]);

  useEffect(() => {
    if (restoreId && user) {
      const loadSavedGuide = async () => {
        setLoading(true);
        setErr(null);
        try {
          const { data, error } = await supabase
            .from("study_guides")
            .select("id, created_at, domain, skill_level, goal, daily_minutes, content")
            .eq("id", restoreId)
            .single();
          if (error) throw error;
          if (data) {
            setDomain(data.domain);
            setSkillLevel(data.skill_level);
            setGoal(data.goal);
            setDailyMinutes(data.daily_minutes);
            setGuide(data.content as unknown as StudyGuide);
            setCompleted({});
            setBookmarks({});
          }
        } catch (e) {
          setErr(e instanceof Error ? e.message : "Failed to load study guide");
        } finally {
          setLoading(false);
        }
      };
      loadSavedGuide();
    }
  }, [restoreId, user]);

  const onGen = async () => {
    setLoading(true);
    setErr(null);
    setGuide(null);
    try {
      setGuide(await generate({ data: { domain, skillLevel, goal, dailyMinutes } }));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const onSave = async () => {
    if (!user || !guide) return;
    const { error } = await supabase.from("study_guides").insert({
      user_id: user.id,
      domain,
      skill_level: skillLevel,
      goal,
      daily_minutes: dailyMinutes,
      content: guide as unknown as never,
    });
    if (error) {
      toast.error("Save failed");
      return;
    }
    await awardXP(XP.SAVE_STUDY, "Saved study guide");
    await unlockAchievement({
      code: "save-study",
      title: "Focused Learner",
      description: "Create and save a weekly study guide.",
      icon: "GraduationCap",
      xp: 50,
    });
  };

  const totalTasks = guide?.weeks.reduce((a, w) => a + w.tasks.length, 0) ?? 0;
  const doneTasks = Object.values(completed).filter(Boolean).length;
  const xp = doneTasks * 25;
  const streak = Math.min(doneTasks, 30);

  return (
    <PageShell>
      <PageHeader
        icon={GraduationCap}
        title="AI Study Guide"
        description="A personalised, week-by-week curriculum with tasks, resources, projects and quizzes."
        actions={
          <SaveBar<StudyRow>
            canSave={!!guide}
            onSave={onSave}
            pickerTable="study_guides"
            pickerSelect="id, created_at, domain, skill_level, goal, daily_minutes, content"
            pickerToRow={(r) => ({
              id: r.id,
              label: r.domain,
              meta: `${r.skill_level} · ${r.goal}`,
            })}
            pickerOnPick={(r) => {
              setDomain(r.domain);
              setSkillLevel(r.skill_level);
              setGoal(r.goal);
              setDailyMinutes(r.daily_minutes);
              setGuide(r.content);
              setCompleted({});
              setBookmarks({});
            }}
          />
        }
      />

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="space-y-4 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur">
          <Field label="Domain">
            <Pills value={domain} setValue={setDomain} options={DOMAINS} />
          </Field>
          <Field label="Skill level">
            <Pills value={skillLevel} setValue={setSkillLevel} options={LEVELS} />
          </Field>
          <Field label="Your goal">
            <input
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </Field>
          <Field label={`Daily time: ${dailyMinutes} min`}>
            <input
              type="range"
              min={15}
              max={240}
              step={15}
              value={dailyMinutes}
              onChange={(e) => setDailyMinutes(+e.target.value)}
              className="w-full accent-spark"
            />
          </Field>
          <button
            onClick={onGen}
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-spark px-4 py-3 text-sm font-medium text-primary-foreground shadow-glow disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <GraduationCap className="h-4 w-4" />
            )}
            {loading ? "Generating…" : "Generate study guide"}
          </button>
          {err && <p className="text-xs text-destructive">{err}</p>}

          {guide && (
            <div className="grid grid-cols-3 gap-2">
              <MiniStat label="XP" value={xp} />
              <MiniStat label="Streak" value={`${streak}d`} />
              <MiniStat label="Done" value={`${doneTasks}/${totalTasks}`} />
            </div>
          )}
        </div>

        <div className="min-h-[400px] space-y-4 relative">
          {guide && (
            <div className="absolute right-0 top-0 z-10 flex rounded-xl border border-white/5 bg-black/55 p-1 backdrop-blur">
              <button
                onClick={() => setViewMode("3d")}
                className={`rounded-lg px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-widest transition-colors ${
                  viewMode === "3d"
                    ? "bg-gradient-spark text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                3D Universe
              </button>
              <button
                onClick={() => setViewMode("2d")}
                className={`rounded-lg px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-widest transition-colors ${
                  viewMode === "2d"
                    ? "bg-gradient-spark text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                2D List
              </button>
            </div>
          )}

          {!guide && !loading && (
            <div className="flex h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 text-center text-sm text-muted-foreground">
              <GraduationCap className="mb-3 h-8 w-8 text-spark animate-float" />
              Pick your goal — get a complete curriculum.
            </div>
          )}
          {loading && (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted/30" />
              ))}
            </div>
          )}
          {guide && (
            <>
              {viewMode === "3d" ? (
                <StudyGuideUniverse
                  guide={guide}
                  completed={completed}
                  onToggleComplete={(k) => setCompleted((c) => ({ ...c, [k]: !c[k] }))}
                  bookmarks={bookmarks}
                  onToggleBookmark={(k) => setBookmarks((b) => ({ ...b, [k]: !b[k] }))}
                />
              ) : (
                <>
                  <div className="rounded-2xl border border-border bg-gradient-to-br from-card/80 to-card/30 p-5">
                    <div className="text-xs uppercase tracking-widest text-spark">Curriculum</div>
                    <h2 className="font-display text-2xl font-semibold">{guide.title}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">{guide.summary}</p>
                  </div>

                  <div className="space-y-3">
                    {guide.weeks.map((w) => (
                      <div key={w.week} className="rounded-2xl border border-border bg-card/60 p-5">
                        <div className="mb-3 flex items-center justify-between">
                          <h3 className="font-medium">
                            Week {w.week} — {w.focus}
                          </h3>
                          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                            {w.tasks.length} tasks
                          </span>
                        </div>
                        <ul className="space-y-1.5">
                          {w.tasks.map((t, i) => {
                            const k = `w${w.week}-${i}`;
                            const ck = `b-${k}`;
                            const byoxLink = getBYOXLinkForTask(t);
                            return (
                              <li key={i} className="flex items-center gap-2 text-sm justify-between">
                                <div className="flex items-start gap-2 min-w-0 flex-1">
                                  <button
                                    onClick={() => setCompleted((c) => ({ ...c, [k]: !c[k] }))}
                                    className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border ${completed[k] ? "border-spark bg-spark text-primary-foreground" : "border-border"}`}
                                  >
                                    {completed[k] && "✓"}
                                  </button>
                                  <span
                                    className={`flex-1 truncate ${completed[k] ? "text-muted-foreground line-through" : ""}`}
                                    title={t}
                                  >
                                    {t}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  {byoxLink && (
                                    <Link
                                      to="/build-your-own-x"
                                      search={{ query: byoxLink.query }}
                                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-spark/20 hover:bg-spark/35 border border-spark/30 hover:border-spark/50 text-[9px] font-bold text-spark transition shadow-glow"
                                    >
                                      <Cpu className="h-2.5 w-2.5" />
                                      <span>{byoxLink.label} ↗</span>
                                    </Link>
                                  )}
                                  <button
                                    onClick={() => setBookmarks((b) => ({ ...b, [ck]: !b[ck] }))}
                                    className={`shrink-0 ${bookmarks[ck] ? "text-spark" : "text-muted-foreground hover:text-foreground"}`}
                                  >
                                    <Bookmark
                                      className="h-3.5 w-3.5"
                                      fill={bookmarks[ck] ? "currentColor" : "none"}
                                    />
                                  </button>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                        {w.resources.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {w.resources.map((r, i) => (
                              <span
                                key={i}
                                className="rounded-md border border-border bg-background/40 px-2 py-0.5 text-[10px] text-muted-foreground"
                              >
                                {r}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Card icon={FlaskConical} title="Mini projects" items={guide.miniProjects} />
                    <Card icon={Brain} title="Quizzes" items={guide.quizzes} />
                  </div>
                </>
              )}
            </>
          )}
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
          onClick={() => setValue(o)}
          className={`rounded-full border px-3 py-1 text-xs ${value === o ? "border-spark bg-spark/15 text-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-2 text-center">
      <div className="font-display text-lg">{value}</div>
      <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
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
        <BookOpen className="hidden" />
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
