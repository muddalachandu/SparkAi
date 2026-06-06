import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, PageHeader } from "@/components/PageHeader";
import { HolographicPanel } from "@/components/HolographicPanel";
import * as Icons from "lucide-react";
import { playClick, playSuccess, playHover } from "@/lib/sounds";
import { awardXP } from "@/lib/gamification";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/research")({
  head: () => ({ meta: [{ title: "Research Hub — ProjectSpark" }] }),
  component: ResearchHub,
});

type ResearchPaper = {
  id: string;
  title: string;
  authors: string;
  source: string;
  category: "AI/ML" | "Systems" | "Security";
  abstract: string;
  summary?: { contributions: string[]; impact: string };
  comments: { user: string; text: string; date: string }[];
  likes: number;
  bookmarked?: boolean;
};

const PAPERS: ResearchPaper[] = [
  {
    id: "paper-1",
    title: "Attention Is All You Need",
    authors: "Vaswani et al. (Google Research)",
    source: "NeurIPS 2017",
    category: "AI/ML",
    abstract: "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms.",
    summary: {
      contributions: [
        "Replaced RNNs and CNNs with self-attention layers.",
        "Introduced multi-head attention for parallel sequence modeling.",
        "Significantly reduced training time while achieving SOTA translation results."
      ],
      impact: "Laid the foundation for modern LLMs (GPT, Gemini, Claude)."
    },
    comments: [
      { user: "ml_dev_99", text: "Truly seminal. The multi-head attention model is still the gold standard.", date: "2 hours ago" },
      { user: "quantum_coder", text: "Agreed, though scaling costs are getting quadratic on long contexts.", date: "1 hour ago" }
    ],
    likes: 142,
  },
  {
    id: "paper-2",
    title: "An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale",
    authors: "Dosovitskiy et al. (Google Brain)",
    source: "ICLR 2021",
    category: "AI/ML",
    abstract: "While the Transformer architecture has become the de-facto standard for natural language processing, its applications to computer vision remain limited. We show that a pure transformer applied directly to patches of images performs very well.",
    comments: [
      { user: "vision_pioneer", text: "Vision Transformers (ViT) changed everything in medical imaging benchmarks.", date: "Yesterday" }
    ],
    likes: 98,
  },
  {
    id: "paper-3",
    title: "Resilient Distributed Datasets: A Fault-Tolerant Abstraction for In-Memory Cluster Computing",
    authors: "Zaharia et al. (UC Berkeley)",
    source: "NSDI 2012",
    category: "Systems",
    abstract: "We present Resilient Distributed Datasets (RDDs), a distributed memory abstraction that lets programmers perform in-memory computations on large clusters in a fault-tolerant manner.",
    comments: [],
    likes: 56,
  }
];

