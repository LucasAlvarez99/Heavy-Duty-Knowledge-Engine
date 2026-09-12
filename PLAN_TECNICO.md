# 🏋️ Gym Progress Intelligence — Plan Técnico y Arquitectura

> Documento de planificación técnica previo al desarrollo. Consolida el README, el manual de producto (`Gym_Progress_Intelligence_Manual.pdf`) y las fuentes de metodología Heavy Duty subidas, en un plan accionable, con arquitectura, modelo de datos, motores de decisión y roadmap completo.

---

## 0. Resumen ejecutivo

**Gym Progress Intelligence (GPI)** es una plataforma que registra entrenamiento, fuerza, nutrición y recuperación, y los convierte en **decisiones accionables** mediante un conjunto de motores (*engines*) de análisis. No es un logger: es un sistema de decisión.

Loop central del producto:

```
ENTRENAMIENTO → DATOS → ANÁLISIS → INTERPRETACIÓN → DECISIÓN → RECOMENDACIÓN → NUEVO ENTRENAMIENTO
```

Alcance de este plan: **todo el sistema descrito en el README y el manual**, sin recortar módulos. Se define un roadmap de 12 fases para llegar ahí de forma incremental, pero la arquitectura se diseña desde el día 1 para soportar el sistema completo (no solo el MVP).

---

## 1. Objetivos del producto

- Registrar entrenamiento a nivel de serie (peso, reps, RIR, RPE, descanso).
- Calcular y trackear 1RM real y e1RM (estimado, fórmula de Epley y otras).
- Detectar progreso, estancamiento o retroceso, con un **Confidence Score** (no reaccionar a una sola sesión).
- Medir recuperación (sueño, energía, estrés, dolor muscular, fatiga) → **Recovery Score**.
- Registrar nutrición con **rangos de incertidumbre**, nunca cifras falsamente exactas.
- Calcular **Training Efficiency** (resultado obtenido vs. recursos invertidos).
- Mantener un **Athlete State** dinámico que resume fuerza, fatiga, recuperación, nutrición y consistencia.
- Un **Knowledge Engine** que almacena metodologías de entrenamiento (empezando por Heavy Duty/HIT de Mike Mentzer) con trazabilidad de fuente, distinguiendo `DOCUMENTED` / `INTERPRETED` / `ADAPTED`.
- Un **Decision Engine** y un **Coach Digital** que integran todo lo anterior y devuelven una próxima acción concreta con motivo y confianza.
- Generador de rutinas que adapta metodologías al nivel del usuario, marcando siempre `ORIGINAL` vs `ADAPTED` vs `CUSTOM`.
- Gamificación (PRs, logros, rachas) y, en fases futuras, funcionalidades sociales.

### Público objetivo

| Nivel | Prioridad de la app |
|---|---|
| 🟢 Principiante | Técnica, seguridad, RIR moderado, progresión lineal |
| 🟡 Intermedio | Gestión de volumen, variación de estímulos |
| 🔴 Avanzado | Métricas de alta intensidad, autorregulación, periodización |

### Los 5 principios de producto

1. **Medir** — lo no registrado no se puede analizar.
2. **Comparar** — todo rendimiento se compara contra historial.
3. **Interpretar** — números → información.
4. **Recomendar** — información → sugerencia de acción.
5. **Adaptar** — la recomendación evoluciona según la respuesta real del atleta.

---

## 2. Reglas de negocio no negociables

Estas reglas condicionan todo el diseño técnico posterior y deben quedar codificadas como *tests*, no solo como documentación:

1. **Nunca presentar una estimación como medición exacta.**
   - ✅ "Fideos con tuco: 650–800 kcal"
   - ❌ "742 kcal exactas"
