import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, PageHeader } from "@/components/PageHeader";
import {
  BookOpen,
  Sparkles,
  Brain,
  Compass,
  GraduationCap,
  Code2,
  Trophy,
  Flame,
  Zap,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/_app/learning")({
  head: () => ({ meta: [{ title: "Learning Dashboard — ProjectSpark" }] }),
  component: Learning,
});

function Learning() {
  const { user } = useAuth();
  const [counts, setCounts] = useState({ projects: 0, threads: 0, xp: 0, streak: 0 });
  const [recent, setRecent] = useState<{ id: string; title: string; created_at: string }[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ count: projects }, { count: threads }, { data: profile }, { data: r }] =
        await Promise.all([
          supabase.from("projects").select("*", { count: "exact", head: true }),
          supabase.from("chat_threads").select("*", { count: "exact", head: true }),
          supabase.from("profiles").select("xp, streak_days").eq("id", user.id).maybeSingle(),
          supabase
            .from("projects")
            .select("id, title, created_at")
            .order("created_at", { ascending: false })
            .limit(5),
        ]);
      setCounts({
        projects: projects ?? 0,
        threads: threads ?? 0,
        xp: profile?.xp ?? 0,
        streak: profile?.streak_days ?? 0,
      });
      setRecent(r ?? []);
    })();
  }, [user]);

  const tiles = [
    { to: "/generator", icon: Sparkles, label: "Generate idea", desc: "Spin up new project ideas" },
    { to: "/builder", icon: Code2, label: "Build a project", desc: "Get a full architecture" },
    { to: "/mentor", icon: Brain, label: "AI mentor", desc: "Lesson plans for any topic" },
    {
      to: "/study-guide",
      icon: GraduationCap,
      label: "Study guide",
      desc: "Week-by-week curriculum",
    },
    { to: "/roadmap", icon: Compass, label: "Career roadmap", desc: "Skills, projects, certs" },
    { to: "/analytics", icon: Trophy, label: "Analytics", desc: "Track your growth" },
  ];

  return (
    <PageShell>
      <PageHeader
        icon={BookOpen}
        title="Learning Dashboard"
        description="One place for your projects, plans, and progress."
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon={Sparkles} label="Projects" value={counts.projects} />
        <Stat icon={Flame} label="Streak" value={`${counts.streak}d`} />
        <Stat icon={Zap} label="XP" value={counts.xp} />
        <Stat icon={Brain} label="Chats" value={counts.threads} />
      </div>

      <h2 className="mt-8 mb-3 font-display text-lg">Continue learning</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            className="group rounded-2xl border border-border bg-card/60 p-5 transition hover:border-spark/50 hover:bg-card/80"
          >
            <div className="flex items-center justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-spark text-primary-foreground shadow-glow">
                <t.icon className="h-4 w-4" />
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
            </div>
            <div className="mt-3 font-medium">{t.label}</div>
            <div className="text-xs text-muted-foreground">{t.desc}</div>
          </Link>
        ))}
      </div>

      <h2 className="mt-8 mb-3 font-display text-lg">Recent projects</h2>
      <div className="rounded-2xl border border-border bg-card/60 p-5">
        {recent.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Generate your first idea to see it here.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {recent.map((r) => (
              <li key={r.id} className="flex items-center justify-between py-3">
                <div>
                  <div className="text-sm font-medium">{r.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString()}
                  </div>
                </div>
                <Link to="/saved" className="text-xs text-spark hover:underline">
                  Open
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageShell>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-4">
      <Icon className="h-4 w-4 text-spark" />
      <div className="mt-2 font-display text-2xl font-semibold">{value}</div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}
