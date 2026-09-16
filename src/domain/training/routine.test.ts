import { describe, expect, it } from 'vitest'
import { reorderExercises, validateRoutineInput } from './routine'
import type { RoutineInput } from './routine'

function baseInput(overrides: Partial<RoutineInput> = {}): RoutineInput {
  return {
    name: 'Rutina de fuerza',
    goal: 'strength',
    level: 'intermediate',
    notes: '',
    exercises: [
      {
        exerciseId: 'ex-1',
        orderIndex: 0,
        targetSets: 4,
        targetReps: 6,
        targetRir: 2,
        restSeconds: 120,
      },
    ],
    ...overrides,
  }
}

describe('validateRoutineInput', () => {
  it('acepta una rutina valida', () => {
    expect(validateRoutineInput(baseInput())).toEqual([])
  })

  it('rechaza una rutina sin nombre', () => {
    const errors = validateRoutineInput(baseInput({ name: '  ' }))
    expect(errors).toContain('El nombre de la rutina es obligatorio')
  })

  it('rechaza una rutina sin ejercicios', () => {
    const errors = validateRoutineInput(baseInput({ exercises: [] }))
    expect(errors).toContain('La rutina debe tener al menos un ejercicio')
  })

  it('rechaza series objetivo fuera de rango', () => {
    const errors = validateRoutineInput(
      baseInput({
        exercises: [
          {
            exerciseId: 'ex-1',
            orderIndex: 0,
            targetSets: 0,
            targetReps: 6,
            targetRir: null,
            restSeconds: null,
          },
        ],
      }),
    )
    expect(errors.some((e) => e.includes('series objetivo'))).toBe(true)
  })

  it('rechaza un RIR objetivo fuera de rango', () => {
    const errors = validateRoutineInput(
      baseInput({
        exercises: [
          {
            exerciseId: 'ex-1',
            orderIndex: 0,
            targetSets: 3,
            targetReps: 10,
            targetRir: 15,
            restSeconds: null,
          },
        ],
      }),
    )
    expect(errors.some((e) => e.includes('RIR'))).toBe(true)
  })
})

describe('reorderExercises', () => {
  it('reasigna orderIndex de forma secuencial', () => {
    const result = reorderExercises([
      { exerciseId: 'a', orderIndex: 5, targetSets: 3, targetReps: 8, targetRir: null, restSeconds: null },
      { exerciseId: 'b', orderIndex: 1, targetSets: 3, targetReps: 8, targetRir: null, restSeconds: null },
    ])
    expect(result.map((e) => e.orderIndex)).toEqual([0, 1])
  })
})
