import { createFileRoute, Link, Outlet, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { MessageSquare, Plus, Pin, Trash2, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_app/chat")({
  head: () => ({ meta: [{ title: "AI Chat — ProjectSpark" }] }),
  component: ChatLayout,
});

type Thread = { id: string; title: string; pinned: boolean; updated_at: string };

function ChatLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const params = useParams({ strict: false }) as { threadId?: string };
  const [threads, setThreads] = useState<Thread[] | null>(null);
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("chat_threads")
      .select("id, title, pinned, updated_at")
      .not("title", "like", "Mentor:%")
      .order("pinned", { ascending: false })
      .order("updated_at", { ascending: false });
    setThreads((data ?? []) as Thread[]);
  }, []);
  useEffect(() => {
    if (user) load();
  }, [user, load]);

  const create = async () => {
    if (!user) return;
    setCreating(true);
    const { data, error } = await supabase
      .from("chat_threads")
      .insert({ user_id: user.id, title: "New chat" })
      .select("id")
      .single();
    setCreating(false);
    if (error || !data) return;
    await load();
    navigate({ to: "/chat/$threadId", params: { threadId: data.id } });
  };

  const togglePin = async (t: Thread) => {
    await supabase.from("chat_threads").update({ pinned: !t.pinned }).eq("id", t.id);
    load();
  };
  const remove = async (id: string) => {
    await supabase.from("chat_messages").delete().eq("thread_id", id);
    await supabase.from("chat_threads").delete().eq("id", id);
    if (params.threadId === id) navigate({ to: "/chat" });
    load();
  };

  return (
    <div className="flex h-[calc(100vh-0px)] lg:h-screen">
      <aside className="hidden w-72 shrink-0 flex-col border-r border-border bg-sidebar/40 backdrop-blur md:flex">
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-spark" />
            <h2 className="font-display text-sm font-medium">Conversations</h2>
          </div>
          <button
            onClick={create}
            disabled={creating}
            className="rounded-lg bg-gradient-spark p-1.5 text-primary-foreground shadow-glow disabled:opacity-50"
            aria-label="New chat"
          >
            {creating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-2" data-lenis-prevent>
          {!threads && (
            <div className="space-y-2 p-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded-lg bg-card/40" />
              ))}
            </div>
          )}
          {threads && threads.length === 0 && (
            <p className="px-3 py-6 text-center text-xs text-muted-foreground">No chats yet.</p>
          )}
          {threads?.map((t) => {
            const active = params.threadId === t.id;
            return (
              <div
                key={t.id}
                className={`group flex items-center gap-1 rounded-lg px-1 ${active ? "bg-card/70" : "hover:bg-card/40"}`}
              >
                <Link
                  to="/chat/$threadId"
                  params={{ threadId: t.id }}
                  className="flex-1 truncate px-2 py-2 text-sm"
                >
                  <span className="truncate">{t.title || "Untitled"}</span>
                </Link>
                <button
                  onClick={() => togglePin(t)}
                  className="rounded p-1 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-spark"
                  aria-label="Pin"
                >
                  <Pin
                    className={`h-3 w-3 ${t.pinned ? "fill-spark text-spark opacity-100" : ""}`}
                  />
                </button>
                <button
                  onClick={() => remove(t.id)}
                  className="rounded p-1 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive"
                  aria-label="Delete"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      </aside>

      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
