import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, PageHeader } from "@/components/PageHeader";
import { HolographicPanel } from "@/components/HolographicPanel";
import * as Icons from "lucide-react";
import { playClick, playSuccess, playHover } from "@/lib/sounds";
import { awardXP } from "@/lib/gamification";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/marketplace")({
  head: () => ({ meta: [{ title: "Project Marketplace — ProjectSpark" }] }),
  component: ProjectMarketplace,
});

type ProjectPost = {
  id: string;
  type: "Idea" | "Problem" | "Startup" | "Research";
  title: string;
  domain: string;
  description: string;
  author: string;
  roles: string[];
  suggestedRoles?: { role: string; matchPct: number; reason: string }[];
  likes: number;
  applicants: number;
  hasApplied?: boolean;
};

const INITIAL_POSTS: ProjectPost[] = [
  {
    id: "post-1",
    type: "Startup",
    title: "AI Healthcare Diagnostics Portal",
    domain: "Artificial Intelligence & Health",
    description: "Building an automated chest X-ray scanner using vision transformers and React dashboard, offering doctor assistance.",
    author: "arun_singh",
    roles: ["ML Engineer", "Frontend Dev", "UI Designer"],
    suggestedRoles: [
      { role: "ML Engineer (Vision)", matchPct: 98, reason: "Requires PyTorch & Vision Transformers experience." },
      { role: "Frontend Dev (React)", matchPct: 92, reason: "Requires clean UI, responsive cards, and state synchronization." },
      { role: "UI Designer", matchPct: 85, reason: "Requires glassmorphism dashboards design." }
    ],
    likes: 24,
    applicants: 5,
  },
  {
    id: "post-2",
    type: "Research",
    title: "Zero-Knowledge Proofs for IoT Hubs",
    domain: "Cybersecurity & Blockchain",
    description: "Developing cryptography protocols for small embedded devices to assert authenticity without leaking device IDs.",
    author: "lisa_m",
    roles: ["Crypto Specialist", "IoT dev"],
    suggestedRoles: [
      { role: "Crypto Specialist", matchPct: 95, reason: "Deep mathematical ZK protocol alignment." },
      { role: "IoT Firmware Dev", matchPct: 88, reason: "C/Rust embedded hardware constraints." }
    ],
    likes: 18,
    applicants: 2,
  },
  {
    id: "post-3",
    type: "Idea",
    title: "EcoSpark Carbon Tracker extension",
    domain: "SaaS & Sustainability",
    description: "Browser extension that audits your cloud resources and estimates real-time carbon footprints of hosting servers.",
    author: "dan_code",
    roles: ["Extension Specialist", "Backend Dev"],
    suggestedRoles: [
      { role: "Extension Specialist", matchPct: 90, reason: "Manifest v3 Chrome extensions skills." },
      { role: "Backend Engineer", matchPct: 84, reason: "AWS/GCP API cost reporting parser." }
    ],
    likes: 12,
    applicants: 3,
  }
];

