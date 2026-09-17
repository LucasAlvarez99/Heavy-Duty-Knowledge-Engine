import { bestEstimateFromSets, isNewPersonalRecord } from '../domain/strength/oneRepMax'
import type { WorkoutExercise } from '../domain/training/workout'
import { createOneRmRecord, getBestOneRm } from '../infrastructure/database/oneRmRepository'

export interface PersonalRecordResult {
  exerciseId: string
  weightKg: number
}

/**
 * Despues de guardar un entrenamiento, revisa cada ejercicio: si el mejor
 * e1RM (formula Epley) entre las series registradas supera la mejor marca
 * conocida, lo guarda como un OneRmRecord de tipo ESTIMATED y lo reporta
 * como PR nuevo.
 *
 * Este es el primer caso de uso de la capa `services/`: coordina el motor
 * de fuerza (dominio puro, sin saber nada de Supabase) con el repositorio
 * (que sabe hablar con la DB, pero no conoce reglas de negocio). Ninguna de
 * las dos partes deberia depender de la otra directamente.
 */
export async function detectAndRecordPersonalRecords(
  userId: string,
  date: string,
  exercises: WorkoutExercise[],
): Promise<PersonalRecordResult[]> {
  const results: PersonalRecordResult[] = []

  for (const exercise of exercises) {
    const candidate = bestEstimateFromSets(exercise.sets, 'epley')
    if (candidate === null) continue

    const previousBest = await getBestOneRm(userId, exercise.exerciseId)

    if (isNewPersonalRecord(candidate, previousBest?.weightKg ?? null)) {
      await createOneRmRecord(userId, {
        exerciseId: exercise.exerciseId,
        weightKg: candidate,
        type: 'ESTIMATED',
        formula: 'epley',
        date,
      })
      results.push({ exerciseId: exercise.exerciseId, weightKg: candidate })
    }
  }

  return results
}
