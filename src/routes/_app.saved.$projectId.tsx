import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";
import {
  Bookmark,
  BookmarkCheck,
  ArrowLeft,
  Hammer,
  GraduationCap,
  Map as MapIcon,
  Pencil,
  Trash2,
  Download,
  Share2,
  Cpu,
  Wrench,
  Network,
  CalendarDays,
  Rocket,
  Trophy,
  Loader2,
  Save,
  X,
} from "lucide-react";

export const Route = createFileRoute("/_app/saved/$projectId")({
  head: () => ({ meta: [{ title: "Project Details — ProjectSpark" }] }),
  component: ProjectDetailsPage,
});

type Project = {
  id: string;
  user_id: string;
  title: string;
  problem_statement: string;
  solution_overview: string;
  technologies: string[];
  requirements: { hardware?: string[]; software?: string[] } | null;
  architecture: string[];
  timeline: string[];
  future_scope: string[];
  resume_value_score: number | string;
  innovation_score: number | string;
  tech_depth_score: number | string;
  market_potential: string;
  difficulty: string;
  domains: string[];
  bookmarked: boolean;
  created_at: string;
};

function ProjectDetailsPage() {
  const { projectId } = Route.useParams();
  const navigate = useNavigate();
  const router = useRouter();
  const [p, setP] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<{
    title: string;
    problem_statement: string;
    solution_overview: string;
  }>({
    title: "",
    problem_statement: "",
    solution_overview: "",
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .maybeSingle();
      if (error) toast.error(error.message);
      setP((data as unknown as Project) ?? null);
      setLoading(false);
    })();
  }, [projectId]);

  const toggleBookmark = async () => {
    if (!p) return;
    const next = !p.bookmarked;
    setP({ ...p, bookmarked: next });
    const { error } = await supabase.from("projects").update({ bookmarked: next }).eq("id", p.id);
    if (error) {
      setP({ ...p, bookmarked: !next });
      toast.error(error.message);
    }
  };

  const onDelete = async () => {
    if (!p) return;
    if (!confirm("Delete this project? This cannot be undone.")) return;
    const { error } = await supabase.from("projects").delete().eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success("Project deleted");
    navigate({ to: "/saved" });
  };

  const startEdit = () => {
    if (!p) return;
    setDraft({
      title: p.title,
      problem_statement: p.problem_statement,
      solution_overview: p.solution_overview,
    });
    setEditing(true);
  };

  const saveEdit = async () => {
    if (!p) return;
    const { error } = await supabase.from("projects").update(draft).eq("id", p.id);
    if (error) return toast.error(error.message);
    setP({ ...p, ...draft });
    setEditing(false);
    toast.success("Saved");
  };

  const buildThis = () => {
    if (!p) return;
    sessionStorage.setItem(
      "ps:buildIdea",
      JSON.stringify({
        title: p.title,
        problemStatement: p.problem_statement,
        solutionOverview: p.solution_overview,
        technologies: p.technologies,
        requirements: p.requirements ?? { hardware: [], software: [] },
        architecture: p.architecture,
        timeline: p.timeline,
        futureScope: p.future_scope,
        resumeValueScore: Number(p.resume_value_score),
        innovationScore: Number(p.innovation_score),
        techDepthScore: Number(p.tech_depth_score),
        marketPotential: p.market_potential,
        difficulty: p.difficulty,
        domains: p.domains,
      }),
    );
    navigate({ to: "/builder" });
  };

  const mentor = () => {
    if (!p) return;
    sessionStorage.setItem("ps:mentorTopic", p.title);
    navigate({ to: "/mentor" });
  };

  const roadmap = () => {
    if (!p) return;
    sessionStorage.setItem("ps:roadmapSeed", p.domains?.[0] ?? p.title);
    navigate({ to: "/roadmap" });
  };

  const exportPdf = () => {
    if (!p) return;
    const w = window.open("", "_blank");
    if (!w) return toast.error("Popup blocked");
    const list = (arr: string[] = []) => arr.map((x) => `<li>${escapeHtml(x)}</li>`).join("");
    w.document.write(`<!doctype html><html><head><title>${escapeHtml(p.title)}</title>
      <style>body{font-family:Inter,system-ui,sans-serif;max-width:780px;margin:40px auto;padding:0 24px;color:#111}
      h1{font-size:28px;margin-bottom:4px} h2{font-size:16px;margin-top:24px;color:#333;border-bottom:1px solid #eee;padding-bottom:4px}
      ul{padding-left:18px} .meta{color:#666;font-size:13px;margin-bottom:16px}
      .pills span{display:inline-block;border:1px solid #ddd;padding:2px 8px;border-radius:999px;font-size:11px;margin:2px 4px 2px 0}
      .scores{display:flex;gap:16px;margin:12px 0}
      .scores div{flex:1;border:1px solid #eee;padding:8px;border-radius:8px;text-align:center}</style></head><body>
      <h1>${escapeHtml(p.title)}</h1>
      <div class="meta">${escapeHtml(p.difficulty)} · ${escapeHtml(p.market_potential)} market · Saved ${new Date(p.created_at).toLocaleDateString()}</div>
      <div class="pills">${(p.domains ?? []).map((d) => `<span>${escapeHtml(d)}</span>`).join("")}</div>
      <div class="scores">
        <div><b>${Number(p.resume_value_score).toFixed(1)}</b><br/>Resume value</div>
        <div><b>${Number(p.innovation_score).toFixed(1)}</b><br/>Innovation</div>
        <div><b>${Number(p.tech_depth_score).toFixed(1)}</b><br/>Tech depth</div>
      </div>
      <h2>Problem</h2><p>${escapeHtml(p.problem_statement)}</p>
      <h2>Solution</h2><p>${escapeHtml(p.solution_overview)}</p>
      <h2>Technologies</h2><div class="pills">${(p.technologies ?? []).map((t) => `<span>${escapeHtml(t)}</span>`).join("")}</div>
      <h2>Hardware</h2><ul>${list(p.requirements?.hardware ?? [])}</ul>
      <h2>Software</h2><ul>${list(p.requirements?.software ?? [])}</ul>
      <h2>Architecture</h2><ol>${list(p.architecture ?? [])}</ol>
      <h2>Timeline</h2><ol>${list(p.timeline ?? [])}</ol>
      <h2>Future scope</h2><ul>${list(p.future_scope ?? [])}</ul>
      <script>window.onload=()=>window.print()</script></body></html>`);
    w.document.close();
  };

  const share = async () => {
    const url = window.location.href;
    const title = p?.title ?? "ProjectSpark";
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* user cancelled */
      }
    }
    await navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  if (loading) {
    return (
      <PageShell>
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      </PageShell>
    );
  }

  if (!p) {
    return (
      <PageShell>
        <div className="rounded-2xl border border-dashed border-border py-16 text-center">
          <p className="text-sm text-muted-foreground">Project not found.</p>
          <Link
            to="/saved"
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-spark hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to saved
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <button
        onClick={() => router.history.back()}
        className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back
      </button>

      <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {editing ? (
              <input
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 font-display text-2xl font-semibold outline-none focus:border-spark/50"
              />
            ) : (
              <h1 className="font-display text-3xl font-semibold">{p.title}</h1>
            )}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {(p.domains ?? []).map((d) => (
                <span
                  key={d}
                  className="rounded-full border border-spark/40 bg-spark/10 px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-spark"
                >
                  {d}
                </span>
              ))}
              <span className="rounded-full border border-border px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                {p.difficulty}
              </span>
              <span className="rounded-full border border-border px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                {p.market_potential} market
              </span>
              <span className="rounded-full border border-border px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                Saved {new Date(p.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          <button
            onClick={toggleBookmark}
            className="inline-flex items-center gap-1.5 rounded-lg border border-spark/50 bg-spark/10 px-3 py-1.5 text-xs font-medium text-spark"
          >
            {p.bookmarked ? (
              <BookmarkCheck className="h-3.5 w-3.5" />
            ) : (
              <Bookmark className="h-3.5 w-3.5" />
            )}
            {p.bookmarked ? "Bookmarked" : "Bookmark"}
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Action onClick={buildThis} primary icon={Hammer}>
            Build This Project
          </Action>
          <Action onClick={mentor} icon={GraduationCap}>
            Continue with AI Mentor
          </Action>
          <Action onClick={roadmap} icon={MapIcon}>
            Generate Roadmap
          </Action>
          {editing ? (
            <>
              <Action onClick={saveEdit} icon={Save}>
                Save
              </Action>
              <Action onClick={() => setEditing(false)} icon={X}>
                Cancel
              </Action>
            </>
          ) : (
            <Action onClick={startEdit} icon={Pencil}>
              Edit Project
            </Action>
          )}
          <Action onClick={exportPdf} icon={Download}>
            Export PDF
          </Action>
          <Action onClick={share} icon={Share2}>
            Share
          </Action>
          <Action onClick={onDelete} icon={Trash2} danger>
            Delete
          </Action>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat
          icon={Trophy}
          label="Resume value"
          value={`${Number(p.resume_value_score).toFixed(1)}/10`}
        />
        <Stat
          icon={Rocket}
          label="Innovation"
          value={`${Number(p.innovation_score).toFixed(1)}/10`}
        />
        <Stat
          icon={Network}
          label="Tech depth"
          value={`${Number(p.tech_depth_score).toFixed(1)}/10`}
        />
      </div>

      <div className="mt-5 space-y-5">
        <Section title="Problem">
          {editing ? (
            <textarea
              value={draft.problem_statement}
              onChange={(e) => setDraft({ ...draft, problem_statement: e.target.value })}
              rows={4}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-spark/50"
            />
          ) : (
            <p className="text-sm leading-relaxed text-foreground/90">{p.problem_statement}</p>
          )}
        </Section>
        <Section title="Solution">
          {editing ? (
            <textarea
              value={draft.solution_overview}
              onChange={(e) => setDraft({ ...draft, solution_overview: e.target.value })}
              rows={4}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-spark/50"
            />
          ) : (
            <p className="text-sm leading-relaxed text-foreground/90">{p.solution_overview}</p>
          )}
        </Section>

        <div>
          <SectionTitle>Tech stack</SectionTitle>
          <div className="flex flex-wrap gap-1.5">
            {(p.technologies ?? []).map((t) => (
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
          <ListBlock icon={Cpu} title="Hardware" items={p.requirements?.hardware ?? []} />
          <ListBlock icon={Wrench} title="Software" items={p.requirements?.software ?? []} />
        </div>

        <ListBlock
          icon={Network}
          title="Architecture / Workflow"
          items={p.architecture ?? []}
          ordered
        />
        <ListBlock icon={CalendarDays} title="Timeline" items={p.timeline ?? []} ordered />
        <ListBlock icon={Rocket} title="Future scope" items={p.future_scope ?? []} />
      </div>
    </PageShell>
  );
}

function escapeHtml(s: string) {
  return String(s ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

function Action({
  children,
  onClick,
  icon: Icon,
  primary,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  primary?: boolean;
  danger?: boolean;
}) {
  const cls = primary
    ? "bg-gradient-spark text-primary-foreground shadow-glow hover:opacity-95"
    : danger
      ? "border border-destructive/40 text-destructive hover:bg-destructive/10"
      : "border border-border hover:bg-card/60";
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${cls}`}
    >
      <Icon className="h-3.5 w-3.5" /> {children}
    </button>
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
    <div className="rounded-xl border border-border bg-card/40 p-4">
      <Icon className="h-3.5 w-3.5 text-spark" />
      <div className="mt-2 font-display text-xl">{value}</div>
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
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <SectionTitle>{title}</SectionTitle>
      {children}
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
  if (!items?.length) return null;
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
