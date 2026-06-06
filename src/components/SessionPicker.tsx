import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { History, Loader2 } from "lucide-react";

type Row = { id: string; label: string; meta?: string; created_at: string };

type Props<T> = {
  table:
    | "roadmaps"
    | "study_guides"
    | "mentor_sessions"
    | "mentor_plans"
    | "build_blueprints"
    | "projects"
    | "resumes";
  select: string;
  toRow: (r: T) => Omit<Row, "created_at"> & { created_at?: string };
  onPick: (row: T) => void;
  label?: string;
};

export function SessionPicker<T extends { id: string; created_at: string }>({
  table,
  select,
  toRow,
  onPick,
  label = "Resume previous",
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || rows !== null) return;
    setLoading(true);
    supabase
      .from(table)
      .select(select)
      .order("created_at", { ascending: false })
      .limit(12)
      .then(({ data, error }) => {
        if (error) console.error("[SessionPicker]", error);
        setRows((data ?? []) as unknown as T[]);
        setLoading(false);
      });
  }, [open, rows, table, select]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/60 px-3 py-1.5 text-xs hover:bg-card transition"
      >
        <History className="h-3.5 w-3.5" />
        {label}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-80 overflow-hidden rounded-xl border border-border glass-panel">
          <div className="border-b border-border px-3 py-2 text-[10px] uppercase tracking-widest text-muted-foreground">
            Recent sessions
          </div>
          <div className="max-h-80 overflow-y-auto" data-lenis-prevent>
            {loading && (
              <div className="flex items-center justify-center py-6 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
            {!loading && rows && rows.length === 0 && (
              <div className="px-3 py-6 text-center text-xs text-muted-foreground">
                No saved sessions yet.
              </div>
            )}
            {!loading &&
              rows?.map((r) => {
                const row = toRow(r);
                return (
                  <button
                    key={r.id}
                    onClick={() => {
                      onPick(r);
                      setOpen(false);
                    }}
                    className="block w-full border-b border-border/60 px-3 py-2.5 text-left text-sm last:border-b-0 hover:bg-white/5 transition"
                  >
                    <div className="truncate font-medium">{row.label}</div>
                    {row.meta && (
                      <div className="mt-0.5 truncate text-[11px] text-muted-foreground">
                        {row.meta}
                      </div>
                    )}
                    <div className="mt-0.5 text-[10px] text-muted-foreground">
                      {new Date(r.created_at).toLocaleString()}
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
