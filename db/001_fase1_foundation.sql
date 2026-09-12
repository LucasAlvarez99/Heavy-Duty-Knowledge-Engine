-- Fase 1 - Foundation
-- Tablas: athlete_profiles, exercises
-- Nota: la tabla de usuarios la maneja Supabase Auth (auth.users);
-- no se crea una tabla "User" propia, se referencia auth.users(id).

-- =========================================================
-- athlete_profiles
-- =========================================================
create table if not exists public.athlete_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  birth_date date not null,
  height_cm numeric(5,1) not null,
  weight_kg numeric(5,1) not null,
  experience_level text not null check (experience_level in ('beginner', 'intermediate', 'advanced')),
  goal text not null check (
    goal in ('muscle_mass', 'strength', 'fat_loss', 'body_recomposition', 'performance')
  ),
  available_days integer not null check (available_days between 1 and 7),
  session_duration_minutes integer not null check (session_duration_minutes between 10 and 240),
  equipment text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_athlete_profiles_updated_at on public.athlete_profiles;
create trigger trg_athlete_profiles_updated_at
  before update on public.athlete_profiles
  for each row execute function public.set_updated_at();

alter table public.athlete_profiles enable row level security;

drop policy if exists "athlete_profiles_select_own" on public.athlete_profiles;
create policy "athlete_profiles_select_own"
  on public.athlete_profiles for select
  using (auth.uid() = user_id);

drop policy if exists "athlete_profiles_insert_own" on public.athlete_profiles;
create policy "athlete_profiles_insert_own"
  on public.athlete_profiles for insert
  with check (auth.uid() = user_id);

drop policy if exists "athlete_profiles_update_own" on public.athlete_profiles;
create policy "athlete_profiles_update_own"
  on public.athlete_profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "athlete_profiles_delete_own" on public.athlete_profiles;
create policy "athlete_profiles_delete_own"
  on public.athlete_profiles for delete
  using (auth.uid() = user_id);

-- =========================================================
-- exercises
-- Catalogo compartido de ejercicios: lectura publica para
-- cualquier usuario autenticado, escritura restringida
-- (se administra por ahora desde el panel de Supabase / seed).
-- =========================================================
create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  muscle_group text not null,
  secondary_muscles text[] not null default '{}',
  equipment text not null default '',
  instructions text not null default '',
  created_at timestamptz not null default now()
);

alter table public.exercises enable row level security;

drop policy if exists "exercises_select_authenticated" on public.exercises;
create policy "exercises_select_authenticated"
  on public.exercises for select
  using (auth.role() = 'authenticated');

-- Seed minimo de ejercicios basicos para poder probar el catalogo end to end.
insert into public.exercises (name, muscle_group, secondary_muscles, equipment, instructions)
values
  ('Press de banca', 'Pecho', array['Triceps', 'Hombro anterior'], 'Barra y banco', 'Bajar la barra al pecho de forma controlada y empujar hasta extender los brazos.'),
  ('Sentadilla', 'Cuadriceps', array['Gluteos', 'Isquiotibiales'], 'Barra y rack', 'Descender manteniendo el torso erguido hasta profundidad completa y volver a subir.'),
  ('Peso muerto', 'Espalda baja', array['Isquiotibiales', 'Gluteos'], 'Barra', 'Levantar la barra desde el piso manteniendo la espalda neutra durante todo el recorrido.'),
  ('Dominadas', 'Espalda', array['Biceps'], 'Barra de dominadas', 'Traccionar hasta que el menton supere la barra y descender de forma controlada.'),
  ('Press militar', 'Hombro', array['Triceps'], 'Barra o mancuernas', 'Empujar la carga desde los hombros hasta la extension completa de los brazos por encima de la cabeza.')
on conflict do nothing;