export function ResearchHub() {
  const [papers, setPapers] = useState<ResearchPaper[]>(PAPERS);
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);
  
  // Custom comment state
  const [commentText, setCommentText] = useState("");

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playClick();
    setPapers(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, likes: p.likes + 1 };
      }
      return p;
    }));
  };

  const handleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playClick();
    setPapers(prev => prev.map(p => {
      if (p.id === id) {
        const bookmarked = !p.bookmarked;
        if (bookmarked) {
          awardXP(15, "Bookmarked research paper");
          toast.success("Paper added to study repository.");
        }
        return { ...p, bookmarked };
      }
      return p;
    }));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedPaper) return;
    playClick();

    const newComment = {
      user: "you",
      text: commentText,
      date: "Just now"
    };

    setPapers(prev => prev.map(p => {
      if (p.id === selectedPaper.id) {
        const updated = {
          ...p,
          comments: [...p.comments, newComment]
        };
        setSelectedPaper(updated);
        return updated;
      }
      return p;
    }));
    setCommentText("");
    awardXP(10, "Commented on research paper");
    toast.success("Discussion posted!");
  };

  const generateAISummary = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playSuccess();
    setPapers(prev => prev.map(p => {
      if (p.id === id) {
        const updated = {
          ...p,
          summary: p.summary || {
            contributions: [
              "Formulated novel representations mapping patch networks.",
              "Introduced modular layers allowing linear scalability.",
              "Established benchmark validations surpassing traditional architectures."
            ],
            impact: "Enabled high fidelity deployments under low latency constraints."
          }
        };
        if (selectedPaper?.id === id) setSelectedPaper(updated);
        awardXP(25, "Generated paper AI summary");
        toast.success("AI Summary generated successfully!");
        return updated;
      }
      return p;
    }));
  };

  return (
    <PageShell>
      <PageHeader
        icon={Icons.Newspaper}
        title="AI Research Hub"
        description="Explore pioneering engineering research. View abstract summaries, trigger AI digests, and participate in peer discussions."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        
        {/* Left Side: Papers List */}
        <div className="space-y-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Recommended papers feed</div>
          
          <div className="space-y-3.5">
            {papers.map(p => {
              const isSelected = selectedPaper?.id === p.id;
              const catColors = {
                "AI/ML": "bg-purple-500/10 border-purple-500/20 text-purple-400",
                "Systems": "bg-blue-500/10 border-blue-500/20 text-blue-400",
                "Security": "bg-red-500/10 border-red-500/20 text-red-400"
              };
              return (
                <HolographicPanel
                  key={p.id}
                  className={`p-5 space-y-4 cursor-pointer transition ${isSelected ? "border-spark/50 bg-spark/5" : "hover:border-white/10"}`}
                  onClick={() => { playClick(); setSelectedPaper(p); }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${catColors[p.category]}`}>
                          {p.category}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-semibold">{p.source}</span>
                      </div>
                      <h3 className="font-display text-sm font-bold text-foreground mt-2">{p.title}</h3>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Authors: {p.authors}</p>
                    </div>

                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={(e) => handleBookmark(p.id, e)}
                        className={`rounded-lg p-1.5 border transition ${p.bookmarked ? "bg-spark/10 border-spark/20 text-spark" : "border-white/5 text-muted-foreground hover:text-foreground"}`}
                      >
                        <Icons.Bookmark className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{p.abstract}</p>

                  {/* AI Summary details */}
                  {p.summary && (
                    <div className="rounded-xl border border-spark/20 bg-spark/5 p-3 space-y-2">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-spark flex items-center gap-1">
                        <Icons.Brain className="h-3.5 w-3.5" /> AI Summary & Key Contributions
                      </div>
                      <ul className="list-disc pl-4 text-[11px] leading-relaxed text-muted-foreground space-y-1">
                        {p.summary.contributions.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                      <div className="text-[11px] text-muted-foreground">
                        <span className="font-bold text-foreground">Future Impact: </span> {p.summary.impact}
                      </div>
                    </div>
                  )}

                  {/* Actions inside list card */}
                  <div className="flex justify-between items-center text-xs pt-2 border-t border-white/5">
                    <button onClick={(e) => handleLike(p.id, e)} className="flex items-center gap-1 text-muted-foreground hover:text-red-400 transition">
                      <Icons.Heart className="h-4 w-4" />
                      <span>{p.likes} Likes</span>
                    </button>

                    {!p.summary && (
                      <button
                        onClick={(e) => generateAISummary(p.id, e)}
                        className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] uppercase tracking-wider font-semibold text-foreground hover:bg-white/10 transition flex items-center gap-1"
                      >
                        <Icons.Sparkles className="h-3.5 w-3.5 text-spark" />
                        <span>Generate AI Summary</span>
                      </button>
                    )}
                  </div>
                </HolographicPanel>
              );
            })}
          </div>
        </div>

        {/* Right Side: Discussion Board */}
        <div>
          <HolographicPanel className="p-5 min-h-[460px] flex flex-col justify-between">
            {selectedPaper ? (
              <div className="flex flex-col justify-between h-full flex-1">
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground">Discussions: {selectedPaper.title.substring(0, 30)}...</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Participate in peer discussions & notes exchange.</p>

                  <div className="mt-4 pt-4 border-t border-white/5 space-y-3 max-h-[220px] overflow-y-auto" data-lenis-prevent>
                    {selectedPaper.comments.map((comment, i) => (
                      <div key={i} className="bg-white/2 border border-white/5 rounded-xl p-3 text-xs space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-foreground">@{comment.user}</span>
                          <span className="text-[9px] text-muted-foreground">{comment.date}</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{comment.text}</p>
                      </div>
                    ))}
                    {selectedPaper.comments.length === 0 && (
                      <div className="text-center py-6 text-xs text-muted-foreground">
                        No discussions yet. Be the first to start the thread!
                      </div>
                    )}
                  </div>
                </div>

                <form onSubmit={handleAddComment} className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                  <input
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder="Ask a question or comment..."
                    className="flex-1 rounded-xl border border-white/10 bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-spark"
                    required
                  />
                  <button type="submit" className="rounded-xl bg-gradient-spark px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:opacity-95 transition">
                    Comment
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-20 flex-1 flex flex-col items-center justify-center">
                <Icons.MessageSquare className="h-8 w-8 text-spark/40 animate-pulse mb-3" />
                <h4 className="font-semibold text-xs text-muted-foreground">No Paper Selected</h4>
                <p className="text-[10px] text-muted-foreground mt-1 px-4 leading-relaxed">
                  Select a research paper from the feed to load discussion threads and draft AI summaries.
                </p>
              </div>
            )}
          </HolographicPanel>
        </div>

      </div>
    </PageShell>
  );
}
