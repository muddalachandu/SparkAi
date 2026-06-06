-- Add additional metadata columns to roadmap_cache and node_progress
ALTER TABLE public.roadmap_cache
  ADD COLUMN IF NOT EXISTS generated_by TEXT,
  ADD COLUMN IF NOT EXISTS model TEXT,
  ADD COLUMN IF NOT EXISTS version TEXT,
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

ALTER TABLE public.node_progress
  ADD COLUMN IF NOT EXISTS hours_spent NUMERIC NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS xp_earned INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS quiz_score INTEGER,
  ADD COLUMN IF NOT EXISTS last_accessed TIMESTAMPTZ NOT NULL DEFAULT now();
