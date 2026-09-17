import { supabase } from './supabaseClient'
import type { EstimationFormula, OneRmRecord, OneRmSource } from '../../domain/strength/types'

interface OneRmDbRow {
  id: string
  user_id: string
  exercise_id: string
  weight_kg: number
  type: OneRmSource
  formula: EstimationFormula | null
  date: string
}

function fromDbRow(row: OneRmDbRow): OneRmRecord {
  return {
    id: row.id,
    userId: row.user_id,
    exerciseId: row.exercise_id,
    weightKg: row.weight_kg,
    type: row.type,
    formula: row.formula,
    date: row.date,
  }
}

export async function listOneRmHistory(userId: string, exerciseId: string): Promise<OneRmRecord[]> {
  const { data, error } = await supabase
    .from('one_rm_records')
    .select('*')
    .eq('user_id', userId)
    .eq('exercise_id', exerciseId)
    .order('date', { ascending: true })

  if (error) throw error
  return (data as OneRmDbRow[]).map(fromDbRow)
}

/**
 * Mejor marca conocida para un ejercicio: prioriza cualquier REAL por sobre
 * las ESTIMATED, y dentro de cada tipo el peso mas alto. Un 1RM medido de
 * verdad es mas confiable que uno estimado por formula, incluso si el
 * estimado da un numero mayor.
 */
export async function getBestOneRm(userId: string, exerciseId: string): Promise<OneRmRecord | null> {
  const { data: realRows, error: realError } = await supabase
    .from('one_rm_records')
    .select('*')
    .eq('user_id', userId)
    .eq('exercise_id', exerciseId)
    .eq('type', 'REAL')
    .order('weight_kg', { ascending: false })
    .limit(1)

  if (realError) throw realError
  if (realRows && realRows.length > 0) return fromDbRow(realRows[0] as OneRmDbRow)

  const { data: estimatedRows, error: estimatedError } = await supabase
    .from('one_rm_records')
    .select('*')
    .eq('user_id', userId)
    .eq('exercise_id', exerciseId)
    .eq('type', 'ESTIMATED')
    .order('weight_kg', { ascending: false })
    .limit(1)

  if (estimatedError) throw estimatedError
  if (estimatedRows && estimatedRows.length > 0) return fromDbRow(estimatedRows[0] as OneRmDbRow)

  return null
}

export async function listBestOneRmByExercise(
  userId: string,
): Promise<Map<string, OneRmRecord>> {
  const { data, error } = await supabase
    .from('one_rm_records')
    .select('*')
    .eq('user_id', userId)
    .order('weight_kg', { ascending: false })

  if (error) throw error

  const rows = (data as OneRmDbRow[]).map(fromDbRow)
  const bestByExercise = new Map<string, OneRmRecord>()

  for (const row of rows) {
    const current = bestByExercise.get(row.exerciseId)
    if (!current) {
      bestByExercise.set(row.exerciseId, row)
      continue
    }
    // Ya estan ordenadas por peso descendente, pero un REAL siempre gana
    // aunque su peso sea menor que un ESTIMATED ya guardado.
    if (current.type === 'ESTIMATED' && row.type === 'REAL') {
      bestByExercise.set(row.exerciseId, row)
    }
  }

  return bestByExercise
}

export interface RecordOneRmInput {
  exerciseId: string
  weightKg: number
  type: OneRmSource
  formula: EstimationFormula | null
  date: string
}

export async function createOneRmRecord(
  userId: string,
  input: RecordOneRmInput,
): Promise<OneRmRecord> {
  const { data, error } = await supabase
    .from('one_rm_records')
    .insert({
      user_id: userId,
      exercise_id: input.exerciseId,
      weight_kg: input.weightKg,
      type: input.type,
      formula: input.formula,
      date: input.date,
    })
    .select('*')
    .single()

  if (error) throw error
  return fromDbRow(data as OneRmDbRow)
}
