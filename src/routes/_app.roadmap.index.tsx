import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateCustomRoadmap } from "@/lib/roadmap.functions";
import { DOMAINS } from "@/lib/domains";
import { PageShell, PageHeader } from "@/components/PageHeader";
import { SaveBar } from "@/components/SaveBar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { awardXP, XP, unlockAchievement } from "@/lib/gamification";
import { toast } from "sonner";
import {
  Compass,
  Loader2,
  Target,
  Calendar,
  Award,
  BookOpen,
  Sparkles,
  ChevronDown,
  CheckCircle,
} from "lucide-react";

export const Route = createFileRoute("/_app/roadmap/")({
  head: () => ({ meta: [{ title: "Roadmap Planner — ProjectSpark" }] }),
  component: RoadmapIndexPage,
});

const ROLES_SUGGESTIONS = [
  "AI Engineer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Cybersecurity Analyst",
  "Data Scientist",
  "UI/UX Designer",
];
const TIMEFRAMES = ["3 months", "6 months", "9 months", "12 months"];
const LEVELS = ["Absolute beginner", "Some basics", "Intermediate", "Advanced"];

type CustomRoadmapData = {
  goal: string;
  weeks: Array<{
    week: number;
    theme: string;
    daily: string[];
    milestone: string;
    project?: string;
  }>;
  resources: Array<{
    type: string;
    title: string;
    url: string;
  }>;
};

type SavedRoadmapRow = {
  id: string;
  created_at: string;
  target_role: string;
  timeframe: string;
  experience_level: string;
  content: CustomRoadmapData;
};

