-- Fase 3 - Strength Engine
-- Tabla: one_rm_records (1RM real medido o estimado a partir de una serie)

create table if not exists public.one_rm_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  weight_kg numeric(6,2) not null check (weight_kg > 0),
  type text not null check (type in ('REAL', 'ESTIMATED')),
  formula text check (formula in ('epley', 'brzycki', 'lombardi')),
  source_set_id uuid references public.sets(id) on delete set null,
  date date not null default current_date,
  created_at timestamptz not null default now(),
  constraint one_rm_records_formula_only_when_estimated check (
    (type = 'ESTIMATED' and formula is not null) or
    (type = 'REAL' and formula is null)
  )
);

create index if not exists idx_one_rm_records_user_exercise
  on public.one_rm_records (user_id, exercise_id, weight_kg desc);

alter table public.one_rm_records enable row level security;

drop policy if exists "one_rm_records_all_own" on public.one_rm_records;
create policy "one_rm_records_all_own"
  on public.one_rm_records for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
