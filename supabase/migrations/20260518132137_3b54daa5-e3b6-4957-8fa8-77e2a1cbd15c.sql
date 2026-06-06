
-- RESUMES TABLE
CREATE TABLE public.resumes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Resume',
  target_role TEXT NOT NULL DEFAULT '',
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  ats_score NUMERIC NOT NULL DEFAULT 0,
  ats_report JSONB NOT NULL DEFAULT '{}'::jsonb,
  template TEXT NOT NULL DEFAULT 'glass',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "resumes own all" ON public.resumes FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ACHIEVEMENTS TABLE
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT 'trophy',
  xp_awarded INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, code)
);
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "achievements select own" ON public.achievements FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "achievements insert own" ON public.achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- XP + STREAK RPC
CREATE OR REPLACE FUNCTION public.award_xp_and_streak(amount INTEGER, reason TEXT DEFAULT '')
RETURNS TABLE (new_xp INTEGER, new_streak INTEGER, new_level INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid UUID := auth.uid();
  today DATE := (now() AT TIME ZONE 'UTC')::date;
  last_day DATE;
  current_streak INTEGER;
  total_xp INTEGER;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  SELECT MAX(day) INTO last_day FROM public.daily_progress WHERE user_id = uid;

  INSERT INTO public.daily_progress (user_id, day, xp_earned, notes)
  VALUES (uid, today, amount, reason)
  ON CONFLICT DO NOTHING;

  UPDATE public.daily_progress
     SET xp_earned = xp_earned + amount,
         notes = COALESCE(NULLIF(notes, ''), reason)
   WHERE user_id = uid AND day = today;

  IF last_day IS NULL OR last_day < today - INTERVAL '1 day' THEN
    current_streak := 1;
  ELSIF last_day = today THEN
    SELECT streak_days INTO current_streak FROM public.profiles WHERE id = uid;
    current_streak := COALESCE(current_streak, 1);
  ELSE
    SELECT streak_days INTO current_streak FROM public.profiles WHERE id = uid;
    current_streak := COALESCE(current_streak, 0) + 1;
  END IF;

  UPDATE public.profiles
     SET xp = xp + amount,
         streak_days = current_streak,
         updated_at = now()
   WHERE id = uid
   RETURNING xp INTO total_xp;

  RETURN QUERY SELECT total_xp, current_streak, GREATEST(1, (total_xp / 500) + 1);
END;
$$;

-- Auto-update updated_at on resumes
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER resumes_touch_updated_at BEFORE UPDATE ON public.resumes
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
