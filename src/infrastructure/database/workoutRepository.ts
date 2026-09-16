import { supabase } from './supabaseClient'
import type {
  SetEntry,
  Workout,
  WorkoutExercise,
  WorkoutInput,
  WorkoutWithExercises,
} from '../../domain/training/workout'

interface WorkoutDbRow {
  id: string
  user_id: string
  routine_id: string | null
  date: string
  start_time: string
  end_time: string | null
  notes: string
}

interface WorkoutExerciseDbRow {
  id: string
  workout_id: string
  exercise_id: string
  order_index: number
}

interface SetDbRow {
  id: string
  workout_exercise_id: string
  set_number: number
  weight_kg: number
  repetitions: number
  rir: number | null
  rpe: number | null
  rest_seconds: number | null
}

function workoutFromDbRow(row: WorkoutDbRow): Workout {
  return {
    id: row.id,
    userId: row.user_id,
    routineId: row.routine_id,
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    notes: row.notes,
  }
}

function setFromDbRow(row: SetDbRow): SetEntry {
  return {
    id: row.id,
    workoutExerciseId: row.workout_exercise_id,
    setNumber: row.set_number,
    weightKg: row.weight_kg,
    repetitions: row.repetitions,
    rir: row.rir,
    rpe: row.rpe,
    restSeconds: row.rest_seconds,
  }
}

export async function listWorkouts(userId: string): Promise<Workout[]> {
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .order('start_time', { ascending: false })

  if (error) throw error
  return (data as WorkoutDbRow[]).map(workoutFromDbRow)
}

export async function getWorkoutWithExercises(workoutId: string): Promise<WorkoutWithExercises | null> {
  const { data: workoutRow, error: workoutError } = await supabase
    .from('workouts')
    .select('*')
    .eq('id', workoutId)
    .maybeSingle()

  if (workoutError) throw workoutError
  if (!workoutRow) return null

  const { data: exerciseRows, error: exercisesError } = await supabase
    .from('workout_exercises')
    .select('*')
    .eq('workout_id', workoutId)
    .order('order_index', { ascending: true })

  if (exercisesError) throw exercisesError

  const workoutExerciseRows = exerciseRows as WorkoutExerciseDbRow[]
  const exerciseIds = workoutExerciseRows.map((row) => row.id)

  let setRows: SetDbRow[] = []
  if (exerciseIds.length > 0) {
    const { data, error: setsError } = await supabase
      .from('sets')
      .select('*')
      .in('workout_exercise_id', exerciseIds)
      .order('set_number', { ascending: true })

    if (setsError) throw setsError
    setRows = data as SetDbRow[]
  }

  const exercises: WorkoutExercise[] = workoutExerciseRows.map((row) => ({
    id: row.id,
    workoutId: row.workout_id,
    exerciseId: row.exercise_id,
    orderIndex: row.order_index,
    sets: setRows.filter((set) => set.workout_exercise_id === row.id).map(setFromDbRow),
  }))

  return { ...workoutFromDbRow(workoutRow as WorkoutDbRow), exercises }
}

/**
 * Crea el entrenamiento completo: la fila de `workouts`, una fila de
 * `workout_exercises` por cada ejercicio y sus `sets`. No hay edicion de
 * entrenamientos pasados en el MVP (se registran una vez y quedan como
 * historial), por eso no existe `updateWorkout`.
 */
export async function createWorkout(userId: string, input: WorkoutInput): Promise<WorkoutWithExercises> {
  const { data: workoutRow, error: workoutError } = await supabase
    .from('workouts')
    .insert({
      user_id: userId,
      routine_id: input.routineId,
      date: input.date,
      notes: input.notes,
    })
    .select('*')
    .single()

  if (workoutError) throw workoutError

  const exercises: WorkoutExercise[] = []

  for (const exerciseInput of input.exercises) {
    const { data: exerciseRow, error: exerciseError } = await supabase
      .from('workout_exercises')
      .insert({
        workout_id: workoutRow.id,
        exercise_id: exerciseInput.exerciseId,
        order_index: exerciseInput.orderIndex,
      })
      .select('*')
      .single()

    if (exerciseError) throw exerciseError

    let sets: SetEntry[] = []
    if (exerciseInput.sets.length > 0) {
      const { data: setRows, error: setsError } = await supabase
        .from('sets')
        .insert(
          exerciseInput.sets.map((set) => ({
            workout_exercise_id: exerciseRow.id,
            set_number: set.setNumber,
            weight_kg: set.weightKg,
            repetitions: set.repetitions,
            rir: set.rir,
            rpe: set.rpe,
            rest_seconds: set.restSeconds,
          })),
        )
        .select('*')
        .order('set_number', { ascending: true })

      if (setsError) throw setsError
      sets = (setRows as SetDbRow[]).map(setFromDbRow)
    }

    exercises.push({
      id: exerciseRow.id,
      workoutId: exerciseRow.workout_id,
      exerciseId: exerciseRow.exercise_id,
      orderIndex: exerciseRow.order_index,
      sets,
    })
  }

  return { ...workoutFromDbRow(workoutRow as WorkoutDbRow), exercises }
}

export async function deleteWorkout(workoutId: string): Promise<void> {
  const { error } = await supabase.from('workouts').delete().eq('id', workoutId)
  if (error) throw error
}
