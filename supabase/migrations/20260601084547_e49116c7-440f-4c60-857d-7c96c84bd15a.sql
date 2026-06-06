
CREATE TABLE IF NOT EXISTS public.mentor_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  topic TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'Beginner',
  goal TEXT,
  plan JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mentor_plans TO authenticated;
GRANT ALL ON public.mentor_plans TO service_role;
ALTER TABLE public.mentor_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own select" ON public.mentor_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own insert" ON public.mentor_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own update" ON public.mentor_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own delete" ON public.mentor_plans FOR DELETE USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.build_blueprints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  technologies JSONB NOT NULL DEFAULT '[]'::jsonb,
  blueprint JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.build_blueprints TO authenticated;
GRANT ALL ON public.build_blueprints TO service_role;
ALTER TABLE public.build_blueprints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own select" ON public.build_blueprints FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own insert" ON public.build_blueprints FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own update" ON public.build_blueprints FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own delete" ON public.build_blueprints FOR DELETE USING (auth.uid() = user_id);
