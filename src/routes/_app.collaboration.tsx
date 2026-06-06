import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell, PageHeader } from "@/components/PageHeader";
import { HolographicPanel } from "@/components/HolographicPanel";
import * as Icons from "lucide-react";
import { playClick, playSuccess, playHover } from "@/lib/sounds";
import { awardXP } from "@/lib/gamification";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/collaboration")({
  head: () => ({ meta: [{ title: "Collaboration Hub — ProjectSpark" }] }),
  component: CollaborationHub,
});

type KanbanTask = {
  id: string;
  title: string;
  assignee: string;
  stage: "Todo" | "InProgress" | "Review" | "Done";
  priority: "Low" | "Medium" | "High";
};

type ChatMessage = {
  id: string;
  sender: string;
  role: string;
  content: string;
  timestamp: string;
};

type ContributionItem = {
  id: string;
  type: "Commit" | "Task" | "Research" | "Documentation" | "Design";
  detail: string;
  date: string;
  xpGained: number;
};

const INITIAL_TASKS: KanbanTask[] = [
  { id: "task-1", title: "Train vision transformer model backbone", assignee: "ML Engineer", stage: "InProgress", priority: "High" },
  { id: "task-2", title: "Design Figma mockups for clinical dashboard", assignee: "UI Designer", stage: "Review", priority: "Medium" },
  { id: "task-3", title: "Configure Docker environment and compose files", assignee: "You (Backend Dev)", stage: "Todo", priority: "High" },
  { id: "task-4", title: "Set up Supabase authentication hooks", assignee: "You (Backend Dev)", stage: "Done", priority: "Medium" }
];

const INITIAL_CHAT: ChatMessage[] = [
  { id: "msg-1", sender: "arun_singh", role: "ML Engineer", content: "Vision model validation accuracy hit 92.4%! Pushing checkpoint now.", timestamp: "10:14 AM" },
  { id: "msg-2", sender: "lisa_m", role: "UI Designer", content: "Awesome! I'll update the Figma frames to reflect diagnostics analytics.", timestamp: "10:18 AM" }
];

const INITIAL_CONTRIBUTIONS: ContributionItem[] = [
  { id: "c-1", type: "Commit", detail: "Feat: implement token validation middleware", date: "June 2", xpGained: 50 },
  { id: "c-2", type: "Documentation", detail: "Doc: update API response schema markdown", date: "June 2", xpGained: 30 },
  { id: "c-3", type: "Design", detail: "Design: layout skeleton wireframes", date: "June 1", xpGained: 40 }
];

