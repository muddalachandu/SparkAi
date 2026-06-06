import { Link } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { useEffect, useState } from "react";
import { getDomainProgress } from "@/lib/roadmap.functions";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/lib/auth";

type DomainCardProps = {
  slug: string;
  name: string;
  category: string;
  blurb: string;
  tags: string[];
  icon: string;
  colorTheme: string;
  galaxyCluster: string;
};

// Map colorTheme key to class styles for border and glow colors
const COLOR_CLASSES: Record<string, { border: string; glow: string; text: string; bg: string }> = {
  violet: {
    border: "group-hover:border-violet-500/40",
    glow: "group-hover:shadow-[0_0_20px_oklch(0.65_0.22_290_/_0.2)]",
    text: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  cyan: {
    border: "group-hover:border-cyan-500/40",
    glow: "group-hover:shadow-[0_0_20px_oklch(0.74_0.16_200_/_0.2)]",
    text: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  emerald: {
    border: "group-hover:border-emerald-500/40",
    glow: "group-hover:shadow-[0_0_20px_oklch(0.80_0.16_140_/_0.2)]",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  indigo: {
    border: "group-hover:border-indigo-500/40",
    glow: "group-hover:shadow-[0_0_20px_oklch(0.60_0.20_270_/_0.2)]",
    text: "text-indigo-400",
    bg: "bg-indigo-500/10",
  },
  blue: {
    border: "group-hover:border-blue-500/40",
    glow: "group-hover:shadow-[0_0_20px_oklch(0.60_0.18_250_/_0.2)]",
    text: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  sky: {
    border: "group-hover:border-sky-500/40",
    glow: "group-hover:shadow-[0_0_20px_oklch(0.70_0.15_220_/_0.2)]",
    text: "text-sky-400",
    bg: "bg-sky-500/10",
  },
  orange: {
    border: "group-hover:border-orange-500/40",
    glow: "group-hover:shadow-[0_0_20px_oklch(0.65_0.20_40_/_0.2)]",
    text: "text-orange-400",
    bg: "bg-orange-500/10",
  },
  rose: {
    border: "group-hover:border-rose-500/40",
    glow: "group-hover:shadow-[0_0_20px_oklch(0.65_0.22_25_/_0.2)]",
    text: "text-rose-400",
    bg: "bg-rose-500/10",
  },
  fuchsia: {
    border: "group-hover:border-fuchsia-500/40",
    glow: "group-hover:shadow-[0_0_20px_oklch(0.65_0.22_320_/_0.2)]",
    text: "text-fuchsia-400",
    bg: "bg-fuchsia-500/10",
  },
  teal: {
    border: "group-hover:border-teal-500/40",
    glow: "group-hover:shadow-[0_0_20px_oklch(0.65_0.15_170_/_0.2)]",
    text: "text-teal-400",
    bg: "bg-teal-500/10",
  },
  amber: {
    border: "group-hover:border-amber-500/40",
    glow: "group-hover:shadow-[0_0_20px_oklch(0.75_0.15_80_/_0.2)]",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
  },
};

export function DomainCard({
  slug,
  name,
  category,
  blurb,
  tags,
  icon,
  colorTheme,
  galaxyCluster,
}: DomainCardProps) {
  const fetchProgress = useServerFn(getDomainProgress);
  const { user } = useAuth();
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    fetchProgress({ data: { slug } })
      .then(({ rows }) => {
        const done = rows.filter((r) => r.status === "done").length;
        setCompletedCount(done);
        setTotalCount(rows.length || 0);
      })
      .catch(() => {});
  }, [slug, user, fetchProgress]);

  const LucideIcon =
    (Icons as any)[icon] as React.ComponentType<{ className?: string }> || Icons.Code2;
  const colors = COLOR_CLASSES[colorTheme] || COLOR_CLASSES.blue;

  const progressPercentage = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <Link
      to="/roadmap/$slug"
      params={{ slug }}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card/60 p-6 backdrop-blur transition-all duration-300 hover:bg-card/80 hover:-translate-y-1 ${colors.border} ${colors.glow}`}
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div>
        <div className="flex items-center justify-between">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${colors.bg} ${colors.text} shadow-inner`}
          >
            <LucideIcon className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            {category}
          </span>
        </div>

        <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-foreground transition group-hover:text-gradient">
          {name}
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">{blurb}</p>

        <div className="mt-4 flex flex-wrap gap-1">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-lg bg-white/5 px-2 py-0.5 text-[10px] text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 border-t border-white/5 pt-4">
        {totalCount > 0 ? (
          <div>
            <div className="mb-2 flex items-center justify-between text-[10px] font-medium">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-foreground">{progressPercentage}%</span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-spark transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="mt-1.5 block text-[9px] uppercase tracking-wider text-muted-foreground">
              {completedCount} of {totalCount} nodes completed
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="text-[10px] uppercase tracking-widest">{galaxyCluster}</span>
            <span className="inline-flex items-center gap-1 text-[10px] text-spark transition-transform group-hover:translate-x-0.5">
              Explore path <Icons.ArrowRight className="h-3 w-3" />
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
