import { useState, useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Markdown } from "@/components/Markdown";
import * as Icons from "lucide-react";
import { generateNodeStudyGuide, toggleNodeProgress, generateNodeResourcesAndMindmap } from "@/lib/roadmap.functions";
import { useServerFn } from "@tanstack/react-start";
import { Link, useNavigate } from "@tanstack/react-router";
import { awardXP, XP, unlockAchievement } from "@/lib/gamification";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { playHover, playClick, playSuccess } from "@/lib/sounds";
import { generateMindmapData, getFallbackInterviewQuestions, matchKey, getFallbackMindmapAndResources } from "@/lib/resource-engine";
import { getBYOXLinkForTask } from "@/lib/byox-link";

type RoadmapResource = {
  type: "doc" | "youtube" | "github" | "blog" | "practice";
  title: string;
  url: string;
  channel?: string;
  videoId?: string;
  author?: string;
  duration?: string;
  difficulty?: string;
  thumbnail?: string;
  rating?: number;
  free?: boolean;
};

type RoadmapProject = {
  title: string;
  brief: string;
  difficulty: "easy" | "medium" | "hard";
};

type NodeDrawerProps = {
  open: boolean;
  onClose: () => void;
  node: {
    id: string;
    title: string;
    why: string;
    prerequisites: string[];
    outcome: string;
    hours: number;
    difficulty: "easy" | "medium" | "hard";
    resources: RoadmapResource[];
    projects: RoadmapProject[];
    skills?: string[];
    tools?: string[];
    interviewTopics?: string[];
    careerImpact?: string;
  };
  domainSlug: string;
  domainName: string;
  tier: "beginner" | "intermediate" | "advanced";
  nodeStatus: "locked" | "available" | "in_progress" | "completed";
  onStatusChange: (newStatus: "in_progress" | "done") => Promise<void>;
};

