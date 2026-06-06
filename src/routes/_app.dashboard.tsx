import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, PageHeader } from "@/components/PageHeader";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import { HolographicPanel } from "@/components/HolographicPanel";
import { playHover, playClick, isSoundsEnabled, setSoundsEnabled } from "@/lib/sounds";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — ProjectSpark" }] }),
  component: Dashboard,
});

const ALL_ACHIEVEMENTS = [
  { code: "first-project", title: "First Spark", description: "Generate your first AI project idea.", icon: "Sparkles", xp: 50 },
  { code: "save-roadmap", title: "Curriculum Architect", description: "Design and save a custom career roadmap.", icon: "Compass", xp: 50 },
  { code: "save-study", title: "Focused Learner", description: "Create and save a weekly study guide.", icon: "GraduationCap", xp: 50 },
  { code: "save-blueprint", title: "AI Builder Pro", description: "Generate a production code blueprint.", icon: "Code2", xp: 75 },
  { code: "first-chat", title: "Curious Mind", description: "Initiate a chat discussion with AI.", icon: "MessageSquare", xp: 50 },
  { code: "perfect-quiz", title: "Perfect Score", description: "Answer all mini-quiz questions correctly.", icon: "Brain", xp: 75 }
];

type Stats = {
  projects: number;
  saved: number;
  threads: number;
  xp: number;
  streak: number;
  recent: { id: string; title: string; created_at: string }[];
  achievements: string[];
  topProfiles: { id: string; display_name: string | null; avatar_url: string | null; xp: number }[];
};

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [soundsEnabled, setSoundsEnabledState] = useState(true);

  useEffect(() => {
    setSoundsEnabledState(isSoundsEnabled());
  }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [
        { count: projects },
        { count: saved },
        { count: threads },
        { data: profile },
        { data: recent },
        { data: achievementsData },
        { data: leaderboardData },
      ] = await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase
          .from("projects")
          .select("*", { count: "exact", head: true })
          .eq("bookmarked", true),
        supabase.from("chat_threads").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("xp, streak_days").eq("id", user.id).maybeSingle(),
        supabase
          .from("projects")
          .select("id, title, created_at")
          .order("created_at", { ascending: false })
          .limit(5),
        supabase.from("achievements").select("code").eq("user_id", user.id),
        supabase
          .from("profiles")
          .select("id, display_name, avatar_url, xp")
          .order("xp", { ascending: false })
          .limit(5),
      ]);

      setStats({
        projects: projects ?? 0,
        saved: saved ?? 0,
        threads: threads ?? 0,
        xp: profile?.xp ?? 0,
        streak: profile?.streak_days ?? 0,
        recent: recent ?? [],
        achievements: (achievementsData ?? []).map((a) => a.code),
        topProfiles: (leaderboardData ?? []) as any[],
      });
    })();
  }, [user]);

  const cards = [
    {
      label: "Projects",
      value: stats?.projects ?? 0,
      icon: Icons.Sparkles,
      accent: "from-spark to-violet-glow",
    },
    { label: "Saved", value: stats?.saved ?? 0, icon: Icons.Bookmark, accent: "from-aurora to-spark" },
    {
      label: "Chat Threads",
      value: stats?.threads ?? 0,
      icon: Icons.MessageSquare,
      accent: "from-violet-glow to-aurora",
    },
    { label: "XP", value: stats?.xp ?? 0, icon: Icons.Zap, accent: "from-spark-glow to-aurora" },
    {
      label: "Streak",
      value: `${stats?.streak ?? 0}d`,
      icon: Icons.Flame,
      accent: "from-aurora to-spark-glow",
    },
  ];

  return (
    <PageShell>
      <PageHeader
        icon={Icons.LayoutDashboard}
        title={`Welcome back${user?.email ? `, ${user.email.split("@")[0]}` : ""}`}
        description="Your AI innovation cockpit. Generate ideas, learn faster, ship more."
        actions={
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => {
                const nextVal = !soundsEnabled;
                setSoundsEnabled(nextVal);
                setSoundsEnabledState(nextVal);
                if (nextVal) {
                  playClick();
                }
              }}
              onMouseEnter={playHover}
              className="inline-flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-4 py-2.5 text-xs font-medium text-foreground hover:bg-white/10 transition cursor-pointer"
              title={soundsEnabled ? "Disable sound effects" : "Enable sound effects"}
            >
              {soundsEnabled ? (
                <>
                  <Icons.Volume2 className="h-4 w-4 text-emerald-400" />
                  <span>Sounds: ON</span>
                </>
              ) : (
                <>
                  <Icons.VolumeX className="h-4 w-4 text-muted-foreground" />
                  <span>Sounds: OFF</span>
                </>
              )}
            </button>
            <Link
              to="/generator"
              onClick={playClick}
              onMouseEnter={playHover}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-spark px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-glow transition hover:opacity-95"
            >
              <Icons.Sparkles className="h-4 w-4" /> New project idea
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((c) => {
          const isStreak = c.label === "Streak";
          return (
            <div key={c.label} onMouseEnter={playHover}>
                <HolographicPanel
                  className="relative overflow-hidden p-4 group glass"
                >
                <div
                  className={`absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${c.accent} opacity-20 blur-2xl`}
                />
                <div className="flex items-center justify-between">
                  <c.icon className="h-4 w-4 text-muted-foreground" />
                  {isStreak && stats && stats.streak > 0 && (
                    <span className="h-2 w-2 rounded-full bg-orange-500 animate-ping" />
                  )}
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <div className="font-display text-3xl font-semibold">{c.value}</div>
                  {isStreak && stats && stats.streak > 0 && (
                    <span className="text-xs text-orange-500">🔥</span>
                  )}
                </div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</div>
              </HolographicPanel>
            </div>
          );
        })}
      </div>

      {/* Developer OS Growth Cockpit */}
      <h2 className="mt-8 mb-4 font-display text-lg font-semibold text-foreground flex items-center gap-2">
        <Icons.Activity className="h-5 w-5 text-spark" />
        <span>Developer Growth Cockpit</span>
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Current Roadmap & Learning Progress */}
        <HolographicPanel className="p-5 flex flex-col justify-between glass">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Current Roadmap</span>
              <Icons.Compass className="h-4 w-4 text-spark animate-spin-slow" />
            </div>
            <h4 className="font-semibold text-sm text-foreground">AI Engineer Career Track</h4>
            <p className="text-xs text-muted-foreground mt-1">Tier: Beginner · Node 3/8</p>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">Roadmap Progress</span>
              <span className="font-semibold text-spark">37.5%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-spark rounded-full" style={{ width: "37.5%" }} />
            </div>
          </div>
        </HolographicPanel>

        {/* Study Time & Skill Growth */}
        <HolographicPanel className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Study Time & Skill Growth</span>
              <Icons.Clock className="h-4 w-4 text-aurora" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-display">12.5h</span>
              <span className="text-xs text-emerald-400 font-semibold font-mono">+1.5h vs last week</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Top Gain: Backend (Node.js) +20%</p>
          </div>
          <div className="mt-3 flex gap-1 items-end h-6">
            <div className="flex-1 bg-white/5 h-2 rounded-t" />
            <div className="flex-1 bg-white/5 h-3 rounded-t" />
            <div className="flex-1 bg-gradient-spark h-5 rounded-t" />
            <div className="flex-1 bg-gradient-spark h-4 rounded-t" />
            <div className="flex-1 bg-gradient-spark h-6 rounded-t" />
          </div>
        </HolographicPanel>

        {/* Interview Readiness & AI Viva */}
        <HolographicPanel className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Interview Readiness</span>
              <Icons.Terminal className="h-4 w-4 text-violet-glow" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-display text-foreground">78%</span>
              <span className="text-[10px] rounded-full bg-violet-glow/10 border border-violet-glow/20 px-1.5 py-0.5 text-violet-glow font-bold">Good</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">AI Viva Score: 8.5/10 (TypeScript)</p>
          </div>
          <Link to="/job-prep" onClick={playClick} onMouseEnter={playHover} className="mt-3 block text-center rounded-xl bg-white/5 border border-white/5 py-1.5 text-[10px] uppercase tracking-wider font-semibold text-foreground hover:bg-white/10 transition">
            Start Mock Interview
          </Link>
        </HolographicPanel>

        {/* Resume ATS Score & Portfolio */}
        <HolographicPanel className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Resume ATS Score</span>
              <Icons.FileText className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-display text-foreground">84/100</span>
              <span className="text-[10px] rounded-full bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 text-emerald-400 font-bold">Optimized</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Portfolio templates: Active (Cyber)</p>
          </div>
          <Link to="/resume" onClick={playClick} onMouseEnter={playHover} className="mt-3 block text-center rounded-xl bg-gradient-spark py-1.5 text-[10px] uppercase tracking-wider font-semibold text-primary-foreground shadow-glow transition hover:opacity-90">
            Audit Resume
          </Link>
        </HolographicPanel>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-4">
        {/* AI recommendations */}
        <HolographicPanel className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-7 w-7 rounded-lg bg-spark/10 border border-spark/20 grid place-items-center">
                <Icons.Brain className="h-4 w-4 text-spark animate-pulse" />
              </div>
              <h3 className="font-display text-sm font-bold text-foreground">Personal AI Agent Recommendations</h3>
            </div>
            <div className="space-y-2">
              <div className="rounded-xl border border-white/5 bg-white/2 p-2.5 text-xs flex gap-2">
                <Icons.Flame className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-foreground">Next Up on Roadmap:</span> Study **Asynchronous JS & Promises** (Intermediate) node to unlock React Hooks.
                </div>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/2 p-2.5 text-xs flex gap-2">
                <Icons.Briefcase className="h-4 w-4 text-spark shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-foreground">Internship Fit:</span> You match **85%** of requirements for **React Intern** posts at SparkLabs.
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Link to="/roadmap" onClick={playClick} className="flex-1 text-center rounded-xl bg-white/5 border border-white/5 py-2 text-xs font-semibold hover:bg-white/10 transition">
              Resume Study
            </Link>
            <Link to="/mentor" onClick={playClick} className="flex-1 text-center rounded-xl bg-gradient-spark py-2 text-xs font-semibold text-primary-foreground shadow-glow transition hover:opacity-95">
              Ask AI Agent
            </Link>
          </div>
        </HolographicPanel>

        {/* Upcoming goals */}
        <HolographicPanel className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-aurora/10 border border-aurora/20 grid place-items-center">
                  <Icons.CalendarCheck className="h-4 w-4 text-aurora" />
                </div>
                <h3 className="font-display text-sm font-bold text-foreground">Upcoming Goals & Tasks</h3>
              </div>
              <Link to="/collaboration" className="text-xs text-muted-foreground hover:text-spark transition">Kanban Board</Link>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs rounded-xl border border-white/5 bg-white/2 p-2.5">
                <div className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked={false} className="rounded border-white/20 bg-transparent text-spark focus:ring-0" />
                  <span className="text-muted-foreground">Complete "Intro to Django" practice tasks</span>
                </div>
                <span className="text-[9px] rounded bg-orange-500/10 border border-orange-500/20 px-1.5 py-0.5 text-orange-400 font-bold font-mono">Today</span>
              </div>
              <div className="flex items-center justify-between text-xs rounded-xl border border-white/5 bg-white/2 p-2.5">
                <div className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked={false} className="rounded border-white/20 bg-transparent text-spark focus:ring-0" />
                  <span className="text-muted-foreground">Submit mock interview code review</span>
                </div>
                <span className="text-[9px] rounded bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 text-purple-400 font-bold font-mono">Tomorrow</span>
              </div>
            </div>
          </div>
          <Link to="/collaboration" onClick={playClick} className="mt-4 block text-center rounded-xl bg-white/5 border border-white/5 py-2 text-xs font-semibold hover:bg-white/10 transition">
            Manage Tasks
          </Link>
        </HolographicPanel>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Recent projects */}
          <HolographicPanel className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-medium">Recent projects</h2>
              <Link to="/saved" className="text-xs text-spark hover:underline">
                View all
              </Link>
            </div>
            {stats && stats.recent.length === 0 ? (
              <EmptyRecent />
            ) : (
              <ul className="divide-y divide-border">
                {(stats?.recent ?? []).map((r) => (
                  <li key={r.id} className="flex items-center justify-between py-3">
                    <div>
                      <div className="text-sm font-medium">{r.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(r.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <Link to="/saved" className="text-xs text-muted-foreground hover:text-foreground">
                      Open <Icons.ArrowRight className="ml-1 inline h-3 w-3" />
                    </Link>
                  </li>
                ))}
                {!stats &&
                  Array.from({ length: 3 }).map((_, i) => (
                    <li key={i} className="py-3">
                      <div className="h-4 w-1/2 animate-pulse rounded bg-muted/60" />
                    </li>
                  ))}
              </ul>
            )}
          </HolographicPanel>

          {/* Achievements Grid */}
          <AchievementsGrid unlocked={stats?.achievements ?? []} />
        </div>

        {/* Sidebar panels */}
        <div className="space-y-6">
          {/* Level Progress */}
          {stats && <LevelProgressCard xp={stats.xp} streak={stats.streak} />}

          {/* Global Leaderboard */}
          {stats && <Leaderboard users={stats.topProfiles} />}

          {/* Quick Actions */}
          <HolographicPanel className="p-6">
            <h2 className="font-display text-lg font-medium">Quick actions</h2>
            <div className="mt-4 space-y-2">
              <QuickLink to="/generator" icon={Icons.Sparkles} label="Generate a project idea" />
              <QuickLink to="/chat" icon={Icons.MessageSquare} label="Talk to ProjectSpark AI" />
              <QuickLink to="/roadmap" icon={Icons.Zap} label="Plan a career roadmap" />
              <QuickLink to="/study-guide" icon={Icons.Flame} label="Build a study guide" />
            </div>
          </HolographicPanel>
        </div>
      </div>
    </PageShell>
  );
}

