import type { ExperienceLevel, TrainingGoal } from './athleteProfile'

export interface RoutineExerciseInput {
  exerciseId: string
  orderIndex: number
  targetSets: number
  targetReps: number
  targetRir: number | null
  restSeconds: number | null
}

export interface RoutineInput {
  name: string
  goal: TrainingGoal
  level: ExperienceLevel
  notes: string
  exercises: RoutineExerciseInput[]
}

export interface RoutineExercise extends RoutineExerciseInput {
  id: string
  routineId: string
}

export interface Routine {
  id: string
  userId: string
  name: string
  goal: TrainingGoal
  level: ExperienceLevel
  notes: string
  createdAt: string
  updatedAt: string
}

export interface RoutineWithExercises extends Routine {
  exercises: RoutineExercise[]
}

/**
 * Reglas minimas para que una rutina sea guardable. No valida que los
 * ejercicios existan en el catalogo (eso lo garantiza la FK en DB): valida
 * la forma de los datos, que es responsabilidad del dominio.
 */
export function validateRoutineInput(input: RoutineInput): string[] {
  const errors: string[] = []

  if (input.name.trim().length === 0) {
    errors.push('El nombre de la rutina es obligatorio')
  }

  if (input.exercises.length === 0) {
    errors.push('La rutina debe tener al menos un ejercicio')
  }

  input.exercises.forEach((exercise, index) => {
    const position = index + 1
    if (exercise.targetSets < 1 || exercise.targetSets > 20) {
      errors.push(`Ejercicio #${position}: las series objetivo deben estar entre 1 y 20`)
    }
    if (exercise.targetReps < 1 || exercise.targetReps > 100) {
      errors.push(`Ejercicio #${position}: las repeticiones objetivo deben estar entre 1 y 100`)
    }
    if (exercise.targetRir !== null && (exercise.targetRir < 0 || exercise.targetRir > 10)) {
      errors.push(`Ejercicio #${position}: el RIR objetivo debe estar entre 0 y 10`)
    }
  })

  return errors
}

export function reorderExercises(exercises: RoutineExerciseInput[]): RoutineExerciseInput[] {
  return exercises.map((exercise, index) => ({ ...exercise, orderIndex: index }))
}