2. **Regla de no invención (Knowledge Engine):** toda afirmación histórica sobre una metodología debe tener fuente (libro, capítulo, página). Una interpretación o adaptación del sistema nunca se presenta como si fuera parte de la fuente original. Tres estados posibles: `DOCUMENTED`, `INTERPRETED`, `ADAPTED`.
3. **Etiquetado de rutinas:** toda rutina generada es `Historical` (sin modificar), `Adapted` (basada en fuente + modificación explícita) o `Custom` (generada con principios documentados pero sin representar una rutina histórica puntual). Nunca se muestra una `Adapted` como si fuera `Historical`.
4. **El sistema nunca diagnostica, ni sustituye a un médico, nutricionista o entrenador personal.** Debe recomendar explícitamente supervisión profesional cuando corresponda (cargas altas, principiantes, técnicas avanzadas, dolor persistente).
5. **Confidence Score obligatorio en toda recomendación de progreso.** No se sugiere subir carga en base a una sola sesión buena.
6. **Prioridad ante señales de fatiga/mala recuperación:** Seguridad → Técnica → Recuperación → Progresión. Nunca al revés.
7. **Row Level Security estricta:** ningún usuario accede a datos de otro. Los datos deportivos/nutricionales/de salud son datos personales sensibles.

---

## 3. Arquitectura general

Separación estricta en capas, con la lógica de negocio (*engines*) **independiente de React** para poder testearla y reusarla (incluso desde un futuro backend/worker separado):

```
UI (React)
   ↓
Application Layer (hooks, casos de uso)
   ↓
Domain Layer (entidades, reglas de dominio)
   ↓
Engines (Progress, Recovery, Nutrition, Efficiency, Decision, Recommendation, Adaptation, Routine, Knowledge)
   ↓
Data Access (services / repositories)
   ↓
Database (Supabase / PostgreSQL)
```

### 3.1 Estructura de carpetas

```
src/
├── components/            # UI compartida (design system)
├── pages/                 # rutas/vistas
├── features/              # slices verticales por dominio
│   ├── auth/
│   ├── profile/
│   ├── exercises/
│   ├── workouts/
│   ├── routines/
│   ├── oneRM/
│   ├── progress/
│   ├── recovery/
│   ├── nutrition/
│   ├── coach/
│   ├── knowledge/
│   ├── methodologies/
│   ├── achievements/
│   └── social/
├── domain/                # entidades y reglas puras, sin dependencias externas
│   ├── training/
│   ├── strength/
│   ├── recovery/
│   ├── nutrition/
│   ├── progression/
│   ├── methodologies/
│   └── knowledge/
├── engines/                # lógica de decisión, 100% testeable sin UI ni DB real
│   ├── progress/           # Progress Engine
│   ├── recovery/           # Recovery Score
│   ├── nutrition/          # Nutrition Engine
│   ├── efficiency/         # Training Efficiency
│   ├── decision/           # Decision Engine
│   ├── recommendation/     # Recommendation Engine
│   ├── adaptation/         # Adaptation Engine (nivel/objetivo/historial)
│   ├── routine/            # Routine Generator
│   └── knowledge/          # Knowledge Engine (fuentes → principios → estrategias)
├── infrastructure/
│   ├── database/           # clientes Supabase, mappers
│   ├── auth/
│   └── storage/
├── services/               # orquestación entre engines + infraestructura
├── hooks/
├── utils/
├── constants/
├── types/
└── lib/
```

**Regla dura:** ningún archivo bajo `domain/` o `engines/` puede importar React, Supabase SDK, ni nada de `infrastructure/`. Reciben datos por parámetro y devuelven datos puros. Esto es lo que permite testear `e1RM(80, 8) ≈ 101.3` sin levantar la app.

---

## 4. Los motores (Engines) — contrato de cada uno

### 4.1 Strength / 1RM–e1RM
- **Input:** peso, repeticiones, ejercicio.
- **Fórmula base (Epley):** `e1RM = peso × (1 + reps / 30)`.
- Arquitectura preparada para múltiples fórmulas (Epley, Brzycki, Lombardi, etc.) y comparación entre ellas.
- Tabla de %1RM → zona de entrenamiento sugerida (50-60% potencia, 70-75% hipertrofia/volumen, 80-85% hipertrofia/fuerza híbrida, 90-95% fuerza máxima).
- Todo 1RM se guarda con `type: REAL | ESTIMATED` y `source`.

