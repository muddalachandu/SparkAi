import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { MessageSquare, Sparkles, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_app/chat/")({
  component: ChatEmpty,
});

function ChatEmpty() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const start = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("chat_threads")
      .insert({ user_id: user.id, title: "New chat" })
      .select("id")
      .single();
    setLoading(false);
    if (data) navigate({ to: "/chat/$threadId", params: { threadId: data.id } });
  };
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-10 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-spark text-primary-foreground shadow-glow animate-float">
        <MessageSquare className="h-7 w-7" />
      </div>
      <h2 className="font-display text-2xl font-semibold">ProjectSpark AI</h2>
      <p className="max-w-md text-sm text-muted-foreground">
        Your always-on mentor for ideas, code, learning, and architecture. Start a thread to begin.
      </p>
      <button
        onClick={start}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-spark px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-glow disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        New conversation
      </button>
    </div>
  );
}
