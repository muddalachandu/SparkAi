import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { PageShell, PageHeader } from "@/components/PageHeader";
import { AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_app/$")({
  component: NotFound,
});

function NotFound() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <PageShell>
      <PageHeader
        icon={AlertTriangle}
        title="Page not found"
        description={`Nothing lives at "${path}". Try one of the active modules below.`}
      />
      <div className="rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center">
        <div className="flex flex-wrap justify-center gap-2">
          <Link
            to="/dashboard"
            className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-card/60"
          >
            Dashboard
          </Link>
          <Link
            to="/generator"
            className="rounded-lg bg-gradient-spark px-3 py-1.5 text-xs font-medium text-primary-foreground"
          >
            Project Generator
          </Link>
          <Link
            to="/builder"
            className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-card/60"
          >
            AI Builder
          </Link>
          <Link
            to="/roadmap"
            className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-card/60"
          >
            Roadmap
          </Link>
          <Link
            to="/mentor"
            className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-card/60"
          >
            Mentor
          </Link>
          <Link
            to="/chat"
            className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-card/60"
          >
            AI Chat
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
