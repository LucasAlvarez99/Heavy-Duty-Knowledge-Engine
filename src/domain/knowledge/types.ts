import type { ExperienceLevel } from '../training/athleteProfile'

/**
 * Regla de trazabilidad del Knowledge Engine (PLAN_TECNICO.md 4.7): nada
 * se inventa. Todo dato tiene que poder rastrearse a una fuente real.
 *
 * - DOCUMENTED: extraido literal de una fuente primaria, con cita exacta
 *   (capitulo/pagina). Ej: los principios de intensidad de Mentzer tal
 *   como los escribio el mismo.
 * - INTERPRETED: la fuente reinterpreta o recontextualiza algo documentado
 *   (ej: "Heavy Duty Reloaded" explica un principio de Mentzer con
 *   estudios cientificos posteriores). No es invencion: la fuente
 *   secundaria existe y esta citada, pero la fuente primaria y la
 *   secundaria no dicen exactamente lo mismo.
 * - ADAPTED: una estructura (rutina, estrategia) derivada y modificada a
 *   partir de una fuente documentada, para un contexto distinto al
 *   original (ej: las rutinas "siglo XXI" adaptadas a RIR/RPE modernos).
 */
export type Provenance = 'DOCUMENTED' | 'INTERPRETED' | 'ADAPTED'

export type SourceType = 'book' | 'article' | 'interview'

export interface KnowledgeSource {
  id: string
  title: string
  author: string
  era: string
  sourceType: SourceType
}

export interface Principle {
  id: string
  sourceId: string
  name: string
  description: string
  provenance: Provenance
  citation: string
}

export type StrategyRisk = 'low' | 'medium' | 'high'

export interface StrategyInput {
  sourceId: string
  name: string
  description: string
  objective: string
  recommendedLevel: ExperienceLevel
  risk: StrategyRisk
  restSecondsBetweenSteps: number | null
  provenance: Provenance
  citation: string
}

export interface Strategy extends StrategyInput {
  id: string
}

export interface HistoricalRoutineExerciseSlot {
  exerciseName: string
  orderIndex: number
  sets: number
  repsDescription: string
  supersetGroup: number | null
  technique: string | null
}

export interface HistoricalRoutineInput {
  sourceId: string
  name: string
  author: string
  methodology: string
  era: string
  context: string
  frequencyDescription: string
  exercises: HistoricalRoutineExerciseSlot[]
  provenance: Provenance
  citation: string
}

export interface HistoricalRoutine extends HistoricalRoutineInput {
  id: string
}

/**
 * "Regla de oro" del Knowledge Engine: un ejercicio aislado no define una
 * metodologia. Una rutina historica tiene que tener ejercicios + orden +
 * series + repeticiones + el contexto que la sostiene (para quien es, con
 * que frecuencia). Sin eso, no es una rutina documentada, es una lista de
 * ejercicios suelta.
 */
export function validateHistoricalRoutineInput(input: HistoricalRoutineInput): string[] {
  const errors: string[] = []

  if (input.exercises.length === 0) {
    errors.push('Una rutina historica necesita al menos un ejercicio')
  }
  if (input.frequencyDescription.trim().length === 0) {
    errors.push('Falta la frecuencia de entrenamiento (sin eso no es una metodologia, es una lista suelta)')
  }
  if (input.context.trim().length === 0) {
    errors.push('Falta el contexto (para quien es, en que momento se usa)')
  }

  input.exercises.forEach((exercise, index) => {
    if (exercise.sets < 1) {
      errors.push(`Ejercicio #${index + 1}: tiene que tener al menos 1 serie`)
    }
    if (exercise.repsDescription.trim().length === 0) {
      errors.push(`Ejercicio #${index + 1}: falta la descripcion de repeticiones`)
    }
  })

  return errors
}

/**
 * Regla de no invencion, en su version chequeable por codigo: ninguna
 * entidad de conocimiento puede existir sin fuente y sin cita. Esto no
 * garantiza que la cita sea correcta (eso es responsabilidad editorial de
 * quien carga los datos), pero si detecta el caso mas grave: un dato sin
 * ningun rastro de donde salio.
 */
export function validateProvenance(entry: {
  sourceId: string
  citation: string
  provenance: Provenance
}): string[] {
  const errors: string[] = []

  if (entry.sourceId.trim().length === 0) {
    errors.push('Toda entrada de conocimiento necesita una fuente (sourceId)')
  }
  if (entry.citation.trim().length === 0) {
    errors.push('Toda entrada de conocimiento necesita una cita (capitulo/pagina/seccion)')
  }
  if (entry.provenance === 'DOCUMENTED' && !/\d/.test(entry.citation)) {
    errors.push('Una entrada DOCUMENTED necesita una cita con capitulo o pagina especifica (un numero)')
  }

  return errors
}