function QuickLink({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Link
      to={to}
      onMouseEnter={playHover}
      onClick={playClick}
      className="group flex items-center justify-between rounded-xl border border-border bg-card/40 px-3 py-2.5 text-sm transition hover:border-spark/60 hover:bg-card/70"
    >
      <span className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-spark" /> {label}
      </span>
      <Icons.ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
    </Link>
  );
}

function EmptyRecent() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-10 text-center">
      <Icons.Sparkles className="h-6 w-6 text-spark" />
      <p className="text-sm text-muted-foreground">No projects yet — generate your first idea.</p>
      <Link
        to="/generator"
        className="rounded-lg bg-gradient-spark px-3 py-1.5 text-xs font-medium text-primary-foreground"
      >
        Open generator
      </Link>
    </div>
  );
}

// ---------------- Gamification Subcomponents ----------------

function StreakFlame({ days }: { days: number }) {
  return (
    <div className="relative flex items-center justify-center">
      <motion.svg
        animate={{
          scale: days > 0 ? [1, 1.08, 1] : 1,
          y: days > 0 ? [0, -3, 0] : 0,
        }}
        transition={{
          repeat: Infinity,
          duration: 1.8,
          ease: "easeInOut",
        }}
        className={`h-12 w-12 text-orange-500 filter drop-shadow-[0_0_8px_rgba(249,115,22,0.6)] ${days > 0 ? "opacity-100" : "opacity-25"}`}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2c-.5 0-.9.2-1.2.6C7.5 7.1 6.5 10 6.5 12.5c0 3 2.5 5.5 5.5 5.5s5.5-2.5 5.5-5.5c0-2.5-1-5.4-4.3-9.9-.3-.4-.7-.6-1.2-.6zm0 2.5c2.3 3.6 2.8 5.7 2.8 7.5 0 1.5-1.3 2.8-2.8 2.8S9.2 13.5 9.2 12c0-1.8.5-3.9 2.8-7.5z" />
        {days > 0 && (
          <path
            d="M12 16.5c-1.38 0-2.5-1.12-2.5-2.5 0-1 .6-2.1 2.5-4 1.9 1.9 2.5 3 2.5 4 0 1.38-1.12 2.5-2.5 2.5z"
            className="text-amber-400"
          />
        )}
      </motion.svg>
      {days > 0 && (
        <span className="absolute text-[11px] font-bold text-white mt-1 select-none font-display">
          {days}
        </span>
      )}
    </div>
  );
}

