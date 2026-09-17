import { Link } from 'react-router-dom'
import { useAsyncData } from '../../hooks/useAsyncData'
import { listExercises } from '../../infrastructure/database/exerciseRepository'
import type { Exercise } from '../../domain/training/exercise'

export function ProgressPage() {
  const { data: exercises, loading, error } = useAsyncData<Exercise[]>(listExercises, [], [])

  return (
    <div className="container py-4">
      <h1 className="h3 mb-1">Progreso</h1>
      <p className="text-body-secondary mb-4">
        Elegi un ejercicio para ver su estado de progreso, tendencia y Confidence Score segun el
        historial de entrenamientos registrados.
      </p>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          No se pudo cargar el catalogo de ejercicios: {error}
        </div>
      )}

      {!loading && !error && (
        <div className="list-group">
          {exercises.map((exercise) => (
            <Link
              key={exercise.id}
              to={`/progreso/${exercise.id}`}
              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            >
              {exercise.name}
              <i className="bi bi-chevron-right" aria-hidden="true" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
