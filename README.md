# Gym Progress Intelligence

Fase 1 (Foundation) del proyecto: scaffold del frontend, autenticacion,
esquema inicial de base de datos, perfil del atleta y catalogo de ejercicios.

Consulta `PLAN_TECNICO.md` (en la carpeta de entregables del proyecto,
fuera de este repo) para el plan completo, el modelo de datos y el
roadmap de las 12 fases.

## Stack

- React + TypeScript + Vite
- Bootstrap 5 + Bootstrap Icons (sin librerias de emojis ni glifos de
  teclado: todo icono viene de Bootstrap Icons)
- Supabase (Auth + PostgreSQL) para backend y base de datos
- React Router para el ruteo
- Vitest para tests de los engines (logica de dominio pura)

## Puesta en marcha

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Crear un proyecto en https://supabase.com y copiar `.env.example` a `.env`:

   ```bash
   cp .env.example .env
   ```

   Completar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` con los datos
   de tu proyecto (Project Settings > API).

3. Ejecutar el schema SQL de esta fase contra tu base de Supabase
   (SQL Editor de Supabase, o `psql`):

   ```
   db/001_fase1_foundation.sql
   ```

   Esto crea `athlete_profiles` y `exercises` con Row Level Security
   habilitada, y carga 5 ejercicios base para poder probar el catalogo.

4. Levantar el proyecto:

   ```bash
   npm run dev
   ```

5. Correr los tests de los motores de dominio:

   ```bash
   npm run test
   ```

## Que incluye esta fase

- Registro e inicio de sesion (Supabase Auth).
- Rutas protegidas (`/`, `/perfil`, `/ejercicios`) que requieren sesion.
- Perfil del atleta: datos biometricos, nivel, objetivo, dias/duracion
  disponibles, equipamiento. Persistido en `athlete_profiles` con RLS
  (cada usuario solo ve y edita su propio perfil).
- Catalogo de ejercicios de solo lectura, cargado desde `exercises`.
- Primer motor de dominio, aislado de React y de Supabase, con tests:
  `src/domain/strength/oneRepMax.ts` (1RM y e1RM: Epley, Brzycki,
  Lombardi, tabla de porcentajes de intensidad).

## Estructura de carpetas

```
src/
├── components/       componentes de UI compartidos
├── pages/            paginas de nivel raiz (dashboard)
├── features/         slices verticales por dominio (auth, profile, exercises, ...)
├── domain/           entidades y reglas de negocio puras (sin React ni Supabase)
├── engines/          motores de decision (Progress, Recovery, Coach, etc. — se llenan en fases siguientes)
├── infrastructure/   clientes de Supabase, auth, repositorios de datos
├── hooks/, services/, utils/, constants/, types/, lib/
```

## Proximos pasos (Fase 2 en adelante)

Ver `PLAN_TECNICO.md`, seccion 7 (Roadmap). El siguiente paso es la
Fase 2 (Training MVP): crear/editar rutinas y registrar entrenamientos
con series (peso, reps, RIR, RPE, descanso).
