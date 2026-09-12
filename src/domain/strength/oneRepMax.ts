import type { EstimationFormula, IntensityZone, SetPerformance } from './types'

/**
 * Estima el 1RM (una repeticion maxima) a partir de una serie submaxima.
 *
 * Este motor nunca debe presentarse como una medicion exacta: el resultado
 * es siempre una estimacion, y debe mostrarse etiquetado como tal en la UI
 * (ver regla de negocio: "nunca presentar una estimacion como medicion
 * exacta").
 */

function assertValidSet(set: SetPerformance): void {
  if (set.weightKg <= 0) {
    throw new Error('El peso debe ser mayor a 0 kg')
  }
  if (set.repetitions <= 0) {
    throw new Error('Las repeticiones deben ser mayores a 0')
  }
}

function epley(set: SetPerformance): number {
  return set.weightKg * (1 + set.repetitions / 30)
}

function brzycki(set: SetPerformance): number {
  if (set.repetitions >= 37) {
    // La formula de Brzycki degenera cerca de 37 reps; fuera de ese rango
    // no es confiable, se evita devolver un numero sin sentido.
    throw new Error('Brzycki no es confiable para 37 o mas repeticiones')
  }
  return set.weightKg * (36 / (37 - set.repetitions))
}

function lombardi(set: SetPerformance): number {
  return set.weightKg * Math.pow(set.repetitions, 0.10)
}

const FORMULAS: Record<EstimationFormula, (set: SetPerformance) => number> = {
  epley,
  brzycki,
  lombardi,
}

export function estimateOneRepMax(
  set: SetPerformance,
  formula: EstimationFormula = 'epley',
): number {
  assertValidSet(set)
  const raw = FORMULAS[formula](set)
  return Math.round(raw * 10) / 10
}

export function compareFormulas(set: SetPerformance): Record<EstimationFormula, number> {
  assertValidSet(set)
  return {
    epley: estimateOneRepMax(set, 'epley'),
    brzycki: estimateOneRepMax(set, 'brzycki'),
    lombardi: estimateOneRepMax(set, 'lombardi'),
  }
}

export const INTENSITY_ZONES: IntensityZone[] = [
  { label: 'Entrada en calor / Potencia', minPercentage: 50, maxPercentage: 60 },
  { label: 'Hipertrofia / Volumen', minPercentage: 70, maxPercentage: 75 },
  { label: 'Hipertrofia / Fuerza hibrida', minPercentage: 80, maxPercentage: 85 },
  { label: 'Fuerza maxima', minPercentage: 90, maxPercentage: 95 },
]

export function loadForPercentage(oneRmKg: number, percentage: number): number {
  if (percentage <= 0 || percentage > 110) {
    throw new Error('El porcentaje debe estar entre 0 y 110')
  }
  return Math.round(oneRmKg * (percentage / 100) * 10) / 10
}

export function intensityTable(oneRmKg: number): { percentage: number; weightKg: number }[] {
  const percentages = [50, 60, 70, 75, 80, 85, 90, 95, 100]
  return percentages.map((percentage) => ({
    percentage,
    weightKg: loadForPercentage(oneRmKg, percentage),
  }))
}