function RoadmapIndexPage() {
  const navigate = useNavigate();
  const generate = useServerFn(generateCustomRoadmap);
  const { user } = useAuth();

  // Custom roadmap builder states
  const [goal, setGoal] = useState("");
  const [timeframe, setTimeframe] = useState("6 months");
  const [level, setLevel] = useState("Some basics");
  const [loading, setLoading] = useState(false);
  const [customData, setCustomData] = useState<CustomRoadmapData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [openWeek, setOpenWeek] = useState<number | null>(1);

  // Load list of popular flagship domains to display
  const popularDomains = DOMAINS.filter((d) =>
    [
      "react",
      "nextjs",
      "python",
      "machine-learning",
      "generative-ai",
      "aws",
      "devops",
      "cybersecurity",
      "dsa",
      "system-design",
      "flutter",
      "ui-ux",
    ].includes(d.slug),
  ).slice(0, 6);

  const onGen = async () => {
    if (!goal.trim()) return;
    setLoading(true);
    setError(null);
    setCustomData(null);
    try {
      const res = await generate({ data: { goal, timeframe, level } });
      setCustomData(res as unknown as CustomRoadmapData);
      setOpenWeek(1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate roadmap");
    } finally {
      setLoading(false);
    }
  };

  const onSave = async () => {
    if (!user || !customData) return;
    const { error } = await supabase.from("roadmaps").insert({
      user_id: user.id,
      target_role: goal,
      timeframe,
      experience_level: level,
      content: customData as any,
    });
    if (error) {
      toast.error("Save failed");
      return;
    }
    await awardXP(XP.SAVE_ROADMAP, "Saved custom roadmap");
    await unlockAchievement({
      code: "save-roadmap",
      title: "Curriculum Architect",
      description: "Design and save a custom career roadmap.",
      icon: "Compass",
      xp: 50,
    });
  };

  return (
    <PageShell>
      <PageHeader
        icon={Compass}
        title="AI Roadmap Planner"
        description="Build highly customized, week-by-week career roadmaps or explore flagship curriculum tracks."
        actions={
          <SaveBar<SavedRoadmapRow>
            canSave={!!customData}
            onSave={onSave}
            pickerTable="roadmaps"
            pickerSelect="id, created_at, target_role, timeframe, experience_level, content"
            pickerToRow={(r) => ({
              id: r.id,
              label: r.target_role,
              meta: `${r.timeframe} · ${r.experience_level}`,
            })}
            pickerOnPick={(r) => {
              setGoal(r.target_role);
              setTimeframe(r.timeframe);
              setLevel(r.experience_level);
              setCustomData(r.content);
              setOpenWeek(1);
            }}
          />
        }
      />

      <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
        {/* Left Generation Sidebar Panel */}
        <div className="space-y-5 rounded-3xl border border-border bg-card/60 p-6 backdrop-blur self-start">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-spark">
            Custom Path Builder
          </h3>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
              What is your learning goal?
            </label>
            <input
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Become AI Engineer"
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            {/* Quick Suggestions Tags */}
            <div className="mt-2 flex flex-wrap gap-1">
              {ROLES_SUGGESTIONS.map((role) => (
                <button
                  key={role}
                  onClick={() => setGoal(role)}
                  className="rounded-lg bg-white/5 border border-white/5 px-2 py-0.5 text-[9px] text-muted-foreground hover:bg-white/10 hover:text-foreground"
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
              Target Timeframe
            </label>
            <div className="flex flex-wrap gap-1.5">
              {TIMEFRAMES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    timeframe === t
                      ? "border-spark bg-spark/15 text-foreground font-semibold"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
              Current Level
            </label>
            <div className="flex flex-wrap gap-1.5">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    level === l
                      ? "border-spark bg-spark/15 text-foreground font-semibold"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onGen}
            disabled={loading || !goal.trim()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-spark px-4 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:-translate-y-0.5 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {loading ? "Generating path..." : "Generate AI Roadmap"}
          </button>
          {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
        </div>

        {/* Right Output Area or Popular Tracks */}
        <div className="min-h-[400px] space-y-8">
          {/* Default view when no custom roadmap is loaded */}
          {!customData && !loading && (
            <div className="space-y-6">
              <div className="rounded-3xl border border-dashed border-border bg-card/45 p-8 text-center text-sm text-muted-foreground">
                <Compass className="mx-auto h-8 w-8 text-spark animate-float mb-3" />
                <h4 className="text-base font-semibold text-foreground">
                  AI Custom Curriculum Generator
                </h4>
                <p className="mt-1 text-xs leading-relaxed max-w-md mx-auto">
                  Describe any technical goal (e.g. "React microfrontends") and timeframe. AI will
                  lay out a week-by-week syllabus.
                </p>
              </div>

              {/* Popular Flagship Tracks */}
              <div>
                <h3 className="font-display text-base font-semibold text-foreground mb-4">
                  Or Explore Flagship Learning Tracks
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {popularDomains.map((d) => (
                    <Link
                      key={d.slug}
                      to="/roadmap/$slug"
                      params={{ slug: d.slug }}
                      className="group flex items-center justify-between rounded-2xl border border-white/5 bg-card/60 p-4 transition-all hover:border-spark/40 hover:-translate-y-0.5"
                    >
                      <div>
                        <h4 className="font-display text-sm font-semibold text-foreground group-hover:text-gradient">
                          {d.name}
                        </h4>
                        <span className="text-[9px] uppercase tracking-wider text-muted-foreground mt-0.5 block">
                          {d.category}
                        </span>
                      </div>
                      <button className="rounded-lg bg-white/5 p-1.5 text-muted-foreground group-hover:bg-white/10 group-hover:text-spark transition">
                        <Compass className="h-4 w-4" />
                      </button>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 animate-pulse rounded-2xl bg-muted/30" />
              ))}
            </div>
          )}

          {customData && (
            <div className="space-y-6">
              {/* Generated Roadmap Header */}
              <div className="rounded-2xl border border-border bg-gradient-to-br from-card/85 to-card/30 p-6">
                <div className="text-[10px] font-bold uppercase tracking-widest text-spark">
                  Custom Plan for
                </div>
                <h2 className="font-display text-2xl font-semibold mt-1">{customData.goal}</h2>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Weekly schedule generated for starting level:{" "}
                  <span className="text-foreground font-semibold">{level}</span> and target
                  timeframe: <span className="text-foreground font-semibold">{timeframe}</span>.
                </p>
              </div>

              {/* Week-by-Week Accordion */}
              <div className="space-y-3">
                {customData.weeks.map((w, idx) => (
                  <div
                    key={w.week}
                    className="overflow-hidden rounded-2xl border border-border bg-card/65"
                  >
                    <button
                      onClick={() => setOpenWeek(openWeek === w.week ? null : w.week)}
                      className="flex w-full items-center justify-between px-5 py-4 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="grid h-7 w-7 place-items-center rounded-lg bg-spark/15 text-xs font-bold text-spark">
                          W{w.week}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-foreground">{w.theme}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">
                            Milestone: {w.milestone}
                          </div>
                        </div>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-muted-foreground transition ${
                          openWeek === w.week ? "rotate-180 text-foreground" : ""
                        }`}
                      />
                    </button>

                    {openWeek === w.week && (
                      <div className="border-t border-white/5 bg-background/25 p-5 space-y-4">
                        {/* Daily Schedule */}
                        <div>
                          <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-spark mb-2">
                            <Calendar className="h-3.5 w-3.5" /> Daily Activities
                          </h4>
                          <ul className="space-y-1.5 text-xs text-muted-foreground">
                            {w.daily.map((dayItem, dIdx) => (
                              <li key={dIdx} className="flex items-start gap-2">
                                <span className="text-spark shrink-0">•</span>
                                <span>{dayItem}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Weekly Milestone */}
                        <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-3 flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <h5 className="text-[10px] uppercase font-bold text-emerald-400">
                              Week Milestone
                            </h5>
                            <p className="mt-0.5 text-xs text-muted-foreground">{w.milestone}</p>
                          </div>
                        </div>

                        {/* Mini Project */}
                        {w.project && (
                          <div className="rounded-xl border border-white/5 bg-white/5 p-3 flex items-start gap-2 justify-between">
                            <div className="flex items-start gap-2">
                              <Target className="h-4 w-4 text-spark shrink-0 mt-0.5" />
                              <div>
                                <h5 className="text-[10px] uppercase font-bold text-spark">
                                  Weekly Project
                                </h5>
                                <p className="mt-0.5 text-xs text-muted-foreground">{w.project}</p>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                navigate({ to: "/builder", search: { seed: w.project } })
                              }
                              className="rounded-lg bg-white/5 px-2.5 py-1 text-[10px] text-foreground hover:bg-white/10"
                            >
                              Build
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Extra Suggested Resources */}
              {customData.resources && customData.resources.length > 0 && (
                <div className="rounded-2xl border border-white/5 bg-card/60 p-5">
                  <h3 className="font-display text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-spark" /> Curated Resources
                  </h3>
                  <ul className="divide-y divide-white/5">
                    {customData.resources.map((res, rIdx) => (
                      <li key={rIdx} className="py-2.5 flex items-center justify-between text-xs">
                        <span className="font-medium text-muted-foreground">{res.title}</span>
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-spark font-semibold hover:underline"
                        >
                          View Resource
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
