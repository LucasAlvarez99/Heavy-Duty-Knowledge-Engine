import { describe, expect, it } from 'vitest'
import { compareFormulas, estimateOneRepMax, intensityTable, loadForPercentage } from './oneRepMax'

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
