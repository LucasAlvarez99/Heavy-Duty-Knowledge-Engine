import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useAsyncData } from '../../hooks/useAsyncData'
import { deleteWorkout, listWorkouts } from '../../infrastructure/database/workoutRepository'
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
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [deletedIds, setDeletedIds] = useState<string[]>([])

  const {
    data: workouts,
    loading,
    error,
  } = useAsyncData<Workout[]>(
    () => (user ? listWorkouts(user.id) : Promise.resolve([])),
    [user],
    [],
  )

  const visibleWorkouts = workouts.filter((workout) => !deletedIds.includes(workout.id))

  async function handleDelete(workout: Workout) {
    if (!window.confirm(`Eliminar el entrenamiento del ${formatDate(workout.date)}? Esta accion no se puede deshacer.`)) {
      return
    }
    setDeletingId(workout.id)
    setDeleteError(null)
    try {
      await deleteWorkout(workout.id)
      setDeletedIds((prev) => [...prev, workout.id])
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : String(err))
    } finally {
      setDeletingId(null)
    }
  }

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

      {deleteError && (
        <div className="alert alert-danger" role="alert">
          No se pudo eliminar el entrenamiento: {deleteError}
        </div>
      )}

      {!loading && !error && visibleWorkouts.length === 0 && (
        <div className="alert alert-info" role="status">
          Todavia no registraste ningun entrenamiento.
        </div>
      )}

      {!loading && !error && visibleWorkouts.length > 0 && (
        <div className="list-group">
          {visibleWorkouts.map((workout) => (
            <div
              key={workout.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <Link to={`/entrenamientos/${workout.id}`} className="text-decoration-none flex-grow-1">
                <strong>{formatDate(workout.date)}</strong>
                {workout.notes && <span className="text-body-secondary"> · {workout.notes}</span>}
              </Link>
              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  disabled={deletingId === workout.id}
                  onClick={() => handleDelete(workout)}
                >
                  {deletingId === workout.id ? 'Eliminando...' : 'Eliminar'}
                </button>
                <Link to={`/entrenamientos/${workout.id}`}>
                  <i className="bi bi-chevron-right" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
