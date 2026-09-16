import { describe, expect, it } from 'vitest'
import { totalVolumeKg, validateWorkoutInput } from './workout'
import type { SetInput, WorkoutInput } from './workout'

function baseSet(overrides: Partial<SetInput> = {}): SetInput {
  return {
    setNumber: 1,
    weightKg: 80,
    repetitions: 8,
    rir: 2,
    rpe: null,
    restSeconds: 120,
    ...overrides,
  }
}

function baseInput(overrides: Partial<WorkoutInput> = {}): WorkoutInput {
  return {
    routineId: null,
    date: '2026-09-16',
    notes: '',
    exercises: [{ exerciseId: 'ex-1', orderIndex: 0, sets: [baseSet()] }],
    ...overrides,
  }
}

describe('validateWorkoutInput', () => {
  it('acepta un entrenamiento valido', () => {
    expect(validateWorkoutInput(baseInput())).toEqual([])
  })

  it('rechaza un entrenamiento sin series', () => {
    const errors = validateWorkoutInput(
      baseInput({ exercises: [{ exerciseId: 'ex-1', orderIndex: 0, sets: [] }] }),
    )
    expect(errors).toContain('El entrenamiento debe tener al menos una serie registrada')
  })

  it('rechaza peso invalido', () => {
    const errors = validateWorkoutInput(
      baseInput({ exercises: [{ exerciseId: 'ex-1', orderIndex: 0, sets: [baseSet({ weightKg: 0 })] }] }),
    )
    expect(errors.some((e) => e.includes('peso'))).toBe(true)
  })

  it('rechaza repeticiones invalidas', () => {
    const errors = validateWorkoutInput(
      baseInput({
        exercises: [{ exerciseId: 'ex-1', orderIndex: 0, sets: [baseSet({ repetitions: 0 })] }],
      }),
    )
    expect(errors.some((e) => e.includes('repeticiones'))).toBe(true)
  })

  it('rechaza RIR y RPE fuera de rango', () => {
    const errors = validateWorkoutInput(
      baseInput({
        exercises: [
          {
            exerciseId: 'ex-1',
            orderIndex: 0,
            sets: [baseSet({ rir: 11 }), baseSet({ setNumber: 2, rir: null, rpe: -1 })],
          },
        ],
      }),
    )
    expect(errors.some((e) => e.includes('RIR'))).toBe(true)
    expect(errors.some((e) => e.includes('RPE'))).toBe(true)
  })
})

describe('totalVolumeKg', () => {
  it('suma peso x repeticiones de todas las series', () => {
    const sets = [baseSet({ weightKg: 80, repetitions: 8 }), baseSet({ weightKg: 100, repetitions: 5 })]
    expect(totalVolumeKg(sets)).toBe(80 * 8 + 100 * 5)
  })

  it('devuelve 0 para una lista vacia', () => {
    expect(totalVolumeKg([])).toBe(0)
  })
})
