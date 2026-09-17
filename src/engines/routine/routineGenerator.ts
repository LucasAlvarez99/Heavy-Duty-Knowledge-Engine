import type { ExperienceLevel, TrainingGoal } from '../../domain/training/athleteProfile'
import type { RoutineInput } from '../../domain/training/routine'
import type { RoutineTemplate, TemplateDay } from '../../domain/methodologies/templates'
import { ROUTINE_TEMPLATES } from '../../domain/methodologies/templates'
import type { Exercise } from '../../domain/training/exercise'

/**
 * Routine Generator — logica de decision pura (ver regla dura de
 * PLAN_TECNICO.md 3.1: nada de React/Supabase aca).
 *
 * Selecciona una plantilla que calce con el perfil del atleta y arma una
 * rutina por dia llenando cada "slot" (grupo muscular objetivo) con un
 * ejercicio del catalogo disponible. El match de grupo muscular es texto
 * exacto sin distinguir mayusculas/minusculas contra `Exercise.muscleGroup`
 * (que es texto libre, no un enum). Con catalogos chicos es esperable que
 * algunos slots queden sin cubrir: el generador nunca inventa un ejercicio
 * ni rompe, devuelve el hueco explicitamente para que la UI se lo muestre
 * al usuario en vez de entregar una rutina incompleta sin avisar.
 */

export interface GeneratedDay {
  label: string
  routine: RoutineInput
  unfilledMuscleGroups: string[]
}

function normalize(text: string): string {
  return text.trim().toLowerCase()
}

function findExerciseForMuscleGroup(
  muscleGroup: string,
  availableExercises: Exercise[],
  alreadyUsedIds: Set<string>,
): Exercise | null {
  return (
    availableExercises.find(
      (exercise) =>
        normalize(exercise.muscleGroup) === normalize(muscleGroup) && !alreadyUsedIds.has(exercise.id),
    ) ?? null
  )
}

export function selectTemplate(
  goal: TrainingGoal,
  level: ExperienceLevel,
  preferredDaysPerWeek: number,
  templates: RoutineTemplate[] = ROUTINE_TEMPLATES,
): RoutineTemplate | null {
  const matching = templates.filter(
    (template) => template.goals.includes(goal) && template.levels.includes(level),
  )
  if (matching.length === 0) return null

  const exactDaysMatch = matching.find((template) => template.daysPerWeek === preferredDaysPerWeek)
  if (exactDaysMatch) return exactDaysMatch

  // Si no hay una plantilla con exactamente los dias preferidos, se elige
  // la que tenga la diferencia mas chica en dias por semana.
  return matching.reduce((closest, template) =>
    Math.abs(template.daysPerWeek - preferredDaysPerWeek) <
    Math.abs(closest.daysPerWeek - preferredDaysPerWeek)
      ? template
      : closest,
  )
}

function generateDay(
  day: TemplateDay,
  goal: TrainingGoal,
  level: ExperienceLevel,
  availableExercises: Exercise[],
): GeneratedDay {
  const usedIds = new Set<string>()
  const exercises: RoutineInput['exercises'] = []
  const unfilledMuscleGroups: string[] = []

  day.slots.forEach((slot, index) => {
    const exercise = findExerciseForMuscleGroup(slot.muscleGroup, availableExercises, usedIds)
    if (!exercise) {
      unfilledMuscleGroups.push(slot.muscleGroup)
      return
    }
    usedIds.add(exercise.id)
    exercises.push({
      exerciseId: exercise.id,
      orderIndex: index,
      targetSets: slot.targetSets,
      targetReps: slot.targetReps,
      targetRir: slot.targetRir,
      restSeconds: slot.restSeconds,
    })
  })

  return {
    label: day.label,
    routine: {
      name: day.label,
      goal,
      level,
      notes: 'Generada automaticamente. Revisa los ejercicios antes de guardar.',
      exercises,
    },
    unfilledMuscleGroups,
  }
}

export function generateRoutinesFromTemplate(
  template: RoutineTemplate,
  goal: TrainingGoal,
  level: ExperienceLevel,
  availableExercises: Exercise[],
): GeneratedDay[] {
  return template.days.map((day) => generateDay(day, goal, level, availableExercises))
}
