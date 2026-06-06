import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getRoadmap, getDomainProgress, toggleNodeProgress } from "@/lib/roadmap.functions";
import { DOMAIN_BY_SLUG } from "@/lib/domains";
import { PageShell, PageHeader } from "@/components/PageHeader";
import { enrichRoadmapNode } from "@/lib/resource-engine";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from "@xyflow/react";
import { RoadmapNode } from "@/components/RoadmapNode";
import { NodeDrawer } from "@/components/NodeDrawer";
import { awardXP, XP } from "@/lib/gamification";
import { toast } from "sonner";
import { Compass, Loader2, ArrowLeft, GraduationCap, Clock, CheckCircle } from "lucide-react";
import "@xyflow/react/dist/style.css";
import { type RoadmapNode as RoadmapNodeType, type RoadmapTier } from "@/lib/roadmap-catalog";
import { RoadmapGalaxy } from "@/components/RoadmapGalaxy";

export const Route = createFileRoute("/_app/roadmap/$slug")({
  head: () => ({ meta: [{ title: "Interactive Roadmap — ProjectSpark" }] }),
  component: RoadmapSlugPage,
});

const nodeTypes = {
  roadmapNode: RoadmapNode,
};

type DbProgressRow = {
  tier: string;
  node_id: string;
  status: string;
  hours: number;
  hours_spent: number;
  xp_earned: number;
  bookmarked: boolean;
  completed_at: string | null;
};

