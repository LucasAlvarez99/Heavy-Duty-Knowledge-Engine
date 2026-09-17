import { describe, expect, it } from 'vitest'
import {
  bestEstimateFromSets,
  compareFormulas,
  estimateOneRepMax,
  intensityTable,
  isNewPersonalRecord,
  loadForPercentage,
} from './oneRepMax'

describe('estimateOneRepMax', () => {
  it('calcula e1RM con la formula de Epley', () => {
    // Caso de referencia documentado en el plan tecnico: 80 kg x 8 reps ~= 101.3 kg
    expect(estimateOneRepMax({ weightKg: 80, repetitions: 8 }, 'epley')).toBeCloseTo(101.3, 1)
  })

  it('rechaza pesos invalidos', () => {
    expect(() => estimateOneRepMax({ weightKg: 0, repetitions: 8 })).toThrow()
  })

  it('rechaza repeticiones invalidas', () => {
    expect(() => estimateOneRepMax({ weightKg: 80, repetitions: 0 })).toThrow()
  })

  it('permite comparar varias formulas para la misma serie', () => {
    const result = compareFormulas({ weightKg: 100, repetitions: 5 })
    expect(result.epley).toBeGreaterThan(100)
    expect(result.brzycki).toBeGreaterThan(100)
    expect(result.lombardi).toBeGreaterThan(100)
  })
})

describe('loadForPercentage', () => {
  it('calcula la carga para un porcentaje de 1RM', () => {
    expect(loadForPercentage(100, 80)).toBe(80)
  })

  it('rechaza porcentajes fuera de rango', () => {
    expect(() => loadForPercentage(100, 0)).toThrow()
    expect(() => loadForPercentage(100, 150)).toThrow()
  })
})

describe('intensityTable', () => {
  it('genera la tabla completa de porcentajes para un 1RM dado', () => {
    const table = intensityTable(100)
    expect(table).toHaveLength(9)
    expect(table[0]).toEqual({ percentage: 50, weightKg: 50 })
    expect(table.at(-1)).toEqual({ percentage: 100, weightKg: 100 })
  })
})

describe('isNewPersonalRecord', () => {
  it('la primera marca siempre es PR', () => {
    expect(isNewPersonalRecord(80, null)).toBe(true)
  })

  it('es PR si supera el mejor historico', () => {
    expect(isNewPersonalRecord(101, 100)).toBe(true)
  })

  it('no es PR si iguala o queda por debajo del mejor historico', () => {
    expect(isNewPersonalRecord(100, 100)).toBe(false)
    expect(isNewPersonalRecord(90, 100)).toBe(false)
  })
})

describe('bestEstimateFromSets', () => {
  it('devuelve el e1RM mas alto entre varias series', () => {
    const sets = [
      { weightKg: 80, repetitions: 8 },
      { weightKg: 100, repetitions: 3 },
      { weightKg: 60, repetitions: 12 },
    ]
    const best = bestEstimateFromSets(sets)
    expect(best).toBeCloseTo(estimateOneRepMax({ weightKg: 100, repetitions: 3 }), 5)
  })

  it('ignora series con peso o repeticiones invalidas', () => {
    const sets = [
      { weightKg: 0, repetitions: 8 },
      { weightKg: 80, repetitions: 0 },
    ]
    expect(bestEstimateFromSets(sets)).toBeNull()
  })

  it('devuelve null para una lista vacia', () => {
    expect(bestEstimateFromSets([])).toBeNull()
  })
})
