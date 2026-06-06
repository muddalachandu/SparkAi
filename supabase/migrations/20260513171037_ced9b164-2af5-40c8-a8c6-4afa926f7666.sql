
-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  bio text,
  xp integer not null default 0,
  streak_days integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "profiles select own" on public.profiles for select using (auth.uid() = id);
create policy "profiles insert own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles update own" on public.profiles for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- Generated projects (ideas)
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  problem_statement text not null,
  solution_overview text not null,
  technologies jsonb not null default '[]'::jsonb,
  requirements jsonb not null default '{}'::jsonb,
  architecture jsonb not null default '[]'::jsonb,
  timeline jsonb not null default '[]'::jsonb,
  future_scope jsonb not null default '[]'::jsonb,
  resume_value_score integer not null default 0,
  innovation_score integer not null default 0,
  market_potential text not null default '',
  difficulty text not null default '',
  domains jsonb not null default '[]'::jsonb,
  bookmarked boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.projects enable row level security;
create policy "projects own all" on public.projects for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Chat threads
create table public.chat_threads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'New chat',
  pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.chat_threads enable row level security;
create policy "threads own all" on public.chat_threads for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.chat_threads(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user','assistant','system')),
  parts jsonb not null,
  created_at timestamptz not null default now()
);
alter table public.chat_messages enable row level security;
create policy "messages own all" on public.chat_messages for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create index on public.chat_messages (thread_id, created_at);

-- Roadmaps
create table public.roadmaps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  target_role text not null,
  timeframe text not null,
  experience_level text not null,
  content jsonb not null,
  created_at timestamptz not null default now()
);
alter table public.roadmaps enable row level security;
create policy "roadmaps own all" on public.roadmaps for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Study guides
create table public.study_guides (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  domain text not null,
  skill_level text not null,
  goal text not null,
  daily_minutes integer not null,
  content jsonb not null,
  created_at timestamptz not null default now()
);
alter table public.study_guides enable row level security;
create policy "study own all" on public.study_guides for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Learning progress / mentor sessions
create table public.mentor_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  steps jsonb not null default '[]'::jsonb,
  completed_steps jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.mentor_sessions enable row level security;
create policy "mentor own all" on public.mentor_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Daily progress / streaks
create table public.daily_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null,
  minutes integer not null default 0,
  notes text,
  xp_earned integer not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, day)
);
alter table public.daily_progress enable row level security;
create policy "daily own all" on public.daily_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
