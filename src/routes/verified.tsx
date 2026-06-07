import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle } from "lucide-react";
import { playHover, playClick } from "@/lib/sounds";

export const Route = createFileRoute("/verified")({
  head: () => ({
    meta: [
      { title: "Email Verified | ProjectSpark" },
    ],
  }),
  component: VerifiedPage,
});

function VerifiedPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="relative w-full max-w-md text-center glass rounded-3xl p-8 shadow-glow border border-border/40 backdrop-blur">
        <div className="mb-6 flex justify-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-spark/10 text-spark shadow-glow animate-pulse">
            <CheckCircle className="h-10 w-10 text-spark" />
          </div>
        </div>
        <h1 className="text-3xl font-semibold mb-3 text-gradient">Email Verified</h1>
        <p className="text-muted-foreground mb-8">
          Your email is verified.{" "}
          <Link
            to="/login"
            onMouseEnter={playHover}
            onClick={playClick}
            className="inline-flex items-center gap-1 font-semibold text-spark transition-colors group cursor-pointer"
          >
            <span className="underline decoration-spark group-hover:decoration-spark/80">Please login</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </p>
      </div>
    </div>
  );
}