function LevelProgressCard({ xp, streak }: { xp: number; streak: number }) {
  const level = Math.floor(xp / 500) + 1;
  const currentLevelXp = xp % 500;
  const percent = Math.round((currentLevelXp / 500) * 100);
  const strokeDash = 2 * Math.PI * 32;
  const strokeOffset = strokeDash * (1 - percent / 100);

  return (
    <HolographicPanel className="p-5">
      <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-spark">
        Your Progress & Streak
      </h3>
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 flex items-center justify-center">
            <svg className="h-full w-full -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="32"
                className="stroke-white/5"
                strokeWidth="5"
                fill="transparent"
              />
              <circle
                cx="40"
                cy="40"
                r="32"
                className="stroke-spark filter drop-shadow-[0_0_4px_oklch(0.78_0.18_295_/_0.3)]"
                strokeWidth="5"
                fill="transparent"
                strokeDasharray={strokeDash}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Lvl</div>
              <div className="font-display text-xl font-bold text-foreground leading-none">{level}</div>
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">Level {level} Builder</div>
            <div className="mt-1 text-xs text-muted-foreground">
              {currentLevelXp} / 500 XP to Level {level + 1}
            </div>
            <div className="mt-2 h-1.5 w-32 overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-spark"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="text-center shrink-0 border-l border-white/5 pl-6">
          <StreakFlame days={streak} />
          <div className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Streak
          </div>
        </div>
      </div>
    </HolographicPanel>
  );
}

