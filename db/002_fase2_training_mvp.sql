-- Fase 2 - Training MVP
-- Tablas: routines, routine_exercises, workouts, workout_exercises, sets
--
-- Nota de alcance: routines.methodology / routine_type / source_id y
-- routine_exercises.target_percentage / strategy_id quedan fuera de esta
-- migracion a proposito. Dependen del Strength Engine (Fase 3), Adaptation
-- Engine (Fase 5) y Knowledge Engine (Fase 6), que todavia no existen.
-- Se agregan en la migracion de esa fase para no crear columnas muertas.

-- =========================================================
-- routines
-- =========================================================
create table if not exists public.routines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  goal text not null check (
    goal in ('muscle_mass', 'strength', 'fat_loss', 'body_recomposition', 'performance')
  ),
  level text not null check (level in ('beginner', 'intermediate', 'advanced')),
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_routines_updated_at on public.routines;
create trigger trg_routines_updated_at
  before update on public.routines
  for each row execute function public.set_updated_at();

alter table public.routines enable row level security;

drop policy if exists "routines_all_own" on public.routines;
create policy "routines_all_own"
  on public.routines for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- =========================================================
-- routine_exercises
-- =========================================================
create table if not exists public.routine_exercises (
  id uuid primary key default gen_random_uuid(),
  routine_id uuid not null references public.routines(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete restrict,
  order_index integer not null,
  target_sets integer not null check (target_sets between 1 and 20),
  target_reps integer not null check (target_reps between 1 and 100),
  target_rir integer check (target_rir between 0 and 10),
  rest_seconds integer check (rest_seconds between 0 and 900),
  created_at timestamptz not null default now()
);

create index if not exists idx_routine_exercises_routine_id on public.routine_exercises (routine_id);

alter table public.routine_exercises enable row level security;

drop policy if exists "routine_exercises_all_own" on public.routine_exercises;
create policy "routine_exercises_all_own"
  on public.routine_exercises for all
  using (
    exists (
      select 1 from public.routines r
      where r.id = routine_id and r.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.routines r
      where r.id = routine_id and r.user_id = auth.uid()
    )
  );

-- =========================================================
-- workouts
-- =========================================================
create table if not exists public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  routine_id uuid references public.routines(id) on delete set null,
  date date not null default current_date,
  start_time timestamptz not null default now(),
  end_time timestamptz,
  notes text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists idx_workouts_user_id_date on public.workouts (user_id, date desc);

alter table public.workouts enable row level security;

drop policy if exists "workouts_all_own" on public.workouts;
create policy "workouts_all_own"
  on public.workouts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- =========================================================
-- workout_exercises
-- =========================================================
create table if not exists public.workout_exercises (
  id uuid primary key default gen_random_uuid(),
  workout_id uuid not null references public.workouts(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete restrict,
  order_index integer not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_workout_exercises_workout_id on public.workout_exercises (workout_id);

alter table public.workout_exercises enable row level security;

drop policy if exists "workout_exercises_all_own" on public.workout_exercises;
create policy "workout_exercises_all_own"
  on public.workout_exercises for all
  using (
    exists (
      select 1 from public.workouts w
      where w.id = workout_id and w.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.workouts w
      where w.id = workout_id and w.user_id = auth.uid()
    )
  );

-- =========================================================
-- sets
-- =========================================================
create table if not exists public.sets (
  id uuid primary key default gen_random_uuid(),
  workout_exercise_id uuid not null references public.workout_exercises(id) on delete cascade,
  set_number integer not null check (set_number >= 1),
  weight_kg numeric(6,2) not null check (weight_kg > 0),
  repetitions integer not null check (repetitions > 0),
  rir numeric(3,1) check (rir between 0 and 10),
  rpe numeric(3,1) check (rpe between 0 and 10),
  rest_seconds integer check (rest_seconds between 0 and 900),
  created_at timestamptz not null default now()
);

create index if not exists idx_sets_workout_exercise_id on public.sets (workout_exercise_id);

alter table public.sets enable row level security;

drop policy if exists "sets_all_own" on public.sets;
create policy "sets_all_own"
  on public.sets for all
  using (
    exists (
      select 1 from public.workout_exercises we
      join public.workouts w on w.id = we.workout_id
      where we.id = workout_exercise_id and w.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.workout_exercises we
      join public.workouts w on w.id = we.workout_id
      where we.id = workout_exercise_id and w.user_id = auth.uid()
    )
  );
