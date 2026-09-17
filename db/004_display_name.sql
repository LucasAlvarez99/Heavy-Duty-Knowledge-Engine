-- Fase 5 (UX) - Nombre de usuario visible
-- Agrega un display_name opcional al perfil, para no mostrar el email crudo
-- en la navbar y el dashboard.

alter table public.athlete_profiles
  add column if not exists display_name text;
