import { useEffect, useState } from 'react'
import { listExercises } from '../../infrastructure/database/exerciseRepository'
import type { Exercise } from '../../domain/training/exercise'

export function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    listExercises()
      .then((data) => {
        if (!cancelled) setExercises(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="container py-4">
      <h1 className="h3 mb-4">Catalogo de ejercicios</h1>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando ejercicios...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          No se pudo cargar el catalogo: {error}
        </div>
      )}

      {!loading && !error && exercises.length === 0 && (
        <div className="alert alert-info" role="status">
          Todavia no hay ejercicios cargados en la base de datos.
        </div>
      )}

      {!loading && !error && exercises.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th scope="col">Ejercicio</th>
                <th scope="col">Grupo muscular</th>
                <th scope="col">Musculos secundarios</th>
                <th scope="col">Equipamiento</th>
              </tr>
            </thead>
            <tbody>
              {exercises.map((exercise) => (
                <tr key={exercise.id}>
                  <td>{exercise.name}</td>
                  <td>{exercise.muscleGroup}</td>
                  <td>{exercise.secondaryMuscles.join(', ') || '-'}</td>
                  <td>{exercise.equipment || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