function RoadmapSlugPage() {
  const { slug } = Route.useParams();
  const searchParams = Route.useSearch() as { node?: string };
  const domain = DOMAIN_BY_SLUG[slug];
  const navigate = useNavigate();

  const fetchRoadmap = useServerFn(getRoadmap);
  const fetchProgress = useServerFn(getDomainProgress);
  const updateProgress = useServerFn(toggleNodeProgress);

  const [activeTier, setActiveTier] = useState<"beginner" | "intermediate" | "advanced">(
    "beginner",
  );
  const [loading, setLoading] = useState(true);
  const [roadmapData, setRoadmapData] = useState<RoadmapTier | null>(null);
  const [dbProgress, setDbProgress] = useState<DbProgressRow[]>([]);

  // React Flow state hooks typed with Node and Edge
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Node drawer details state
  const [selectedNode, setSelectedNode] = useState<RoadmapNodeType | null>(null);
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");

  // 1. Fetch roadmap and progress rows
  const loadData = useCallback(
    async (t: typeof activeTier) => {
      setLoading(true);
      try {
        const [roadmapRes, progressRes] = await Promise.all([
          fetchRoadmap({ data: { slug, tier: t } }),
          fetchProgress({ data: { slug } }),
        ]);
        
        const content = roadmapRes?.content ? { ...roadmapRes.content } : null;
        if (content && content.nodes) {
          content.nodes = content.nodes.map((n) => enrichRoadmapNode(n, slug));
        }

        setRoadmapData(content || null);
        setDbProgress((progressRes?.rows || []) as DbProgressRow[]);
      } catch (e) {
        toast.error("Failed to load roadmap.");
      } finally {
        setLoading(false);
      }
    },
    [slug, fetchRoadmap, fetchProgress],
  );

  useEffect(() => {
    loadData(activeTier);
  }, [activeTier, loadData]);

  // 2. Open drawer automatically if ?node=nodeId is passed in search query params
  useEffect(() => {
    if (roadmapData?.nodes && searchParams.node && !selectedNode) {
      const target = roadmapData.nodes.find((n: RoadmapNodeType) => n.id === searchParams.node);
      if (target) {
        setSelectedNode(target);
      }
    }
  }, [roadmapData, searchParams.node, selectedNode]);

  // 3. Status mapping for nodes
  const nodeStatusMap = useMemo(() => {
    const statusMap: Record<string, "locked" | "available" | "in_progress" | "completed"> = {};
    if (!roadmapData?.nodes) return statusMap;

    console.log("[roadmap] nodeStatusMap dbProgress:", dbProgress, "activeTier:", activeTier);

    // Normalize helper: lowercase, map & to and, strip spaces and punctuation
    const normalizeId = (id: string) => {
      return id
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]/g, "");
    };

    // First map all completed and in-progress nodes from database
    const completedSet = new Set<string>();
    const inProgressSet = new Set<string>();

    if (Array.isArray(dbProgress)) {
      dbProgress.forEach((p) => {
        const pStatus = p.status || "";
        if (pStatus.toLowerCase() === "done" || pStatus.toLowerCase() === "completed") {
          completedSet.add(p.node_id);
        } else if (pStatus.toLowerCase() === "in_progress") {
          inProgressSet.add(p.node_id);
        }
      });
    }

    // Build completedSet normalized
    const completedSetNormalized = new Set<string>();
    completedSet.forEach((id) => completedSetNormalized.add(normalizeId(id)));

    // Map title/ID to ID for fuzzy lookup
    const titleOrIdToIdMap = new Map<string, string>();
    roadmapData.nodes.forEach((node) => {
      titleOrIdToIdMap.set(normalizeId(node.id), node.id);
      titleOrIdToIdMap.set(normalizeId(node.title), node.id);
    });

    console.log("[roadmap] completedSet:", Array.from(completedSet));

    // Now evaluate states in order
    roadmapData.nodes.forEach((node: RoadmapNodeType, idx: number) => {
      if (completedSet.has(node.id)) {
        statusMap[node.id] = "completed";
      } else if (inProgressSet.has(node.id)) {
        statusMap[node.id] = "in_progress";
      } else {
        // All nodes are unlocked/available by default
        statusMap[node.id] = "available";
      }
    });

    return statusMap;
  }, [roadmapData, dbProgress, activeTier]);

  // Calculate statistics
  const totalHours = useMemo(() => {
    return (
      roadmapData?.nodes?.reduce((acc: number, n: RoadmapNodeType) => acc + (n.hours || 0), 0) || 0
    );
  }, [roadmapData]);

  const completedStats = useMemo(() => {
    if (!roadmapData?.nodes) return { count: 0, percent: 0 };
    const total = roadmapData.nodes.length;
    let completed = 0;
    roadmapData.nodes.forEach((n: RoadmapNodeType) => {
      if (nodeStatusMap[n.id] === "completed") completed++;
    });
    return {
      count: completed,
      percent: total ? Math.round((completed / total) * 100) : 0,
    };
  }, [roadmapData, nodeStatusMap]);

  // 4. Position and connect React Flow nodes
  // 4. Position and connect React Flow nodes
  useEffect(() => {
    if (!roadmapData?.nodes) return;

    const flowNodes: Node[] = [];
    const flowEdges: Edge[] = [];

    // Calculate depths based on prerequisites
    const depths: Record<string, number> = {};
    const titleToNodeMap = new Map<string, RoadmapNodeType>();
    roadmapData.nodes.forEach((n) => {
      depths[n.id] = 0;
      titleToNodeMap.set(n.title.toLowerCase(), n);
      titleToNodeMap.set(n.id.toLowerCase(), n);
    });

    // Propagate depths
    for (let iter = 0; iter < 6; iter++) {
      roadmapData.nodes.forEach((node) => {
        const prereqs = node.prerequisites || [];
        prereqs.forEach((prereq) => {
          const parent = titleToNodeMap.get(prereq.toLowerCase());
          if (parent) {
            depths[node.id] = Math.max(depths[node.id], depths[parent.id] + 1);
          }
        });
      });
    }

    // Group nodes by depth
    const nodesByDepth: Record<number, RoadmapNodeType[]> = {};
    roadmapData.nodes.forEach((node) => {
      const d = depths[node.id] || 0;
      if (!nodesByDepth[d]) nodesByDepth[d] = [];
      nodesByDepth[d].push(node);
    });

    // Position coordinates
    const horizontalSpacing = 280;
    const verticalSpacing = 200;

    Object.entries(nodesByDepth).forEach(([depthStr, depthNodes]) => {
      const d = parseInt(depthStr, 10);
      const numNodes = depthNodes.length;
      depthNodes.forEach((node, index) => {
        const x = (index - (numNodes - 1) / 2) * horizontalSpacing;
        const y = d * verticalSpacing;

        const status = nodeStatusMap[node.id] || "locked";

        flowNodes.push({
          id: node.id,
          type: "roadmapNode",
          position: { x, y },
          data: {
            title: node.title,
            why: node.why,
            prerequisites: node.prerequisites || [],
            outcome: node.outcome,
            hours: node.hours,
            difficulty: node.difficulty,
            status,
            onOpenDrawer: () => setSelectedNode(node),
          },
        });
      });
    });

    // Create connections (edges)
    roadmapData.nodes.forEach((node, idx) => {
      const prereqs = node.prerequisites || [];
      const status = nodeStatusMap[node.id] || "locked";

      let connected = false;
      prereqs.forEach((prereq) => {
        const parent = titleToNodeMap.get(prereq.toLowerCase());
        if (parent) {
          connected = true;
          const parentStatus = nodeStatusMap[parent.id] || "locked";
          const isAnimated = parentStatus === "completed" || parentStatus === "in_progress";
          const strokeColor = parentStatus === "completed" ? "oklch(0.80 0.16 140)" : "oklch(0.78 0.18 295)";

          flowEdges.push({
            id: `edge-${parent.id}-${node.id}`,
            source: parent.id,
            target: node.id,
            type: "smoothstep",
            animated: isAnimated,
            style: {
              stroke: strokeColor,
              strokeWidth: 3,
              opacity: status === "locked" ? 0.25 : 0.8,
            },
          });
        }
      });

      // Connect orphans to sequence
      if (!connected && idx > 0) {
        const prevNode = roadmapData.nodes[idx - 1];
        const prevStatus = nodeStatusMap[prevNode.id] || "locked";
        const isAnimated = prevStatus === "completed" || prevStatus === "in_progress";
        const strokeColor = prevStatus === "completed" ? "oklch(0.80 0.16 140)" : "oklch(0.78 0.18 295)";

        flowEdges.push({
          id: `edge-seq-${prevNode.id}-${node.id}`,
          source: prevNode.id,
          target: node.id,
          type: "smoothstep",
          animated: isAnimated,
          style: {
            stroke: strokeColor,
            strokeWidth: 3,
            opacity: status === "locked" ? 0.25 : 0.8,
          },
        });
      }
    });

    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [roadmapData, nodeStatusMap, setNodes, setEdges]);

  // Handler for completion toggle inside Drawer
  const handleStatusChange = async (newStatus: "in_progress" | "done") => {
    if (!selectedNode) return;
    try {
      await updateProgress({
        data: {
          slug,
          tier: activeTier,
          nodeId: selectedNode.id,
          status: newStatus,
          hours: selectedNode.hours,
        },
      });

      if (newStatus === "done") {
        await awardXP(100, `Completed: ${selectedNode.title}`);
      }

      // Re-fetch progress to update the UI
      const progressRes = await fetchProgress({ data: { slug } });
      setDbProgress((progressRes?.rows || []) as DbProgressRow[]);
    } catch (e) {
      toast.error("Failed to update status");
    }
  };
  const completedIds = useMemo(() => new Set(dbProgress.filter(p => p.status === "done" || p.status === "completed").map(p => p.node_id)), [dbProgress]);
  const inProgressIds = useMemo(() => new Set(dbProgress.filter(p => p.status === "in_progress").map(p => p.node_id)), [dbProgress]);

  return (
    <PageShell>
      <PageHeader
        icon={Compass}
        title={domain?.name ?? "Interactive Roadmap"}
        description={domain?.blurb ?? "Interact, learn, and master this technology roadmap."}
        actions={
          <Link
            to="/resources"
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/5 bg-white/5 px-4 py-2 text-xs text-foreground hover:bg-white/10 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to tracks</span>
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* 3D Galaxy / 2D Flow Container */}
        <div className="relative h-[650px] overflow-hidden rounded-3xl border border-border bg-card/45 backdrop-blur-md">
          {/* 3D / 2D Switcher overlay controls */}
          <div className="absolute right-4 top-4 z-10 flex rounded-xl border border-white/5 bg-black/55 p-1 backdrop-blur">
            <button
              onClick={() => setViewMode("3d")}
              className={`rounded-lg px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-widest transition-colors ${
                viewMode === "3d"
                  ? "bg-gradient-spark text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              3D Galaxy
            </button>
            <button
              onClick={() => setViewMode("2d")}
              className={`rounded-lg px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-widest transition-colors ${
                viewMode === "2d"
                  ? "bg-gradient-spark text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              2D Diagram
            </button>
          </div>

          {loading ? (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/50">
              <Loader2 className="h-8 w-8 animate-spin text-spark" />
              <p className="mt-3 text-sm text-muted-foreground">
                Scaffolding interactive learning path...
              </p>
            </div>
          ) : viewMode === "3d" && roadmapData?.nodes ? (
            <RoadmapGalaxy
              nodes={roadmapData.nodes}
              completedIds={completedIds}
              inProgressIds={inProgressIds}
              selectedNode={selectedNode}
              onSelectNode={(n) => setSelectedNode(n)}
              nodeStatus={selectedNode ? (nodeStatusMap[selectedNode.id] || "locked") : "locked"}
              onStatusChange={handleStatusChange}
            />
          ) : (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              minZoom={0.5}
              maxZoom={1.5}
            >
              <Background gap={12} size={1} color="oklch(1 0 0 / 0.05)" />
              <Controls />
              <MiniMap
                nodeColor={() => "oklch(0.78 0.18 295 / 0.4)"}
                maskColor="oklch(0.16 0.02 270 / 0.6)"
                className="!hidden sm:!block"
              />
            </ReactFlow>
          )}
        </div>

        {/* Sidebar Info & Tier Switcher */}
        <div className="space-y-6">
          {/* Tiers Tab selector */}
          <div className="rounded-3xl border border-border bg-card/60 p-4 backdrop-blur">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Learning Tiers
            </h3>
            <div className="space-y-1.5">
              {(["beginner", "intermediate", "advanced"] as const).map((tierKey) => (
                <button
                  key={tierKey}
                  onClick={() => setActiveTier(tierKey)}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-xs font-medium transition ${
                    activeTier === tierKey
                      ? "bg-gradient-spark text-primary-foreground font-semibold shadow-glow"
                      : "text-muted-foreground border border-white/5 hover:bg-white/5 hover:text-foreground"
                  }`}
                >
                  <span className="capitalize">{tierKey}</span>
                  {activeTier !== tierKey && (
                    <span className="text-[10px] text-muted-foreground">
                      {dbProgress.filter((p) => p.tier === tierKey && p.status === "done").length}{" "}
                      done
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tier Statistics & Progress Rings */}
          <div className="rounded-3xl border border-border bg-card/60 p-5 backdrop-blur">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Tier Progress
            </h3>

            <div className="flex items-center gap-4">
              {/* Progress Ring SVG */}
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
                <svg className="h-full w-full -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    className="stroke-white/5"
                    strokeWidth="4"
                    fill="transparent"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    className="stroke-spark"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 26}
                    strokeDashoffset={2 * Math.PI * 26 * (1 - completedStats.percent / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-xs font-semibold text-foreground">
                  {completedStats.percent}%
                </span>
              </div>

              <div>
                <div className="text-sm font-semibold text-foreground">
                  {completedStats.count} / {roadmapData?.nodes?.length || 0} completed
                </div>
                <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                  <GraduationCap className="h-3.5 w-3.5 text-spark" />
                  <span>{activeTier} track</span>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/5 pt-4 text-xs">
              <div className="flex flex-col">
                <span className="text-muted-foreground">Est. Time</span>
                <span className="mt-0.5 inline-flex items-center gap-1 font-semibold text-foreground">
                  <Clock className="h-3.5 w-3.5 text-spark" /> {totalHours}h
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">XP Earned</span>
                <span className="mt-0.5 inline-flex items-center gap-1 font-semibold text-foreground">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                  {dbProgress
                    .filter((p) => p.tier === activeTier && p.status === "done")
                    .reduce((acc, p) => acc + (p.xp_earned || 0), 0)}{" "}
                  XP
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <NodeDrawer
          open={!!selectedNode}
          onClose={() => {
            setSelectedNode(null);
            // Clear node search param on drawer close
            navigate({ to: ".", search: {} });
          }}
          node={selectedNode}
          domainSlug={slug}
          domainName={domain?.name ?? slug}
          tier={activeTier}
          nodeStatus={nodeStatusMap[selectedNode.id] || "locked"}
          onStatusChange={handleStatusChange}
        />
      )}
    </PageShell>
  );
}
