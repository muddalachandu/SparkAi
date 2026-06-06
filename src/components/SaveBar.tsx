import { useState } from "react";
import { Save, Loader2, Check } from "lucide-react";
import { SessionPicker } from "./SessionPicker";

type Props<T extends { id: string; created_at: string }> = {
  canSave: boolean;
  onSave: () => Promise<void> | void;
  pickerTable: Parameters<typeof SessionPicker<T>>[0]["table"];
  pickerSelect: string;
  pickerToRow: Parameters<typeof SessionPicker<T>>[0]["toRow"];
  pickerOnPick: Parameters<typeof SessionPicker<T>>[0]["onPick"];
};

export function SaveBar<T extends { id: string; created_at: string }>(p: Props<T>) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const handle = async () => {
    if (!p.canSave || saving) return;
    setSaving(true);
    try {
      await p.onSave();
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="flex items-center gap-2">
      <SessionPicker<T>
        table={p.pickerTable}
        select={p.pickerSelect}
        toRow={p.pickerToRow}
        onPick={p.pickerOnPick}
      />
      <button
        type="button"
        onClick={handle}
        disabled={!p.canSave || saving}
        className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-spark px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-glow transition hover:scale-[1.03] disabled:opacity-40 disabled:hover:scale-100"
      >
        {saving ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : saved ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <Save className="h-3.5 w-3.5" />
        )}
        {saving ? "Saving…" : saved ? "Saved" : "Save"}
      </button>
    </div>
  );
}
