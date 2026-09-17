export type OneRmSource = 'REAL' | 'ESTIMATED'

export type EstimationFormula = 'epley' | 'brzycki' | 'lombardi'

export interface SetPerformance {
  weightKg: number
  repetitions: number
}

export interface OneRmEstimate {
  formula: EstimationFormula
  estimatedOneRmKg: number
}

export interface IntensityZone {
  label: string
  minPercentage: number
  maxPercentage: number
}

export interface OneRmRecord {
  id: string
  userId: string
  exerciseId: string
  weightKg: number
  type: OneRmSource
  formula: EstimationFormula | null
  date: string
}
