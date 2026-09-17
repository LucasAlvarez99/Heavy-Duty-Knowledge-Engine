export interface SetInput {
  setNumber: number
  weightKg: number
  repetitions: number
  rir: number | null
  rpe: number | null
  restSeconds: number | null
}

export interface SetEntry extends SetInput {
  id: string
  workoutExerciseId: string
}

export interface WorkoutExerciseInput {
  exerciseId: string
  orderIndex: number
  sets: SetInput[]
}

export interface WorkoutExercise {
  id: string
  workoutId: string
  exerciseId: string
  orderIndex: number
  sets: SetEntry[]
}

export interface WorkoutInput {
  routineId: string | null
  date: string
  notes: string
  exercises: WorkoutExerciseInput[]
}

export interface Workout {
  id: string
  userId: string
  routineId: string | null
  date: string
  startTime: string
  endTime: string | null
  notes: string
}

export interface WorkoutWithExercises extends Workout {
  exercises: WorkoutExercise[]
}

/**
 * Un entrenamiento registrado debe tener al menos una serie real cargada.
 * Series con peso o repeticiones invalidas no se aceptan (misma regla que
 * usa el Strength Engine para estimar 1RM: ver domain/strength/oneRepMax).
 */
export function validateWorkoutInput(input: WorkoutInput): string[] {
  const errors: string[] = []

  const totalSets = input.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0)
  if (totalSets === 0) {
    errors.push('El entrenamiento debe tener al menos una serie registrada')
  }

  input.exercises.forEach((exercise, exerciseIndex) => {
    exercise.sets.forEach((set, setIndex) => {
      const label = `Ejercicio #${exerciseIndex + 1}, serie #${setIndex + 1}`
      if (set.weightKg <= 0) {
        errors.push(`${label}: el peso debe ser mayor a 0 kg`)
      }
      if (set.repetitions <= 0) {
        errors.push(`${label}: las repeticiones deben ser mayores a 0`)
      }
      if (set.rir !== null && (set.rir < 0 || set.rir > 10)) {
        errors.push(`${label}: el RIR debe estar entre 0 y 10`)
      }
      if (set.rpe !== null && (set.rpe < 0 || set.rpe > 10)) {
        errors.push(`${label}: el RPE debe estar entre 0 y 10`)
      }
    })
  })

  return errors
}

/**
 * Volumen total de una serie: peso x repeticiones. Suma simple, sin
 * ponderar por intensidad (eso lo hara el Progress Engine en la Fase 4).
 * Solo pide peso y repeticiones a proposito: cualquier fuente de series
 * (un WorkoutInput completo, o una fila cruda de la DB) sirve sin adaptar.
 */
export function totalVolumeKg(sets: Pick<SetInput, 'weightKg' | 'repetitions'>[]): number {
  return sets.reduce((sum, set) => sum + set.weightKg * set.repetitions, 0)
}
