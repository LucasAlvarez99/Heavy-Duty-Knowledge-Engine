import { describe, expect, it } from 'vitest'
import { validateHistoricalRoutineInput, validateProvenance } from './types'
import type { HistoricalRoutineInput } from './types'

function baseRoutine(overrides: Partial<HistoricalRoutineInput> = {}): HistoricalRoutineInput {
  return {
    sourceId: 'src-1',
    name: 'Rutina A/B',
    author: 'Mike Mentzer',
    methodology: 'Heavy Duty clasico',
    era: '1980s',
    context: 'Para atletas que ya completaron la fase de acondicionamiento',
    frequencyDescription: 'Dias alternos',
    exercises: [
      {
        exerciseName: 'Sentadilla',
        orderIndex: 0,
        sets: 1,
        repsDescription: 'Hasta el fallo',
        supersetGroup: null,
        technique: null,
      },
    ],
    provenance: 'DOCUMENTED',
    citation: 'Heavy Duty (Mentzer), cap. VI, pag. 47',
    ...overrides,
  }
}

describe('validateHistoricalRoutineInput', () => {
  it('acepta una rutina historica completa', () => {
    expect(validateHistoricalRoutineInput(baseRoutine())).toEqual([])
  })

  it('rechaza una rutina sin ejercicios', () => {
    const errors = validateHistoricalRoutineInput(baseRoutine({ exercises: [] }))
    expect(errors.some((e) => e.includes('al menos un ejercicio'))).toBe(true)
  })

  it('rechaza una rutina sin frecuencia (la regla de oro: no alcanza con la lista de ejercicios)', () => {
    const errors = validateHistoricalRoutineInput(baseRoutine({ frequencyDescription: '' }))
    expect(errors.some((e) => e.includes('frecuencia'))).toBe(true)
  })

  it('rechaza una rutina sin contexto', () => {
    const errors = validateHistoricalRoutineInput(baseRoutine({ context: '  ' }))
    expect(errors.some((e) => e.includes('contexto'))).toBe(true)
  })

  it('rechaza un ejercicio sin series', () => {
    const errors = validateHistoricalRoutineInput(
      baseRoutine({
        exercises: [
          {
            exerciseName: 'Press de banca',
            orderIndex: 0,
            sets: 0,
            repsDescription: 'Hasta el fallo',
            supersetGroup: null,
            technique: null,
          },
        ],
      }),
    )
    expect(errors.some((e) => e.includes('al menos 1 serie'))).toBe(true)
  })
})

describe('validateProvenance', () => {
  it('acepta una entrada DOCUMENTED con cita numerica', () => {
    const errors = validateProvenance({
      sourceId: 'src-1',
      citation: 'Heavy Duty (Mentzer), pag. 40',
      provenance: 'DOCUMENTED',
    })
    expect(errors).toEqual([])
  })

  it('rechaza una entrada sin fuente', () => {
    const errors = validateProvenance({ sourceId: '', citation: 'pag. 40', provenance: 'DOCUMENTED' })
    expect(errors.some((e) => e.includes('fuente'))).toBe(true)
  })

  it('rechaza una entrada sin cita', () => {
    const errors = validateProvenance({ sourceId: 'src-1', citation: '', provenance: 'INTERPRETED' })
    expect(errors.some((e) => e.includes('cita'))).toBe(true)
  })

  it('rechaza una entrada DOCUMENTED con cita sin numero de pagina/capitulo', () => {
    const errors = validateProvenance({
      sourceId: 'src-1',
      citation: 'Heavy Duty, seccion de principios',
      provenance: 'DOCUMENTED',
    })
    expect(errors.some((e) => e.includes('DOCUMENTED'))).toBe(true)
  })

  it('no exige numero en la cita para ADAPTED o INTERPRETED', () => {
    const errors = validateProvenance({
      sourceId: 'src-1',
      citation: 'Adaptacion moderna basada en el capitulo de principios',
      provenance: 'ADAPTED',
    })
    expect(errors).toEqual([])
  })
})