### 4.2 Progress Engine
- **Inputs:** peso, reps, series, RIR, RPE, volumen, 1RM/e1RM, frecuencia, historial, objetivo.
- **Outputs:** estado, % de progreso, tendencia, Confidence Score, recomendación.
- **Estados posibles:** 🚀 Progreso rápido · 📈 Progreso consistente · ➡️ Estable · ⚠️ Posible estancamiento (sin variación 3+ sesiones) · 🔻 Disminución de rendimiento · 🔥 Preparado para progresar · 🧪 Posible nuevo PR.
- **Confidence Score:** sube con consistencia a lo largo de varias sesiones, e1RM en aumento, técnica mantenida, buena recuperación. Ejemplo: 84%. Evita recomendaciones prematuras.

### 4.3 Recovery Engine
- **Inputs (check-in diario):** horas y calidad de sueño, energía, estrés, dolor muscular (DOMS), fatiga, motivación.
- **Output:** Recovery Score (0–100) con categoría (🟢/🟡/🔴), explícitamente **no es diagnóstico médico**.

### 4.4 Nutrition Engine
- **Inputs:** comidas registradas (alimento, cantidad, unidad), objetivo (perder grasa / mantener / ganar masa / recomposición).
- **Outputs:** calorías, macros, con **rangos de incertidumbre** cuando la información es incompleta. Nunca cifras puntuales falsas.
- Gasto energético: BMR + actividad + entrenamiento, siempre presentado como rango.

### 4.5 Training Efficiency
- Relaciona recursos (tiempo, volumen, series, descansos, fatiga) contra resultados (progreso, fuerza, rendimiento). Ej: 135 min → +1% progreso → ⚠️ baja eficiencia; 55 min → +8% → 🔥 alta eficiencia. Nunca se usa como criterio absoluto y aislado.

### 4.6 Athlete State
- Snapshot dinámico: Fuerza, Rendimiento, Hipertrofia, Fatiga, Recuperación, Nutrición, Consistencia (cada uno con tendencia ↑ → ↓). Es el input principal del Decision Engine.

### 4.7 Knowledge Engine
Pipeline de conocimiento estructurado (no una lista de ejercicios):

```
FUENTES → PRINCIPIOS → ESTRATEGIAS → RUTINAS → ESTRUCTURAS → REGLAS → ADAPTACIÓN
```

- Cada rutina histórica documentada conserva: autor, metodología, era, nombre, fuente, libro, capítulo, página, contexto, ejercicios, orden, series, reps, descanso, técnicas, frecuencia.
- Cada estrategia (ej. *pre-exhaustion*, *rest-pause*, *forced reps*) es una entidad independiente con: nombre, descripción, objetivo, ejercicios involucrados, orden, descanso, nivel recomendado, riesgo, fuente, contexto.
- **Regla de oro:** un ejercicio aislado no define una metodología. Heavy Duty = ejercicios + orden + series + intensidad + descansos + relación entre ejercicios + técnicas + frecuencia + recuperación, todo junto.
- Fuentes ya disponibles para cargar (subidas por vos): *Heavy Duty Nutrition* (Mike Mentzer, original) y *Heavy Duty Reloaded* (actualización moderna con estudios de Schoenfeld, Carpinelli & Otto, Fisher et al.). Cada dato extraído de estos documentos se carga con su cita exacta (documento + sección).

### 4.8 Adaptation Engine
- Nunca copia una rutina avanzada a un principiante. Preserva la lógica de la metodología y adapta la ejecución (ej. pre-exhaustion con descanso controlado para principiante vs. sin descanso para avanzado). Marca siempre `ORIGINAL` u `ADAPTED`.

### 4.9 Routine Generator
- Flujo: `PERFIL → EVALUACIÓN → ATHLETE STATE → SELECCIÓN DE METODOLOGÍA → SELECCIÓN DE ESTRUCTURA → ADAPTACIÓN → VALIDACIÓN → RUTINA`.
- Tipos de salida: `Historical`, `Adapted`, `Custom` (este último debe indicarse explícitamente como generado por principios, no como rutina histórica real).

### 4.10 Decision Engine
- Convierte estado en acción: `DATOS → ANÁLISIS → ESTADO → DECISION ENGINE → ACCIÓN`.
- Acciones posibles: Increase Load, Increase Reps, Maintain Load, Reduce Load, Reduce Volume, Increase Rest, Change Exercise, Repeat Workout, Recovery Day, Deload, New PR Attempt, No PR Attempt.
- Toda decisión se acompaña de motivo, confianza y datos utilizados.

