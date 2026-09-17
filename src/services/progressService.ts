import { bestEstimateFromSets } from '../domain/strength/oneRepMax'
import { totalVolumeKg } from '../domain/training/workout'
import { analyzeProgress } from '../engines/progress/progressEngine'
import type { ExerciseSessionSnapshot, ProgressAnalysis } from '../domain/progression/types'
import { listExerciseSessions } from '../infrastructure/database/progressRepository'
import { getBestOneRm } from '../infrastructure/database/oneRmRepository'

function averageRir(sets: { rir: number | null }[]): number | null {
  const withRir = sets.filter((set): set is { rir: number } => set.rir !== null)
  if (withRir.length === 0) return null
  const sum = withRir.reduce((total, set) => total + set.rir, 0)
  return Math.round((sum / withRir.length) * 10) / 10
}

export interface ProgressReport {
  analysis: ProgressAnalysis
  sessions: ExerciseSessionSnapshot[]
}

export async function getExerciseProgress(userId: string, exerciseId: string): Promise<ProgressReport> {
  const rawSessions = await listExerciseSessions(exerciseId)

  const sessions: ExerciseSessionSnapshot[] = rawSessions.map((session) => ({
    date: session.date,
    estimatedOneRmKg: bestEstimateFromSets(session.sets, 'epley'),
    totalVolumeKg: totalVolumeKg(session.sets),
    averageRir: averageRir(session.sets),
  }))

  const previousBest = await getBestOneRm(userId, exerciseId)

  const analysis = analyzeProgress(sessions, previousBest?.weightKg ?? null)

  return { analysis, sessions }
}