export function NodeDrawer({
  open,
  onClose,
  node,
  domainSlug,
  domainName,
  tier,
  nodeStatus,
  onStatusChange,
}: NodeDrawerProps) {
  const [activeTab, setActiveTab] = useState<
    "learn" | "resources" | "build" | "guide" | "mindmap" | "interview" | "notes" | "projects" | "mentor"
  >("learn");
  const fetchStudyGuide = useServerFn(generateNodeStudyGuide);
  const fetchResourcesAndMindmap = useServerFn(generateNodeResourcesAndMindmap);
  const navigate = useNavigate();

  // Check if this node matches any BYOX challenge
  const getMatchedBYOX = () => {
    let match = getBYOXLinkForTask(node.title);
    if (match) return match;
    
    if (node.tools) {
      for (const tool of node.tools) {
        match = getBYOXLinkForTask(tool);
        if (match) return match;
      }
    }
    
    if (node.skills) {
      for (const skill of node.skills) {
        match = getBYOXLinkForTask(skill);
        if (match) return match;
      }
    }
    
    return null;
  };

  const matchedBYOX = getMatchedBYOX();

  // Zoom and Pan states for Mindmap
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<any | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const onWheel = (e: WheelEvent) => {
      if (activeTab !== "mindmap") return;
      e.preventDefault();
      const zoomFactor = 1.1;
      setZoom((prev) => {
        const nextZoom = e.deltaY < 0 ? prev * zoomFactor : prev / zoomFactor;
        return Math.max(0.3, Math.min(4, nextZoom));
      });
    };

    svgEl.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      svgEl.removeEventListener("wheel", onWheel);
    };
  }, [activeTab]);

  // Dynamic resources & mindmap states
  const [dynamicData, setDynamicData] = useState<{
    resources: RoadmapResource[];
    mindmap: { nodes: any[]; edges: any[] };
  } | null>(null);
  const [dynamicLoading, setDynamicLoading] = useState(false);

  useEffect(() => {
    if (!open || !node.id) return;
    setDynamicData(null);
    setDynamicLoading(true);
    fetchResourcesAndMindmap({ data: { slug: domainSlug, tier, nodeId: node.id, nodeTitle: node.title } })
      .then((res) => {
        setDynamicData(res as any);
      })
      .catch((err) => {
        console.error("Failed to load AI resources and mindmap:", err);
      })
      .finally(() => {
        setDynamicLoading(false);
      });
  }, [open, node.id, domainSlug, tier, node.title]);

  // Recommended Free Reference Books states
  const [recommendedBooks, setRecommendedBooks] = useState<any[]>([]);
  const [booksLoading, setBooksLoading] = useState(false);

  useEffect(() => {
    if (!open || !node.id || activeTab !== "resources") return;
    
    let active = true;
    const fetchAndFilterBooks = async () => {
      setBooksLoading(true);
      try {
        let books: any[] = (window as any).__fpb_cache || [];
        if (books.length === 0) {
          const res = await fetch("https://raw.githubusercontent.com/EbookFoundation/free-programming-books-search/master/fpb.json");
          const data = await res.json();
          if (data && Array.isArray(data.children) && data.children[0] && Array.isArray(data.children[0].children)) {
            const enBlocks = data.children[0].children.filter((l: any) => l.language && l.language.code === "en");
            enBlocks.forEach((enLang: any) => {
              enLang.sections.forEach((s: any) => {
                const secName = s.section;
                if (Array.isArray(s.entries)) {
                  s.entries.forEach((e: any) => {
                    books.push({
                      id: `live-${books.length}`,
                      title: e.title,
                      url: e.url,
                      author: e.author || "Unknown",
                      category: secName,
                      format: e.notes ? e.notes.join(", ") : "HTML"
                    });
                  });
                }
                if (Array.isArray(s.subsections)) {
                  s.subsections.forEach((sub: any) => {
                    const subName = sub.section;
                    if (Array.isArray(sub.entries)) {
                      sub.entries.forEach((e: any) => {
                        books.push({
                          id: `live-${books.length}`,
                          title: e.title,
                          url: e.url,
                          author: e.author || "Unknown",
                          category: `${secName} - ${subName}`,
                          format: e.notes ? e.notes.join(", ") : "HTML"
                        });
                      });
                    }
                  });
                }
              });
            });
            (window as any).__fpb_cache = books;
          }
        }
        
        if (!active) return;

        const key = matchKey(node.title) || matchKey(domainSlug) || node.id;
        const normalizedNodeTitle = node.title.toLowerCase();
        
        const matched = books.filter(b => {
          const title = b.title.toLowerCase();
          const category = b.category.toLowerCase();
          
          const directMatch = title.includes(normalizedNodeTitle) || category.includes(normalizedNodeTitle);
          const keyMatch = key ? (title.includes(key.toLowerCase()) || category.includes(key.toLowerCase())) : false;
          
          return directMatch || keyMatch;
        });
        
        setRecommendedBooks(matched.slice(0, 4));
      } catch (err) {
        console.warn("Failed to load/match recommended books:", err);
      } finally {
        if (active) {
          setBooksLoading(false);
        }
      }
    };
    
    fetchAndFilterBooks();
    return () => {
      active = false;
    };
  }, [open, node.id, node.title, domainSlug, activeTab]);

  // Play video iframe state for lite-embed
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  // Bookmarks and completed resources local state (simulating tracking)
  const [bookmarkedResources, setBookmarkedResources] = useState<Record<string, boolean>>({});
  const [completedResources, setCompletedResources] = useState<Record<string, boolean>>({});
  const [completedSkills, setCompletedSkills] = useState<Record<string, boolean>>({});

  // Load completed skills from local storage on node change
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`spark-tasks-${node.id}`);
      if (stored) {
        setCompletedSkills(JSON.parse(stored));
      } else {
        setCompletedSkills({});
      }
    } catch {
      setCompletedSkills({});
    }
  }, [node.id]);

  const toggleSkillComplete = (skill: string) => {
    setCompletedSkills((prev) => {
      const updated = { ...prev, [skill]: !prev[skill] };
      localStorage.setItem(`spark-tasks-${node.id}`, JSON.stringify(updated));
      if (updated[skill]) {
        playSuccess();
        awardXP(15, `Mastered: ${skill}`);
      } else {
        playClick();
      }
      return updated;
    });
  };

  // Study Guide generation states
  const [studyGuide, setStudyGuide] = useState<Awaited<ReturnType<typeof fetchStudyGuide>> | null>(
    null,
  );
  const [guideLoading, setGuideLoading] = useState(false);

  // Interactive Quiz States
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const { user } = useAuth();
  const [threadId, setThreadId] = useState<string | null>(null);
  const threadIdRef = useRef<string | null>(null);

  useEffect(() => {
    threadIdRef.current = threadId;
  }, [threadId]);

  // Scoped AI Mentor Chatbot
  const [chatInput, setChatInput] = useState("");
  const { messages, sendMessage, status, stop, setMessages } = useChat({
    id: `mentor-${node.id}`,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onFinish: async ({ message }) => {
      const activeId = threadIdRef.current;
      if (!user || !activeId || !message) return;
      const msgAny = message as any;
      const text = msgAny.content || (Array.isArray(msgAny.parts) ? msgAny.parts.filter((p: any) => p?.type === "text").map((p: any) => p.text).join("\n\n") : "");
      const parts = [{ type: "text", text }];
      await supabase.from("chat_messages").insert({
        id: crypto.randomUUID(),
        thread_id: activeId,
        user_id: user.id,
        role: message.role,
        parts: parts as unknown as never,
      });
      await supabase
        .from("chat_threads")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", activeId);
    }
  });

  const isStreaming = status === "submitted" || status === "streaming";

  // Load Mentor Chat History
  useEffect(() => {
    if (!open || !user || !node.id) return;
    let cancelled = false;
    (async () => {
      const title = `Mentor:${domainSlug}:${node.id}`;
      const { data: threadData } = await supabase
        .from("chat_threads")
        .select("id")
        .eq("user_id", user.id)
        .eq("title", title)
        .maybeSingle();

      if (cancelled) return;

      const systemMessage: UIMessage = {
        id: "sys-prompt",
        role: "system",
        parts: [
          {
            type: "text",
            text: `You are the AI Mentor for the topic "${node.title}" in the domain "${domainName}". Scopes your responses strictly to this topic. Help the user learn, understand core concepts, prepare for interviews, or write code. Use markdown and code blocks when helpful.`,
          },
        ],
      };

      if (threadData) {
        setThreadId(threadData.id);
        const { data: msgData } = await supabase
          .from("chat_messages")
          .select("id, role, parts, created_at")
          .eq("thread_id", threadData.id)
          .order("created_at", { ascending: true });

        if (cancelled) return;

        const loadedMsgs: UIMessage[] = ((msgData ?? []) as any[]).map((m) => ({
          id: m.id,
          role: m.role as UIMessage["role"],
          parts: (Array.isArray(m.parts) ? m.parts : []) as UIMessage["parts"],
        }));
        setMessages([systemMessage, ...loadedMsgs]);
      } else {
        setThreadId(null);
        setMessages([systemMessage]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, user, node.id, domainSlug, domainName]);

  const submitMessage = async (text: string) => {
    if (!user) return;
    let activeThreadId = threadId;

    if (!activeThreadId) {
      const title = `Mentor:${domainSlug}:${node.id}`;
      const { data, error } = await supabase
        .from("chat_threads")
        .insert({ user_id: user.id, title })
        .select("id")
        .single();
      
      if (error || !data) {
        toast.error("Failed to start chat session");
        return;
      }
      activeThreadId = data.id;
      setThreadId(activeThreadId);
    }

    const userMsgId = crypto.randomUUID();
    await supabase.from("chat_messages").insert({
      id: userMsgId,
      thread_id: activeThreadId,
      user_id: user.id,
      role: "user",
      parts: [{ type: "text", text }] as unknown as never,
    });

    sendMessage({ id: userMsgId, role: "user", parts: [{ type: "text", text }] });
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = chatInput.trim();
    if (!text || isStreaming) return;
    setChatInput("");
    await submitMessage(text);
  };

  const getMessageText = (m: any) => {
    if (m.content) return m.content;
    if (Array.isArray(m.parts)) {
      return m.parts
        .filter((p: any) => p && p.type === "text")
        .map((p: any) => p.text)
        .join("\n\n");
    }
    return "";
  };

  // Fetch Study Guide when active tab changes to "guide"
  useEffect(() => {
    if (activeTab === "guide" && !studyGuide) {
      setGuideLoading(true);
      fetchStudyGuide({ data: { slug: domainSlug, tier, nodeId: node.id, nodeTitle: node.title } })
        .then((res) => {
          setStudyGuide(res);
          setQuizAnswers({});
          setQuizSubmitted(false);
        })
        .catch((e) => {
          toast.error("Failed to generate study guide");
        })
        .finally(() => setGuideLoading(false));
    }
  }, [activeTab, domainSlug, tier, node.id, node.title, studyGuide, fetchStudyGuide]);

  // Reset video player, tab, zoom, pan, and hover state on node change
  useEffect(() => {
    setPlayingVideoId(null);
    setStudyGuide(null);
    setActiveTab("learn");
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setHoveredNode(null);
    setRecommendedBooks([]);
    setBooksLoading(false);
  }, [node.id]);

  // Notes state
  const [notesContent, setNotesContent] = useState("");
  const [notesSaved, setNotesSaved] = useState(true);
  const [notesMode, setNotesMode] = useState<"edit" | "preview">("edit");
  const saveTimeoutRef = useRef<any>(null);

  // Load notes on node changes
  useEffect(() => {
    const saved = localStorage.getItem(`spark-notes-${node.id}`);
    setNotesContent(saved || "");
    setNotesSaved(true);
  }, [node.id]);

  const handleNotesChange = (text: string) => {
    setNotesContent(text);
    setNotesSaved(false);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      localStorage.setItem(`spark-notes-${node.id}`, text);
      setNotesSaved(true);
    }, 800);
  };

  // Interview state
  const [expandedQuestionIdx, setExpandedQuestionIdx] = useState<number | null>(null);

  if (!open) return null;

  // Toggle bookmarked resource
  const toggleBookmark = (url: string) => {
    playClick();
    setBookmarkedResources((prev) => {
      const updated = { ...prev, [url]: !prev[url] };
      if (updated[url]) {
        awardXP(10, "Bookmarked study resource");
      }
      return updated;
    });
  };

  // Toggle completed resource
  const toggleResourceComplete = (url: string) => {
    setCompletedResources((prev) => {
      const updated = { ...prev, [url]: !prev[url] };
      if (updated[url]) {
        playSuccess();
        awardXP(20, "Completed learning resource");
      } else {
        playClick();
      }
      return updated;
    });
  };

  // Handle Mark Complete for the Node itself
  const handleNodeCompletion = async () => {
    const isDone = nodeStatus === "completed";
    if (!isDone) {
      playSuccess();
    } else {
      playClick();
    }
    await onStatusChange(isDone ? "in_progress" : "done");
  };

  // Quick Chat Prompts
  const handleQuickPrompt = async (promptText: string) => {
    if (isStreaming) return;
    await submitMessage(promptText);
  };

  // Quiz submission handler
  const handleQuizSubmit = async () => {
    if (!studyGuide?.quiz) return;
    setQuizSubmitted(true);
    let correct = 0;
    studyGuide.quiz.forEach((qItem: any, idx: number) => {
      if (quizAnswers[idx] === qItem.answer) correct++;
    });

    const percent = Math.round((correct / studyGuide.quiz.length) * 100);

    // Save quiz score to node progress via toggleNodeProgress if needed
    // Otherwise award XP
    if (correct === studyGuide.quiz.length) {
      await awardXP(75, `Perfect Quiz! ${correct}/${studyGuide.quiz.length} on ${node.title}`);
      await unlockAchievement({
        code: "perfect-quiz",
        title: "Perfect Score",
        description: "Answer all mini-quiz questions correctly.",
        icon: "Brain",
        xp: 75,
      });
    } else {
      await awardXP(
        correct * 10,
        `Quiz Score: ${correct}/${studyGuide.quiz.length} on ${node.title}`,
      );
    }
  };

  return (
    <>
      {/* Sliding Drawer Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-[540px] flex-col border-l border-white/10 bg-card/95 shadow-glow backdrop-blur-2xl transition-transform duration-300 sm:max-w-[620px]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-spark">
              {domainName} · {tier}
            </span>
            <h2 className="font-display text-xl font-semibold text-foreground mt-0.5">
              {node.title}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {nodeStatus !== "locked" && (
              <button
                onClick={handleNodeCompletion}
                className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold tracking-wide transition ${
                  nodeStatus === "completed"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
                    : "bg-gradient-spark text-primary-foreground shadow-glow hover:-translate-y-0.5"
                }`}
              >
                {nodeStatus === "completed" ? (
                  <>
                    <Icons.CheckCircle2 className="h-4 w-4" />
                    <span>Completed</span>
                  </>
                ) : (
                  <>
                    <Icons.CheckCircle className="h-4 w-4" />
                    <span>Mark Complete</span>
                  </>
                )}
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-muted-foreground hover:bg-white/5 hover:text-foreground transition"
            >
              <Icons.X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/5 px-4 text-xs font-medium overflow-x-auto scrollbar-none flex-nowrap" data-lenis-prevent>
          {(["learn", "resources", "build", "guide", "mindmap", "interview", "notes", "projects", "mentor"] as const).map((tab) => (
            <button
              key={tab}
              onMouseEnter={playHover}
              onClick={() => {
                playClick();
                setActiveTab(tab);
              }}
              className={`relative shrink-0 px-4 py-3 text-center transition capitalize ${
                activeTab === tab
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "guide"
                ? "Study Guide"
                : tab === "mentor"
                  ? "AI Mentor"
                  : tab === "mindmap"
                    ? "Mindmap"
                    : tab === "interview"
                      ? "Interview Prep"
                      : tab === "notes"
                        ? "Personal Notes"
                        : tab === "build"
                          ? "Build (BYOX)"
                          : tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-spark" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Contents Area */}
        <div className="flex-1 overflow-y-auto p-6" data-lenis-prevent>
          {/* LEARN TAB */}
          {activeTab === "learn" && (
            <div className="space-y-6">
              {/* Micro stats banner */}
              <div className="grid grid-cols-2 gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 text-xs">
                <div className="flex flex-col">
                  <span className="text-muted-foreground uppercase tracking-widest text-[9px] font-semibold">Est. Learning Time</span>
                  <span className="mt-1 font-semibold text-foreground text-sm flex items-center gap-1.5"><Icons.Clock className="h-4 w-4 text-spark" /> {node.hours} Hours</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground uppercase tracking-widest text-[9px] font-semibold">Difficulty</span>
                  <span className={`mt-1 font-semibold text-sm capitalize ${node.difficulty === "easy" ? "text-emerald-400" : node.difficulty === "medium" ? "text-blue-400" : "text-red-400"}`}>{node.difficulty}</span>
                </div>
              </div>

              {node.prerequisites && node.prerequisites.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5"><Icons.ShieldAlert className="h-4 w-4 text-spark" /> Prerequisites</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {node.prerequisites.map((p) => (
                      <span key={p} className="rounded-lg bg-red-500/10 border border-red-500/20 px-2.5 py-1 text-xs text-red-400 font-semibold">{p}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-spark">
                  Why learn this?
                </h4>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{node.why}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Expected Outcome</h4>
                <div className="flex gap-2.5 items-start text-sm text-muted-foreground leading-relaxed">
                  <Icons.Target className="h-4 w-4 text-spark mt-0.5 shrink-0" />
                  <span>{node.outcome}</span>
                </div>
              </div>

              {node.careerImpact && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Career Impact</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {node.careerImpact}
                  </p>
                </div>
              )}

              {(node.skills?.length ?? 0) > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">Tasks to Complete (Progress Tracker)</h4>
                  <div className="space-y-2">
                    {node.skills?.map((skill) => {
                      const isSkillDone = !!completedSkills[skill];
                      const byoxLink = getBYOXLinkForTask(skill);
                      return (
                        <div
                          key={skill}
                          onClick={() => toggleSkillComplete(skill)}
                          className={`flex items-center justify-between gap-3 rounded-xl border p-3 cursor-pointer transition ${
                            isSkillDone
                              ? "border-emerald-500/25 bg-emerald-500/5 text-foreground"
                              : "border-white/5 bg-white/2 text-muted-foreground hover:border-white/10 hover:text-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${
                              isSkillDone
                                ? "border-emerald-500 bg-emerald-500 text-primary-foreground"
                                : "border-white/20 bg-transparent"
                            }`}>
                              {isSkillDone && <Icons.Check className="h-3.5 w-3.5 stroke-[3px]" />}
                            </div>
                            <span className="text-xs font-medium truncate">{skill}</span>
                          </div>
                          {byoxLink && (
                            <Link
                              to="/build-your-own-x"
                              search={{ query: byoxLink.query }}
                              onClick={(e) => e.stopPropagation()}
                              className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-spark/20 hover:bg-spark/35 border border-spark/30 hover:border-spark/50 text-[9px] font-bold text-spark transition shadow-glow"
                            >
                              <Icons.Cpu className="h-2.5 w-2.5" />
                              <span>{byoxLink.label} ↗</span>
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {(node.tools?.length ?? 0) > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Tools / Frameworks</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {node.tools?.map((tool) => (
                      <span
                        key={tool}
                        className="rounded-lg bg-white/5 border border-white/5 px-2.5 py-1 text-xs text-foreground"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* RESOURCES TAB */}
          {activeTab === "resources" && (
            <div className="space-y-6">
              {dynamicLoading && (
                <div className="flex flex-col items-center justify-center py-6 border border-dashed border-white/5 rounded-2xl bg-white/2">
                  <Icons.Loader2 className="h-6 w-6 animate-spin text-spark" />
                  <p className="mt-2 text-xs text-muted-foreground font-sans">Querying AI for specialized docs, video tutorials, and exercises...</p>
                </div>
              )}

              {(() => {
                const resources = dynamicData?.resources || node.resources || [];
                if (resources.length > 0) {
                  return (
                    <div className="space-y-4">
                      {resources.map((resource) => {
                        const isVideo = resource.type === "youtube";
                        const isBookmarked = !!bookmarkedResources[resource.url];
                        const isDone = !!completedResources[resource.url];

                        return (
                          <div
                            key={resource.url}
                            className="group overflow-hidden rounded-2xl border border-white/5 bg-card/45 p-4 transition-all duration-300 hover:border-white/10"
                          >
                            <div className="flex items-start gap-4">
                              {/* Left icon depending on resource type */}
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-spark">
                                {resource.type === "doc" && <Icons.FileText className="h-4 w-4" />}
                                {resource.type === "youtube" && (
                                  <Icons.Youtube className="h-4 w-4 text-red-500" />
                                )}
                                {resource.type === "github" && <Icons.Github className="h-4 w-4" />}
                                {resource.type === "practice" && <Icons.Code2 className="h-4 w-4" />}
                                {resource.type === "blog" && <Icons.BookOpen className="h-4 w-4" />}
                              </div>

                              <div className="min-w-0 flex-1">
                                <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
                                  {resource.type} {resource.author ? `· ${resource.author}` : ""}
                                </span>
                                <h4 className="text-sm font-semibold text-foreground truncate mt-0.5 group-hover:text-spark transition">
                                  <a
                                    href={resource.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:underline"
                                  >
                                    {resource.title}
                                  </a>
                                </h4>
                                <div className="mt-1 flex flex-wrap items-center gap-x-2 text-[10px] text-muted-foreground">
                                  {resource.duration && <span>⏱️ {resource.duration}</span>}
                                  {resource.rating && <span>⭐ {resource.rating}</span>}
                                  <span>{resource.free ? "Free" : "Paid"}</span>
                                </div>
                              </div>

                              {/* Quick bookmark + completion buttons */}
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => toggleBookmark(resource.url)}
                                  className={`rounded-lg p-1.5 hover:bg-white/5 transition ${
                                    isBookmarked ? "text-spark" : "text-muted-foreground"
                                  }`}
                                  title={isBookmarked ? "Remove bookmark" : "Bookmark resource"}
                                >
                                  <Icons.Bookmark
                                    className="h-4 w-4"
                                    fill={isBookmarked ? "currentColor" : "none"}
                                  />
                                </button>
                                <button
                                  onClick={() => toggleResourceComplete(resource.url)}
                                  className={`rounded-lg p-1.5 hover:bg-white/5 transition ${
                                    isDone ? "text-emerald-400" : "text-muted-foreground"
                                  }`}
                                  title={isDone ? "Mark incomplete" : "Mark as completed"}
                                >
                                  <Icons.CheckCircle2
                                    className="h-4 w-4"
                                    fill={isDone ? "currentColor" : "none"}
                                  />
                                </button>
                              </div>
                            </div>

                            {/* YouTube Lite-Embed Player */}
                            {isVideo && resource.videoId && (
                              <div className="mt-4">
                                <div className="aspect-video w-full overflow-hidden rounded-xl bg-black relative">
                                  <div className="absolute top-2 left-2 z-10">
                                    <a
                                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(resource.title || node.title + " " + resource.title)}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="rounded-lg bg-black/75 border border-white/10 px-2 py-1 text-[9px] font-semibold text-white hover:text-spark transition flex items-center gap-1 cursor-pointer"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Icons.Search className="h-3 w-3" />
                                      <span>Search YouTube</span>
                                    </a>
                                  </div>
                                  {playingVideoId === resource.videoId ? (
                                    <iframe
                                      src={`https://www.youtube.com/embed/${resource.videoId}?autoplay=1`}
                                      title={resource.title}
                                      frameBorder="0"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                      className="h-full w-full"
                                    />
                                  ) : (
                                    <div
                                      onClick={() => setPlayingVideoId(resource.videoId!)}
                                      className="relative flex h-full w-full cursor-pointer items-center justify-center bg-cover bg-center"
                                      style={{
                                        backgroundImage: `url(https://img.youtube.com/vi/${resource.videoId}/hqdefault.jpg)`,
                                      }}
                                    >
                                      <div className="absolute inset-0 bg-black/40 transition hover:bg-black/25" />
                                      <div className="z-10 flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-glow transition group-hover:scale-105">
                                        <Icons.Play className="h-6 w-6 ml-0.5" fill="currentColor" />
                                      </div>
                                      <span className="absolute bottom-2 right-2 rounded bg-black/85 px-1.5 py-0.5 text-[9px] text-white">
                                        YouTube Preview
                                      </span>
                                    </div>
                                  )}
                                </div>
                                {/* Fallback info when video is unavailable */}
                                <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground px-1">
                                  <span>Video preview unavailable?</span>
                                  <a
                                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(resource.title || node.title + " " + resource.title)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-spark font-semibold hover:underline flex items-center gap-1"
                                  >
                                    <Icons.Search className="h-2.5 w-2.5" />
                                    <span>Find working version on YouTube ↗</span>
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                } else {
                  return (
                    <p className="text-center text-sm text-muted-foreground py-10">
                      No resources specified.
                    </p>
                  );
                }
              })()}

              {/* Recommended Books Section */}
              {booksLoading && (
                <div className="flex items-center gap-2 justify-center py-6 border border-dashed border-white/5 rounded-2xl bg-white/2">
                  <Icons.Loader2 className="h-4 w-4 animate-spin text-spark" />
                  <span className="text-[11px] text-muted-foreground">Searching free programming reference books catalog...</span>
                </div>
              )}

              {!booksLoading && recommendedBooks.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-spark flex items-center gap-1.5">
                    <Icons.BookOpen className="h-3.5 w-3.5" />
                    <span>Recommended Reference Books ({recommendedBooks.length})</span>
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {recommendedBooks.map((book) => (
                      <div key={book.id} className="relative overflow-hidden rounded-xl border border-white/5 bg-white/2 p-3 hover:border-spark/20 transition flex flex-col justify-between min-h-[120px]">
                        <div>
                          <span className="text-[8px] font-semibold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-1.5 py-0.2 rounded w-fit inline-block">
                            {book.category}
                          </span>
                          <h5 className="font-bold text-xs text-foreground mt-1.5 line-clamp-2 leading-snug">{book.title}</h5>
                          <p className="text-[9px] text-muted-foreground mt-0.5 truncate">by {book.author}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[10px]">
                          <span className="font-mono text-[8px] text-muted-foreground">{book.format}</span>
                          <a
                            href={book.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => { playClick(); awardXP(10, `Opened book from roadmap: ${book.title}`); }}
                            className="text-spark hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <span>Read</span>
                            <Icons.ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* BUILD (BYOX) TAB */}
          {activeTab === "build" && (
            <div className="space-y-6">
              {matchedBYOX ? (
                <div className="rounded-2xl border border-spark/20 bg-spark/5 p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-spark/20 flex items-center justify-center text-spark">
                      <Icons.Cpu className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">
                        Build Your Own {matchedBYOX.label.replace("Build ", "")}
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Matched with our interactive step-by-step BYOX catalog
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    This roadmap topic is directly related to the coding challenge <strong>"{matchedBYOX.label}"</strong>. 
                    You can build a complete, production-ready version of this tool from scratch to earn substantial bonus XP, gain deep system engineering expertise, and showcase it on your resume.
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        playClick();
                        onClose();
                        navigate({
                          to: "/build-your-own-x",
                          search: { query: matchedBYOX.query },
                        });
                      }}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-spark px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-glow hover:opacity-95 transition cursor-none"
                    >
                      <Icons.Play className="h-3.5 w-3.5 fill-current" />
                      <span>Start Building Challenge</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-white/5 bg-white/2 p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground">
                      <Icons.FileCode className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">
                        Custom BYOX Sandbox Prototype
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        No direct catalog match found
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Although there is no pre-built interactive guide for <strong>"{node.title}"</strong>, 
                    you can prototype a custom sandbox project for it using our AI Project Builder. Describe the concept, select your stack, and let AI initiate the codebase.
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        playClick();
                        onClose();
                        navigate({
                          to: "/builder",
                          search: { seed: `A custom prototype for ${node.title}` },
                        });
                      }}
                      className="inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/5 px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-white/10 hover:border-white/10 transition cursor-none"
                    >
                      <Icons.Code2 className="h-3.5 w-3.5 text-spark" />
                      <span>Create Project Sandbox</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STUDY GUIDE TAB */}
          {activeTab === "guide" && (
            <div className="space-y-6">
              {guideLoading && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Icons.Loader2 className="h-8 w-8 animate-spin text-spark" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    AI is designing your mini study guide...
                  </p>
                </div>
              )}

              {studyGuide && (
                <div className="space-y-6">
                  {/* What & How */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                      <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-spark mb-2.5">
                        <Icons.Target className="h-4 w-4" /> Core Topics
                      </h4>
                      <ul className="space-y-2 text-xs text-muted-foreground">
                        {studyGuide.what.map((w: string, i: number) => (
                          <li key={i} className="flex gap-1.5">
                            <span className="text-spark font-bold">•</span>
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                      <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-spark mb-2.5">
                        <Icons.BookOpen className="h-4 w-4" /> Action Plan
                      </h4>
                      <ul className="space-y-2 text-xs text-muted-foreground">
                        {studyGuide.how.map((h: string, i: number) => (
                          <li key={i} className="flex gap-1.5">
                            <span className="text-spark font-bold">{i + 1}.</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Practice Tasks */}
                  <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                    <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-spark mb-2.5">
                      <Icons.Code2 className="h-4 w-4" /> Practice Tasks
                    </h4>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      {studyGuide.practice.map((p: string, i: number) => (
                        <li key={i} className="flex gap-1.5">
                          <Icons.CircleDot className="h-3.5 w-3.5 text-spark shrink-0 mt-0.5" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Mini Project */}
                  {studyGuide.mini_project && (
                    <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                      <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-spark mb-2">
                        <Icons.Trophy className="h-4 w-4" /> Capstone Project
                      </h4>
                      <h5 className="text-xs font-semibold text-foreground mt-1">
                        {studyGuide.mini_project.title}
                      </h5>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        {studyGuide.mini_project.brief}
                      </p>
                      <button
                        onClick={() =>
                          navigate({
                            to: "/builder",
                            search: { seed: studyGuide.mini_project.title },
                          })
                        }
                        className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-spark hover:underline"
                      >
                        Architect in AI Builder <Icons.ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  )}

                  {/* Interactive Quiz */}
                  {studyGuide.quiz && (
                    <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                      <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-spark mb-4">
                        <Icons.Brain className="h-4 w-4" /> Scoped Mini-Quiz
                      </h4>

                      <div className="space-y-4">
                        {studyGuide.quiz.map((qItem: any, qIdx: number) => (
                          <div key={qIdx} className="space-y-2">
                            <p className="text-xs font-semibold text-foreground">
                              {qIdx + 1}. {qItem.q}
                            </p>
                            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                              {qItem.choices.map((choice: string, cIdx: number) => {
                                const isSelected = quizAnswers[qIdx] === cIdx;
                                const isCorrect = qItem.answer === cIdx;

                                let choiceClass =
                                  "border-white/5 bg-white/2 text-muted-foreground hover:bg-white/5";
                                if (isSelected) {
                                  choiceClass = "border-spark/50 bg-spark/10 text-foreground";
                                }
                                if (quizSubmitted) {
                                  if (isCorrect) {
                                    choiceClass =
                                      "border-emerald-500/50 bg-emerald-500/10 text-emerald-400";
                                  } else if (isSelected) {
                                    choiceClass = "border-red-500/50 bg-red-500/10 text-red-400";
                                  }
                                }

                                return (
                                  <button
                                    key={cIdx}
                                    disabled={quizSubmitted}
                                    onClick={() =>
                                      setQuizAnswers((prev) => ({ ...prev, [qIdx]: cIdx }))
                                    }
                                    className={`rounded-lg border px-3 py-2 text-left text-xs transition ${choiceClass}`}
                                  >
                                    {choice}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>

                      {!quizSubmitted ? (
                        <button
                          onClick={handleQuizSubmit}
                          disabled={Object.keys(quizAnswers).length < studyGuide.quiz.length}
                          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-spark px-4 py-2.5 text-xs font-medium text-primary-foreground shadow-glow disabled:opacity-50"
                        >
                          Submit Answers
                        </button>
                      ) : (
                        <div className="mt-4 flex items-center justify-between text-xs font-semibold">
                          <span className="text-muted-foreground">Quiz Submitted</span>
                          <button
                            onClick={() => {
                              setQuizAnswers({});
                              setQuizSubmitted(false);
                            }}
                            className="text-spark hover:underline"
                          >
                            Retake Quiz
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* MINDMAP TAB */}
          {activeTab === "mindmap" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-center">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-spark mb-1">
                  AI-Powered Learning Mindmap
                </h4>
                <p className="text-[11px] text-muted-foreground font-sans">
                  A visual overview of skills, tools, projects, and interview expectations for {node.title}.
                </p>
              </div>

              {dynamicLoading && !dynamicData ? (
                <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/5 rounded-3xl bg-white/2">
                  <Icons.Loader2 className="h-8 w-8 animate-spin text-spark" />
                  <p className="mt-3 text-xs text-muted-foreground font-sans">
                    Constructing customized AI mindmap nodes and relations...
                  </p>
                </div>
              ) : (
                (() => {
                  const data = dynamicData?.mindmap || getFallbackMindmapAndResources(node.title, domainSlug, tier).mindmap;
                  
                  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
                    if (e.button !== 0) return;
                    const target = e.target as SVGElement;
                    if (target.closest(".mindmap-node-group")) return;
                    setIsPanning(true);
                    setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
                  };

                  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
                    if (!isPanning) return;
                    setPan({
                      x: e.clientX - startPan.x,
                      y: e.clientY - startPan.y,
                    });
                  };

                  const handleMouseUpOrLeave = () => {
                    setIsPanning(false);
                  };

                  const zoomIn = () => setZoom((prev) => Math.min(4, prev * 1.2));
                  const zoomOut = () => setZoom((prev) => Math.max(0.3, prev / 1.2));
                  const resetView = () => {
                    setZoom(1);
                    setPan({ x: 0, y: 0 });
                  };

                  return (
                    <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-black/40 p-4 min-h-[380px]">
                      {/* Navigation helper */}
                      <div className="absolute top-4 left-4 z-10 text-[9px] text-muted-foreground bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/5 pointer-events-none select-none">
                        🖱️ Drag to pan | Scroll to zoom
                      </div>

                      {/* Zoom controls */}
                      <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-lg border border-white/5">
                        <button
                          onClick={zoomIn}
                          className="p-1.5 hover:bg-white/10 text-muted-foreground hover:text-foreground rounded transition"
                          title="Zoom In"
                        >
                          <Icons.ZoomIn className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={zoomOut}
                          className="p-1.5 hover:bg-white/10 text-muted-foreground hover:text-foreground rounded transition"
                          title="Zoom Out"
                        >
                          <Icons.ZoomOut className="h-3.5 w-3.5" />
                        </button>
                        <div className="w-px h-3.5 bg-white/10 mx-1" />
                        <button
                          onClick={resetView}
                          className="p-1.5 hover:bg-white/10 text-muted-foreground hover:text-foreground rounded transition"
                          title="Reset View"
                        >
                          <Icons.Maximize className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <svg
                        ref={svgRef}
                        viewBox="-320 -180 640 360"
                        className="w-full h-[360px] overflow-visible select-none"
                        style={{ cursor: isPanning ? "grabbing" : "grab" }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUpOrLeave}
                        onMouseLeave={handleMouseUpOrLeave}
                      >
                        <defs>
                          <radialGradient id="root-grad" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="oklch(0.78 0.18 295)" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="oklch(0.78 0.18 295)" stopOpacity="0" />
                          </radialGradient>
                        </defs>

                        {/* Transformed container */}
                        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                          {/* Connections */}
                          {data.edges?.map((e: any) => {
                            const src = data.nodes?.find((n: any) => n.id === e.source);
                            const tgt = data.nodes?.find((n: any) => n.id === e.target);
                            if (!src || !tgt) return null;
                            return (
                              <g key={e.id}>
                                <line
                                  x1={src.x}
                                  y1={src.y}
                                  x2={tgt.x}
                                  y2={tgt.y}
                                  stroke={src.color || "rgba(255,255,255,0.15)"}
                                  strokeWidth={e.animated ? "2" : "1.2"}
                                  strokeDasharray={e.animated ? "4,4" : "none"}
                                  className={e.animated ? "animate-[dash_15s_linear_infinite]" : ""}
                                  style={{
                                    opacity: 0.45
                                  }}
                                />
                              </g>
                            );
                          })}

                          {/* Nodes */}
                          {data.nodes?.map((n: any) => {
                            const isRoot = n.type === "root";
                            const isMain = n.type === "main";
                            const isLeaf = n.type === "leaf";
                            const isHovered = hoveredNode?.id === n.id;

                            if (isRoot) {
                              return (
                                <g
                                  key={n.id}
                                  className="mindmap-node-group cursor-pointer"
                                  onMouseDown={(e) => e.stopPropagation()}
                                  onMouseEnter={() => setHoveredNode(n)}
                                  onMouseLeave={() => setHoveredNode(null)}
                                >
                                  <circle cx={n.x} cy={n.y} r={isHovered ? "58" : "50"} fill="url(#root-grad)" className="transition-all duration-200" />
                                  <rect
                                    x={n.x - 75}
                                    y={n.y - 20}
                                    width="150"
                                    height="40"
                                    rx="12"
                                    fill="oklch(0.16 0.02 270)"
                                    stroke={isHovered ? "oklch(0.78 0.18 295)" : (n.color || "#fff")}
                                    strokeWidth={isHovered ? "2.5" : "2"}
                                    className="drop-shadow-[0_0_12px_rgba(150,50,255,0.4)] transition-all duration-200"
                                  />
                                  <text
                                    x={n.x}
                                    y={n.y + 4}
                                    textAnchor="middle"
                                    fill="#fff"
                                    className="font-semibold text-[9px] uppercase tracking-wider select-none pointer-events-none"
                                  >
                                    {n.label.length > 20 ? n.label.substring(0, 18) + "..." : n.label}
                                  </text>
                                </g>
                              );
                            }

                            if (isMain) {
                              return (
                                <g
                                  key={n.id}
                                  className="mindmap-node-group cursor-pointer"
                                  onMouseDown={(e) => e.stopPropagation()}
                                  onMouseEnter={() => setHoveredNode(n)}
                                  onMouseLeave={() => setHoveredNode(null)}
                                >
                                  <rect
                                    x={n.x - 65}
                                    y={n.y - 16}
                                    width="130"
                                    height="32"
                                    rx="10"
                                    fill="oklch(0.2 0.03 260)"
                                    stroke={isHovered ? "oklch(0.78 0.18 295)" : (n.color || "rgba(255,255,255,0.3)")}
                                    strokeWidth={isHovered ? "2" : "1.5"}
                                    className="transition-all duration-200"
                                  />
                                  <text
                                    x={n.x}
                                    y={n.y + 4}
                                    textAnchor="middle"
                                    fill="#fff"
                                    className="font-semibold text-[9px] select-none pointer-events-none"
                                  >
                                    {n.label.length > 20 ? n.label.substring(0, 18) + "..." : n.label}
                                  </text>
                                </g>
                              );
                            }

                            // Leaf node
                            return (
                              <g
                                key={n.id}
                                className="mindmap-node-group cursor-pointer"
                                onMouseDown={(e) => e.stopPropagation()}
                                onMouseEnter={() => setHoveredNode(n)}
                                onMouseLeave={() => setHoveredNode(null)}
                              >
                                <circle
                                  cx={n.x}
                                  cy={n.y}
                                  r={isHovered ? "7" : "5"}
                                  fill={isHovered ? "oklch(0.78 0.18 295)" : "oklch(0.78 0.18 295)"}
                                  stroke="rgba(255,255,255,0.2)"
                                  strokeWidth={isHovered ? "1.5" : "0"}
                                  className="transition-all duration-200"
                                />
                                <text
                                  x={n.x > 0 ? n.x + 10 : n.x - 10}
                                  y={n.y + 3}
                                  textAnchor={n.x > 0 ? "start" : "end"}
                                  fill={isHovered ? "#fff" : "rgba(255,255,255,0.7)"}
                                  className="text-[9px] select-none pointer-events-none font-medium transition-all duration-200"
                                >
                                  {n.label.length > 22 ? n.label.substring(0, 20) + "..." : n.label}
                                </text>
                              </g>
                            );
                          })}
                        </g>
                      </svg>
                      <style>{`
                        @keyframes dash {
                          to {
                            stroke-dashoffset: -40;
                          }
                        }
                      `}</style>

                      {/* Floating Info & Source Panel */}
                      {hoveredNode ? (
                        <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 bg-black/90 p-4 text-xs backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 z-20">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <span className="inline-block rounded-md bg-spark/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-spark">
                                {hoveredNode.type || "Topic"}
                              </span>
                              <h5 className="font-semibold text-foreground text-sm mt-1">
                                {hoveredNode.label}
                              </h5>
                            </div>
                            {hoveredNode.source && (
                              <a
                                href={hoveredNode.source}
                                target="_blank"
                                rel="noreferrer"
                                className="shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold text-spark hover:underline bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 transition"
                              >
                                <span>Learn More</span>
                                <Icons.ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                          <p className="mt-2 text-muted-foreground leading-relaxed text-[11px]">
                            {hoveredNode.info || "No details provided."}
                          </p>
                        </div>
                      ) : (
                        <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/5 bg-black/60 p-3 text-center text-[10px] text-muted-foreground backdrop-blur-sm pointer-events-none select-none">
                          💡 Hover over any node to view detailed descriptions and learning sources.
                        </div>
                      )}
                    </div>
                  );
                })()
              )}
            </div>
          )}

          {/* INTERVIEW PREP TAB */}
          {activeTab === "interview" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-spark mb-1">
                  Interview Readiness Cockpit
                </h4>
                <p className="text-[11px] text-muted-foreground font-sans">
                  Common interview questions for {node.title}. Click any question to reveal a comprehensive answer.
                </p>
              </div>

              <div className="space-y-2">
                {(() => {
                  const key = matchKey(node.title) || matchKey(domainSlug) || matchKey(node.id);
                  const questions = getFallbackInterviewQuestions(node.title, key);
                  
                  return questions.map((q, idx) => {
                    const isExpanded = expandedQuestionIdx === idx;
                    return (
                      <div
                        key={idx}
                        className="rounded-2xl border border-white/5 bg-card/45 overflow-hidden transition-all"
                      >
                        <button
                          onClick={() => setExpandedQuestionIdx(isExpanded ? null : idx)}
                          className="flex w-full items-center justify-between p-4 text-left text-xs font-semibold text-foreground hover:bg-white/5"
                        >
                          <span>{idx + 1}. {q.question}</span>
                          <Icons.ChevronDown
                            className={`h-4 w-4 text-muted-foreground transition ${
                              isExpanded ? "rotate-180 text-foreground" : ""
                            }`}
                          />
                        </button>
                        {isExpanded && (
                          <div className="border-t border-white/5 bg-white/2 p-4 text-xs text-muted-foreground leading-relaxed">
                            <p>{q.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}

          {/* PERSONAL NOTES TAB */}
          {activeTab === "notes" && (
            <div className="flex flex-col h-[400px]">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setNotesMode("edit")}
                    className={`rounded-lg px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition ${
                      notesMode === "edit" ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setNotesMode("preview")}
                    className={`rounded-lg px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition ${
                      notesMode === "preview" ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Preview
                  </button>
                </div>
                <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                  {notesSaved ? (
                    <>
                      <Icons.Check className="h-3 w-3 text-emerald-400" />
                      <span>All notes saved</span>
                    </>
                  ) : (
                    <>
                      <Icons.Loader2 className="h-3 w-3 animate-spin text-spark" />
                      <span>Saving drafts...</span>
                    </>
                  )}
                </div>
              </div>

              {notesMode === "edit" ? (
                <textarea
                  value={notesContent}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  placeholder={`Write your markdown notes about ${node.title} here...`}
                  className="flex-1 w-full rounded-2xl border border-white/5 bg-black/45 p-4 text-xs text-foreground outline-none focus:border-white/10 font-mono placeholder:text-muted-foreground"
                />
              ) : (
                <div className="flex-1 w-full rounded-2xl border border-white/5 bg-black/45 p-4 overflow-y-auto text-xs text-muted-foreground leading-relaxed prose prose-invert" data-lenis-prevent>
                  {notesContent.trim() ? (
                    <Markdown>{notesContent}</Markdown>
                  ) : (
                    <p className="text-center italic py-10">No notes written yet. Switch to Edit to write your first note!</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* AI MENTOR TAB */}
          {activeTab === "mentor" && (
            <div className="flex h-[420px] flex-col overflow-hidden rounded-2xl border border-white/5 bg-white/2">
              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4" data-lenis-prevent>
                {messages
                  .filter((m) => m.role !== "system")
                  .map((message) => {
                    const isUser = message.role === "user";
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                            isUser
                              ? "bg-gradient-spark text-primary-foreground"
                              : "bg-white/5 border border-white/5 text-muted-foreground"
                          }`}
                        >
                          <Markdown>{getMessageText(message)}</Markdown>
                        </div>
                      </div>
                    );
                  })}
                {isStreaming && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl bg-white/5 border border-white/5 px-4 py-2.5 text-xs text-muted-foreground">
                      <Icons.Loader2 className="h-3.5 w-3.5 animate-spin text-spark" />
                    </div>
                  </div>
                )}
              </div>

              {/* Suggestions Cards (if no user messages sent yet) */}
              {messages.filter((m) => m.role !== "system").length === 0 && (
                <div className="px-4 pb-2">
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      {
                        l: "Explain Simply",
                        q: `Explain the core concepts of "${node.title}" simply like I'm a beginner.`,
                      },
                      {
                        l: "Code Examples",
                        q: `Show me some real-world code examples using "${node.title}".`,
                      },
                      {
                        l: "Interview Qs",
                        q: `Give me 3 common interview questions on "${node.title}".`,
                      },
                    ].map((card) => (
                      <button
                        key={card.l}
                        onClick={() => handleQuickPrompt(card.q)}
                        className="rounded-full border border-white/5 bg-white/5 px-2.5 py-1 text-[10px] text-muted-foreground hover:bg-white/10 hover:text-foreground transition"
                      >
                        {card.l}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Input */}
              <form
                onSubmit={handleChatSubmit}
                className="flex border-t border-white/5 p-2 bg-background/50"
              >
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={`Ask AI Mentor about ${node.title}...`}
                  className="flex-1 bg-transparent px-3 text-xs text-foreground outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="submit"
                  disabled={isStreaming || !chatInput.trim()}
                  className="rounded-lg bg-gradient-spark p-2 text-primary-foreground shadow-glow disabled:opacity-50"
                >
                  <Icons.Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          )}

          {/* PROJECTS TAB */}
          {activeTab === "projects" && (
            <div className="space-y-4">
              {node.projects.length > 0 ? (
                node.projects.map((project) => (
                  <div
                    key={project.title}
                    className="group rounded-2xl border border-white/5 bg-card/45 p-4 transition duration-300 hover:border-white/10"
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-semibold text-foreground group-hover:text-spark transition">
                        {project.title}
                      </h4>
                      <span
                        className={`rounded-lg px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider ${
                          project.difficulty === "easy"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : project.difficulty === "medium"
                              ? "bg-blue-500/10 text-blue-400"
                              : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {project.difficulty}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                      {project.brief}
                    </p>
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() =>
                          navigate({ to: "/builder", search: { seed: project.title } })
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 border border-white/5 px-3 py-1.5 text-[10px] text-foreground hover:bg-white/10 transition"
                      >
                        <Icons.Code2 className="h-3.5 w-3.5 text-spark" />
                        <span>Build with AI</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-muted-foreground py-10">
                  No projects specified.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
