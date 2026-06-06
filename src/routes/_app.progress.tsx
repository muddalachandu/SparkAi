import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, PageHeader } from "@/components/PageHeader";
import { CalendarCheck, Loader2, Flame, Target, Plus } from "lucide-react";

export const Route = createFileRoute("/_app/progress")({
  head: () => ({ meta: [{ title: "Daily Progress — ProjectSpark" }] }),
  component: ProgressPage,
});

type Entry = { id: string; day: string; minutes: number; xp_earned: number; notes: string | null };

function ProgressPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [minutes, setMinutes] = useState(60);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("daily_progress")
        .select("id, day, minutes, xp_earned, notes")
        .order("day", { ascending: false })
        .limit(60);
      setEntries((data as Entry[]) ?? []);
      setLoading(false);
    })();
  }, [user]);

  const log = async () => {
    if (!user) return;
    setSaving(true);
    const xp = Math.round(minutes / 2);
    const { data, error } = await supabase
      .from("daily_progress")
      .insert({ user_id: user.id, day: today, minutes, xp_earned: xp, notes: notes || null })
      .select("id, day, minutes, xp_earned, notes")
      .single();
    setSaving(false);
    if (!error && data) {
      setEntries((e) => [data as Entry, ...e]);
      setNotes("");
      // bump XP on profile
      await supabase.rpc; // noop to satisfy lint
      const totalXp =
        (await supabase.from("profiles").select("xp").eq("id", user.id).maybeSingle()).data?.xp ??
        0;
      await supabase
        .from("profiles")
        .update({ xp: totalXp + xp })
        .eq("id", user.id);
    }
  };

  // streak calc: consecutive days from today
  const dates = new Set(entries.map((e) => e.day));
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    if (dates.has(d)) streak++;
    else break;
  }
  const totalMinutes = entries.reduce((a, e) => a + e.minutes, 0);
  const totalXp = entries.reduce((a, e) => a + e.xp_earned, 0);

  // 30-day heatmap
  const heat = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(Date.now() - (29 - i) * 86400000).toISOString().slice(0, 10);
    const e = entries.find((x) => x.day === d);
    return { d, mins: e?.minutes ?? 0 };
  });

  return (
    <PageShell>
      <PageHeader
        icon={CalendarCheck}
        title="Daily Progress"
        description="Log focused minutes, earn XP, and keep the streak alive."
      />

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="space-y-4 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur">
          <div className="grid grid-cols-3 gap-2">
            <Mini label="Streak" value={`${streak}d`} icon={Flame} />
            <Mini label="Total XP" value={totalXp} icon={Target} />
            <Mini label="Hours" value={`${(totalMinutes / 60).toFixed(1)}h`} icon={CalendarCheck} />
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
              Minutes today: {minutes}
            </label>
            <input
              type="range"
              min={5}
              max={240}
              step={5}
              value={minutes}
              onChange={(e) => setMinutes(+e.target.value)}
              className="w-full accent-spark"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="What did you learn?"
              className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <button
            onClick={log}
            disabled={saving}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-spark px-4 py-3 text-sm font-medium text-primary-foreground shadow-glow disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Log today (+{Math.round(minutes / 2)} XP)
          </button>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card/60 p-5">
            <h3 className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Last 30 days
            </h3>
            <div className="flex flex-wrap gap-1">
              {heat.map((h) => {
                const intensity =
                  h.mins === 0 ? 0 : h.mins < 30 ? 1 : h.mins < 60 ? 2 : h.mins < 120 ? 3 : 4;
                const bg = ["bg-muted/40", "bg-spark/20", "bg-spark/40", "bg-spark/60", "bg-spark"][
                  intensity
                ];
                return (
                  <div
                    key={h.d}
                    title={`${h.d}: ${h.mins} min`}
                    className={`h-6 w-6 rounded ${bg}`}
                  />
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 p-5">
            <h3 className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Recent entries
            </h3>
            {loading ? (
              <Loader2 className="mx-auto h-5 w-5 animate-spin text-spark" />
            ) : entries.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No entries yet — log your first session.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {entries.slice(0, 12).map((e) => (
                  <li key={e.id} className="flex items-start justify-between gap-3 py-3 text-sm">
                    <div>
                      <div className="font-medium">
                        {new Date(e.day).toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      {e.notes && (
                        <div className="mt-0.5 text-xs text-muted-foreground">{e.notes}</div>
                      )}
                    </div>
                    <div className="text-right text-xs">
                      <div className="font-mono">{e.minutes} min</div>
                      <div className="text-spark">+{e.xp_earned} XP</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function Mini({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-2 text-center">
      <Icon className="mx-auto h-3.5 w-3.5 text-spark" />
      <div className="mt-1 font-display text-base">{value}</div>
      <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}
