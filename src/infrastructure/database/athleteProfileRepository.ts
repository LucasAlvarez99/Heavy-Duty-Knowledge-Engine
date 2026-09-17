import { supabase } from './supabaseClient'
import type { AthleteProfileInput } from '../../domain/training/athleteProfile'

export interface AthleteProfileRow extends AthleteProfileInput {
  id: string
  userId: string
}

interface AthleteProfileDbRow {
  id: string
  user_id: string
  display_name: string | null
  birth_date: string
  height_cm: number
  weight_kg: number
  experience_level: AthleteProfileInput['experienceLevel']
  goal: AthleteProfileInput['goal']
  available_days: number
  session_duration_minutes: number
  equipment: string
}

function fromDbRow(row: AthleteProfileDbRow): AthleteProfileRow {
  return {
    id: row.id,
    userId: row.user_id,
    displayName: row.display_name ?? '',
    birthDate: row.birth_date,
    heightCm: row.height_cm,
    weightKg: row.weight_kg,
    experienceLevel: row.experience_level,
    goal: row.goal,
    availableDays: row.available_days,
    sessionDurationMinutes: row.session_duration_minutes,
    equipment: row.equipment,
  }
}

export async function getAthleteProfile(userId: string): Promise<AthleteProfileRow | null> {
  const { data, error } = await supabase
    .from('athlete_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    throw error
  }
  return data ? fromDbRow(data as AthleteProfileDbRow) : null
}

export async function upsertAthleteProfile(
  userId: string,
  input: AthleteProfileInput,
): Promise<AthleteProfileRow> {
  const { data, error } = await supabase
    .from('athlete_profiles')
    .upsert(
      {
        user_id: userId,
        display_name: input.displayName,
        birth_date: input.birthDate,
        height_cm: input.heightCm,
        weight_kg: input.weightKg,
        experience_level: input.experienceLevel,
        goal: input.goal,
        available_days: input.availableDays,
        session_duration_minutes: input.sessionDurationMinutes,
        equipment: input.equipment,
      },
      { onConflict: 'user_id' },
    )
    .select('*')
    .single()

  if (error) {
    throw error
  }
  return fromDbRow(data as AthleteProfileDbRow)
}