### 4.11 Coach Digital
- Integra Athlete State + Progress + Recovery + Nutrition + Knowledge + Methodology → produce: estado, interpretación, recomendación, motivo, confianza, próxima acción. Ejemplos de salida ya definidos en el manual (positivo 🟢, cautela 🟡, descarga 🔴).

---

## 5. Modelo de datos

Diseño relacional (Postgres/Supabase), agrupado por dominio. Todas las tablas de usuario llevan `user_id` + RLS.

**Usuario y perfil**
- `User(id, name, email, created_at)`
- `AthleteProfile(id, user_id, birth_date, height, weight, experience_level, goal, available_days, session_duration, equipment, created_at, updated_at)`

**Ejercicios y entrenamiento**
- `Exercise(id, name, muscle_group, secondary_muscles, equipment, instructions, created_at)`
- `Routine(id, user_id, name, goal, level, methodology, routine_type[Historical|Adapted|Custom], source_id, created_at, updated_at)`
- `RoutineExercise(id, routine_id, exercise_id, order, target_sets, target_reps, target_rir, target_percentage, rest_seconds, strategy_id)`
- `Workout(id, user_id, routine_id, date, start_time, end_time, duration, notes)`
- `WorkoutExercise(id, workout_id, exercise_id, order)`
- `Set(id, workout_exercise_id, set_number, weight, repetitions, rir, rpe, rest_seconds)`

**Fuerza**
- `ExerciseRecord(id, user_id, exercise_id, weight, repetitions, date)`
- `OneRM(id, user_id, exercise_id, weight, type[REAL|ESTIMATED], date, source)`

**Nutrición**
- `NutritionProfile(id, user_id, goal, daily_calories, protein_target, carb_target, fat_target)`
- `Food(id, name, calories, protein, carbohydrates, fat, fiber, serving_size)`
- `Meal(id, user_id, date, meal_type, notes)`
- `MealFood(id, meal_id, food_id, quantity)`

**Recuperación**
- `RecoveryLog(id, user_id, date, sleep_hours, sleep_quality, energy, stress, soreness, fatigue, motivation)`

**Progreso y objetivos**
- `ProgressAnalysis(id, user_id, exercise_id, status, progress_percentage, confidence_score, recommendation, created_at)`
- `Goal(id, user_id, type, exercise_id, current_value, target_value, start_date, target_date, status)`

**Gamificación**
- `Achievement(id, name, description, icon, criteria)`
- `UserAchievement(id, user_id, achievement_id, unlocked_at)`

**Knowledge Engine** *(no está detallado como tablas en el README, se propone aquí para completar el modelo)*
- `KnowledgeSource(id, title, author, type[book|article|study], year, edition, notes)`
- `MethodologyPrinciple(id, source_id, methodology, name, description, chapter, page, context)`
- `TrainingStrategy(id, source_id, name, description, objective, exercises_involved, order, rest, recommended_level, risk, context)`
- `HistoricalRoutine(id, source_id, author, methodology, era, name, chapter, page, context)`
- `HistoricalRoutineExercise(id, historical_routine_id, exercise_id, order, sets, reps, rest, techniques)`

---

## 6. Stack técnico

| Capa | Elección | Motivo |
|---|---|---|
| Frontend | React + TypeScript + Vite | Definido en README; rápido, tipado, buen soporte de ecosistema |
| Backend / DB | Supabase (PostgreSQL) | Auth + DB + RLS out-of-the-box, ideal para un proyecto solo/pequeño equipo |
| Auth | Supabase Auth | Integrado, evita reinventar sesiones |
| Charts | Recharts | Simplicidad para gráficos de progreso/volumen |
| Deploy | Vercel | Deploy directo desde el repo, previews por PR |
| Testing | Vitest + Testing Library (a definir en Fase 1) | Los engines deben tener cobertura alta por ser lógica crítica |

---

## 7. Roadmap completo (12 fases)

El roadmap no recorta funcionalidad: cada fase agrega un motor o módulo completo, en orden de dependencia (no se puede construir Progress Engine sin antes tener registro de series, por ejemplo).

