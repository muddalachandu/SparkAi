import { Handle, Position } from "@xyflow/react";
import * as Icons from "lucide-react";
import { useState } from "react";

type NodeData = {
  title: string;
  why: string;
  prerequisites: string[];
  outcome: string;
  hours: number;
  difficulty: "easy" | "medium" | "hard";
  status: "locked" | "available" | "in_progress" | "completed";
  onOpenDrawer: () => void;
};

export function RoadmapNode({ data }: { data: NodeData }) {
  const [hovered, setHovered] = useState(false);

  const getStatusStyles = () => {
    switch (data.status) {
      case "locked":
        return {
          card: "border-white/5 bg-white/2 opacity-50 cursor-not-allowed",
          iconBg: "bg-white/5 text-muted-foreground",
          icon: Icons.Lock,
          accent: "text-muted-foreground",
        };
      case "completed":
        return {
          card: "border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/60 shadow-[0_0_15px_oklch(0.8_0.16_140_/_0.05)] cursor-pointer",
          iconBg: "bg-emerald-500/10 text-emerald-400",
          icon: Icons.CheckCircle2,
          accent: "text-emerald-400",
        };
      case "in_progress":
        return {
          card: "border-spark/50 bg-spark/5 shadow-[0_0_20px_oklch(0.78_0.18_295_/_0.15)] ring-1 ring-spark/30 cursor-pointer animate-pulse-border",
          iconBg: "bg-spark/15 text-spark",
          icon: Icons.PlayCircle,
          accent: "text-spark",
        };
      case "available":
      default:
        return {
          card: "border-white/10 bg-card/70 hover:border-spark/40 hover:shadow-[0_0_20px_oklch(0.78_0.18_295_/_0.1)] cursor-pointer",
          iconBg: "bg-white/5 text-muted-foreground group-hover:text-foreground",
          icon: Icons.Circle,
          accent: "text-spark",
        };
    }
  };

  const styles = getStatusStyles();
  const IconComponent = styles.icon;

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Node input/output handles */}
      <Handle type="target" position={Position.Top} className="!bg-border !w-2 !h-2 !border-0" />
      <Handle type="source" position={Position.Bottom} className="!bg-border !w-2 !h-2 !border-0" />

      {/* The main Node Glass Card */}
      <div
        onClick={() => data.status !== "locked" && data.onOpenDrawer()}
        className={`group flex items-center gap-3 rounded-2xl border px-4 py-3 backdrop-blur-md transition-all duration-300 w-[240px] text-left ${styles.card}`}
      >
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${styles.iconBg}`}
        >
          <IconComponent className="h-4.5 w-4.5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-semibold text-foreground tracking-tight">
            {data.title}
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Icons.Clock className="h-3 w-3" />
            <span>{data.hours}h</span>
            <span>•</span>
            <span className="capitalize">{data.difficulty}</span>
          </div>
        </div>
      </div>

      {/* Hover Info Card */}
      {hovered && (
        <div className="absolute left-1/2 bottom-full z-30 mb-2 w-[280px] -translate-x-1/2 rounded-2xl border border-white/10 bg-popover p-4 shadow-glow backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-150">
          <h4 className="font-display text-sm font-semibold text-foreground">{data.title}</h4>
          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{data.why}</p>

          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/5 pt-2 text-[10px]">
            <div>
              <span className="block text-muted-foreground font-medium uppercase tracking-wider">
                Outcome
              </span>
              <span className="mt-0.5 block text-foreground truncate">{data.outcome}</span>
            </div>
            <div>
              <span className="block text-muted-foreground font-medium uppercase tracking-wider">
                Prereqs
              </span>
              <span className="mt-0.5 block text-foreground truncate">
                {data.prerequisites.length > 0 ? data.prerequisites.join(", ") : "None"}
              </span>
            </div>
          </div>

          {data.status === "locked" && (
            <div className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-red-500/10 px-2 py-1 text-[10px] text-red-400">
              <Icons.Lock className="h-3 w-3" />
              <span>Complete prerequisites to unlock.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
