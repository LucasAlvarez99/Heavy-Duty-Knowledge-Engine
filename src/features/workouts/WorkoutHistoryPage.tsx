import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useAsyncData } from '../../hooks/useAsyncData'
import { listWorkouts } from '../../infrastructure/database/workoutRepository'
import type { Workout } from '../../domain/training/workout'

function formatDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function WorkoutHistoryPage() {
  const { user } = useAuth()

  const {
    data: workouts,
    loading,
    error,
  } = useAsyncData<Workout[]>(
    () => (user ? listWorkouts(user.id) : Promise.resolve([])),
    [user],
    [],
  )

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Historial de entrenamientos</h1>
        <Link to="/entrenamientos/nuevo" className="btn btn-primary">
          Registrar entrenamiento
        </Link>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando historial...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          No se pudo cargar el historial: {error}
        </div>
      )}

      {!loading && !error && workouts.length === 0 && (
        <div className="alert alert-info" role="status">
          Todavia no registraste ningun entrenamiento.
        </div>
      )}

      {!loading && !error && workouts.length > 0 && (
        <div className="list-group">
          {workouts.map((workout) => (
            <Link
              key={workout.id}
              to={`/entrenamientos/${workout.id}`}
              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            >
              <span>
                <strong>{formatDate(workout.date)}</strong>
                {workout.notes && <span className="text-body-secondary"> · {workout.notes}</span>}
              </span>
              <i className="bi bi-chevron-right" aria-hidden="true" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
