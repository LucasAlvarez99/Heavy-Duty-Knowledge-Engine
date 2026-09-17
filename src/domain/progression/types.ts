/**
 * Estados posibles del Progress Engine, tal como estan definidos en el plan
 * tecnico (seccion 4.2). El emoji es solo referencia para la UI, la logica
 * nunca deberia depender de el.
 */
export type ProgressStatus =
  | 'RAPID_PROGRESS' // Progreso rapido
  | 'CONSISTENT_PROGRESS' // Progreso consistente
  | 'STABLE' // Estable
  | 'POSSIBLE_PLATEAU' // Posible estancamiento (sin variacion 3+ sesiones)
  | 'PERFORMANCE_DECLINE' // Disminucion de rendimiento
  | 'READY_TO_PROGRESS' // Preparado para progresar
  | 'POSSIBLE_NEW_PR' // Posible nuevo PR

export type Trend = 'up' | 'down' | 'flat'

/**
 * Una sesion resumida para un ejercicio puntual: no es el Workout completo,
 * es solo lo que el Progress Engine necesita para analizar la evolucion de
 * ESE ejercicio a lo largo del tiempo.
 */
export interface ExerciseSessionSnapshot {
  date: string
  estimatedOneRmKg: number | null
  totalVolumeKg: number
  averageRir: number | null
}

export interface ProgressAnalysis {
  status: ProgressStatus
  trend: Trend
  /** % de cambio del e1RM entre la primera y la ultima sesion del rango analizado. */
  progressPercentage: number
  /** 0-100. Ver engines/progress/progressEngine.ts para como se calcula. */
  confidenceScore: number
  recommendation: string
}
