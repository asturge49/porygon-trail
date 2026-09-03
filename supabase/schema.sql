-- Porygon Trail - Supabase schema
-- Reverse-engineered from the production project (introspected via information_schema /
-- pg_policies, since no migration history existed). Source of truth going forward —
-- apply this to any new environment (e.g. staging) instead of hand-copying tables.
--
-- Auth: user_id / id columns reference auth.uid() via RLS policies, not FK constraints
-- (Supabase's usual pattern — production has no FKs to auth.users either).

create table if not exists public.pt_profiles (
    id uuid primary key,
    username text not null unique,
    created_at timestamptz default now()
);
alter table public.pt_profiles enable row level security;
create policy "Public read" on public.pt_profiles for select using (true);
create policy "Own write" on public.pt_profiles for all using (auth.uid() = id);

create table if not exists public.pt_saves (
    user_id uuid primary key,
    save_data jsonb not null,
    updated_at timestamptz default now()
);
alter table public.pt_saves enable row level security;
create policy "Own save" on public.pt_saves for all using (auth.uid() = user_id);

create table if not exists public.pt_leaderboard (
    id uuid primary key default gen_random_uuid(),
    user_id uuid,
    username text not null,
    score integer not null,
    pokedex_count integer not null default 0,
    badges integer not null default 0,
    days_elapsed integer not null default 0,
    won boolean not null default false,
    date text not null,
    created_at timestamptz default now(),
    run_id text unique,
    status text not null default 'completed',
    legendary_count integer default 0,
    pokedex_ids integer[] default '{}',
    legendary_ids integer[] default '{}',
    champion_ids integer[] default '{}',
    -- Johto expansion (§13.1-13.2 of JOHTO_EXPANSION_SCOPE.md): one row per run,
    -- existing columns above unchanged/Kanto-scoped. johto_completed is the
    -- boolean-style region flag; the johto_* stat columns stay null until a run
    -- actually continues into Johto (state.region becomes 'johto'), so a
    -- Kanto-only run never populates them. Apply via the Supabase SQL editor
    -- against the STAGING project only (see CLAUDE.md) — never prod.
    johto_completed boolean not null default false,
    johto_badges integer,
    johto_days_elapsed integer,
    johto_score integer,
    johto_pokedex_count integer,
    -- Kanto E4 clear — separate from `won` (full Red-capstone victory) and
    -- from johto_completed (Johto E4 clear). See engine/leaderboard-api.js's
    -- pt_e4_wins_leaderboard() comment for why `won` can't be used as this
    -- flag's proxy.
    kanto_e4_cleared boolean not null default false,
    -- Difficulty levels (1-5, see data/difficulty-levels.js) — the level a run
    -- was started on. Defaults to 1 so every pre-existing row (from before
    -- difficulty levels existed) reads as Level 1 with no backfill needed.
    -- Level-unlock eligibility is derived at read time from this column (see
    -- engine/leaderboard-api.js's getHighestUnlockedLevel) rather than tracked
    -- in a separate unlocks table — deliberately simpler than an earlier plan
    -- that would've needed its own migration; this one needs none since a
    -- default-1 column value already correctly grandfathers every existing
    -- Red-win account into Level 2 eligibility. Apply via the Supabase SQL
    -- editor against the STAGING project only (see CLAUDE.md) — never prod.
    difficulty_level int default 1
);
alter table public.pt_leaderboard enable row level security;
create policy "Public read" on public.pt_leaderboard for select using (true);
create policy "Auth insert" on public.pt_leaderboard for insert with check (auth.uid() = user_id);
create policy "Users can update their own leaderboard rows" on public.pt_leaderboard for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Johto migration for an EXISTING pt_leaderboard table (this file's `create table
-- if not exists` won't add columns to a table that already exists) — run once,
-- by hand, against the STAGING project's SQL editor:
--   alter table public.pt_leaderboard add column if not exists johto_completed boolean not null default false;
--   alter table public.pt_leaderboard add column if not exists johto_badges integer;
--   alter table public.pt_leaderboard add column if not exists johto_days_elapsed integer;
--   alter table public.pt_leaderboard add column if not exists johto_score integer;
--   alter table public.pt_leaderboard add column if not exists johto_pokedex_count integer;
--   alter table public.pt_leaderboard add column if not exists kanto_e4_cleared boolean not null default false;

-- Difficulty levels migration for an EXISTING pt_leaderboard table — run once,
-- by hand, against the STAGING project's SQL editor:
--   alter table public.pt_leaderboard add column if not exists difficulty_level int default 1;

create table if not exists public.pt_pokedex (
    user_id uuid primary key,
    pokedex_data jsonb not null,
    updated_at timestamptz not null default now()
);
alter table public.pt_pokedex enable row level security;
create policy "Public read access" on public.pt_pokedex for select using (true);
create policy "Users can read own pokedex" on public.pt_pokedex for select using (auth.uid() = user_id);
create policy "Owner write access" on public.pt_pokedex for insert with check (auth.uid() = user_id);
create policy "Users can insert own pokedex" on public.pt_pokedex for insert with check (auth.uid() = user_id);
create policy "Owner update access" on public.pt_pokedex for update using (auth.uid() = user_id);
create policy "Users can update own pokedex" on public.pt_pokedex for update using (auth.uid() = user_id);
create policy "Users can delete own pokedex" on public.pt_pokedex for delete using (auth.uid() = user_id);

create table if not exists public.pt_records (
    user_id uuid primary key,
    records_data jsonb not null,
    updated_at timestamptz not null default now()
);
alter table public.pt_records enable row level security;
create policy "Public read access" on public.pt_records for select using (true);
create policy "Owner write access" on public.pt_records for insert with check (auth.uid() = user_id);
create policy "Owner update access" on public.pt_records for update using (auth.uid() = user_id);

create table if not exists public.pt_events (
    id uuid primary key default gen_random_uuid(),
    user_id uuid,
    event_type text not null,
    payload jsonb,
    created_at timestamptz default now()
);
alter table public.pt_events enable row level security;
create policy "Public read" on public.pt_events for select using (true);
create policy "Auth insert" on public.pt_events for insert with check (auth.uid() = user_id);
