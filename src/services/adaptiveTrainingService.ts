import { generateRoutinesFromTemplate } from '../engines/routine/routineGenerator'
import type { GeneratedDay } from '../engines/routine/routineGenerator'
import { suggestAdaptations } from '../engines/adaptation/adaptationEngine'
import type { AdaptationSuggestion } from '../engines/adaptation/adaptationEngine'
import type { RoutineTemplate } from '../domain/methodologies/templates'
import type { ProgressAnalysis } from '../domain/progression/types'
import { getAthleteProfile } from '../infrastructure/database/athleteProfileRepository'
import { listExercises } from '../infrastructure/database/exerciseRepository'
import { getRoutineWithExercises } from '../infrastructure/database/routineRepository'
import { getExerciseProgress } from './progressService'

/**
 * Flujo "generar rutina": perfil -> evaluacion (perfil ya tiene nivel y
 * objetivo cargados desde la Fase 1) -> seleccion (la plantilla la elige
 * el usuario o se pre-selecciona en la UI) -> este servicio arma el
 * preview -> validacion (el usuario revisa y guarda desde el formulario ya
 * existente de la Fase 2, no se persiste nada automaticamente aca).
 */
export async function generateRoutinesForUser(
  userId: string,
  template: RoutineTemplate,
): Promise<GeneratedDay[]> {
  const [profile, exercises] = await Promise.all([getAthleteProfile(userId), listExercises()])

  if (!profile) {
    throw new Error('Completa tu perfil de atleta antes de generar una rutina automaticamente.')
  }

  return generateRoutinesFromTemplate(template, profile.goal, profile.experienceLevel, exercises)
}

/**
 * Flujo "adaptar rutina": trae la rutina + el analisis de progreso (Fase 4)
 * de cada uno de sus ejercicios, y le pide al Adaptation Engine que
 * sugiera ajustes. Nunca aplica nada: devuelve sugerencias para que la UI
 * las muestre y el usuario decida cuales aceptar.
 */
export async function getAdaptationSuggestionsForRoutine(
  userId: string,
  routineId: string,
): Promise<AdaptationSuggestion[]> {
  const routine = await getRoutineWithExercises(routineId)
  if (!routine || routine.exercises.length === 0) return []

  const progressByExercise = new Map<string, ProgressAnalysis>()

  for (const exercise of routine.exercises) {
    const { analysis } = await getExerciseProgress(userId, exercise.exerciseId)
    progressByExercise.set(exercise.exerciseId, analysis)
  }

  return suggestAdaptations(routine.exercises, progressByExercise)
}
