CREATE TABLE public.roadmap_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  domain TEXT NOT NULL,
  tier TEXT NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (domain, tier)
);

GRANT SELECT ON public.roadmap_cache TO anon;
GRANT SELECT, INSERT, UPDATE ON public.roadmap_cache TO authenticated;
GRANT ALL ON public.roadmap_cache TO service_role;

ALTER TABLE public.roadmap_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "roadmap_cache readable by all"
ON public.roadmap_cache FOR SELECT
USING (true);

CREATE POLICY "roadmap_cache writable by authenticated"
ON public.roadmap_cache FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "roadmap_cache updatable by authenticated"
ON public.roadmap_cache FOR UPDATE TO authenticated
USING (true);

CREATE TABLE public.node_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  domain TEXT NOT NULL,
  tier TEXT NOT NULL,
  node_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress',
  hours NUMERIC NOT NULL DEFAULT 0,
  bookmarked BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, domain, tier, node_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.node_progress TO authenticated;
GRANT ALL ON public.node_progress TO service_role;

ALTER TABLE public.node_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "node_progress own all"
ON public.node_progress FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER trg_node_progress_touch
BEFORE UPDATE ON public.node_progress
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER trg_roadmap_cache_touch
BEFORE UPDATE ON public.roadmap_cache
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX idx_node_progress_user_domain ON public.node_progress(user_id, domain, tier);