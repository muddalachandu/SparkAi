import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, PageHeader } from "@/components/PageHeader";
import { HolographicPanel } from "@/components/HolographicPanel";
import * as Icons from "lucide-react";
import { playHover, playClick, playSuccess } from "@/lib/sounds";
import { awardXP } from "@/lib/gamification";

export const Route = createFileRoute("/_app/skills")({
  head: () => ({ meta: [{ title: "Skill Graph — ProjectSpark" }] }),
  component: SkillGraph,
});

type SkillNode = {
  id: string;
  label: string;
  category: "Frontend" | "Backend" | "Data Science" | "DevOps";
  progress: number;
  prereqs: string[];
  info: string;
  x: number;
  y: number;
  connections: string[];
  jobs: string[];
};

const INITIAL_NODES: SkillNode[] = [
  { id: "html", label: "HTML5 & Semantic Web", category: "Frontend", progress: 95, prereqs: [], info: "Foundational structure of web pages and document layout.", x: -180, y: -100, connections: ["css", "js"], jobs: ["Frontend Dev", "Full Stack Dev"] },
  { id: "css", label: "CSS3 & Responsive Layouts", category: "Frontend", progress: 85, prereqs: ["html"], info: "Styling layout architectures, Flexbox, Grid, animations, and TailwindCSS.", x: -80, y: -130, connections: ["js", "react"], jobs: ["UI Engineer", "Frontend Dev"] },
  { id: "js", label: "Advanced JavaScript", category: "Frontend", progress: 80, prereqs: ["html"], info: "Asynchronous programming, closures, ES6 syntax, and web DOM controls.", x: -80, y: -50, connections: ["react", "nodejs"], jobs: ["Frontend Dev", "JS Architect"] },
  { id: "react", label: "React JS Meta-Framework", category: "Frontend", progress: 75, prereqs: ["css", "js"], info: "Component lifecycle, Virtual DOM diffing, and state hook flows.", x: 20, y: -90, connections: ["nextjs"], jobs: ["React Engineer", "Frontend Dev"] },
  { id: "nextjs", label: "Next.js App Router", category: "Frontend", progress: 60, prereqs: ["react"], info: "Server-side rendering (SSR), Static Generation (SSG), and API routes.", x: 120, y: -90, connections: [], jobs: ["Next.js Developer", "Full Stack Dev"] },
  
  { id: "python", label: "Python Core", category: "Backend", progress: 90, prereqs: [], info: "Object-oriented scripting, data structures, and basic automation.", x: -180, y: 100, connections: ["django", "ml"], jobs: ["Python Dev", "Backend Dev"] },
  { id: "django", label: "Django Framework", category: "Backend", progress: 70, prereqs: ["python"], info: "Batteries-included backend web engine, ORMs, and secure REST APIs.", x: -80, y: 130, connections: ["postgresql"], jobs: ["Backend Engineer", "Django Dev"] },
  { id: "nodejs", label: "NodeJS & Express", category: "Backend", progress: 65, prereqs: ["js"], info: "Server event loop architecture, middleware, routers, and streaming.", x: 20, y: 50, connections: ["postgresql"], jobs: ["Node Developer", "Backend Dev"] },
  { id: "postgresql", label: "PostgreSQL & SQL database", category: "Backend", progress: 75, prereqs: ["django", "nodejs"], info: "Relational database constraints, indexing, aggregate queries, and pooling.", x: 120, y: 70, connections: ["aws"], jobs: ["Database Admin", "Backend Dev"] },
  
  { id: "ml", label: "Machine Learning (Scikit)", category: "Data Science", progress: 50, prereqs: ["python"], info: "Regression algorithms, decision trees, feature engineering, and validation.", x: -20, y: 160, connections: ["dl"], jobs: ["ML Engineer", "Data Scientist"] },
  { id: "dl", label: "Deep Learning (PyTorch)", category: "Data Science", progress: 30, prereqs: ["ml"], info: "Neural network backpropagation, convolution grids, and transformer weights.", x: 80, y: 160, connections: [], jobs: ["Computer Vision Dev", "AI Research Scientist"] },
  
  { id: "aws", label: "Amazon Web Services (AWS)", category: "DevOps", progress: 40, prereqs: ["postgresql"], info: "Cloud computing instances (EC2), object store buckets (S3), and network VPC bridges.", x: 200, y: 0, connections: [], jobs: ["Cloud Solutions Architect", "DevOps Engineer"] }
];

