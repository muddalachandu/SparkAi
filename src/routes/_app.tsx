import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { Logo } from "@/components/Logo";
import { useLenis, instance as lenisInstance } from "@/hooks/use-lenis";
import { ThemeToggle } from "@/components/ThemeToggle";
import { PageTransition } from "@/components/PageTransition";
import {
  LayoutDashboard,
  Sparkles,
  Bookmark,
  Brain,
  GraduationCap,
  MessageSquare,
  Compass,
  Code2,
  BarChart3,
  BookOpen,
  Settings,
  User as UserIcon,
  Info,
  CalendarCheck,
  Trophy,
  LogOut,
  Loader2,
  FileText,
  Cpu,
  ShoppingBag,
  Users,
  FolderHeart,
  Briefcase,
  Terminal,
  Menu,
} from "lucide-react";
import { SearchPalette } from "@/components/SearchPalette";
import { useSceneStore } from "@/hooks/use-scene-store";

import { playHover, playClick, playSweep } from "@/lib/sounds";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/generator", label: "Project Generator", icon: Sparkles },
  { to: "/saved", label: "Saved", icon: Bookmark },
  { to: "/mentor", label: "AI Mentor", icon: Brain },
  { to: "/study-guide", label: "Study Guide", icon: GraduationCap },
  { to: "/chat", label: "Chatbot", icon: MessageSquare },
  { to: "/roadmap", label: "Roadmap Planner", icon: Compass },
  { to: "/builder", label: "AI Project Builder", icon: Code2 },
  { to: "/learning", label: "Learning Dashboard", icon: BookOpen },
  { to: "/progress", label: "Daily Progress", icon: CalendarCheck },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/resources", label: "Resources Hub", icon: Trophy },
  { to: "/resume", label: "Resume & ATS", icon: FileText },

  // Developer OS modules
  { to: "/build-your-own-x", label: "Build Your Own X", icon: Cpu },
  { to: "/marketplace", label: "Project Marketplace", icon: ShoppingBag },
  { to: "/collaboration", label: "Collaboration Hub", icon: Users },
  { to: "/portfolio", label: "Portfolio Builder", icon: FolderHeart },
  { to: "/job-prep", label: "Interview Prep", icon: Terminal },
  { to: "/internships", label: "Opportunity Hub", icon: Briefcase },
  { to: "/books", label: "Books & Docs Hub", icon: BookOpen },

  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/profile", label: "Profile", icon: UserIcon },
  { to: "/about", label: "About", icon: Info },
] as const;

function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isChat = path.startsWith("/chat");
  const { setScene } = useSceneStore();
  useLenis();

  useEffect(() => {
    if (lenisInstance) {
      lenisInstance.resize();
      lenisInstance.scrollTo(0, { immediate: true });
    }
  }, [path]);

  useEffect(() => {
    // Play transition portal swoop sound
    playSweep();

    if (path.startsWith("/chat")) {
      setScene("chat");
    } else if (path.startsWith("/mentor")) {
      setScene("mentor");
    } else if (path.startsWith("/roadmap")) {
      setScene("roadmap");
    } else if (path.startsWith("/study-guide")) {
      setScene("study-guide");
    } else if (path.startsWith("/analytics")) {
      setScene("analytics");
    } else {
      setScene("dashboard");
    }
  }, [path, setScene]);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-spark" />
      </div>
    );
  }

  return (
    <div className="relative flex h-svh w-full overflow-hidden aurora-bg pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <SearchPalette />
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-25 [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)]" />

      {/* Desktop Sidebar */}
      <aside className="sticky top-0 z-20 hidden w-64 shrink-0 flex-col glass-panel rounded-none border-y-0 border-l-0 px-4 py-6 lg:flex h-full">
        <div className="flex flex-col h-full">
          <Logo className="shrink-0" />

          <div className="flex-1 min-h-0 overflow-y-auto mt-8 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }} data-lenis-prevent>
            <nav className="space-y-0.5 pr-1 pb-4">
              {NAV.map((n) => {
                const active = path === n.to || path.startsWith(n.to + "/");
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    onMouseEnter={playHover}
                    onClick={playClick}
                    className={`group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all duration-300 ${active ? "bg-gradient-spark text-primary-foreground shadow-glow" : "text-muted-foreground hover:bg-white/5 hover:text-foreground hover:translate-x-0.5"}`}
                  >
                    <n.icon className="h-4 w-4" />
                    <span className="truncate">{n.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="mt-4 shrink-0 glass rounded-2xl p-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-spark text-primary-foreground shadow-glow shrink-0">
                {(user.email ?? "U")[0].toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-foreground">{user.email}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Signed in</div>
              </div>
              <button
                onClick={async () => {
                  await signOut();
                  navigate({ to: "/" });
                }}
                className="shrink-0 rounded-lg p-1.5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="relative flex flex-col flex-1 min-w-0 overflow-hidden h-full">

        {/* Mobile Header */}
        <div className="lg:hidden shrink-0 sticky top-0 z-10 flex items-center justify-between glass px-4 py-3 border-b border-white/5">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 -ml-2 rounded-lg hover:bg-white/10 transition">
            <Menu className="h-6 w-6 text-foreground" />
          </button>
          <div onClick={() => setMenuOpen(!menuOpen)} className="cursor-pointer flex items-center">
            <Logo />
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Drawer */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-sm">
            <div className="h-full w-64 flex flex-col glass-panel bg-background/95 p-4 shadow-2xl">
              <Logo className="shrink-0" />
              <div className="flex-1 min-h-0 overflow-y-auto mt-8 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }} data-lenis-prevent>
                <nav className="space-y-0.5 pr-1 pb-4">
                  {NAV.map((n) => {
                    const active = path === n.to || path.startsWith(n.to + "/");
                    return (
                      <Link
                        key={n.to}
                        to={n.to}
                        onMouseEnter={playHover}
                        onClick={() => setMenuOpen(false)}
                        className={`group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all duration-300 ${active ? "bg-gradient-spark text-primary-foreground shadow-glow" : "text-muted-foreground hover:bg-white/5 hover:text-foreground hover:translate-x-0.5"}`}
                      >
                        <n.icon className="h-4 w-4" />
                        <span className="truncate">{n.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Mobile User Panel */}
              <div className="mt-4 shrink-0 glass rounded-2xl p-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-foreground">{user.email}</div>
                  </div>
                  <button
                    onClick={async () => {
                      await signOut();
                      navigate({ to: "/" });
                    }}
                    className="shrink-0 rounded-lg p-1.5 text-muted-foreground hover:bg-white/10 hover:text-rose-400 transition"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            {/* Clickaway backdrop */}
            <div className="flex-1" onClick={() => setMenuOpen(false)} />
          </div>
        )}

        {/* Scrollable Content Routing */}
        <div className="flex-1 min-h-0 overflow-y-auto w-full [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }} data-lenis-prevent>
          {isChat ? (
            <Outlet />
          ) : (
            <PageTransition>
              <Outlet />
            </PageTransition>
          )}
        </div>
      </main>
    </div>
  );
}