function Leaderboard({ users }: { users: any[] }) {
  return (
    <HolographicPanel className="p-5 glass">
      <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-spark">
        Global Leaderboard
      </h3>
      <div className="space-y-2.5">
        {users.map((u, idx) => {
          const isTop3 = idx < 3;
          const medal = isTop3 ? ["🥇", "🥈", "🥉"][idx] : `${idx + 1}`;
          const isLvl = Math.floor(u.xp / 500) + 1;
          return (
            <div
              key={u.id}
              className="flex items-center justify-between rounded-xl border border-white/5 bg-background/30 p-2.5 transition hover:bg-white/5"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold w-5 text-center">{medal}</span>
                <div className="h-8 w-8 rounded-full bg-gradient-spark flex items-center justify-center text-xs font-semibold text-primary-foreground">
                  {u.avatar_url ? (
                    <img src={u.avatar_url} alt="" className="h-full w-full rounded-full object-cover" />
                  ) : (
                    (u.display_name || "U")[0].toUpperCase()
                  )}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{u.display_name || "Anonymous Builder"}</div>
                  <div className="text-[10px] text-muted-foreground">Level {isLvl}</div>
                </div>
              </div>
              <div className="text-right font-mono">
                <div className="text-xs font-semibold text-spark">{u.xp} XP</div>
              </div>
            </div>
          );
        })}
        {users.length === 0 && (
          <p className="text-center text-xs text-muted-foreground py-4">No top profiles available.</p>
        )}
      </div>
    </HolographicPanel>
  );
}

