import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/PageHeader";
import { Info, Sparkles, Brain, Code2, Compass, GraduationCap, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/_app/about")({
  head: () => ({ meta: [{ title: "About — ProjectSpark" }] }),
  component: About,
});

function About() {
  return (
    <PageShell>
      <PageHeader
        icon={Info}
        title="About ProjectSpark"
        description="An AI innovation and learning OS — ChatGPT, GitHub, Coursera, Notion AI and Replit, fused into one."
      />

      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-card/80 to-card/30 p-6">
          <h2 className="font-display text-xl">What it does</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            ProjectSpark helps students, developers, and engineers turn an idea into a shipped
            project. Generate original ideas, design full architectures, follow AI-built study
            plans, and track your progress — all in one workspace with a single sign-in.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Sparkles,
              t: "Project Generator",
              d: "Original, constraint-aware ideas with full architecture.",
              to: "/generator",
            },
            {
              icon: Code2,
              t: "AI Builder",
              d: "Folder structure, schema, APIs, code, and deploy steps.",
              to: "/builder",
            },
            {
              icon: Brain,
              t: "AI Mentor",
              d: "Lesson plans for any topic with tasks and examples.",
              to: "/mentor",
            },
            {
              icon: Compass,
              t: "Roadmap Planner",
              d: "Skills, projects, and certs for any career path.",
              to: "/roadmap",
            },
            {
              icon: GraduationCap,
              t: "Study Guide",
              d: "Week-by-week curriculum tailored to your goal.",
              to: "/study-guide",
            },
            {
              icon: MessageSquare,
              t: "AI Chat",
              d: "Threaded, persistent conversations powered by Lovable AI.",
              to: "/chat",
            },
          ].map((f) => (
            <Link
              key={f.to}
              to={f.to}
              className="group rounded-2xl border border-border bg-card/60 p-5 transition hover:border-spark/50"
            >
              <f.icon className="h-5 w-5 text-spark" />
              <div className="mt-3 font-medium">{f.t}</div>
              <p className="mt-1 text-xs text-muted-foreground">{f.d}</p>
            </Link>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-6">
          <h2 className="font-display text-xl">Built with</h2>
          <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
            {[
              "TanStack Start",
              "React 19",
              "Tailwind CSS v4",
              "Lovable Cloud",
              "Lovable AI Gateway",
              "Vercel AI SDK",
              "Recharts",
            ].map((t) => (
              <span
                key={t}
                className="rounded-md border border-border bg-background/40 px-2 py-1 font-mono"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
