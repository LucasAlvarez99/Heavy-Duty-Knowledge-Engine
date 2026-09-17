import type {
  ExerciseSessionSnapshot,
  ProgressAnalysis,
  ProgressStatus,
  Trend,
} from '../../domain/progression/types'

/**
 * Progress Engine — logica de decision pura, sin DB ni UI (ver regla dura
 * en PLAN_TECNICO.md seccion 3.1).
 *
 * El plan tecnico define los 7 estados posibles de forma cualitativa, sin
 * formulas exactas. Los umbrales de esta implementacion son una decision de
 * diseno explicita, documentada aca mismo, pensada para ser facil de
 * ajustar si en la practica no se sienten bien calibrados.
 */

const MIN_SESSIONS_FOR_ANALYSIS = 2
const PLATEAU_WINDOW = 3
const PLATEAU_TOLERANCE_PERCENT = 1
const RAPID_PROGRESS_THRESHOLD_PERCENT = 5
const DECLINE_THRESHOLD_PERCENT = 2
const READY_TO_PROGRESS_RIR_INCREASE = 1

function percentChange(from: number, to: number): number {
  if (from === 0) return 0
  return Math.round(((to - from) / from) * 1000) / 10
}

function sessionsWithOneRm(sessions: ExerciseSessionSnapshot[]): ExerciseSessionSnapshot[] {
  return sessions
    .filter((session) => session.estimatedOneRmKg !== null)
    .sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * Estancamiento: las ultimas PLATEAU_WINDOW sesiones (3 por defecto, segun
 * el plan tecnico) no variaron mas de PLATEAU_TOLERANCE_PERCENT entre si.
 */
function isPlateau(recent: ExerciseSessionSnapshot[]): boolean {
  if (recent.length < PLATEAU_WINDOW) return false
  const lastN = recent.slice(-PLATEAU_WINDOW)
  for (let i = 1; i < lastN.length; i++) {
    const prev = lastN[i - 1].estimatedOneRmKg as number
    const curr = lastN[i].estimatedOneRmKg as number
    if (Math.abs(percentChange(prev, curr)) > PLATEAU_TOLERANCE_PERCENT) return false
  }
  return true
}

function isRirTrendingUp(recent: ExerciseSessionSnapshot[]): boolean {
  const withRir = recent.filter((s) => s.averageRir !== null).slice(-PLATEAU_WINDOW)
  if (withRir.length < 2) return false
  const first = withRir[0].averageRir as number
  const last = withRir.at(-1)!.averageRir as number
  return last - first >= READY_TO_PROGRESS_RIR_INCREASE
}

function computeTrend(overallChangePercent: number): Trend {
  if (overallChangePercent > PLATEAU_TOLERANCE_PERCENT) return 'up'
  if (overallChangePercent < -PLATEAU_TOLERANCE_PERCENT) return 'down'
  return 'flat'
}

function computeStatus(
  sessions: ExerciseSessionSnapshot[],
  overallChangePercent: number,
  lastStepChangePercent: number,
  isNewAllTimeHigh: boolean,
): ProgressStatus {
  if (isNewAllTimeHigh) return 'POSSIBLE_NEW_PR'

  // El RIR en aumento con carga estable reinterpreta lo que a simple vista
  // parece un plateau: el peso se siente cada vez mas facil, no estancado.
  // Por eso esta condicion se evalua antes que isPlateau.
  if (isRirTrendingUp(sessions)) return 'READY_TO_PROGRESS'

  if (isPlateau(sessions)) return 'POSSIBLE_PLATEAU'

  if (lastStepChangePercent < -DECLINE_THRESHOLD_PERCENT) return 'PERFORMANCE_DECLINE'

  if (overallChangePercent >= RAPID_PROGRESS_THRESHOLD_PERCENT) return 'RAPID_PROGRESS'

  if (overallChangePercent > PLATEAU_TOLERANCE_PERCENT) return 'CONSISTENT_PROGRESS'

  return 'STABLE'
}

const RECOMMENDATION_BY_STATUS: Record<ProgressStatus, string> = {
  RAPID_PROGRESS:
    'El e1RM viene subiendo fuerte. Mantene la tecnica y no aceleres la progresion de carga mas de lo que el cuerpo puede sostener.',
  CONSISTENT_PROGRESS:
    'Progreso solido y sostenido. Segui con el plan actual, no hace falta cambiar nada todavia.',
  STABLE:
    'El rendimiento se mantiene estable. Es un buen momento para revisar volumen, tecnica o descanso antes de forzar mas carga.',
  POSSIBLE_PLATEAU:
    'Sin variacion en las ultimas sesiones. Considera un cambio de estimulo: variar rango de reps, tempo, o una semana de descarga.',
  PERFORMANCE_DECLINE:
    'El rendimiento bajo respecto a la sesion anterior. Revisa recuperacion, sueno y estres antes de asumir que es perdida de fuerza real.',
  READY_TO_PROGRESS:
    'El RIR viene en aumento con el mismo peso: hay margen para subir la carga en la proxima sesion.',
  POSSIBLE_NEW_PR:
    'Esta sesion iguala o supera tu mejor marca conocida. Si es consistente, vale la pena confirmarla con un test real de 1RM.',
}

const INSUFFICIENT_DATA_ANALYSIS: ProgressAnalysis = {
  status: 'STABLE',
  trend: 'flat',
  progressPercentage: 0,
  confidenceScore: 0,
  recommendation: `Todavia no hay suficientes sesiones registradas para este ejercicio (minimo ${MIN_SESSIONS_FOR_ANALYSIS}). Segui registrando entrenamientos para desbloquear el analisis de progreso.`,
}

/**
 * Confidence Score (0-100): combina cuantas sesiones hay, que tan
 * consistente es la direccion del cambio sesion a sesion, y que tan
 * reciente es el dato mas nuevo. Un solo numero alto no implica progreso
 * positivo, implica que el estado calculado es confiable.
 */
function computeConfidenceScore(sessions: ExerciseSessionSnapshot[], trend: Trend): number {
  const sessionCountScore = Math.min(sessions.length, 6) / 6 * 40

  let consistencyScore = 0
  if (trend !== 'flat' && sessions.length >= 2) {
    let agreeing = 0
    for (let i = 1; i < sessions.length; i++) {
      const change =
        (sessions[i].estimatedOneRmKg as number) - (sessions[i - 1].estimatedOneRmKg as number)
      const agreesWithTrend = trend === 'up' ? change >= 0 : change <= 0
      if (agreesWithTrend) agreeing++
    }
    consistencyScore = (agreeing / (sessions.length - 1)) * 40
  } else if (trend === 'flat') {
    consistencyScore = 40
  }

  const lastSessionDate = new Date(`${sessions.at(-1)!.date}T00:00:00`)
  const daysSinceLastSession = Math.floor(
    (Date.now() - lastSessionDate.getTime()) / (1000 * 60 * 60 * 24),
  )
  const recencyScore = daysSinceLastSession <= 7 ? 20 : daysSinceLastSession <= 14 ? 10 : 0

  return Math.round(sessionCountScore + consistencyScore + recencyScore)
}

export function analyzeProgress(
  allSessions: ExerciseSessionSnapshot[],
  previousAllTimeBestKg: number | null,
): ProgressAnalysis {
  const sessions = sessionsWithOneRm(allSessions)

  if (sessions.length < MIN_SESSIONS_FOR_ANALYSIS) {
    return INSUFFICIENT_DATA_ANALYSIS
  }

  const first = sessions[0].estimatedOneRmKg as number
  const last = sessions.at(-1)!.estimatedOneRmKg as number
  const secondToLast = sessions.at(-2)!.estimatedOneRmKg as number

  const overallChangePercent = percentChange(first, last)
  const lastStepChangePercent = percentChange(secondToLast, last)
  const trend = computeTrend(overallChangePercent)
  const isNewAllTimeHigh = previousAllTimeBestKg === null || last > previousAllTimeBestKg

  const status = computeStatus(sessions, overallChangePercent, lastStepChangePercent, isNewAllTimeHigh)
  const confidenceScore = computeConfidenceScore(sessions, trend)

  return {
    status,
    trend,
    progressPercentage: overallChangePercent,
    confidenceScore,
    recommendation: RECOMMENDATION_BY_STATUS[status],
  }
}