function AchievementsGrid({ unlocked }: { unlocked: string[] }) {
  return (
    <HolographicPanel className="p-6">
      <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-spark">
        Achievements & Badges
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {ALL_ACHIEVEMENTS.map((a) => {
          const isUnlocked = unlocked.includes(a.code);
          const IconComp = (Icons as any)[a.icon] || Icons.Trophy;

          return (
            <div
              key={a.code}
              className={`flex items-start gap-3.5 rounded-2xl border p-4.5 transition-all duration-300 ${
                isUnlocked
                  ? "border-emerald-500/20 bg-emerald-500/5 shadow-[0_0_15px_oklch(0.8_0.16_140_/_0.03)]"
                  : "border-white/5 bg-white/2 opacity-60"
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  isUnlocked ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-muted-foreground"
                }`}
              >
                {isUnlocked ? <IconComp className="h-5 w-5" /> : <Icons.Lock className="h-5 w-5" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`text-sm font-semibold ${isUnlocked ? "text-foreground" : "text-muted-foreground"}`}>
                    {a.title}
                  </h4>
                  <span className={`text-[9px] font-bold uppercase ${isUnlocked ? "text-emerald-400" : "text-muted-foreground"}`}>
                    +{a.xp} XP
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {a.description}
                </p>
                {isUnlocked && (
                  <span className="mt-1.5 inline-flex items-center gap-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[8.5px] font-medium text-emerald-400">
                    <Icons.Check className="h-2.5 w-2.5" /> Unlocked
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </HolographicPanel>
  );
}
