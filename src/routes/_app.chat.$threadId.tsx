import { createFileRoute, useParams } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Send, Loader2, Sparkles, User as UserIcon, Square } from "lucide-react";
import { Markdown } from "@/components/Markdown";
import { unlockAchievement } from "@/lib/gamification";
import { MentorHologram } from "@/components/MentorHologram";

export const Route = createFileRoute("/_app/chat/$threadId")({
  component: ChatThreadPage,
});

type DBMessage = { id: string; role: string; parts: unknown };

function ChatThreadPage() {
  const { threadId } = useParams({ from: "/_app/chat/$threadId" });
  const [initial, setInitial] = useState<UIMessage[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    setInitial(null);
    (async () => {
      const { data } = await supabase
        .from("chat_messages")
        .select("id, role, parts, created_at")
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true });
      if (cancelled) return;
      const msgs: UIMessage[] = ((data ?? []) as DBMessage[]).map((m) => ({
        id: m.id,
        role: m.role as UIMessage["role"],
        parts: (Array.isArray(m.parts) ? m.parts : []) as UIMessage["parts"],
      }));
      setInitial(msgs);
    })();
    return () => {
      cancelled = true;
    };
  }, [threadId]);

  if (initial === null) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-spark" />
      </div>
    );
  }
  return <ChatWindow key={threadId} threadId={threadId} initialMessages={initial} />;
}

function ChatWindow({
  threadId,
  initialMessages,
}: {
  threadId: string;
  initialMessages: UIMessage[];
}) {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const cancelSavedRef = useRef(false);

  const { messages, sendMessage, status, stop } = useChat({
    id: threadId,
    messages: initialMessages,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onFinish: async ({ message }) => {
      if (!user || !message) return;
      const text = getMessageText(message);
      const parts = [{ type: "text", text }];
      await supabase.from("chat_messages").insert({
        id: crypto.randomUUID(),
        thread_id: threadId,
        user_id: user.id,
        role: message.role,
        parts: parts as unknown as never,
      });
      await supabase
        .from("chat_threads")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", threadId);
    },
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const isStreaming = status === "submitted" || status === "streaming";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || !user || isStreaming) return;
    setInput("");
    const userMsgId = crypto.randomUUID();
    await supabase.from("chat_messages").insert({
      id: userMsgId,
      thread_id: threadId,
      user_id: user.id,
      role: "user",
      parts: [{ type: "text", text }] as unknown as never,
    });
    if (messages.length === 0) {
      const title = text.length > 50 ? text.slice(0, 50) + "…" : text;
      await supabase.from("chat_threads").update({ title }).eq("id", threadId);
      await unlockAchievement({
        code: "first-chat",
        title: "Curious Mind",
        description: "Initiate a chat discussion with AI.",
        icon: "MessageSquare",
        xp: 50,
      });
    }
    sendMessage({ id: userMsgId, role: "user", parts: [{ type: "text", text }] });
  };

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-8 sm:px-8" data-lenis-prevent>
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground"
            >
              <MentorHologram isTyping={isStreaming} />
              <p className="text-sm mt-4">Ask anything — ideas, code, architecture, learning paths.</p>
            </motion.div>
          )}
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <Bubble key={m.id} m={m} />
            ))}
          </AnimatePresence>
          {isStreaming && messages[messages.length - 1]?.role === "user" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <Avatar role="assistant" />
              <div className="rounded-2xl border border-border bg-card/60 px-4 py-3">
                <div className="flex gap-1">
                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-spark"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-spark"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-spark"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className="border-t border-border bg-background/80 px-3 pt-3 backdrop-blur sm:px-8"
        style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-border bg-card/60 p-2 transition focus-within:border-spark/60 focus-within:shadow-glow">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit(e);
              }
            }}
            rows={1}
            placeholder="Message ProjectSpark AI…"
            className="flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          {isStreaming ? (
            <button
              type="button"
              onClick={() => stop()}
              className="grid h-9 w-9 place-items-center rounded-xl bg-destructive text-destructive-foreground shadow-glow transition hover:scale-105"
              aria-label="Stop generating"
            >
              <Square className="h-3.5 w-3.5 fill-current" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-spark text-primary-foreground shadow-glow transition hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          )}
        </div>
        <p className="mx-auto mt-2 max-w-3xl text-center text-[10.5px] text-muted-foreground">
          {isStreaming
            ? "Press the stop button to cancel anytime."
            : "ProjectSpark AI can make mistakes. Verify critical info."}
        </p>
      </form>
    </div>
  );
}

function Avatar({ role }: { role: string }) {
  const isUser = role === "user";
  return (
    <div
      className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${isUser ? "bg-card border border-border" : "bg-gradient-spark text-primary-foreground shadow-glow"}`}
    >
      {isUser ? <UserIcon className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
    </div>
  );
}

function getMessageText(m: any): string {
  if (m.content) return m.content;
  if (Array.isArray(m.parts)) {
    return m.parts
      .filter((p: any) => p && p.type === "text")
      .map((p: any) => p.text)
      .join("\n\n");
  }
  return "";
}

function Bubble({ m }: { m: UIMessage }) {
  const isUser = m.role === "user";
  const text = getMessageText(m);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <Avatar role={m.role} />
      <div
        className={`max-w-[85%] rounded-2xl border px-4 py-3 text-sm leading-relaxed ${isUser ? "border-spark/30 bg-spark/10" : "border-border bg-card/60"}`}
      >
        {isUser ? <p className="whitespace-pre-wrap">{text}</p> : <Markdown>{text}</Markdown>}
      </div>
    </motion.div>
  );
}
