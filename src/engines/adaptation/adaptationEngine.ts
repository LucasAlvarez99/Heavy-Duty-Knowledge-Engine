import type { RoutineExercise } from '../../domain/training/routine'
import type { ProgressAnalysis, ProgressStatus } from '../../domain/progression/types'

/**
 * Adaptation Engine — logica de decision pura (dominio + reglas, sin DB ni
 * UI). Solo SUGIERE cambios: nunca modifica una rutina por su cuenta. La
 * validacion final (aplicar o descartar cada sugerencia) es siempre del
 * usuario, tal como marca el flujo perfil -> evaluacion -> seleccion ->
 * adaptacion -> validacion del plan tecnico.
 */

export type AdaptationField = 'targetSets' | 'targetReps' | 'targetRir'

export interface AdaptationSuggestion {
  exerciseId: string
  field: AdaptationField
  currentValue: number | null
  suggestedValue: number
  reason: string
}

const MIN_SETS = 1
const MAX_SETS = 20
const MIN_REPS = 1
const MAX_REPS = 100
const MIN_RIR = 0
const MAX_RIR = 10
const PLATEAU_REP_RANGE_SHIFT = 4
const REP_RANGE_MIDPOINT = 8

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function suggestionsForStatus(exercise: RoutineExercise, status: ProgressStatus): AdaptationSuggestion[] {
  switch (status) {
    case 'READY_TO_PROGRESS': {
      // Hay margen (RIR en aumento con la misma carga): pedir un poco mas
      // de esfuerzo. Si ya esta al fallo (RIR 0), en vez de eso se agrega
      // una repeticion, no se puede pedir menos RIR que 0.
      if (exercise.targetRir !== null && exercise.targetRir > MIN_RIR) {
        return [
          {
            exerciseId: exercise.exerciseId,
            field: 'targetRir',
            currentValue: exercise.targetRir,
            suggestedValue: clamp(exercise.targetRir - 1, MIN_RIR, MAX_RIR),
            reason: 'El RIR viene en aumento: se puede pedir un poco mas de esfuerzo en la proxima sesion.',
          },
        ]
      }
      return [
        {
          exerciseId: exercise.exerciseId,
          field: 'targetReps',
          currentValue: exercise.targetReps,
          suggestedValue: clamp(exercise.targetReps + 1, MIN_REPS, MAX_REPS),
          reason: 'Ya esta al limite de esfuerzo (RIR 0): sumar una repeticion en vez de bajar el RIR.',
        },
      ]
    }

    case 'POSSIBLE_PLATEAU': {
      // Cambiar el estimulo moviendo el rango de repeticiones: si venia
      // trabajando en rango bajo, subir el rango (mas resistencia muscular);
      // si venia en rango alto, bajarlo (mas tension mecanica).
      const shift =
        exercise.targetReps <= REP_RANGE_MIDPOINT ? PLATEAU_REP_RANGE_SHIFT : -PLATEAU_REP_RANGE_SHIFT
      return [
        {
          exerciseId: exercise.exerciseId,
          field: 'targetReps',
          currentValue: exercise.targetReps,
          suggestedValue: clamp(exercise.targetReps + shift, MIN_REPS, MAX_REPS),
          reason: 'Sin variacion en las ultimas sesiones: cambiar el rango de repeticiones para variar el estimulo.',
        },
      ]
    }

    case 'PERFORMANCE_DECLINE': {
      // Deload: bajar una serie es menos disruptivo que bajar peso (eso lo
      // decide el atleta en la proxima sesion segun como se sienta), y da
      // mas margen de recuperacion sin perder frecuencia de estimulo.
      if (exercise.targetSets > MIN_SETS) {
        return [
          {
            exerciseId: exercise.exerciseId,
            field: 'targetSets',
            currentValue: exercise.targetSets,
            suggestedValue: clamp(exercise.targetSets - 1, MIN_SETS, MAX_SETS),
            reason: 'Bajo el rendimiento respecto a la sesion anterior: reducir una serie para favorecer la recuperacion.',
          },
        ]
      }
      return [
        {
          exerciseId: exercise.exerciseId,
          field: 'targetRir',
          currentValue: exercise.targetRir,
          suggestedValue: clamp((exercise.targetRir ?? 0) + 1, MIN_RIR, MAX_RIR),
          reason: 'Bajo el rendimiento y ya esta en el minimo de series: sumar un RIR de margen para recuperar.',
        },
      ]
    }

    // RAPID_PROGRESS, CONSISTENT_PROGRESS, STABLE y POSSIBLE_NEW_PR no
    // generan sugerencia: lo que se esta haciendo ya esta funcionando, o el
    // hallazgo (un PR) no es sobre la estructura de la rutina sino sobre el
    // 1RM, que ya se registra aparte via el Strength Engine.
    default:
      return []
  }
}

export function suggestAdaptations(
  routineExercises: RoutineExercise[],
  progressByExercise: Map<string, ProgressAnalysis>,
): AdaptationSuggestion[] {
  return routineExercises.flatMap((exercise) => {
    const analysis = progressByExercise.get(exercise.exerciseId)
    if (!analysis) return []
    return suggestionsForStatus(exercise, analysis.status)
  })
}
