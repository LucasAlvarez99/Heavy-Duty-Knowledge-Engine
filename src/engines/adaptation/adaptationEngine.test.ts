import { describe, expect, it } from 'vitest'
import { suggestAdaptations } from './adaptationEngine'
import type { RoutineExercise } from '../../domain/training/routine'
import type { ProgressAnalysis, ProgressStatus } from '../../domain/progression/types'

function routineExercise(overrides: Partial<RoutineExercise> = {}): RoutineExercise {
  return {
    id: 're-1',
    routineId: 'r-1',
    exerciseId: 'ex-1',
    orderIndex: 0,
    targetSets: 3,
    targetReps: 8,
    targetRir: 2,
    restSeconds: 90,
    ...overrides,
  }
}

function analysis(status: ProgressStatus): ProgressAnalysis {
  return { status, trend: 'flat', progressPercentage: 0, confidenceScore: 80, recommendation: '' }
}

describe('suggestAdaptations', () => {
  it('no sugiere nada si no hay analisis de progreso para el ejercicio', () => {
    const suggestions = suggestAdaptations([routineExercise()], new Map())
    expect(suggestions).toEqual([])
  })

  it('no sugiere nada en progreso rapido, consistente, estable o PR', () => {
    const noSuggestionStatuses: ProgressStatus[] = [
      'RAPID_PROGRESS',
      'CONSISTENT_PROGRESS',
      'STABLE',
      'POSSIBLE_NEW_PR',
    ]
    for (const status of noSuggestionStatuses) {
      const suggestions = suggestAdaptations(
        [routineExercise()],
        new Map([['ex-1', analysis(status)]]),
      )
      expect(suggestions).toEqual([])
    }
  })

  it('READY_TO_PROGRESS baja el RIR objetivo si hay margen', () => {
    const suggestions = suggestAdaptations(
      [routineExercise({ targetRir: 2 })],
      new Map([['ex-1', analysis('READY_TO_PROGRESS')]]),
    )
    expect(suggestions).toEqual([
      expect.objectContaining({ field: 'targetRir', currentValue: 2, suggestedValue: 1 }),
    ])
  })

  it('READY_TO_PROGRESS suma una rep si el RIR ya esta en 0', () => {
    const suggestions = suggestAdaptations(
      [routineExercise({ targetRir: 0, targetReps: 8 })],
      new Map([['ex-1', analysis('READY_TO_PROGRESS')]]),
    )
    expect(suggestions).toEqual([
      expect.objectContaining({ field: 'targetReps', currentValue: 8, suggestedValue: 9 }),
    ])
  })

  it('POSSIBLE_PLATEAU sube el rango de reps si estaba bajo', () => {
    const suggestions = suggestAdaptations(
      [routineExercise({ targetReps: 6 })],
      new Map([['ex-1', analysis('POSSIBLE_PLATEAU')]]),
    )
    expect(suggestions).toEqual([
      expect.objectContaining({ field: 'targetReps', currentValue: 6, suggestedValue: 10 }),
    ])
  })

  it('POSSIBLE_PLATEAU baja el rango de reps si estaba alto', () => {
    const suggestions = suggestAdaptations(
      [routineExercise({ targetReps: 15 })],
      new Map([['ex-1', analysis('POSSIBLE_PLATEAU')]]),
    )
    expect(suggestions).toEqual([
      expect.objectContaining({ field: 'targetReps', currentValue: 15, suggestedValue: 11 }),
    ])
  })

  it('PERFORMANCE_DECLINE baja una serie si hay mas de 1', () => {
    const suggestions = suggestAdaptations(
      [routineExercise({ targetSets: 3 })],
      new Map([['ex-1', analysis('PERFORMANCE_DECLINE')]]),
    )
    expect(suggestions).toEqual([
      expect.objectContaining({ field: 'targetSets', currentValue: 3, suggestedValue: 2 }),
    ])
  })

  it('PERFORMANCE_DECLINE sube el RIR si ya esta en el minimo de series', () => {
    const suggestions = suggestAdaptations(
      [routineExercise({ targetSets: 1, targetRir: 2 })],
      new Map([['ex-1', analysis('PERFORMANCE_DECLINE')]]),
    )
    expect(suggestions).toEqual([
      expect.objectContaining({ field: 'targetRir', currentValue: 2, suggestedValue: 3 }),
    ])
  })

  it('respeta los limites validos (RIR nunca negativo, series nunca 0)', () => {
    const suggestions = suggestAdaptations(
      [routineExercise({ targetSets: 1, targetRir: 10 })],
      new Map([['ex-1', analysis('PERFORMANCE_DECLINE')]]),
    )
    expect(suggestions[0].suggestedValue).toBeLessThanOrEqual(10)
  })

  it('procesa varios ejercicios de la rutina de forma independiente', () => {
    const suggestions = suggestAdaptations(
      [
        routineExercise({ exerciseId: 'ex-1', targetRir: 2 }),
        routineExercise({ exerciseId: 'ex-2', targetSets: 3 }),
      ],
      new Map([
        ['ex-1', analysis('READY_TO_PROGRESS')],
        ['ex-2', analysis('PERFORMANCE_DECLINE')],
      ]),
    )
    expect(suggestions).toHaveLength(2)
    expect(suggestions.map((s) => s.exerciseId)).toEqual(['ex-1', 'ex-2'])
  })
})
