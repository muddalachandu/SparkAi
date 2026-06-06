DROP POLICY IF EXISTS "roadmap_cache writable by authenticated" ON public.roadmap_cache;
DROP POLICY IF EXISTS "roadmap_cache updatable by authenticated" ON public.roadmap_cache;
REVOKE INSERT, UPDATE ON public.roadmap_cache FROM authenticated;