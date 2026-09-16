import { supabase } from './supabaseClient'
import type { Routine, RoutineExercise, RoutineInput, RoutineWithExercises } from '../../domain/training/routine'

interface RoutineDbRow {
  id: string
  user_id: string
  name: string
  goal: Routine['goal']
  level: Routine['level']
  notes: string
  created_at: string
  updated_at: string
}

interface RoutineExerciseDbRow {
  id: string
  routine_id: string
  exercise_id: string
  order_index: number
  target_sets: number
  target_reps: number
  target_rir: number | null
  rest_seconds: number | null
}

function routineFromDbRow(row: RoutineDbRow): Routine {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    goal: row.goal,
    level: row.level,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function routineExerciseFromDbRow(row: RoutineExerciseDbRow): RoutineExercise {
  return {
    id: row.id,
    routineId: row.routine_id,
    exerciseId: row.exercise_id,
    orderIndex: row.order_index,
    targetSets: row.target_sets,
    targetReps: row.target_reps,
    targetRir: row.target_rir,
    restSeconds: row.rest_seconds,
  }
}

export async function listRoutines(userId: string): Promise<Routine[]> {
  const { data, error } = await supabase
    .from('routines')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return (data as RoutineDbRow[]).map(routineFromDbRow)
}

export async function getRoutineWithExercises(routineId: string): Promise<RoutineWithExercises | null> {
  const { data: routineRow, error: routineError } = await supabase
    .from('routines')
    .select('*')
    .eq('id', routineId)
    .maybeSingle()

  if (routineError) throw routineError
  if (!routineRow) return null

  const { data: exerciseRows, error: exercisesError } = await supabase
    .from('routine_exercises')
    .select('*')
    .eq('routine_id', routineId)
    .order('order_index', { ascending: true })

  if (exercisesError) throw exercisesError

  return {
    ...routineFromDbRow(routineRow as RoutineDbRow),
    exercises: (exerciseRows as RoutineExerciseDbRow[]).map(routineExerciseFromDbRow),
  }
}

export async function createRoutine(userId: string, input: RoutineInput): Promise<RoutineWithExercises> {
  const { data: routineRow, error: routineError } = await supabase
    .from('routines')
    .insert({
      user_id: userId,
      name: input.name,
      goal: input.goal,
      level: input.level,
      notes: input.notes,
    })
    .select('*')
    .single()

  if (routineError) throw routineError

  const exercises = await insertRoutineExercises(routineRow.id, input)

  return { ...routineFromDbRow(routineRow as RoutineDbRow), exercises }
}

export async function updateRoutine(
  routineId: string,
  input: RoutineInput,
): Promise<RoutineWithExercises> {
  const { data: routineRow, error: routineError } = await supabase
    .from('routines')
    .update({
      name: input.name,
      goal: input.goal,
      level: input.level,
      notes: input.notes,
    })
    .eq('id', routineId)
    .select('*')
    .single()

  if (routineError) throw routineError

  // Reemplazo completo de los ejercicios de la rutina: mas simple y menos
  // propenso a errores que diffear altas/bajas/reordenamientos para un MVP.
  const { error: deleteError } = await supabase
    .from('routine_exercises')
    .delete()
    .eq('routine_id', routineId)

  if (deleteError) throw deleteError

  const exercises = await insertRoutineExercises(routineId, input)

  return { ...routineFromDbRow(routineRow as RoutineDbRow), exercises }
}

export async function deleteRoutine(routineId: string): Promise<void> {
  const { error } = await supabase.from('routines').delete().eq('id', routineId)
  if (error) throw error
}

async function insertRoutineExercises(
  routineId: string,
  input: RoutineInput,
): Promise<RoutineExercise[]> {
  if (input.exercises.length === 0) return []

  const { data, error } = await supabase
    .from('routine_exercises')
    .insert(
      input.exercises.map((exercise) => ({
        routine_id: routineId,
        exercise_id: exercise.exerciseId,
        order_index: exercise.orderIndex,
        target_sets: exercise.targetSets,
        target_reps: exercise.targetReps,
        target_rir: exercise.targetRir,
        rest_seconds: exercise.restSeconds,
      })),
    )
    .select('*')
    .order('order_index', { ascending: true })

  if (error) throw error
  return (data as RoutineExerciseDbRow[]).map(routineExerciseFromDbRow)
}