export function CollaborationHub() {
  const [activeTab, setActiveTab] = useState<"kanban" | "chat" | "notes" | "tracking">("kanban");
  
  // Kanban board state
  const [tasks, setTasks] = useState<KanbanTask[]>(INITIAL_TASKS);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskAssignee, setNewTaskAssignee] = useState("You (Backend Dev)");
  const [newTaskPriority, setNewTaskPriority] = useState<KanbanTask["priority"]>("Medium");
  
  // Team chat state
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT);
  const [chatInput, setChatInput] = useState("");

  // Meeting notes state
  const [notesText, setNotesText] = useState(
    `# Project Spark Diagnostics Sync notes\n\n**Date:** ${new Date().toLocaleDateString()}\n**Attendees:** You, arun_singh, lisa_m\n\n## Action Items\n- [ ] Configure local Docker development environments.\n- [ ] Complete clinical metrics UI mocks.\n- [ ] Optimize transformer learning rates.`
  );

  // Contribution tracking state
  const [contributions, setContributions] = useState<ContributionItem[]>(INITIAL_CONTRIBUTIONS);
  const [contrScore, setContrScore] = useState(120);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    playSuccess();
    const newTask: KanbanTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      assignee: newTaskAssignee,
      stage: "Todo",
      priority: newTaskPriority
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
    toast.success("Task added to Kanban Board!");
    awardXP(10, "Added collaboration task");
  };

  const shiftTaskStage = (taskId: string, nextStage: KanbanTask["stage"]) => {
    playClick();
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        if (nextStage === "Done" && t.stage !== "Done") {
          awardXP(30, `Completed task: ${t.title}`);
          // Record contribution
          const newContr: ContributionItem = {
            id: `c-${Date.now()}`,
            type: "Task",
            detail: `Task: ${t.title}`,
            date: "Today",
            xpGained: 30
          };
          setContributions(c => [newContr, ...c]);
          setContrScore(score => score + 30);
          toast.success("Task completed! Contribution recorded.");
        }
        return { ...t, stage: nextStage };
      }
      return t;
    }));
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    playClick();
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "you",
      role: "Growth Builder",
      content: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, userMsg]);
    setChatInput("");

    // Teammate auto-reply
    setTimeout(() => {
      playSuccess();
      const replies = [
        "Good call! I will sync my code and test it locally.",
        "Perfect, let's discuss this in tomorrow's standup sync.",
        "Already on it. Pushing design components shortly."
      ];
      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "arun_singh",
        role: "ML Engineer",
        content: replies[Math.floor(Math.random() * replies.length)],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1200);
  };

  const addManualContribution = (type: ContributionItem["type"]) => {
    playSuccess();
    let detail = "";
    let xp = 0;
    if (type === "Commit") {
      detail = `Commit: Feat: optimize cache index pipelines`;
      xp = 40;
    } else if (type === "Research") {
      detail = `Research: Audited Vision Transformers scalability paper`;
      xp = 50;
    } else if (type === "Documentation") {
      detail = `Doc: drafted project setup guides`;
      xp = 25;
    } else if (type === "Design") {
      detail = `Design: optimized theme palette structures`;
      xp = 35;
    }

    const newContr: ContributionItem = {
      id: `c-${Date.now()}`,
      type,
      detail,
      date: "Today",
      xpGained: xp
    };
    setContributions(prev => [newContr, ...prev]);
    setContrScore(prev => prev + xp);
    awardXP(xp, `Contribution: ${type}`);
    toast.success(`Contribution recorded: +${xp} Score`);
  };

  return (
    <PageShell>
      <PageHeader
        icon={Icons.Users}
        title="Team Collaboration Hub"
        description="Task allocation pipelines, file share channels, multi-user chat sync, meeting logs, and contribution analytics."
      />

      <div className="flex border-b border-white/5 mb-6 text-xs font-semibold overflow-x-auto">
        {(["kanban", "chat", "notes", "tracking"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => { playClick(); setActiveTab(tab); }}
            className={`px-6 py-2.5 capitalize transition ${activeTab === tab ? "border-b-2 border-spark text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {tab === "kanban" ? "Kanban Board" : tab === "tracking" ? "Contribution Tracking" : tab === "notes" ? "Sync Notes" : "Team Chat"}
          </button>
        ))}
      </div>

      <div className="grid gap-6">
        
        {/* KANBAN BOARD TAB */}
        {activeTab === "kanban" && (
          <div className="space-y-6">
            {/* Form to add task */}
            <HolographicPanel className="p-4">
              <form onSubmit={handleAddTask} className="flex flex-wrap items-end gap-3 text-xs">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Task Title</label>
                  <input
                    value={newTaskTitle}
                    onChange={e => setNewTaskTitle(e.target.value)}
                    placeholder="Enter task item detail..."
                    className="w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-spark"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Assignee</label>
                  <select
                    value={newTaskAssignee}
                    onChange={e => setNewTaskAssignee(e.target.value)}
                    className="rounded-lg border border-white/10 bg-card px-2 py-2 text-xs text-foreground outline-none focus:border-spark"
                  >
                    <option>You (Backend Dev)</option>
                    <option>ML Engineer</option>
                    <option>UI Designer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={e => setNewTaskPriority(e.target.value as any)}
                    className="rounded-lg border border-white/10 bg-card px-2 py-2 text-xs text-foreground outline-none focus:border-spark"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-spark px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:opacity-95 transition"
                >
                  Create Task
                </button>
              </form>
            </HolographicPanel>

            {/* Kanban Columns */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(["Todo", "InProgress", "Review", "Done"] as const).map(stage => {
                const stageTasks = tasks.filter(t => t.stage === stage);
                const headerColors = {
                  Todo: "text-muted-foreground",
                  InProgress: "text-blue-400",
                  Review: "text-amber-400",
                  Done: "text-emerald-400"
                };
                return (
                  <HolographicPanel key={stage} className="p-4 flex flex-col h-[calc(100vh-210px)]">
                    <div className={`text-xs font-bold uppercase tracking-wider flex justify-between items-center mb-4 ${headerColors[stage]}`}>
                      <span>{stage === "InProgress" ? "In Progress" : stage}</span>
                      <span className="font-mono text-[10px] bg-white/5 px-2 py-0.5 rounded-full">{stageTasks.length}</span>
                    </div>

                    <div className="space-y-3 flex-1 overflow-y-auto" data-lenis-prevent>
                      {stageTasks.map(task => (
                        <div key={task.id} className="rounded-xl border border-white/5 bg-white/2 p-3.5 space-y-3 flex flex-col justify-between transition hover:border-white/10">
                          <div>
                            <div className="flex justify-between items-start">
                              <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded border ${task.priority === "High" ? "bg-red-500/10 border-red-500/20 text-red-400" : task.priority === "Medium" ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-blue-500/10 border-blue-500/20 text-blue-400"}`}>
                                {task.priority}
                              </span>
                              <span className="text-[9px] text-muted-foreground">@{task.assignee.split(" ")[0]}</span>
                            </div>
                            <p className="text-xs text-foreground font-semibold mt-2.5 leading-snug">{task.title}</p>
                          </div>

                          <div className="flex gap-1 pt-2 border-t border-white/5 text-[9px] uppercase tracking-wider font-semibold">
                            {stage !== "Todo" && (
                              <button onClick={() => shiftTaskStage(task.id, stage === "InProgress" ? "Todo" : stage === "Review" ? "InProgress" : "Review")} className="text-muted-foreground hover:text-foreground">← Back</button>
                            )}
                            <div className="flex-1" />
                            {stage !== "Done" && (
                              <button onClick={() => shiftTaskStage(task.id, stage === "Todo" ? "InProgress" : stage === "InProgress" ? "Review" : "Done")} className="text-spark hover:text-spark-glow">Next →</button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </HolographicPanel>
                );
              })}
            </div>
          </div>
        )}

        {/* TEAM CHAT TAB */}
        {activeTab === "chat" && (
          <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
            {/* Sidebar Channels */}
            <HolographicPanel className="p-4 space-y-3 h-[calc(100vh-130px)]">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Sync channels</div>
              <div className="space-y-1">
                <button className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold bg-spark/10 text-spark flex items-center gap-1.5">
                  <Icons.Hash className="h-3.5 w-3.5" /> general-sync
                </button>
                <button className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:bg-white/5 hover:text-foreground flex items-center gap-1.5 transition">
                  <Icons.Hash className="h-3.5 w-3.5" /> code-blueprints
                </button>
                <button className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:bg-white/5 hover:text-foreground flex items-center gap-1.5 transition">
                  <Icons.Hash className="h-3.5 w-3.5" /> clinical-design
                </button>
              </div>
            </HolographicPanel>

            {/* Chat Frame */}
            <HolographicPanel className="p-5 flex flex-col h-[calc(100vh-130px)]">
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4" data-lenis-prevent>
                {messages.map(msg => {
                  const isYou = msg.sender === "you";
                  return (
                    <div key={msg.id} className={`flex gap-3 text-xs ${isYou ? "justify-end" : "justify-start"}`}>
                      {!isYou && (
                        <div className="h-8 w-8 rounded-full bg-gradient-spark flex items-center justify-center font-bold text-primary-foreground self-start shrink-0">
                          {msg.sender[0].toUpperCase()}
                        </div>
                      )}
                      <div className={`max-w-[70%] rounded-2xl p-3 border ${isYou ? "bg-spark/10 border-spark/20 rounded-tr-none text-foreground" : "bg-card border-white/5 rounded-tl-none text-muted-foreground"}`}>
                        <div className="flex items-baseline justify-between gap-4 mb-1">
                          <span className="font-bold text-foreground">{isYou ? "You" : `@${msg.sender}`}</span>
                          <span className="text-[8px] text-muted-foreground font-mono">{msg.timestamp}</span>
                        </div>
                        <p className="leading-relaxed">{msg.content}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleSendChat} className="flex gap-2">
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Sync with team members..."
                  className="flex-1 rounded-xl border border-white/10 bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-spark"
                />
                <button type="submit" className="rounded-xl bg-gradient-spark px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow hover:opacity-95 transition">
                  Send
                </button>
              </form>
            </HolographicPanel>
          </div>
        )}

        {/* SYNC NOTES TAB */}
        {activeTab === "notes" && (
          <HolographicPanel className="p-5 space-y-4 h-[calc(100vh-130px)] flex flex-col justify-between" innerClassName="flex flex-col h-full gap-3">
            <div className="flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <Icons.FileEdit className="h-4 w-4 text-spark" />
                <h3 className="font-display text-sm font-bold text-foreground">Sync Meeting Notes Canvas</h3>
              </div>
              <button onClick={() => { playSuccess(); awardXP(20, "Recorded standup sync notes"); toast.success("Notes saved and synced to team dashboard!"); }} className="px-3.5 py-1.5 rounded-lg bg-gradient-spark text-primary-foreground text-[10px] uppercase tracking-wider font-semibold shadow-glow">
                Save & Broadcast Sync
              </button>
            </div>
            <textarea
              value={notesText}
              onChange={e => setNotesText(e.target.value)}
              className="flex-1 w-full rounded-xl border border-white/10 bg-background/50 p-4 font-mono text-xs leading-relaxed text-foreground outline-none focus:border-spark resize-none"
            />
          </HolographicPanel>
        )}

        {/* CONTRIBUTION TRACKING TAB */}
        {activeTab === "tracking" && (
          <div className="grid gap-6 md:grid-cols-3 h-[calc(100vh-130px)]">
            {/* Score dashboard */}
            <HolographicPanel className="p-5 flex flex-col justify-between items-center text-center h-full">
              <div>
                <Icons.Trophy className="h-10 w-10 text-spark mx-auto mb-3 animate-bounce" />
                <h3 className="font-display text-sm font-bold text-foreground">Team Contribution Score</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Growth Tier: Tier-A Builder</p>
              </div>

              <div className="my-6">
                <span className="text-4xl font-bold font-display text-foreground">{contrScore}</span>
                <span className="text-xs text-muted-foreground font-mono block mt-1">Total score points recorded</span>
              </div>

              <div className="w-full space-y-1">
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Progress to Tier-S</span>
                  <span>{contrScore} / 300</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-spark" style={{ width: `${Math.min(100, (contrScore/300)*100)}%` }} />
                </div>
              </div>
            </HolographicPanel>

            {/* Quick Commit Logger */}
            <HolographicPanel className="p-5 space-y-4 md:col-span-2 h-full flex flex-col justify-between" innerClassName="flex flex-col h-full">
              <h3 className="font-display text-sm font-bold text-foreground">Record Team Contribution Logs</h3>
              <p className="text-xs text-muted-foreground">Record a mock activity to update your contribution score and feed logs.</p>
              
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                <button onClick={() => addManualContribution("Commit")} className="py-2.5 rounded-xl border border-white/5 bg-white/2 hover:border-spark/50 flex items-center justify-center gap-1.5 transition">
                  <Icons.GitCommit className="h-4 w-4 text-purple-400" />
                  <span>Push Git Commit</span>
                </button>
                <button onClick={() => addManualContribution("Design")} className="py-2.5 rounded-xl border border-white/5 bg-white/2 hover:border-spark/50 flex items-center justify-center gap-1.5 transition">
                  <Icons.Palette className="h-4 w-4 text-emerald-400" />
                  <span>Submit Figma Mock</span>
                </button>
                <button onClick={() => addManualContribution("Research")} className="py-2.5 rounded-xl border border-white/5 bg-white/2 hover:border-spark/50 flex items-center justify-center gap-1.5 transition">
                  <Icons.BookOpen className="h-4 w-4 text-blue-400" />
                  <span>Log Research Audit</span>
                </button>
                <button onClick={() => addManualContribution("Documentation")} className="py-2.5 rounded-xl border border-white/5 bg-white/2 hover:border-spark/50 flex items-center justify-center gap-1.5 transition">
                  <Icons.FileText className="h-4 w-4 text-amber-400" />
                  <span>Log Dev API Docs</span>
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-white/5 flex-1 flex flex-col min-h-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 shrink-0">Contribution history log</div>
                <div className="space-y-2 flex-1 overflow-y-auto pr-1" data-lenis-prevent>
                  {contributions.map(contr => {
                    const icons = {
                      Commit: Icons.GitCommit,
                      Task: Icons.CheckSquare,
                      Research: Icons.Search,
                      Documentation: Icons.FileText,
                      Design: Icons.Palette
                    };
                    const IconC = icons[contr.type] || Icons.Zap;
                    return (
                      <div key={contr.id} className="flex justify-between items-center text-xs p-2 rounded-lg border border-white/5 bg-white/2">
                        <div className="flex items-center gap-2">
                          <IconC className="h-3.5 w-3.5 text-spark" />
                          <span className="text-muted-foreground">{contr.detail}</span>
                        </div>
                        <span className="text-[10px] text-spark font-mono font-bold">+{contr.xpGained} XP</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </HolographicPanel>
          </div>
        )}

      </div>
    </PageShell>
  );
}
