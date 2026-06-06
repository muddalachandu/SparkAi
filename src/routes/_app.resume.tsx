import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  generateResume,
  analyzeResumeATS,
  type Resume,
  type ATSReport,
} from "@/lib/resume.functions";
import { PageShell, PageHeader } from "@/components/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { awardXP, XP } from "@/lib/gamification";
import { SessionPicker } from "@/components/SessionPicker";
import {
  FileText,
  Loader2,
  Sparkles,
  Download,
  Save,
  ScanLine,
  Mail,
  MapPin,
  Globe,
  Github,
  Linkedin,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/resume")({
  head: () => ({ meta: [{ title: "Resume Builder & ATS — ProjectSpark" }] }),
  component: ResumePage,
});

type SavedResume = {
  id: string;
  title: string;
  target_role: string;
  content: Resume;
  ats_score: number;
  ats_report: ATSReport | Record<string, never>;
  created_at: string;
};

function ResumePage() {
  const { user } = useAuth();
  const gen = useServerFn(generateResume);
  const ats = useServerFn(analyzeResumeATS);

  const [tab, setTab] = useState<"build" | "ats">("build");

  // Build state
  const [name, setName] = useState("");
  const [targetRole, setTargetRole] = useState("Full Stack Engineer");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [projects, setProjects] = useState("");
  const [education, setEducation] = useState("");
  const [resume, setResume] = useState<Resume | null>(null);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ATS state
  const [jobDesc, setJobDesc] = useState("");
  const [report, setReport] = useState<ATSReport | null>(null);
  const [atsLoading, setAtsLoading] = useState(false);

  const onGen = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setResume(null);
    setResumeId(null);
    setReport(null);
    try {
      const r = await gen({ data: { name, targetRole, experience, skills, projects, education } });
      setResume(r);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const onSave = async () => {
    if (!resume || !user) return;
    const { data, error } = await supabase
      .from("resumes")
      .insert({
        user_id: user.id,
        title: `${resume.name} — ${targetRole}`,
        target_role: targetRole,
        content: resume as unknown as never,
        ats_score: report?.overallScore ?? 0,
        ats_report: (report ?? {}) as unknown as never,
      })
      .select("id")
      .single();
    if (error) {
      toast.error(error.message);
      return;
    }
    setResumeId(data.id);
    await awardXP(XP.SAVE_RESUME, "Saved resume");
  };

  const onExportPDF = () => {
    window.print();
  };

  const onRunATS = async () => {
    if (!resume) {
      toast.error("Generate a resume first.");
      return;
    }
    if (!jobDesc.trim()) return;
    setAtsLoading(true);
    setReport(null);
    try {
      const resumeText = serializeResume(resume);
      const r = await ats({ data: { resumeText, jobDescription: jobDesc } });
      setReport(r);
      await awardXP(XP.RUN_ATS, "Ran ATS analysis");
      if (resumeId) {
        await supabase
          .from("resumes")
          .update({ ats_score: r.overallScore, ats_report: r as unknown as never })
          .eq("id", resumeId);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "ATS failed");
    } finally {
      setAtsLoading(false);
    }
  };

  return (
    <PageShell>
      <PageHeader
        icon={FileText}
        title="Resume Builder & ATS Analyzer"
        description="AI-generated, ATS-optimized resumes with recruiter-grade scoring."
        actions={
          <div className="flex gap-2">
            <SessionPicker<SavedResume>
              table="resumes"
              select="id, title, target_role, content, ats_score, ats_report, created_at"
              toRow={(r) => ({
                id: r.id,
                label: r.title,
                meta: `${r.target_role} · ATS ${Math.round(Number(r.ats_score))}`,
              })}
              onPick={(r) => {
                setResume(r.content);
                setTargetRole(r.target_role);
                setName(r.content.name);
                setResumeId(r.id);
                setReport(
                  (r.ats_report as ATSReport)?.overallScore ? (r.ats_report as ATSReport) : null,
                );
                setTab("build");
              }}
            />
          </div>
        }
      />

      <div className="mb-6 flex gap-2 rounded-xl glass-panel p-1 w-fit">
        <TabBtn active={tab === "build"} onClick={() => setTab("build")} icon={Sparkles}>
          Build
        </TabBtn>
        <TabBtn active={tab === "ats"} onClick={() => setTab("ats")} icon={ScanLine}>
          ATS Analyzer
        </TabBtn>
      </div>

      {tab === "build" && (
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <div className="space-y-4 rounded-2xl glass-panel p-6">
            <Field label="Full name">
              <Input value={name} onChange={setName} placeholder="Ada Lovelace" />
            </Field>
            <Field label="Target role">
              <Input
                value={targetRole}
                onChange={setTargetRole}
                placeholder="Full Stack Engineer"
              />
            </Field>
            <Field label="Experience (free text)">
              <TextArea
                value={experience}
                onChange={setExperience}
                rows={4}
                placeholder="Past jobs, internships, freelance work…"
              />
            </Field>
            <Field label="Skills (comma sep)">
              <Input
                value={skills}
                onChange={setSkills}
                placeholder="React, TypeScript, Postgres…"
              />
            </Field>
            <Field label="Projects">
              <TextArea
                value={projects}
                onChange={setProjects}
                rows={3}
                placeholder="Brief project names + what they do"
              />
            </Field>
            <Field label="Education">
              <Input
                value={education}
                onChange={setEducation}
                placeholder="B.S. CS, Stanford, 2022"
              />
            </Field>
            <button
              onClick={onGen}
              disabled={loading || !name.trim()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-spark px-4 py-3 text-sm font-medium text-primary-foreground shadow-glow disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {loading ? "Crafting resume…" : "Generate resume"}
            </button>
            {resume && (
              <div className="flex gap-2">
                <button
                  onClick={onSave}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card/60 px-3 py-2 text-xs hover:bg-card transition"
                >
                  <Save className="h-3.5 w-3.5" /> {resumeId ? "Saved" : "Save"}
                </button>
                <button
                  onClick={onExportPDF}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card/60 px-3 py-2 text-xs hover:bg-card transition"
                >
                  <Download className="h-3.5 w-3.5" /> Export PDF
                </button>
              </div>
            )}
          </div>

          <div className="min-h-[500px]">
            {!resume && !loading && (
              <div className="flex h-[500px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 text-center text-sm text-muted-foreground">
                <FileText className="mb-3 h-8 w-8 text-spark animate-float" />
                Fill in the form — AI will craft a polished resume.
              </div>
            )}
            {loading && <div className="h-[500px] animate-pulse rounded-2xl bg-muted/20" />}
            {resume && <ResumePreview resume={resume} />}
          </div>
        </div>
      )}

      {tab === "ats" && (
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <div className="space-y-4 rounded-2xl glass-panel p-6">
            <div className="text-xs text-muted-foreground">
              {resume
                ? `Analyzing: ${resume.name} — ${targetRole}`
                : "Generate a resume first in the Build tab."}
            </div>
            <Field label="Paste job description">
              <TextArea
                value={jobDesc}
                onChange={setJobDesc}
                rows={10}
                placeholder="Paste the full JD here…"
              />
            </Field>
            <button
              onClick={onRunATS}
              disabled={atsLoading || !resume || !jobDesc.trim()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-spark px-4 py-3 text-sm font-medium text-primary-foreground shadow-glow disabled:opacity-50"
            >
              {atsLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ScanLine className="h-4 w-4" />
              )}
              {atsLoading ? "Analyzing…" : "Run ATS analysis"}
            </button>
          </div>

          <div className="min-h-[500px]">
            {!report && !atsLoading && (
              <div className="flex h-[500px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 text-center text-sm text-muted-foreground">
                <ScanLine className="mb-3 h-8 w-8 text-spark animate-float" />
                Paste a JD to score your resume.
              </div>
            )}
            {atsLoading && <div className="h-[500px] animate-pulse rounded-2xl bg-muted/20" />}
            {report && <ATSPanel report={report} />}
          </div>
        </div>
      )}
    </PageShell>
  );
}

function serializeResume(r: Resume): string {
  return `${r.name}\n${r.headline}\n\nSUMMARY\n${r.summary}\n\nSKILLS\n${r.skills.join(", ")}\n\nEXPERIENCE\n${r.experience.map((e) => `${e.role} @ ${e.company} (${e.period})\n${e.bullets.map((b) => `- ${b}`).join("\n")}`).join("\n\n")}\n\nPROJECTS\n${r.projects.map((p) => `${p.name}: ${p.description} [${p.tech.join(", ")}]`).join("\n")}\n\nEDUCATION\n${r.education.map((e) => `${e.degree}, ${e.school} (${e.period})`).join("\n")}\n\nCERTIFICATIONS\n${r.certifications.join(", ")}\n\nACHIEVEMENTS\n${r.achievements.join("\n")}`;
}

function ResumePreview({ resume }: { resume: Resume }) {
  return (
    <div className="print:bg-white print:text-black overflow-hidden rounded-2xl glass-panel">
      <div className="bg-gradient-to-br from-spark/20 via-transparent to-transparent p-8 print:bg-none">
        <h1 className="font-display text-4xl font-bold text-gradient">{resume.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{resume.headline}</p>
        <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
          {resume.contact.email && <Chip icon={Mail}>{resume.contact.email}</Chip>}
          {resume.contact.location && <Chip icon={MapPin}>{resume.contact.location}</Chip>}
          {resume.contact.website && <Chip icon={Globe}>{resume.contact.website}</Chip>}
          {resume.contact.github && <Chip icon={Github}>{resume.contact.github}</Chip>}
          {resume.contact.linkedin && <Chip icon={Linkedin}>{resume.contact.linkedin}</Chip>}
        </div>
      </div>
      <div className="space-y-5 p-8 pt-2">
        <Section title="Summary">
          <p className="text-sm leading-relaxed">{resume.summary}</p>
        </Section>
        <Section title="Skills">
          <div className="flex flex-wrap gap-1.5">
            {resume.skills.map((s, i) => (
              <span
                key={i}
                className="rounded-md border border-border bg-card/40 px-2 py-0.5 text-[11px]"
              >
                {s}
              </span>
            ))}
          </div>
        </Section>
        <Section title="Experience">
          <div className="space-y-3">
            {resume.experience.map((e, i) => (
              <div key={i}>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-medium">
                    {e.role} · {e.company}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{e.period}</span>
                </div>
                <ul className="mt-1 space-y-0.5 pl-4 text-sm">
                  {e.bullets.map((b, j) => (
                    <li key={j} className="list-disc">
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
        <Section title="Projects">
          <div className="space-y-2">
            {resume.projects.map((p, i) => (
              <div key={i} className="text-sm">
                <div className="font-medium">{p.name}</div>
                <div className="text-muted-foreground">{p.description}</div>
                <div className="mt-0.5 text-[11px] text-spark">{p.tech.join(" · ")}</div>
              </div>
            ))}
          </div>
        </Section>
        <Section title="Education">
          {resume.education.map((e, i) => (
            <div key={i} className="flex items-baseline justify-between text-sm">
              <span>
                {e.degree} · {e.school}
              </span>
              <span className="text-[11px] text-muted-foreground">{e.period}</span>
            </div>
          ))}
        </Section>
        {resume.certifications.length > 0 && (
          <Section title="Certifications">
            <p className="text-sm">{resume.certifications.join(" · ")}</p>
          </Section>
        )}
        {resume.achievements.length > 0 && (
          <Section title="Achievements">
            <ul className="space-y-0.5 pl-4 text-sm">
              {resume.achievements.map((a, i) => (
                <li key={i} className="list-disc">
                  {a}
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>
    </div>
  );
}

function ATSPanel({ report }: { report: ATSReport }) {
  const radarData = Object.entries(report.scores).map(([k, v]) => ({
    metric: k.charAt(0).toUpperCase() + k.slice(1),
    value: v,
  }));
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-[260px_1fr]">
        <div className="flex flex-col items-center justify-center rounded-2xl glass-panel p-6">
          <div className="relative grid h-32 w-32 place-items-center">
            <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="hsl(var(--border))"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="url(#g)"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={`${(report.overallScore / 100) * 264} 264`}
              />
              <defs>
                <linearGradient id="g" x1="0" x2="1">
                  <stop offset="0" stopColor="hsl(var(--spark))" />
                  <stop offset="1" stopColor="hsl(var(--primary))" />
                </linearGradient>
              </defs>
            </svg>
            <div className="text-center">
              <div className="font-display text-3xl font-bold">
                {Math.round(report.overallScore)}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                ATS Score
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl glass-panel p-4">
          <div className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">
            Recruiter take
          </div>
          <p className="text-sm leading-relaxed">{report.recruiterTake}</p>
          <div className="mt-3 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  dataKey="value"
                  stroke="hsl(var(--spark))"
                  fill="hsl(var(--spark))"
                  fillOpacity={0.35}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ListCard title="Matched keywords" items={report.matchedKeywords} tone="ok" />
        <ListCard title="Missing keywords" items={report.missingKeywords} tone="warn" />
        <ListCard title="Strengths" items={report.strengths} tone="ok" />
        <ListCard title="Improvements" items={report.improvements} tone="warn" />
      </div>
    </div>
  );
}

function ListCard({ title, items, tone }: { title: string; items: string[]; tone: "ok" | "warn" }) {
  return (
    <div className="rounded-2xl glass-panel p-4">
      <div className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">
        {title}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((it, i) => (
          <span
            key={i}
            className={`rounded-md border px-2 py-0.5 text-[11px] ${tone === "ok" ? "border-spark/40 bg-spark/10 text-foreground" : "border-destructive/40 bg-destructive/10 text-foreground"}`}
          >
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-[10px] uppercase tracking-widest text-spark">{title}</div>
      {children}
    </div>
  );
}
function Chip({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {children}
    </span>
  );
}
function TabBtn({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition ${active ? "bg-gradient-spark text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground"}`}
    >
      <Icon className="h-3.5 w-3.5" /> {children}
    </button>
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
function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
    />
  );
}
function TextArea({
  value,
  onChange,
  rows,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  rows: number;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm"
    />
  );
}
