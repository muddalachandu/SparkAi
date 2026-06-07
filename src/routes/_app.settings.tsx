import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, PageHeader } from "@/components/PageHeader";
import { Settings as SettingsIcon, LogOut, Trash2, Moon, Bell, Lock, Loader2, UserMinus } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { deleteCurrentUserAccount } from "@/lib/auth.functions";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — ProjectSpark" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user, signOut } = useAuth();
  const nav = useNavigate();
  const [notify, setNotify] = useState(true);
  const [emails, setEmails] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const onResetPwd = async () => {
    if (!user?.email) return;
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(user.email);
    setBusy(false);
    setMsg(error ? error.message : "Password reset email sent.");
    setTimeout(() => setMsg(null), 3000);
  };

  const onDelete = async () => {
    if (!confirm("Permanently delete all your projects and chats? This cannot be undone.")) return;
    setBusy(true);
    await Promise.all([
      supabase.from("projects").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
      supabase.from("chat_threads").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
      supabase.from("chat_messages").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
      supabase.from("daily_progress").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
    ]);
    setBusy(false);
    setMsg("All data cleared.");
  };

  const onDeleteAccount = async () => {
    if (
      !confirm(
        "Are you absolutely sure you want to delete your account? This will permanently delete your login, profile, and all data. This action is irreversible.",
      )
    )
      return;
    setBusy(true);
    try {
      // Try database RPC first (bypasses SUPABASE_SERVICE_ROLE_KEY environment variable mismatch issues)
      const { error: rpcError } = await supabase.rpc("delete_user_account");
      
      if (rpcError) {
        console.warn("[settings] RPC deletion failed, falling back to server function:", rpcError);
        const res = await deleteCurrentUserAccount();
        if (!res?.success) {
          throw new Error("Failed to delete account via server function");
        }
      }
      
      // Successfully deleted user. Clear session and redirect.
      await signOut();
      nav({ to: "/" });
    } catch (err) {
      console.error("[settings] Deletion error:", err);
      setMsg((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageShell>
      <PageHeader
        icon={SettingsIcon}
        title="Settings"
        description="Account, preferences, and data controls."
      />

      <div className="space-y-4">
        <Section title="Account">
          <Row label="Email" value={user?.email ?? "—"} />
          <button
            onClick={onResetPwd}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-card/60 disabled:opacity-50"
          >
            <Lock className="h-3.5 w-3.5" /> Send password reset
          </button>
        </Section>

        <Section title="Preferences">
          <ThemeToggle />
          <Toggle icon={Bell} label="In-app notifications" checked={notify} onChange={setNotify} />
          <Toggle
            icon={Bell}
            label="Email digest"
            hint="Weekly summary of your progress"
            checked={emails}
            onChange={setEmails}
          />
        </Section>

        <Section title="Danger zone">
          <button
            onClick={() => signOut().then(() => nav({ to: "/" }))}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-card/60"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
          <button
            onClick={onDelete}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-xs text-destructive hover:bg-destructive/20 disabled:opacity-50"
          >
            {busy ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}{" "}
            Erase all my data
          </button>
          <button
            onClick={onDeleteAccount}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-lg border border-destructive bg-destructive/20 px-3 py-1.5 text-xs text-destructive hover:bg-destructive/30 disabled:opacity-50"
          >
            {busy ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <UserMinus className="h-3.5 w-3.5" />
            )}{" "}
            Delete my account
          </button>
        </Section>

        {msg && <p className="text-xs text-spark">{msg}</p>}
      </div>
    </PageShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5">
      <h3 className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {title}
      </h3>
      <div className="flex flex-wrap items-start gap-3">{children}</div>
    </div>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-background/40 px-3 py-2 text-sm flex-1 min-w-[240px]">
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}
function Toggle({
  icon: Icon,
  label,
  hint,
  checked,
  onChange,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  hint?: string;
  checked?: boolean;
  onChange?: (b: boolean) => void;
}) {
  return (
    <label className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-border bg-background/40 px-3 py-2 text-sm">
      <span className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-spark" />
        <span>
          {label}
          {hint && <span className="block text-[10px] text-muted-foreground">{hint}</span>}
        </span>
      </span>
      <input
        type="checkbox"
        checked={!!checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="h-4 w-4 accent-spark"
      />
    </label>
  );
}
