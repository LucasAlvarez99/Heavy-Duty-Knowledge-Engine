import { supabase } from './supabaseClient'

interface WorkoutExerciseWithDateRow {
  id: string
  workouts: { date: string } | { date: string }[] | null
}

interface SetWeightRepsRirRow {
  workout_exercise_id: string
  weight_kg: number
  repetitions: number
  rir: number | null
}

export interface ExerciseSessionSetsRaw {
  workoutExerciseId: string
  date: string
  sets: { weightKg: number; repetitions: number; rir: number | null }[]
}

/**
 * Arma, para un usuario y ejercicio puntual, la lista de sesiones donde se
 * entreno ese ejercicio con sus series crudas (peso/reps/RIR). Es la unica
 * responsabilidad de este repositorio: traer datos. El Progress Engine
 * (dominio puro) es quien decide que significan.
 *
 * Se resuelve con dos consultas simples en vez de un unico select anidado
 * con filtro sobre la tabla embebida, seleccionar por dos pasos evita
 * ambiguedades de sintaxis en el embedding de PostgREST y es el mismo
 * patron que ya usa `workoutRepository.getWorkoutWithExercises`.
 */
export async function listExerciseSessions(
  exerciseId: string,
): Promise<ExerciseSessionSetsRaw[]> {
  const { data: exerciseRows, error: exerciseError } = await supabase
    .from('workout_exercises')
    .select('id, workouts(date)')
    .eq('exercise_id', exerciseId)

  if (exerciseError) throw exerciseError

  const rows = exerciseRows as WorkoutExerciseWithDateRow[]
  if (rows.length === 0) return []

  const workoutExerciseIds = rows.map((row) => row.id)

  const { data: setRows, error: setsError } = await supabase
    .from('sets')
    .select('workout_exercise_id, weight_kg, repetitions, rir')
    .in('workout_exercise_id', workoutExerciseIds)

  if (setsError) throw setsError

  const sets = setRows as SetWeightRepsRirRow[]

  return rows
    .map((row) => {
      const workoutRelation = Array.isArray(row.workouts) ? row.workouts[0] : row.workouts
      return {
        workoutExerciseId: row.id,
        date: workoutRelation?.date ?? '',
        sets: sets
          .filter((set) => set.workout_exercise_id === row.id)
          .map((set) => ({ weightKg: set.weight_kg, repetitions: set.repetitions, rir: set.rir })),
      }
    })
    .filter((session) => session.date !== '' && session.sets.length > 0)
    .sort((a, b) => a.date.localeCompare(b.date))
}
