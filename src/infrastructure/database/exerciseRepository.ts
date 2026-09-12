import { supabase } from './supabaseClient'
import type { Exercise } from '../../domain/training/exercise'

interface ExerciseDbRow {
  id: string
  name: string
  muscle_group: string
  secondary_muscles: string[] | null
  equipment: string | null
  instructions: string | null
}

function fromDbRow(row: ExerciseDbRow): Exercise {
  return {
    id: row.id,
    name: row.name,
    muscleGroup: row.muscle_group,
    secondaryMuscles: row.secondary_muscles ?? [],
    equipment: row.equipment ?? '',
    instructions: row.instructions ?? '',
  }
}

export async function listExercises(): Promise<Exercise[]> {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    throw error
  }
  return (data as ExerciseDbRow[]).map(fromDbRow)
}
