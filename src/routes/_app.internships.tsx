import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, PageHeader } from "@/components/PageHeader";
import { HolographicPanel } from "@/components/HolographicPanel";
import * as Icons from "lucide-react";
import { playClick, playSuccess, playHover } from "@/lib/sounds";
import { awardXP } from "@/lib/gamification";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/internships")({
  head: () => ({ meta: [{ title: "Opportunity Hub — ProjectSpark" }] }),
  component: InternshipHub,
});

type InternshipItem = {
  id: string;
  type: "Internship" | "Research" | "Fellowship";
  title: string;
  company: string;
  domain: string;
  stipend: string;
  status: "Open" | "Applied";
};

type HackathonItem = {
  id: string;
  title: string;
  organizer: string;
  date: string;
  prizes: string;
  teamsCount: number;
  hasTeam?: boolean;
};

type OpenSourceRepo = {
  id: string;
  name: string;
  stars: number;
  description: string;
  issues: { title: string; difficulty: "Easy" | "Medium"; link: string }[];
};

const INITIAL_OPPS: InternshipItem[] = [
  { id: "op-1", type: "Internship", title: "ML Engineering Intern", company: "SparkLabs AI", domain: "Deep Learning & Vision", stipend: "$4,500/mo", status: "Open" },
  { id: "op-2", type: "Research", title: "Quantum Cryptography Fellow", company: "Supercomputing Lab", domain: "Security & Physics", stipend: "$3,800/mo", status: "Open" },
  { id: "op-3", type: "Fellowship", title: "Next.js Core Contributor Program", company: "Vercel Devs", domain: "Frontend Meta-frameworks", stipend: "$5,000/mo", status: "Open" }
];

const INITIAL_HACKATHONS: HackathonItem[] = [
  { id: "hack-1", title: "Sparkathon AI Builder 2026", organizer: "Google DeepMind team", date: "June 24-26", prizes: "$50,000", teamsCount: 142 },
  { id: "hack-2", title: "Web3 Decentrahack League", organizer: "Ethereum Foundation", date: "July 12-14", prizes: "$30,000", teamsCount: 88 }
];

const REPOS: OpenSourceRepo[] = [
  {
    id: "repo-1",
    name: "spark-forge/ai-orb-visualizer",
    stars: 1240,
    description: "Highly performant webgl particle volumetric glows for interactive 3d maps.",
    issues: [
      { title: "Optimize shader canvas render loop memory leakage", difficulty: "Medium", link: "#" },
      { title: "Fix touch swipe zoom controls on iOS webkit browsers", difficulty: "Easy", link: "#" }
    ]
  },
  {
    id: "repo-2",
    name: "facebook/pytorch-lightning",
    stars: 28900,
    description: "Lightweight PyTorch wrapper for high-performance AI research training.",
    issues: [
      { title: "Document learning rate schedules inside docs tutorials", difficulty: "Easy", link: "#" }
    ]
  }
];

