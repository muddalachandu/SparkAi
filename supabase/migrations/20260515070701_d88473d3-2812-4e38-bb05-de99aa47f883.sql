ALTER TABLE public.projects
  ALTER COLUMN innovation_score TYPE numeric(3,1) USING innovation_score::numeric(3,1),
  ALTER COLUMN resume_value_score TYPE numeric(3,1) USING resume_value_score::numeric(3,1),
  ALTER COLUMN innovation_score SET DEFAULT 0,
  ALTER COLUMN resume_value_score SET DEFAULT 0;

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS tech_depth_score numeric(3,1) NOT NULL DEFAULT 0;