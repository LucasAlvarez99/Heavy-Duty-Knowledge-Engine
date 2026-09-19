-- Fase 6+7 (fusionadas) - Knowledge Engine + carga de Heavy Duty
--
-- Estas tablas son datos de referencia editorial, no datos del usuario: se
-- cargan por migracion (ver 006_knowledge_engine_seed_heavy_duty.sql), no
-- por la app. RLS las deja de solo lectura para cualquier usuario
-- autenticado; no hay policy de insert/update/delete desde el cliente a
-- proposito, para que la curaduria de fuentes quede fuera del alcance de
-- la UI por ahora.

-- =========================================================
-- knowledge_sources
-- =========================================================
create table if not exists public.knowledge_sources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null,
  era text not null,
  source_type text not null check (source_type in ('book', 'article', 'interview')),
  created_at timestamptz not null default now()
);

alter table public.knowledge_sources enable row level security;

drop policy if exists "knowledge_sources_read_all" on public.knowledge_sources;
create policy "knowledge_sources_read_all"
  on public.knowledge_sources for select
  using (true);

-- =========================================================
-- principles
-- =========================================================
create table if not exists public.principles (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.knowledge_sources(id) on delete cascade,
  name text not null,
  description text not null,
  provenance text not null check (provenance in ('DOCUMENTED', 'INTERPRETED', 'ADAPTED')),
  citation text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_principles_source_id on public.principles (source_id);

alter table public.principles enable row level security;

drop policy if exists "principles_read_all" on public.principles;
create policy "principles_read_all"
  on public.principles for select
  using (true);

-- =========================================================
-- strategies
-- =========================================================
create table if not exists public.strategies (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.knowledge_sources(id) on delete cascade,
  name text not null,
  description text not null,
  objective text not null,
  recommended_level text not null check (recommended_level in ('beginner', 'intermediate', 'advanced')),
  risk text not null check (risk in ('low', 'medium', 'high')),
  rest_seconds_between_steps integer,
  provenance text not null check (provenance in ('DOCUMENTED', 'INTERPRETED', 'ADAPTED')),
  citation text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_strategies_source_id on public.strategies (source_id);

alter table public.strategies enable row level security;

drop policy if exists "strategies_read_all" on public.strategies;
create policy "strategies_read_all"
  on public.strategies for select
  using (true);

-- =========================================================
-- historical_routines
-- =========================================================
create table if not exists public.historical_routines (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.knowledge_sources(id) on delete cascade,
  name text not null,
  author text not null,
  methodology text not null,
  era text not null,
  context text not null,
  frequency_description text not null,
  provenance text not null check (provenance in ('DOCUMENTED', 'INTERPRETED', 'ADAPTED')),
  citation text not null,
  created_at timestamptz not null default now()
);

alter table public.historical_routines enable row level security;

drop policy if exists "historical_routines_read_all" on public.historical_routines;
create policy "historical_routines_read_all"
  on public.historical_routines for select
  using (true);

-- =========================================================
-- historical_routine_exercises
-- =========================================================
-- Ejercicios como texto libre citado de la fuente (no FK al catalogo del
-- usuario): "Sentadilla" en un libro de 1990 no es el mismo registro que
-- el ejercicio "Sentadilla" que un usuario particular cargo en su catalogo.
-- Son dominios distintos a proposito.
create table if not exists public.historical_routine_exercises (
  id uuid primary key default gen_random_uuid(),
  historical_routine_id uuid not null references public.historical_routines(id) on delete cascade,
  exercise_name text not null,
  order_index integer not null,
  sets integer not null check (sets >= 1),
  reps_description text not null,
  superset_group integer,
  technique text
);

create index if not exists idx_hre_routine_id on public.historical_routine_exercises (historical_routine_id);

alter table public.historical_routine_exercises enable row level security;

drop policy if exists "historical_routine_exercises_read_all" on public.historical_routine_exercises;
create policy "historical_routine_exercises_read_all"
  on public.historical_routine_exercises for select
  using (true);