export function SkillGraph() {
  const [nodes, setNodes] = useState<SkillNode[]>(INITIAL_NODES);
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<SkillNode | null>(null);

  const handleNodeClick = (node: SkillNode) => {
    playClick();
    setSelectedNode(node);
  };

  const handleStudySkill = (nodeId: string) => {
    playSuccess();
    setNodes(prev => prev.map(n => {
      if (n.id === nodeId) {
        const nextProgress = Math.min(100, n.progress + 10);
        if (nextProgress === 100) {
          awardXP(100, `Fully Mastered Skill: ${n.label}`);
        } else {
          awardXP(20, `Studied Skill: ${n.label}`);
        }
        return { ...n, progress: nextProgress };
      }
      return n;
    }));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(prev => prev ? { ...prev, progress: Math.min(100, prev.progress + 10) } : null);
    }
  };

  return (
    <PageShell>
      <PageHeader
        icon={Icons.Network}
        title="Unified Knowledge Graph"
        description="Visual skill tree representing prerequisites, progression maps, and targeted job opportunities."
      />

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Graph Canvas */}
        <div className="lg:col-span-3">
          <HolographicPanel className="relative p-4 overflow-hidden min-h-[460px]">
            <div className="absolute top-4 left-4 z-10 text-[10px] text-muted-foreground bg-black/60 px-3 py-1.5 rounded-lg border border-white/5 pointer-events-none">
              💡 Click nodes to review dependencies & career options
            </div>

            <svg viewBox="-260 -200 520 400" className="w-full h-[400px] overflow-visible">
              <defs>
                <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="oklch(0.78 0.18 295)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="oklch(0.78 0.18 295)" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Connections (Edges) */}
              {nodes.map(n => {
                return n.connections.map(targetId => {
                  const target = nodes.find(t => t.id === targetId);
                  if (!target) return null;
                  const isHighlighted = selectedNode?.id === n.id || selectedNode?.id === targetId;
                  return (
                    <line
                      key={`${n.id}-${targetId}`}
                      x1={n.x}
                      y1={n.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={isHighlighted ? "oklch(0.78 0.18 295)" : "rgba(255, 255, 255, 0.08)"}
                      strokeWidth={isHighlighted ? "2" : "1.2"}
                      strokeDasharray={isHighlighted ? "none" : "3,3"}
                      className="transition-all duration-300"
                    />
                  );
                });
              })}

              {/* Node Circles & Labels */}
              {nodes.map(n => {
                const isSelected = selectedNode?.id === n.id;
                const isHovered = hoveredNode?.id === n.id;
                const categoryColors = {
                  "Frontend": "oklch(0.80 0.16 140)", // emerald
                  "Backend": "oklch(0.74 0.16 230)", // blue
                  "Data Science": "oklch(0.84 0.13 85)", // yellow
                  "DevOps": "oklch(0.76 0.17 340)" // pink
                };
                const color = categoryColors[n.category] || "#fff";

                return (
                  <g
                    key={n.id}
                    className="cursor-pointer"
                    transform={`translate(${n.x}, ${n.y})`}
                    onClick={() => handleNodeClick(n)}
                    onMouseEnter={() => {
                      playHover();
                      setHoveredNode(n);
                    }}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    {/* Glowing outer shadow ring */}
                    {(isSelected || isHovered) && (
                      <circle r="26" fill="url(#node-glow)" />
                    )}
                    
                    {/* Outer Progress Rim */}
                    <circle
                      r="16"
                      fill="none"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="3.5"
                    />
                    <circle
                      r="16"
                      fill="none"
                      stroke={color}
                      strokeWidth="3.5"
                      strokeDasharray={2 * Math.PI * 16}
                      strokeDashoffset={2 * Math.PI * 16 * (1 - n.progress / 100)}
                      strokeLinecap="round"
                      className="rotate-[-90deg] origin-center transition-all duration-500"
                    />

                    {/* Core circle */}
                    <circle
                      r="12"
                      fill="oklch(0.16 0.02 270)"
                      stroke={isSelected ? "#fff" : "rgba(255,255,255,0.15)"}
                      strokeWidth={isSelected ? "1.8" : "1"}
                      className="transition-all duration-300"
                    />

                    {/* Small inner master icon */}
                    {n.progress === 100 && (
                      <circle r="4" fill="oklch(0.86 0.1 140)" />
                    )}

                    {/* Node Text Label */}
                    <text
                      y="26"
                      textAnchor="middle"
                      fill={(isSelected || isHovered) ? "#fff" : "rgba(255,255,255,0.7)"}
                      className="font-display text-[8.5px] font-semibold select-none transition-all duration-300"
                    >
                      {n.label.split(" ")[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </HolographicPanel>
        </div>

        {/* Info Sidebar panel */}
        <div className="space-y-6">
          <HolographicPanel className="p-5">
            {selectedNode ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block rounded-md bg-spark/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-spark">
                      {selectedNode.category} Node
                    </span>
                    <h3 className="font-display text-lg font-bold text-foreground mt-1">
                      {selectedNode.label}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-spark">{selectedNode.progress}%</div>
                    <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Progress</div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {selectedNode.info}
                </p>

                {selectedNode.prereqs.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
                      <Icons.ShieldAlert className="h-3 w-3 text-red-400" /> Prerequisites
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedNode.prereqs.map(p => (
                        <span key={p} className="rounded bg-red-500/10 border border-red-500/20 px-2 py-0.5 text-[9px] text-red-400 font-semibold uppercase">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
                    <Icons.Briefcase className="h-3 w-3 text-spark" /> Career Pathways
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.jobs.map(j => (
                      <span key={j} className="rounded bg-white/5 border border-white/5 px-2.5 py-0.5 text-[9px] text-foreground font-semibold">
                        {j}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleStudySkill(selectedNode.id)}
                  disabled={selectedNode.progress >= 100}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-spark px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow transition hover:opacity-95 disabled:opacity-50"
                >
                  <Icons.Flame className="h-4 w-4" />
                  <span>{selectedNode.progress >= 100 ? "Fully Mastered!" : "Study Concept (+20 XP)"}</span>
                </button>
              </div>
            ) : (
              <div className="text-center py-10">
                <Icons.Network className="h-8 w-8 mx-auto text-spark/40 animate-pulse" />
                <h3 className="font-display text-sm font-semibold text-muted-foreground mt-2">
                  No Node Selected
                </h3>
                <p className="text-[11px] text-muted-foreground mt-1 px-4 leading-relaxed">
                  Click on any technology node on the visual graph to inspect credentials, prerequisites, and pathways.
                </p>
              </div>
            )}
          </HolographicPanel>
        </div>
      </div>
    </PageShell>
  );
}