export function ProjectMarketplace() {
  const [posts, setPosts] = useState<ProjectPost[]>(INITIAL_POSTS);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  
  // Post Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [formType, setFormType] = useState<ProjectPost["type"]>("Idea");
  const [formTitle, setFormTitle] = useState("");
  const [formDomain, setFormDomain] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formRoles, setFormRoles] = useState("");
  
  // AI Suggestions generated state
  const [matchingRoles, setMatchingRoles] = useState<{ role: string; matchPct: number; reason: string }[] | null>(null);
  const [matchRunning, setMatchRunning] = useState(false);

  const runMatchmaker = () => {
    if (!formTitle || !formDesc) {
      toast.error("Please enter a title and description first.");
      return;
    }
    playClick();
    setMatchRunning(true);
    setMatchingRoles(null);
    
    // Simulate AI generation
    setTimeout(() => {
      playSuccess();
      const mockMatches = [
        { role: `${formType === "Research" ? "Research Assistant" : "Product Manager"}`, matchPct: 94, reason: `Matches scope of "${formTitle}" description.` },
        { role: "Full Stack Engineer", matchPct: 90, reason: "Required to construct the functional prototype." },
        { role: `${formDomain.includes("AI") || formDesc.toLowerCase().includes("ai") ? "ML Engineer" : "UI/UX Developer"}`, matchPct: 88, reason: "Matches key tech stack requirements." }
      ];
      setMatchingRoles(mockMatches);
      setMatchRunning(false);
      awardXP(25, "Used AI Matchmaker");
      toast.success("AI suggested matching team structure!");
    }, 1500);
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formDesc || !formDomain) {
      toast.error("Please fill out all fields.");
      return;
    }
    
    playSuccess();
    const newPost: ProjectPost = {
      id: `post-${Date.now()}`,
      type: formType,
      title: formTitle,
      domain: formDomain,
      description: formDesc,
      author: "you (Growth Builder)",
      roles: formRoles.split(",").map(r => r.trim()).filter(Boolean),
      suggestedRoles: matchingRoles || [
        { role: "General Collaborator", matchPct: 85, reason: "Help kickstart the repository." }
      ],
      likes: 0,
      applicants: 0,
    };
    
    setPosts([newPost, ...posts]);
    setShowAddForm(false);
    // Reset fields
    setFormTitle("");
    setFormDomain("");
    setFormDesc("");
    setFormRoles("");
    setMatchingRoles(null);
    
    awardXP(50, `Posted a ${formType}`);
    toast.success(`${formType} posted to the marketplace!`);
  };

  const handleApply = (postId: string) => {
    playSuccess();
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const already = !!p.hasApplied;
        return {
          ...p,
          applicants: p.applicants + (already ? -1 : 1),
          hasApplied: !already
        };
      }
      return p;
    }));
    toast.success("Application submitted! The team creator has been notified.");
    awardXP(15, "Applied to collaborate");
  };

  const handleLike = (postId: string) => {
    playClick();
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, likes: p.likes + 1 };
      }
      return p;
    }));
  };

  const filteredPosts = posts.filter(p => {
    if (activeFilter === "All") return true;
    return p.type === activeFilter;
  });

  return (
    <PageShell>
      <PageHeader
        icon={Icons.ShoppingBag}
        title="Project Marketplace & Matchmaker"
        description="Launch startup prototypes, post problem statements, form teams, and use AI Matchmaking to find the perfect collaborators."
        actions={
          <button
            onClick={() => { playClick(); setShowAddForm(!showAddForm); }}
            onMouseEnter={playHover}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-spark px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-95 transition"
          >
            <Icons.Plus className="h-4 w-4" />
            <span>Post Project / Idea</span>
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        
        {/* Left Side: Post form / Quick Tools */}
        <div className="space-y-6">
          {showAddForm ? (
            <HolographicPanel className="p-5 space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-sm font-bold text-foreground">Post to Ecosystem</h3>
                <button onClick={() => setShowAddForm(false)} className="text-muted-foreground hover:text-foreground">
                  <Icons.X className="h-4 w-4" />
                </button>
              </div>
              
              <form onSubmit={handlePostSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Ecosystem Category</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(["Idea", "Problem", "Startup", "Research"] as const).map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => { playClick(); setFormType(t); }}
                        className={`py-1.5 px-2 rounded-lg border text-center font-medium transition ${formType === t ? "border-spark bg-spark/10 text-spark" : "border-white/5 bg-white/2 text-muted-foreground hover:text-foreground"}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Title</label>
                  <input
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    placeholder="e.g. Decentralized Voting app"
                    className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-spark"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Domain</label>
                  <input
                    value={formDomain}
                    onChange={e => setFormDomain(e.target.value)}
                    placeholder="e.g. Web3, Cybersecurity"
                    className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-spark"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Brief Description</label>
                  <textarea
                    value={formDesc}
                    onChange={e => setFormDesc(e.target.value)}
                    placeholder="Describe your goal, tech stack, and what you aim to build."
                    rows={3}
                    className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-spark resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Roles Needed (comma-separated)</label>
                  <input
                    value={formRoles}
                    onChange={e => setFormRoles(e.target.value)}
                    placeholder="e.g. React Developer, UI Designer"
                    className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-spark"
                  />
                </div>

                {/* Matchmaking trigger */}
                <button
                  type="button"
                  onClick={runMatchmaker}
                  disabled={matchRunning}
                  className="w-full py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 font-semibold flex items-center justify-center gap-1.5 hover:bg-purple-500/20 transition disabled:opacity-50"
                >
                  {matchRunning ? <Icons.Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Icons.Cpu className="h-3.5 w-3.5" />}
                  <span>{matchRunning ? "Running Matchmaker..." : "AI Team Matchmaker"}</span>
                </button>

                {/* AI matched results inside form */}
                {matchingRoles && (
                  <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3 space-y-2 animate-in slide-in-from-top-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1">
                      <Icons.Brain className="h-3 w-3 animate-pulse" /> AI Matchmaker Recommendations
                    </div>
                    {matchingRoles.map((match, i) => (
                      <div key={i} className="text-[11px] leading-relaxed">
                        <div className="flex justify-between font-semibold">
                          <span className="text-foreground">{match.role}</span>
                          <span className="text-purple-400 font-mono">{match.matchPct}% match</span>
                        </div>
                        <p className="text-muted-foreground text-[10px]">{match.reason}</p>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-gradient-spark text-primary-foreground font-semibold shadow-glow hover:opacity-95 transition mt-2"
                >
                  Publish to Marketplace
                </button>
              </form>
            </HolographicPanel>
          ) : (
            <HolographicPanel className="p-5 space-y-4">
              <h3 className="font-display text-sm font-bold text-foreground">Ecosystem Matchmaking Info</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                ProjectSpark scans domain, required skills, and study records to pair you with the best collaborators. 
                Generate role recommendations instantly with the AI tool.
              </p>
              <div className="rounded-xl border border-white/5 bg-white/2 p-3 space-y-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <Icons.GraduationCap className="h-4 w-4 text-spark" />
                  <div>
                    <div className="font-semibold">Match score multiplier</div>
                    <div className="text-[10px] text-muted-foreground">Based on current roadmap nodes.</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Icons.Flame className="h-4 w-4 text-orange-500" />
                  <div>
                    <div className="font-semibold">Active team boost</div>
                    <div className="text-[10px] text-muted-foreground">Collaborators with high XP are bumped.</div>
                  </div>
                </div>
              </div>
            </HolographicPanel>
          )}
        </div>

        {/* Right Side: Feed & Search filter */}
        <div className="space-y-4">
          {/* Feed Filter tab bar */}
          <div className="flex gap-1.5 overflow-x-auto pb-1" data-lenis-prevent>
            {["All", "Idea", "Problem", "Startup", "Research"].map(f => (
              <button
                key={f}
                onClick={() => { playClick(); setActiveFilter(f); }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition ${activeFilter === f ? "border-spark bg-spark/15 text-foreground" : "border-white/5 bg-white/2 text-muted-foreground hover:text-foreground"}`}
              >
                {f === "All" ? "All Posts" : f}
              </button>
            ))}
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            {filteredPosts.map(post => {
              const typeColors = {
                Idea: "bg-blue-500/10 border-blue-500/20 text-blue-400",
                Problem: "bg-red-500/10 border-red-500/20 text-red-400",
                Startup: "bg-purple-500/10 border-purple-500/20 text-purple-400",
                Research: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              };
              return (
                <HolographicPanel key={post.id} className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${typeColors[post.type]}`}>
                          {post.type}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">Posted by @{post.author}</span>
                      </div>
                      <h3 className="font-display text-base font-bold text-foreground mt-2">{post.title}</h3>
                      <p className="text-[10px] text-spark font-medium uppercase tracking-wider mt-0.5">{post.domain}</p>
                    </div>

                    <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg border border-white/5 text-[10px] font-mono">
                      <Icons.Users className="h-3 w-3 text-muted-foreground" />
                      <span>{post.applicants} applied</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">{post.description}</p>

                  {/* AI recommended roles grid */}
                  {post.suggestedRoles && post.suggestedRoles.length > 0 && (
                    <div className="rounded-xl border border-white/5 bg-white/2 p-3 space-y-2">
                      <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                        <Icons.Brain className="h-3.5 w-3.5 text-spark" /> Suggested Team Matchmaking
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {post.suggestedRoles.map((roleObj, i) => (
                          <div key={i} className="rounded-lg border border-white/5 bg-black/20 p-2 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-center text-[10px] font-semibold text-foreground">
                                <span className="truncate">{roleObj.role}</span>
                                <span className="text-emerald-400">{roleObj.matchPct}%</span>
                              </div>
                              <p className="text-[9px] text-muted-foreground leading-tight mt-1">{roleObj.reason}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Post actions */}
                  <div className="flex justify-between items-center pt-2 border-t border-white/5 text-xs">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-1.5 text-muted-foreground hover:text-red-400 transition"
                    >
                      <Icons.Heart className="h-4 w-4" />
                      <span>{post.likes} Likes</span>
                    </button>
                    
                    <button
                      onClick={() => handleApply(post.id)}
                      className={`px-4.5 py-1.5 rounded-xl font-semibold border transition flex items-center gap-1.5 ${post.hasApplied ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" : "bg-gradient-spark text-primary-foreground shadow-glow hover:opacity-95"}`}
                    >
                      {post.hasApplied ? (
                        <>
                          <Icons.Check className="h-3.5 w-3.5" />
                          <span>Applied</span>
                        </>
                      ) : (
                        <>
                          <Icons.Send className="h-3.5 w-3.5" />
                          <span>Apply to Team</span>
                        </>
                      )}
                    </button>
                  </div>
                </HolographicPanel>
              );
            })}
          </div>
        </div>

      </div>
    </PageShell>
  );
}
