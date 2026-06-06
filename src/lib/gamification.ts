import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type XPReward = {
  newXp: number;
  newStreak: number;
  newLevel: number;
};

/**
 * Awards XP to the current user, updates their streak, and shows an animated toast.
 * Safe to call from anywhere on the client.
 */
export async function awardXP(amount: number, reason: string): Promise<XPReward | null> {
  try {
    const { data, error } = await supabase.rpc("award_xp_and_streak", {
      amount,
      reason,
    });
    if (error || !data || !Array.isArray(data) || data.length === 0) {
      console.error("[xp] award failed", error);
      return null;
    }
    const row = data[0] as { new_xp: number; new_streak: number; new_level: number };
    const reward: XPReward = {
      newXp: row.new_xp,
      newStreak: row.new_streak,
      newLevel: row.new_level,
    };
    toast.success(`+${amount} XP — ${reason}`, {
      description: `🔥 ${reward.newStreak}-day streak · Level ${reward.newLevel} · ${reward.newXp} XP`,
      duration: 3500,
    });
    return reward;
  } catch (e) {
    console.error("[xp]", e);
    return null;
  }
}

/**
 * Unlocks an achievement (idempotent thanks to UNIQUE constraint).
 */
export async function unlockAchievement(opts: {
  code: string;
  title: string;
  description?: string;
  icon?: string;
  xp?: number;
}) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return;
  const xp = opts.xp ?? 50;
  const { error } = await supabase.from("achievements").insert({
    user_id: u.user.id,
    code: opts.code,
    title: opts.title,
    description: opts.description ?? "",
    icon: opts.icon ?? "trophy",
    xp_awarded: xp,
  });
  // Ignore unique-violation (already unlocked)
  if (error && !error.message.includes("duplicate")) {
    console.error("[achievement]", error);
    return;
  }
  if (!error) {
    await awardXP(xp, `Achievement: ${opts.title}`);
  }
}

export const XP = {
  SAVE_ROADMAP: 50,
  SAVE_STUDY: 50,
  SAVE_BLUEPRINT: 75,
  SAVE_MENTOR: 40,
  SAVE_PROJECT: 60,
  SAVE_RESUME: 80,
  RUN_ATS: 30,
  CHAT_MESSAGE: 5,
} as const;
