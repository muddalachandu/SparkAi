import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, PageHeader } from "@/components/PageHeader";
import {
  Bookmark,
  Sparkles,
  Trash2,
  ArrowRight,
  Code2,
  FolderHeart,
  BookOpen,
  Terminal,
  Brain,
  GraduationCap,
  Lightbulb,
  ExternalLink,
  Search
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { HolographicPanel } from "@/components/HolographicPanel";
import { playClick, playSuccess } from "@/lib/sounds";

export const Route = createFileRoute("/_app/saved/")({
  head: () => ({ meta: [{ title: "Saved Items — ProjectSpark" }] }),
  component: SavedPage,
});

type TabType = "blueprints" | "projects" | "portfolios" | "books" | "interview" | "mentor" | "study";

function SavedPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("blueprints");
  const [searchQuery, setSearchQuery] = useState("");

  // Category lists
  const [blueprints, setBlueprints] = useState<any[]>([]);
  const [projectIdeas, setProjectIdeas] = useState<any[]>([]);
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [interviewPreps, setInterviewPreps] = useState<any[]>([]);
  const [mentorPlans, setMentorPlans] = useState<any[]>([]);
  const [studyGuides, setStudyGuides] = useState<any[]>([]);

  const filterList = (list: any[], fields: string[]) => {
    if (!searchQuery.trim()) return list;
    const query = searchQuery.toLowerCase().trim();
    return list.filter((item) => {
      return fields.some((field) => {
        const val = field.split('.').reduce((acc: any, part: string) => acc && acc[part], item);
        return val && String(val).toLowerCase().includes(query);
      });
    });
  };

  const filteredBlueprints = filterList(blueprints, ["title", "description", "technologies"]);
  const filteredProjectIdeas = filterList(projectIdeas, ["title", "solution_overview", "difficulty", "domains"]);
  const filteredPortfolios = filterList(portfolios, ["title", "description", "technologies"]);
  const filteredBooks = filterList(books, ["title", "blueprint.description", "blueprint.categoryName", "blueprint.author"]);
  const filteredInterviewPreps = filterList(interviewPreps, ["title", "description", "blueprint.company"]);
  const filteredMentorPlans = filterList(mentorPlans, ["topic", "goal", "level"]);
  const filteredStudyGuides = filterList(studyGuides, ["domain", "goal"]);

  const loadAllSaved = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [
        projectsRes,
        blueprintsRes,
        mentorRes,
        studyRes
      ] = await Promise.all([
        supabase.from("projects").select("*").order("created_at", { ascending: false }),
        supabase.from("build_blueprints").select("*").order("created_at", { ascending: false }),
        supabase.from("mentor_plans").select("*").order("created_at", { ascending: false }),
        supabase.from("study_guides").select("*").order("created_at", { ascending: false })
      ]);

      if (projectsRes.error) throw projectsRes.error;
      if (blueprintsRes.error) throw blueprintsRes.error;
      if (mentorRes.error) throw mentorRes.error;
      if (studyRes.error) throw studyRes.error;

      setProjectIdeas(projectsRes.data || []);
      setMentorPlans(mentorRes.data || []);
      setStudyGuides(studyRes.data || []);

      // Split build_blueprints by blueprint.category
      const allBps = blueprintsRes.data || [];
      const bps: any[] = [];
      const ports: any[] = [];
      const bks: any[] = [];
      const preps: any[] = [];

      allBps.forEach((item) => {
        const bp = item.blueprint as any;
        if (bp && bp.category === "portfolio") {
          ports.push(item);
        } else if (bp && bp.category === "book") {
          bks.push(item);
        } else if (bp && bp.category === "interview_prep") {
          preps.push(item);
        } else {
          bps.push(item);
        }
      });

      setBlueprints(bps);
      setPortfolios(ports);
      setBooks(bks);
      setInterviewPreps(preps);

      // Auto-switch to first non-empty tab if blueprints is empty
      if (bps.length === 0) {
        if (ports.length > 0) setActiveTab("portfolios");
        else if (projectsRes.data && projectsRes.data.length > 0) setActiveTab("projects");
        else if (bks.length > 0) setActiveTab("books");
        else if (preps.length > 0) setActiveTab("interview");
        else if (mentorRes.data && mentorRes.data.length > 0) setActiveTab("mentor");
        else if (studyRes.data && studyRes.data.length > 0) setActiveTab("study");
      }
    } catch (err: any) {
      toast.error("Failed to load saved items: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllSaved();
  }, [user]);

  const deleteItem = async (id: string, table: "projects" | "build_blueprints" | "mentor_plans" | "study_guides") => {
    playClick();
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete: " + error.message);
    } else {
      toast.success("Item removed");
      loadAllSaved();
    }
  };

  const tabs: { value: TabType; label: string; icon: any; count: number }[] = [
    { value: "blueprints", label: "Sandbox & Blueprints", icon: Code2, count: filteredBlueprints.length },
    { value: "projects", label: "Project Ideas", icon: Lightbulb, count: filteredProjectIdeas.length },
    { value: "portfolios", label: "Portfolios", icon: FolderHeart, count: filteredPortfolios.length },
    { value: "books", label: "Books & Docs", icon: BookOpen, count: filteredBooks.length },
    { value: "interview", label: "Interview Prep", icon: Terminal, count: filteredInterviewPreps.length },
    { value: "mentor", label: "AI Mentor Plans", icon: Brain, count: filteredMentorPlans.length },
    { value: "study", label: "Study Guides", icon: GraduationCap, count: filteredStudyGuides.length },
  ];

  const renderActiveContent = () => {
    switch (activeTab) {
      case "blueprints":
        return filteredBlueprints.length === 0 ? (
          <EmptyState tabLabel="Blueprints & Code Sandbox" redirectPath="/builder" hasQuery={!!searchQuery} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredBlueprints.map((item) => (
              <HolographicPanel key={item.id} className="p-5 flex flex-col justify-between min-h-[160px] relative group border-white/5 bg-card/45">
                <button
                  onClick={() => deleteItem(item.id, "build_blueprints")}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-destructive p-1 rounded hover:bg-white/5 opacity-0 group-hover:opacity-100 transition cursor-none"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-base text-foreground flex items-center gap-1.5 pr-6">
                    <Code2 className="h-4 w-4 text-spark" />
                    <span>{item.title}</span>
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.description || "Production project blueprint with generated starter files and architectural layouts."}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(item.technologies || []).slice(0, 4).map((tech: string) => (
                      <span key={tech} className="px-2 py-0.5 rounded-full border border-spark/20 bg-spark/5 text-[9px] uppercase tracking-wider text-spark font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-4 text-[10px]">
                  <span className="text-muted-foreground font-mono">{new Date(item.created_at).toLocaleDateString()}</span>
                  <Link
                    to="/builder"
                    search={{ restoreId: item.id }}
                    onClick={playClick}
                    className="text-spark hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Launch Sandbox</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </HolographicPanel>
            ))}
          </div>
        );

      case "projects":
        return filteredProjectIdeas.length === 0 ? (
          <EmptyState tabLabel="Project Ideas" redirectPath="/generator" hasQuery={!!searchQuery} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredProjectIdeas.map((item) => (
              <HolographicPanel key={item.id} className="p-5 flex flex-col justify-between min-h-[160px] relative group border-white/5 bg-card/45">
                <button
                  onClick={() => deleteItem(item.id, "projects")}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-destructive p-1 rounded hover:bg-white/5 opacity-0 group-hover:opacity-100 transition cursor-none"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-base text-foreground flex items-center gap-1.5 pr-6">
                    <Lightbulb className="h-4 w-4 text-spark" />
                    <span>{item.title}</span>
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.solution_overview}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(item.domains || []).slice(0, 3).map((domain: string) => (
                      <span key={domain} className="px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-[9px] uppercase tracking-wider text-muted-foreground">
                        {domain}
                      </span>
                    ))}
                    <span className="px-2 py-0.5 rounded-full border border-border bg-background/30 text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">
                      {item.difficulty}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-4 text-[10px]">
                  <span className="text-muted-foreground font-mono">{new Date(item.created_at).toLocaleDateString()}</span>
                  <Link
                    to="/saved/$projectId"
                    params={{ projectId: item.id }}
                    onClick={playClick}
                    className="text-spark hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>View Idea Details</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </HolographicPanel>
            ))}
          </div>
        );

      case "portfolios":
        return filteredPortfolios.length === 0 ? (
          <EmptyState tabLabel="Custom Portfolios" redirectPath="/portfolio" hasQuery={!!searchQuery} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredPortfolios.map((item) => (
              <HolographicPanel key={item.id} className="p-5 flex flex-col justify-between min-h-[160px] relative group border-white/5 bg-card/45">
                <button
                  onClick={() => deleteItem(item.id, "build_blueprints")}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-destructive p-1 rounded hover:bg-white/5 opacity-0 group-hover:opacity-100 transition cursor-none"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-base text-foreground flex items-center gap-1.5 pr-6">
                    <FolderHeart className="h-4 w-4 text-spark" />
                    <span>{item.title}</span>
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.description || "Tailored developer custom portfolio website styling and content structure."}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(item.technologies || []).slice(0, 4).map((tech: string) => (
                      <span key={tech} className="px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-[9px] uppercase tracking-wider text-muted-foreground">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-4 text-[10px]">
                  <span className="text-muted-foreground font-mono">{new Date(item.created_at).toLocaleDateString()}</span>
                  <Link
                    to="/portfolio"
                    search={{ restoreId: item.id }}
                    onClick={playClick}
                    className="text-spark hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Load Portfolio Builder</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </HolographicPanel>
            ))}
          </div>
        );

      case "books":
        return filteredBooks.length === 0 ? (
          <EmptyState tabLabel="Saved Books & Docs" redirectPath="/books" hasQuery={!!searchQuery} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredBooks.map((item) => {
              const bp = item.blueprint as any;
              return (
                <HolographicPanel key={item.id} className="p-5 flex flex-col justify-between min-h-[160px] relative group border-white/5 bg-card/45">
                  <button
                    onClick={() => deleteItem(item.id, "build_blueprints")}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-destructive p-1 rounded hover:bg-white/5 opacity-0 group-hover:opacity-100 transition cursor-none"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="space-y-2">
                    <span className="px-2 py-0.2 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[8px] font-bold uppercase tracking-wider w-fit block mb-1">
                      {bp.categoryName || "Computer Science"}
                    </span>
                    <h3 className="font-display font-bold text-base text-foreground flex items-center gap-1.5 pr-6 truncate">
                      <BookOpen className="h-4 w-4 text-spark" />
                      <span>{item.title}</span>
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {bp.description || `Author: ${item.description}`}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-4 text-[10px]">
                    <span className="text-purple-400 font-mono font-bold bg-purple-500/10 border border-purple-500/10 px-1.5 py-0.2 rounded text-[8px]">{bp.format || "HTML"}</span>
                    <a
                      href={bp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => { playSuccess(); }}
                      className="text-spark hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>Read Book</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </HolographicPanel>
              );
            })}
          </div>
        );

      case "interview":
        return filteredInterviewPreps.length === 0 ? (
          <EmptyState tabLabel="Interview Prep Lists" redirectPath="/job-prep" hasQuery={!!searchQuery} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredInterviewPreps.map((item) => {
              const bp = item.blueprint as any;
              return (
                <HolographicPanel key={item.id} className="p-5 flex flex-col justify-between min-h-[160px] relative group border-white/5 bg-card/45">
                  <button
                    onClick={() => deleteItem(item.id, "build_blueprints")}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-destructive p-1 rounded hover:bg-white/5 opacity-0 group-hover:opacity-100 transition cursor-none"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-base text-foreground flex items-center gap-1.5 pr-6">
                      <Terminal className="h-4 w-4 text-spark" />
                      <span>{item.title}</span>
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-sans">
                      {item.description || `LeetCode questions list compiled for technical interviews.`}
                    </p>
                    {bp && (
                      <span className="inline-block text-[10px] text-muted-foreground bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                        {bp.questionsCount || 0} Questions Saved
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-4 text-[10px]">
                    <span className="text-muted-foreground font-mono">{new Date(item.created_at).toLocaleDateString()}</span>
                    <Link
                      to="/job-prep"
                      search={{ company: bp.company, timeframe: bp.timeframe }}
                      onClick={playClick}
                      className="text-spark hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>Open Prep Console</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </HolographicPanel>
              );
            })}
          </div>
        );

      case "mentor":
        return filteredMentorPlans.length === 0 ? (
          <EmptyState tabLabel="AI Lesson Plans" redirectPath="/mentor" hasQuery={!!searchQuery} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredMentorPlans.map((item) => (
              <HolographicPanel key={item.id} className="p-5 flex flex-col justify-between min-h-[160px] relative group border-white/5 bg-card/45">
                <button
                  onClick={() => deleteItem(item.id, "mentor_plans")}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-destructive p-1 rounded hover:bg-white/5 opacity-0 group-hover:opacity-100 transition cursor-none"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-base text-foreground flex items-center gap-1.5 pr-6">
                    <Brain className="h-4 w-4 text-spark" />
                    <span>{item.topic}</span>
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    Goal: {item.goal || `Master ${item.topic}`}
                  </p>
                  <span className="inline-block text-[10px] text-spark bg-spark/10 border border-spark/20 px-2 py-0.5 rounded-full font-bold">
                    {item.level} Level
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-4 text-[10px]">
                  <span className="text-muted-foreground font-mono">{new Date(item.created_at).toLocaleDateString()}</span>
                  <Link
                    to="/mentor"
                    search={{ restoreId: item.id }}
                    onClick={playClick}
                    className="text-spark hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Open Lesson Plan</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </HolographicPanel>
            ))}
          </div>
        );

      case "study":
        return filteredStudyGuides.length === 0 ? (
          <EmptyState tabLabel="AI Study Guides" redirectPath="/study-guide" hasQuery={!!searchQuery} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredStudyGuides.map((item) => (
              <HolographicPanel key={item.id} className="p-5 flex flex-col justify-between min-h-[160px] relative group border-white/5 bg-card/45">
                <button
                  onClick={() => deleteItem(item.id, "study_guides")}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-destructive p-1 rounded hover:bg-white/5 opacity-0 group-hover:opacity-100 transition cursor-none"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-base text-foreground flex items-center gap-1.5 pr-6">
                    <GraduationCap className="h-4 w-4 text-spark" />
                    <span>{item.domain} Curriculum</span>
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    Goal: {item.goal}
                  </p>
                  <span className="inline-block text-[10px] text-muted-foreground bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                    {item.daily_minutes} Min Daily Routine
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-4 text-[10px]">
                  <span className="text-muted-foreground font-mono">{new Date(item.created_at).toLocaleDateString()}</span>
                  <Link
                    to="/study-guide"
                    search={{ restoreId: item.id }}
                    onClick={playClick}
                    className="text-spark hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Launch Study Console</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </HolographicPanel>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <PageShell>
      <PageHeader
        icon={Bookmark}
        title="Saved Items"
        description="Your centralized storage center. Access saved code blueprints, interactive sandboxes, portfolios, book bookmarks, interview preps, mentor guides, and curriculums."
      />

      {/* Search and Tabs Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        {/* Tabs */}
        <div className="flex border-b border-white/5 text-xs font-semibold overflow-x-auto pb-1 gap-1 scrollbar-none flex-1 order-last md:order-first" data-lenis-prevent>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.value}
                onClick={() => { playClick(); setActiveTab(tab.value); }}
                className={`px-4.5 py-2.5 capitalize rounded-t-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === tab.value
                    ? "border-b-2 border-spark text-foreground bg-spark/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/2"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-white/10 text-muted-foreground ml-0.5">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80 order-first md:order-last shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search saved items..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-background/50 pl-9 pr-8 py-1.5 text-xs text-foreground outline-none focus:border-spark focus:ring-1 focus:ring-spark/30 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-36 animate-pulse rounded-2xl bg-card/20 border border-white/5" />
          ))}
        </div>
      ) : (
        <div className="animate-in fade-in duration-300">
          {renderActiveContent()}
        </div>
      )}
    </PageShell>
  );
}

function EmptyState({ tabLabel, redirectPath, hasQuery }: { tabLabel: string; redirectPath: string; hasQuery?: boolean }) {
  if (hasQuery) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border py-20 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/5 text-muted-foreground">
          <Bookmark className="h-6 w-6" />
        </div>
        <div>
          <p className="font-display text-lg font-medium">No matching items found</p>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm px-4">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border py-20 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-spark text-primary-foreground shadow-glow animate-float">
        <Sparkles className="h-6 w-6" />
      </div>
      <div>
        <p className="font-display text-lg font-medium">No saved items in this category</p>
        <p className="mt-1 text-xs text-muted-foreground max-w-sm px-4">
          Compile and bookmark references or generate AI tools inside the {tabLabel} section to see them listed here.
        </p>
      </div>
      <Link
        to={redirectPath}
        onClick={playClick}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-spark px-5 py-2 text-xs font-semibold text-primary-foreground shadow-glow transition hover:opacity-95"
      >
        <Sparkles className="h-3.5 w-3.5" /> Explore {tabLabel}
      </Link>
    </div>
  );
}