| Fase | Nombre | Entregables clave |
|---|---|---|
| 1 | **Foundation** | Setup del proyecto (Vite+TS), arquitectura de carpetas, Auth (Supabase), esquema inicial de DB, perfil de atleta, catálogo de ejercicios |
| 2 | **Training MVP** | Crear/editar rutina, registrar entrenamiento y series (peso/reps), historial básico |
| 3 | **Strength Engine** | 1RM real y e1RM (Epley + comparación de fórmulas), tabla de %1RM, detección de PRs, gráficos de fuerza |
| 4 | **Progress Engine** | Análisis de tendencia por ejercicio, detección de progreso/estancamiento/retroceso, Confidence Score, recomendaciones básicas |
| 5 | **Adaptive Training** | Routine Generator (flujo perfil→evaluación→selección→adaptación→validación), Adaptation Engine, soporte multi-metodología |
| 6 | **Knowledge Engine** | Modelo de `KnowledgeSource/Principle/Strategy/HistoricalRoutine`, pipeline de carga de fuentes (PDF→texto→segmentación→extracción con trazabilidad), regla de no invención (`DOCUMENTED/INTERPRETED/ADAPTED`) |
| 7 | **Heavy Duty** | Carga de las fuentes Mentzer ya disponibles (Heavy Duty Nutrition, Heavy Duty Reloaded) como primer caso real del Knowledge Engine; estrategias (pre-exhaustion, rest-pause, etc.); adaptación por nivel |
| 8 | **Recovery** | Check-in diario, Recovery Score, histórico de recuperación |
| 9 | **Nutrition** | Perfil nutricional, registro de comidas/alimentos, cálculo de macros con rangos de incertidumbre, gasto energético estimado |
| 10 | **Coach** | Athlete State consolidado, Decision Engine, Coach Digital con recomendaciones integradas (entrenamiento + recuperación + nutrición) |
| 11 | **Gamification** | PRs automáticos, logros, rachas, niveles |
| 12 | **Social** | Perfil público, feed de actividad, seguidores, likes/comentarios, desafíos |

Cada fase debe cerrar con: (a) tests de los engines nuevos, (b) UI funcional mínima para esa fase, (c) sin romper RLS/seguridad.

---

## 8. Testing (qué se prueba y cómo)

Las reglas de negocio son el corazón del producto → se prueban como unidades puras, sin DB ni UI:

```
Input:  80 kg × 8 reps
Expect: e1RM ≈ 101.3 kg

Input:  70kg progresando 8→9→10→11→12 reps en 5 sesiones, 1RM=100kg
Expect: status = "progreso consistente", confidence alto, recomendación = subir carga

Input:  fatiga alta + sueño bajo + rendimiento en baja
Expect: Decision Engine → "Recovery Day" o "Reduce Volume", nunca "Increase Load"
```

Motores con test suite obligatoria desde su fase de implementación: 1RM/e1RM, Progress Engine, Recovery Score, Nutrition Engine, Training Efficiency, Decision Engine, Recommendation Engine, Routine Generator, Knowledge Engine, Adaptation Engine.

---

## 9. Seguridad y privacidad

- Row Level Security en todas las tablas con `user_id`.
- Separación explícita entre datos públicos (fase Social) y privados (todo lo demás por defecto).
- Borrado de cuenta y de registros individuales soportado desde el modelo (no como parche posterior).
- El sistema nunca diagnostica ni reemplaza profesionales — esto se aplica también al *copy* de la UI del Coach Digital, no solo a la lógica.

---

## 10. Próximo paso concreto

Con este plan aprobado, el punto de partida natural es **Fase 1 (Foundation)**:
1. Scaffold del repo (Vite + React + TS).
2. Config de Supabase (proyecto, Auth, esquema inicial: `User`, `AthleteProfile`, `Exercise`).
3. Definir la carpeta `engines/` con el primer motor real y testeado: **1RM/e1RM**, porque todo lo demás (Progress, Coach, Athlete State) depende de tener esa base sólida y probada.

Cuando quieras, seguimos con el scaffolding del repo siguiendo esta arquitectura, o con el schema SQL completo de Supabase (con RLS incluida).
