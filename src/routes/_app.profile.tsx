import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { PageShell, PageHeader } from "@/components/PageHeader";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "Profile — ProjectSpark" }] }),
  component: Profile,
});

const ALL_ACHIEVEMENTS = [
  { code: "first-project", title: "First Spark", description: "Generate your first AI project idea.", icon: "Sparkles", xp: 50 },
  { code: "save-roadmap", title: "Curriculum Architect", description: "Design and save a custom career roadmap.", icon: "Compass", xp: 50 },
  { code: "save-study", title: "Focused Learner", description: "Create and save a weekly study guide.", icon: "GraduationCap", xp: 50 },
  { code: "save-blueprint", title: "AI Builder Pro", description: "Generate a production code blueprint.", icon: "Code2", xp: 75 },
  { code: "first-chat", title: "Curious Mind", description: "Initiate a chat discussion with AI.", icon: "MessageSquare", xp: 50 },
  { code: "perfect-quiz", title: "Perfect Score", description: "Answer all mini-quiz questions correctly.", icon: "Brain", xp: 75 }
];

function Profile() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [profileRes, achievementsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
        supabase.from("achievements").select("code").eq("user_id", user.id)
      ]);

      if (profileRes.data) {
        const data = profileRes.data;
        setDisplayName(data.display_name ?? "");
        setBio(data.bio ?? "");
        setAvatarUrl(data.avatar_url ?? "");
        setXp(data.xp ?? 0);
        setStreak(data.streak_days ?? 0);
      }

      if (achievementsRes.data) {
        setUnlocked(achievementsRes.data.map(a => a.code));
      }

      setLoading(false);
    })();
  }, [user]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    setMsg(null);
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        bio,
        avatar_url: avatarUrl,
      })
      .eq("id", user.id);
    setSaving(false);
    setMsg(error ? error.message : "Saved");
    setTimeout(() => setMsg(null), 2000);
  };

  if (loading)
    return (
      <PageShell>
        <Icons.Loader2 className="mx-auto h-6 w-6 animate-spin text-spark" />
      </PageShell>
    );

  const level = Math.floor(xp / 500) + 1;
  const currentLevelXp = xp % 500;
  const percent = Math.round((currentLevelXp / 500) * 100);
  const strokeDash = 2 * Math.PI * 32;
  const strokeOffset = strokeDash * (1 - percent / 100);

  return (
    <PageShell>
      <PageHeader
        icon={Icons.User}
        title="Profile"
        description="How you appear across ProjectSpark."
      />

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card/60 p-6 text-center backdrop-blur">
            <div className="mx-auto grid h-24 w-24 place-items-center overflow-hidden rounded-full bg-gradient-spark text-3xl text-primary-foreground shadow-glow">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                (displayName || user?.email || "U")[0].toUpperCase()
              )}
            </div>
            <div className="mt-4">
              <div className="font-display text-lg font-semibold">{displayName || user?.email?.split("@")[0]}</div>
              <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
            </div>

            {/* Streak & Level Cards */}
            <div className="mt-6 flex flex-col gap-4 border-t border-white/5 pt-6">
              <div className="flex items-center gap-3">
                <div className="relative h-16 w-16 flex items-center justify-center shrink-0">
                  <svg className="h-full w-full -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      className="stroke-white/5"
                      strokeWidth="4"
                      fill="transparent"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      className="stroke-spark"
                      strokeWidth="4"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 26}
                      strokeDashoffset={2 * Math.PI * 26 * (1 - percent / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute font-display text-sm font-bold text-foreground">
                    {level}
                  </span>
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold">Level {level} Builder</div>
                  <div className="text-[10px] text-muted-foreground">{currentLevelXp}/500 XP ({percent}%)</div>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-background/40 p-3">
                <StreakFlame days={streak} />
                <div className="text-left">
                  <div className="text-xs font-semibold">Active Streak</div>
                  <div className="text-[10px] text-muted-foreground">{streak} consecutive days</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur space-y-4">
            <Field label="Display name">
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
              />
            </Field>
            <Field label="Avatar URL">
              <input
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://…"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
              />
            </Field>
            <Field label="Bio">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                placeholder="Tell us what you're building…"
                className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
              />
            </Field>
            <button
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-spark px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-glow disabled:opacity-50"
            >
              {saving ? <Icons.Loader2 className="h-4 w-4 animate-spin" /> : <Icons.Save className="h-4 w-4" />}
              Save changes
            </button>
            {msg && <p className="text-xs text-spark">{msg}</p>}
          </div>

          {/* Profile Achievements Grid */}
          <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur">
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-spark">
              My Achievements
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {ALL_ACHIEVEMENTS.map((a) => {
                const isUnlocked = unlocked.includes(a.code);
                const IconComp = (Icons as any)[a.icon] || Icons.Trophy;

                return (
                  <div
                    key={a.code}
                    className={`flex items-start gap-3.5 rounded-2xl border p-4 transition-all duration-300 ${
                      isUnlocked
                        ? "border-emerald-500/20 bg-emerald-500/5 shadow-[0_0_15px_oklch(0.8_0.16_140_/_0.03)]"
                        : "border-white/5 bg-white/2 opacity-60"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        isUnlocked ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-muted-foreground"
                      }`}
                    >
                      {isUnlocked ? <IconComp className="h-5 w-5" /> : <Icons.Lock className="h-5 w-5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className={`text-sm font-semibold ${isUnlocked ? "text-foreground" : "text-muted-foreground"}`}>
                          {a.title}
                        </h4>
                        <span className={`text-[9px] font-bold uppercase ${isUnlocked ? "text-emerald-400" : "text-muted-foreground"}`}>
                          +{a.xp} XP
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {a.description}
                      </p>
                      {isUnlocked && (
                        <span className="mt-1.5 inline-flex items-center gap-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[8.5px] font-medium text-emerald-400">
                          <Icons.Check className="h-2.5 w-2.5" /> Unlocked
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground font-semibold">
        {label}
      </label>
      {children}
    </div>
  );
}

function StreakFlame({ days }: { days: number }) {
  return (
    <div className="relative flex items-center justify-center">
      <motion.svg
        animate={{
          scale: days > 0 ? [1, 1.08, 1] : 1,
          y: days > 0 ? [0, -3, 0] : 0,
        }}
        transition={{
          repeat: Infinity,
          duration: 1.8,
          ease: "easeInOut",
        }}
        className={`h-10 w-10 text-orange-500 filter drop-shadow-[0_0_8px_rgba(249,115,22,0.6)] ${days > 0 ? "opacity-100" : "opacity-25"}`}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2c-.5 0-.9.2-1.2.6C7.5 7.1 6.5 10 6.5 12.5c0 3 2.5 5.5 5.5 5.5s5.5-2.5 5.5-5.5c0-2.5-1-5.4-4.3-9.9-.3-.4-.7-.6-1.2-.6zm0 2.5c2.3 3.6 2.8 5.7 2.8 7.5 0 1.5-1.3 2.8-2.8 2.8S9.2 13.5 9.2 12c0-1.8.5-3.9 2.8-7.5z" />
        {days > 0 && (
          <path
            d="M12 16.5c-1.38 0-2.5-1.12-2.5-2.5 0-1 .6-2.1 2.5-4 1.9 1.9 2.5 3 2.5 4 0 1.38-1.12 2.5-2.5 2.5z"
            className="text-amber-400"
          />
        )}
      </motion.svg>
      {days > 0 && (
        <span className="absolute text-[10px] font-bold text-white mt-1 select-none font-display">
          {days}
        </span>
      )}
    </div>
  );
}
