import { Link, useParams } from 'react-router-dom'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAuth } from '../../hooks/useAuth'
import { useAsyncData } from '../../hooks/useAsyncData'
import { listExercises } from '../../infrastructure/database/exerciseRepository'
import { getExerciseProgress } from '../../services/progressService'
import type { ProgressReport } from '../../services/progressService'
import type { ProgressStatus } from '../../domain/progression/types'
import type { Exercise } from '../../domain/training/exercise'

const STATUS_LABEL: Record<ProgressStatus, string> = {
  RAPID_PROGRESS: '🚀 Progreso rapido',
  CONSISTENT_PROGRESS: '📈 Progreso consistente',
  STABLE: '➡️ Estable',
  POSSIBLE_PLATEAU: '⚠️ Posible estancamiento',
  PERFORMANCE_DECLINE: '🔻 Disminucion de rendimiento',
  READY_TO_PROGRESS: '🔥 Preparado para progresar',
  POSSIBLE_NEW_PR: '🧪 Posible nuevo PR',
}

const STATUS_BADGE_CLASS: Record<ProgressStatus, string> = {
  RAPID_PROGRESS: 'text-bg-success',
  CONSISTENT_PROGRESS: 'text-bg-success',
  STABLE: 'text-bg-secondary',
  POSSIBLE_PLATEAU: 'text-bg-warning',
  PERFORMANCE_DECLINE: 'text-bg-danger',
  READY_TO_PROGRESS: 'text-bg-info',
  POSSIBLE_NEW_PR: 'text-bg-primary',
}

export function ExerciseProgressPage() {
  const { exerciseId } = useParams<{ exerciseId: string }>()
  const { user } = useAuth()

  const { data: exercises } = useAsyncData<Exercise[]>(listExercises, [], [])
  const exercise = exercises.find((item) => item.id === exerciseId)

  const {
    data: report,
    loading,
    error,
  } = useAsyncData<ProgressReport | null>(
    () => (user && exerciseId ? getExerciseProgress(user.id, exerciseId) : Promise.resolve(null)),
    [user, exerciseId],
    null,
  )

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Analizando progreso...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          No se pudo analizar el progreso: {error}
        </div>
      </div>
    )
  }

  if (!report) {
    return null
  }

  const { analysis, sessions } = report
  const chartData = sessions
    .filter((session) => session.estimatedOneRmKg !== null)
    .map((session) => ({ date: session.date, e1rm: session.estimatedOneRmKg }))

  return (
    <div className="container py-4" style={{ maxWidth: 900 }}>
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h1 className="h3 mb-1">{exercise?.name ?? 'Progreso'}</h1>
          <Link to={`/fuerza/${exerciseId}`} className="small">
            Ver detalle de fuerza y tabla de %1RM
          </Link>
        </div>
        <span className={`badge fs-6 ${STATUS_BADGE_CLASS[analysis.status]}`}>
          {STATUS_LABEL[analysis.status]}
        </span>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card h-100">
            <div className="card-body text-center">
              <div className="text-body-secondary small">Tendencia</div>
              <div className="fs-4">
                {analysis.trend === 'up' ? '↑' : analysis.trend === 'down' ? '↓' : '→'}
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card h-100">
            <div className="card-body text-center">
              <div className="text-body-secondary small">% de progreso</div>
              <div className="fs-4">{analysis.progressPercentage}%</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card h-100">
            <div className="card-body text-center">
              <div className="text-body-secondary small">Confidence Score</div>
              <div className="fs-4">{analysis.confidenceScore}%</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card h-100">
            <div className="card-body text-center">
              <div className="text-body-secondary small">Sesiones analizadas</div>
              <div className="fs-4">{chartData.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="alert alert-light border mb-4" role="status">
        {analysis.recommendation}
      </div>

      <h2 className="h5 mb-3">e1RM por sesion</h2>
      {chartData.length === 0 ? (
        <div className="alert alert-info" role="status">
          Todavia no hay sesiones registradas con series validas para este ejercicio.
        </div>
      ) : (
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#9d98a6' }} stroke="#33313b" />
              <YAxis
                tick={{ fontSize: 12, fill: '#9d98a6' }}
                stroke="#33313b"
                domain={['dataMin - 5', 'dataMax + 5']}
                unit=" kg"
              />
              <Tooltip
                formatter={(value) => [`${value} kg`, 'e1RM']}
                contentStyle={{ background: '#1c1a21', border: '1px solid #33313b', borderRadius: 6 }}
                labelStyle={{ color: '#f3f1ec' }}
              />
              <Line type="monotone" dataKey="e1rm" stroke="#33c17a" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
