import { describe, expect, it } from 'vitest'
import { analyzeProgress } from './progressEngine'
import type { ExerciseSessionSnapshot } from '../../domain/progression/types'

function session(
  date: string,
  estimatedOneRmKg: number | null,
  averageRir: number | null = 2,
  totalVolumeKg = 1000,
): ExerciseSessionSnapshot {
  return { date, estimatedOneRmKg, totalVolumeKg, averageRir }
}

describe('analyzeProgress — datos insuficientes', () => {
  it('devuelve confianza 0 con menos de 2 sesiones validas', () => {
    const result = analyzeProgress([session('2026-09-01', 100)], null)
    expect(result.confidenceScore).toBe(0)
    expect(result.status).toBe('STABLE')
  })

  it('ignora sesiones sin e1RM al contar el minimo', () => {
    const result = analyzeProgress(
      [session('2026-09-01', null), session('2026-09-03', 100)],
      null,
    )
    expect(result.confidenceScore).toBe(0)
  })
})

describe('analyzeProgress — progreso rapido', () => {
  it('detecta progreso rapido con un salto grande de e1RM', () => {
    const result = analyzeProgress(
      [session('2026-08-01', 100), session('2026-08-15', 108)],
      90,
    )
    // 108 es un nuevo maximo historico (>90), asi que primero se detecta como PR.
    expect(result.status).toBe('POSSIBLE_NEW_PR')
  })

  it('detecta progreso rapido cuando no es un nuevo maximo historico', () => {
    const result = analyzeProgress(
      [session('2026-08-01', 100), session('2026-08-15', 108)],
      120,
    )
    expect(result.status).toBe('RAPID_PROGRESS')
    expect(result.trend).toBe('up')
    expect(result.progressPercentage).toBeCloseTo(8, 0)
  })
})

describe('analyzeProgress — progreso consistente', () => {
  it('detecta progreso consistente con una suba moderada', () => {
    const result = analyzeProgress(
      [session('2026-08-01', 100), session('2026-08-15', 102.5)],
      150,
    )
    expect(result.status).toBe('CONSISTENT_PROGRESS')
    expect(result.trend).toBe('up')
  })
})

describe('analyzeProgress — estancamiento', () => {
  it('detecta plateau con 3+ sesiones sin variacion', () => {
    const result = analyzeProgress(
      [
        session('2026-08-01', 100),
        session('2026-08-08', 100.2),
        session('2026-08-15', 100.1),
        session('2026-08-22', 100.3),
      ],
      150,
    )
    expect(result.status).toBe('POSSIBLE_PLATEAU')
  })

  it('no marca plateau con solo 2 sesiones sin variacion', () => {
    const result = analyzeProgress(
      [session('2026-08-01', 100), session('2026-08-08', 100.1)],
      150,
    )
    expect(result.status).not.toBe('POSSIBLE_PLATEAU')
  })
})

describe('analyzeProgress — disminucion de rendimiento', () => {
  it('detecta caida entre la penultima y la ultima sesion', () => {
    const result = analyzeProgress(
      [session('2026-08-01', 100), session('2026-08-08', 105), session('2026-08-15', 95)],
      150,
    )
    expect(result.status).toBe('PERFORMANCE_DECLINE')
    expect(result.trend).toBe('down')
  })
})

describe('analyzeProgress — preparado para progresar', () => {
  it('detecta RIR en aumento con e1RM estable', () => {
    const result = analyzeProgress(
      [
        session('2026-08-01', 100, 1),
        session('2026-08-08', 100.1, 2),
        session('2026-08-15', 100, 3),
      ],
      150,
    )
    expect(result.status).toBe('READY_TO_PROGRESS')
  })
})

describe('analyzeProgress — posible nuevo PR', () => {
  it('marca PR cuando la ultima sesion supera el mejor historico', () => {
    const result = analyzeProgress(
      [session('2026-08-01', 100), session('2026-08-15', 110)],
      105,
    )
    expect(result.status).toBe('POSSIBLE_NEW_PR')
  })

  it('marca PR cuando no habia marca previa (null)', () => {
    const result = analyzeProgress(
      [session('2026-08-01', 80), session('2026-08-15', 85)],
      null,
    )
    expect(result.status).toBe('POSSIBLE_NEW_PR')
  })
})

describe('analyzeProgress — confidence score', () => {
  it('sube con mas sesiones consistentes en la misma direccion', () => {
    const fewSessions = analyzeProgress(
      [session('2026-08-01', 100), session('2026-08-08', 101)],
      200,
    )
    const manySessions = analyzeProgress(
      [
        session('2026-07-01', 95),
        session('2026-07-08', 97),
        session('2026-07-15', 98),
        session('2026-07-22', 99),
        session('2026-07-29', 100),
        session('2026-08-05', 101),
      ],
      200,
    )
    expect(manySessions.confidenceScore).toBeGreaterThan(fewSessions.confidenceScore)
  })
})