export function InternshipHub() {
  const [activeTab, setActiveTab] = useState<"internships" | "hackathons" | "opensource">("internships");
  
  // Lists state
  const [opps, setOpps] = useState<InternshipItem[]>(INITIAL_OPPS);
  const [hacks, setHacks] = useState<HackathonItem[]>(INITIAL_HACKATHONS);

  const handleApplyInternship = (id: string) => {
    playSuccess();
    setOpps(prev => prev.map(o => {
      if (o.id === id) {
        toast.success(`Application sent to ${o.company} for "${o.title}"!`);
        awardXP(30, "Applied to internship");
        return { ...o, status: "Applied" };
      }
      return o;
    }));
  };

  const handleRegisterHackathon = (id: string) => {
    playSuccess();
    setHacks(prev => prev.map(h => {
      if (h.id === id) {
        const joined = !h.hasTeam;
        toast.success(joined ? "Registered for Hackathon! Team formation created." : "Registration cancelled.");
        awardXP(20, "Registered for Hackathon");
        return {
          ...h,
          teamsCount: h.teamsCount + (joined ? 1 : -1),
          hasTeam: joined
        };
      }
      return h;
    }));
  };

  return (
    <PageShell>
      <PageHeader
        icon={Icons.Briefcase}
        title="Internship & Opportunity Hub"
        description="Launch your career. Discover top internships, form teams for global hackathons, and log open-source contributions."
      />

      <div className="flex border-b border-white/5 mb-6 text-xs font-semibold overflow-x-auto">
        {(["internships", "hackathons", "opensource"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => { playClick(); setActiveTab(tab); }}
            className={`px-6 py-2.5 capitalize transition ${activeTab === tab ? "border-b-2 border-spark text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {tab === "internships" ? "Internships & Research" : tab === "hackathons" ? "Hackathon Arena" : "Open Source Gate"}
          </button>
        ))}
      </div>

      <div className="grid gap-6">

        {/* INTERNSHIPS TAB */}
        {activeTab === "internships" && (
          <div className="space-y-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
              <Icons.Search className="h-3.5 w-3.5" /> Filtered vacancies
            </div>
            
            <div className="space-y-3">
              {opps.map(op => {
                const typeColors = {
                  Internship: "bg-blue-500/10 border-blue-500/20 text-blue-400",
                  Research: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
                  Fellowship: "bg-purple-500/10 border-purple-500/20 text-purple-400"
                };
                return (
                  <HolographicPanel key={op.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${typeColors[op.type]}`}>
                          {op.type}
                        </span>
                        <span className="text-xs text-muted-foreground font-semibold">@{op.company}</span>
                      </div>
                      <h3 className="font-display text-sm font-bold text-foreground mt-2">{op.title}</h3>
                      <p className="text-[10px] text-spark font-medium uppercase tracking-wider mt-0.5">{op.domain} · {op.stipend}</p>
                    </div>

                    <button
                      onClick={() => handleApplyInternship(op.id)}
                      disabled={op.status === "Applied"}
                      className={`sm:self-center px-5 py-2 rounded-xl text-xs font-semibold border transition ${op.status === "Applied" ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400 cursor-not-allowed" : "bg-gradient-spark text-primary-foreground shadow-glow hover:opacity-95"}`}
                    >
                      {op.status === "Applied" ? "Applied" : "Quick Apply"}
                    </button>
                  </HolographicPanel>
                );
              })}
            </div>
          </div>
        )}

        {/* HACKATHON TAB */}
        {activeTab === "hackathons" && (
          <div className="space-y-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
              <Icons.Activity className="h-3.5 w-3.5" /> Active Competitions
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {hacks.map(hack => (
                <HolographicPanel key={hack.id} className="p-5 flex flex-col justify-between h-[180px]">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-bold uppercase text-spark tracking-wider">Date: {hack.date}</span>
                      <span className="text-[9px] bg-white/5 border border-white/5 px-2 py-0.5 rounded-lg text-muted-foreground">{hack.teamsCount} Teams</span>
                    </div>
                    <h3 className="font-display text-sm font-bold text-foreground mt-2">{hack.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">Organizer: {hack.organizer}</p>
                    <p className="text-[10px] text-emerald-400 font-semibold font-mono mt-1">Prize pool: {hack.prizes}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRegisterHackathon(hack.id)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-semibold border transition ${hack.hasTeam ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" : "bg-gradient-spark text-primary-foreground shadow-glow"}`}
                    >
                      {hack.hasTeam ? "Registered" : "Register Now"}
                    </button>
                  </div>
                </HolographicPanel>
              ))}
            </div>
          </div>
        )}

        {/* OPEN SOURCE TAB */}
        {activeTab === "opensource" && (
          <div className="space-y-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
              <Icons.Github className="h-3.5 w-3.5" /> Recommended Repositories & Good First Issues
            </div>

            <div className="space-y-4">
              {REPOS.map(repo => (
                <HolographicPanel key={repo.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Icons.Folder className="h-4 w-4 text-spark" />
                      <h4 className="font-semibold text-sm text-foreground">{repo.name}</h4>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-mono opacity-80">
                      <Icons.Star className="h-3 w-3 text-yellow-400" />
                      <span>{repo.stars} stars</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-normal">{repo.description}</p>
                  
                  <div className="pt-2 border-t border-white/5 space-y-2">
                    <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Good First Issues</div>
                    {repo.issues.map((issue, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white/2 border border-white/5 rounded-lg p-2 text-xs">
                        <div className="flex items-center gap-2">
                          <Icons.GitPullRequest className="h-3.5 w-3.5 text-purple-400" />
                          <span className="text-foreground">{issue.title}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${issue.difficulty === "Easy" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-amber-500/10 border-amber-500/20 text-amber-400"}`}>
                            {issue.difficulty}
                          </span>
                          <button
                            onClick={() => { playSuccess(); awardXP(25, `Contributed to ${repo.name}`); toast.success("Contribution recorded! GitHub issue page simulation activated."); }}
                            className="text-spark font-semibold text-[10px] uppercase tracking-wider hover:underline"
                          >
                            Contribute
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </HolographicPanel>
              ))}
            </div>
          </div>
        )}

      </div>
    </PageShell>
  );
}
