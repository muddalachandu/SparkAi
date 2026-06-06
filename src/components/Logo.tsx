import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function Logo({ to = "/", className = "" }: { to?: string; className?: string }) {
  return (
    <Link to={to} className={`group inline-flex items-center gap-2 ${className}`}>
      <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-spark shadow-glow">
        <Sparkles className="h-4 w-4 text-primary-foreground" />
        <span className="absolute inset-0 rounded-xl animate-pulse-ring" />
      </span>
      <span className="font-display text-lg font-semibold tracking-tight">
        Project<span className="text-gradient">Spark</span>
      </span>
    </Link>
  );
}
