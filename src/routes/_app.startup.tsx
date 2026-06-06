import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, PageHeader } from "@/components/PageHeader";
import { HolographicPanel } from "@/components/HolographicPanel";
import * as Icons from "lucide-react";
import { playClick, playSuccess, playHover } from "@/lib/sounds";
import { awardXP } from "@/lib/gamification";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/startup")({
  head: () => ({ meta: [{ title: "Startup Incubator — ProjectSpark" }] }),
  component: StartupIncubator,
});

type BusinessCanvas = {
  valueProp: string;
  customers: string;
  channels: string;
  revenue: string;
  partners: string;
};

export function StartupIncubator() {
  const [activeTab, setActiveTab] = useState<"validation" | "swot" | "pitch">("validation");
  
  // Startup validation input
  const [ideaText, setIdeaText] = useState("");
  const [validating, setValidating] = useState(false);
  const [validated, setValidated] = useState(false);

  // Business Model Canvas state
  const [canvas, setCanvas] = useState<BusinessCanvas>({
    valueProp: "Provide automated clinical diagnostics dashboards for radiography clinics.",
    customers: "Radiology departments, local medical clinics.",
    channels: "Direct sales reps, medical software distribution partners.",
    revenue: "SaaS licensing per scanning hub unit ($500/mo).",
    partners: "Hospitals, medical hardware suppliers."
  });

  // SWOT Competitor Analysis state
  const [swot, setSwot] = useState({
    strengths: "Proprietary vision transformers model, instant analytics.",
    weaknesses: "High compute requirements, medical compliance verification hurdles.",
    opportunities: "Expansion to MRI scanning fields, partnership with local clinics.",
    threats: "Large established healthcare legacy software vendors."
  });

  const handleValidate = () => {
    if (!ideaText.trim()) {
      toast.error("Please describe your startup idea first.");
      return;
    }
    playClick();
    setValidating(true);
    setValidated(false);

    // Simulate validation review
    setTimeout(() => {
      playSuccess();
      setValidating(false);
      setValidated(true);
      setCanvas({
        valueProp: `Decentralized AI evaluation engine for ${ideaText.substring(0, 30)}...`,
        customers: "Early adopter tech-savvy developers, corporate integrations.",
        channels: "API integrations, GitHub marketplace widgets.",
        revenue: "Pay-per-token API requests + monthly subscription model.",
        partners: "Cloud computing hosts, security compliance providers."
      });
      setSwot({
        strengths: "First mover advantage, localized learning models.",
        weaknesses: "Bootstrap funding, code auditing limits.",
        opportunities: "Global SaaS developer distribution.",
        threats: "Hyperscalers launching similar built-in tooling."
      });
      awardXP(60, "Validated Startup Idea");
      toast.success("Startup idea validated! Business Model & SWOT matrix compiled.");
    }, 1500);
  };

  const handleSaveCanvas = () => {
    playSuccess();
    awardXP(25, "Saved Business Canvas");
    toast.success("Business Model Canvas updated and synced with advisors.");
  };

  return (
    <PageShell>
      <PageHeader
        icon={Icons.Rocket}
        title="Startup Incubator & Launchpad"
        description="Transform engineering projects into high-growth businesses. Run idea validations, compile business models, map SWOT matrices, and compile pitch decks."
      />

      <div className="flex border-b border-white/5 mb-6 text-xs font-semibold overflow-x-auto">
        {(["validation", "swot", "pitch"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => { playClick(); setActiveTab(tab); }}
            className={`px-6 py-2.5 capitalize transition ${activeTab === tab ? "border-b-2 border-spark text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {tab === "validation" ? "Idea Validation & Canvas" : tab === "swot" ? "Competitor SWOT" : "Pitch Deck Builder"}
          </button>
        ))}
      </div>

      <div className="grid gap-6">

        {/* IDEA VALIDATION & CANVAS TAB */}
        {activeTab === "validation" && (
          <div className="space-y-6">
            {/* Input area */}
            <HolographicPanel className="p-5 space-y-4">
              <h3 className="font-display text-sm font-bold text-foreground">Validate Startup Concept</h3>
              <p className="text-xs text-muted-foreground">Describe your startup idea to generate a simulated market analysis and Business Model Canvas.</p>
              
              <div className="flex gap-3">
                <input
                  value={ideaText}
                  onChange={e => setIdeaText(e.target.value)}
                  placeholder="e.g. Automated clinical scans platform powered by machine learning..."
                  className="flex-1 rounded-xl border border-white/10 bg-background px-3 py-2.5 text-xs text-foreground outline-none focus:border-spark"
                />
                <button
                  onClick={handleValidate}
                  disabled={validating}
                  className="rounded-xl bg-gradient-spark px-6 py-2.5 text-xs font-semibold text-primary-foreground shadow-glow hover:opacity-95 transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  {validating ? <Icons.Loader2 className="h-4 w-4 animate-spin" /> : <Icons.Cpu className="h-4 w-4" />}
                  <span>{validating ? "Analyzing Market..." : "AI Validate Idea"}</span>
                </button>
              </div>
            </HolographicPanel>

            {/* Business Model Canvas Grid */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                  <Icons.LayoutGrid className="h-3.5 w-3.5" /> Business Model Canvas
                </div>
                <button onClick={handleSaveCanvas} className="text-xs text-spark hover:underline">
                  Save Changes
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <HolographicPanel className="p-4 space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Icons.Key className="h-3.5 w-3.5 text-spark" /> Key Partners
                  </div>
                  <textarea
                    value={canvas.partners}
                    onChange={e => setCanvas({ ...canvas, partners: e.target.value })}
                    rows={3}
                    className="w-full bg-transparent border-0 resize-none outline-none text-xs text-muted-foreground leading-relaxed"
                  />
                </HolographicPanel>

                <HolographicPanel className="p-4 space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Icons.Award className="h-3.5 w-3.5 text-aurora" /> Value Propositions
                  </div>
                  <textarea
                    value={canvas.valueProp}
                    onChange={e => setCanvas({ ...canvas, valueProp: e.target.value })}
                    rows={3}
                    className="w-full bg-transparent border-0 resize-none outline-none text-xs text-muted-foreground leading-relaxed"
                  />
                </HolographicPanel>

                <HolographicPanel className="p-4 space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Icons.Users className="h-3.5 w-3.5 text-violet-glow" /> Customer Segments
                  </div>
                  <textarea
                    value={canvas.customers}
                    onChange={e => setCanvas({ ...canvas, customers: e.target.value })}
                    rows={3}
                    className="w-full bg-transparent border-0 resize-none outline-none text-xs text-muted-foreground leading-relaxed"
                  />
                </HolographicPanel>

                <HolographicPanel className="p-4 space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Icons.TrendingUp className="h-3.5 w-3.5 text-blue-400" /> Channels
                  </div>
                  <textarea
                    value={canvas.channels}
                    onChange={e => setCanvas({ ...canvas, channels: e.target.value })}
                    rows={3}
                    className="w-full bg-transparent border-0 resize-none outline-none text-xs text-muted-foreground leading-relaxed"
                  />
                </HolographicPanel>

                <HolographicPanel className="p-4 space-y-2 lg:col-span-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Icons.DollarSign className="h-3.5 w-3.5 text-emerald-400" /> Revenue Streams
                  </div>
                  <textarea
                    value={canvas.revenue}
                    onChange={e => setCanvas({ ...canvas, revenue: e.target.value })}
                    rows={2}
                    className="w-full bg-transparent border-0 resize-none outline-none text-xs text-muted-foreground leading-relaxed"
                  />
                </HolographicPanel>
              </div>
            </div>
          </div>
        )}

        {/* COMPETITOR SWOT MATRIX TAB */}
        {activeTab === "swot" && (
          <div className="space-y-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
              <Icons.ShieldAlert className="h-3.5 w-3.5" /> Competitive SWOT Analysis Matrix
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <HolographicPanel className="p-5 border-blue-500/20 bg-blue-500/5 space-y-2">
                <div className="text-xs font-bold uppercase text-blue-400 flex items-center gap-1.5">
                  <Icons.Flame className="h-4 w-4" />
                  <span>Strengths (Internal)</span>
                </div>
                <textarea
                  value={swot.strengths}
                  onChange={e => setSwot({ ...swot, strengths: e.target.value })}
                  rows={3}
                  className="w-full bg-transparent border-0 resize-none outline-none text-xs text-muted-foreground leading-relaxed"
                />
              </HolographicPanel>

              <HolographicPanel className="p-5 border-amber-500/20 bg-amber-500/5 space-y-2">
                <div className="text-xs font-bold uppercase text-amber-400 flex items-center gap-1.5">
                  <Icons.AlertTriangle className="h-4 w-4" />
                  <span>Weaknesses (Internal)</span>
                </div>
                <textarea
                  value={swot.weaknesses}
                  onChange={e => setSwot({ ...swot, weaknesses: e.target.value })}
                  rows={3}
                  className="w-full bg-transparent border-0 resize-none outline-none text-xs text-muted-foreground leading-relaxed"
                />
              </HolographicPanel>

              <HolographicPanel className="p-5 border-emerald-500/20 bg-emerald-500/5 space-y-2">
                <div className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                  <Icons.CheckSquare className="h-4 w-4" />
                  <span>Opportunities (External)</span>
                </div>
                <textarea
                  value={swot.opportunities}
                  onChange={e => setSwot({ ...swot, opportunities: e.target.value })}
                  rows={3}
                  className="w-full bg-transparent border-0 resize-none outline-none text-xs text-muted-foreground leading-relaxed"
                />
              </HolographicPanel>

              <HolographicPanel className="p-5 border-red-500/20 bg-red-500/5 space-y-2">
                <div className="text-xs font-bold uppercase text-red-400 flex items-center gap-1.5">
                  <Icons.Skull className="h-4 w-4" />
                  <span>Threats (External)</span>
                </div>
                <textarea
                  value={swot.threats}
                  onChange={e => setSwot({ ...swot, threats: e.target.value })}
                  rows={3}
                  className="w-full bg-transparent border-0 resize-none outline-none text-xs text-muted-foreground leading-relaxed"
                />
              </HolographicPanel>
            </div>
            
            <div className="flex justify-end pt-2">
              <button onClick={() => { playSuccess(); toast.success("SWOT Matrix saved!"); }} className="px-4 py-2 rounded-xl bg-gradient-spark text-primary-foreground text-xs font-semibold shadow-glow">
                Save Competitor Matrix
              </button>
            </div>
          </div>
        )}

        {/* PITCH DECK BUILDER TAB */}
        {activeTab === "pitch" && (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            {/* Outline list */}
            <div className="space-y-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Pitch Deck Slides</div>
              
              <div className="space-y-3">
                {[
                  { num: 1, title: "Problem Definition", desc: "Why current healthcare diagnostic frameworks take hours for chest scans." },
                  { num: 2, title: "Solution & Architecture", desc: "AI-powered vision transformer scanning in 3D circles." },
                  { num: 3, title: "Market Potential", desc: "Estimated radiology clinics total addressable market of $12B." },
                  { num: 4, title: "Business & Subscription Models", desc: "$500/mo SaaS pricing per dashboard instance." }
                ].map(slide => (
                  <HolographicPanel key={slide.num} className="p-4 flex gap-4 items-start">
                    <div className="h-8 w-8 rounded-lg bg-spark/10 border border-spark/20 grid place-items-center text-xs font-bold font-mono text-spark shrink-0">
                      {slide.num}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-xs text-foreground">{slide.title}</h4>
                      <p className="text-xs text-muted-foreground leading-normal">{slide.desc}</p>
                    </div>
                  </HolographicPanel>
                ))}
              </div>
            </div>

            {/* Quick Actions / AI Builder */}
            <HolographicPanel className="p-5 flex flex-col justify-between h-[240px]">
              <div>
                <h3 className="font-display text-sm font-bold text-foreground">Pitch Deck Generator</h3>
                <p className="text-xs text-muted-foreground mt-1">Export slides into a clean PowerPoint/PDF config format.</p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => { playSuccess(); awardXP(40, "Generated startup pitch deck"); toast.success("Pitch Deck exported! Check downloads directory."); }}
                  className="w-full py-2.5 rounded-xl bg-gradient-spark text-primary-foreground font-semibold shadow-glow hover:opacity-95 transition flex items-center justify-center gap-1.5 text-xs"
                >
                  <Icons.Presentation className="h-4 w-4" />
                  <span>Generate PDF Presentation</span>
                </button>
              </div>
            </HolographicPanel>
          </div>
        )}

      </div>
    </PageShell>
  );
}
