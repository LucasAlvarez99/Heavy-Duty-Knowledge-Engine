import { useParams } from 'react-router-dom'
import { useAsyncData } from '../../hooks/useAsyncData'
import { getWorkoutWithExercises } from '../../infrastructure/database/workoutRepository'
import { listExercises } from '../../infrastructure/database/exerciseRepository'
import { totalVolumeKg } from '../../domain/training/workout'
import type { WorkoutWithExercises } from '../../domain/training/workout'
import type { Exercise } from '../../domain/training/exercise'

function formatDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function WorkoutDetailPage() {
  const { workoutId } = useParams<{ workoutId: string }>()

  const {
    data: workout,
    loading,
    error,
  } = useAsyncData<WorkoutWithExercises | null>(
    () => (workoutId ? getWorkoutWithExercises(workoutId) : Promise.resolve(null)),
    [workoutId],
    null,
  )
  const { data: exerciseCatalog } = useAsyncData<Exercise[]>(listExercises, [], [])

  function exerciseName(exerciseId: string): string {
    return exerciseCatalog.find((exercise) => exercise.id === exerciseId)?.name ?? 'Ejercicio'
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando entrenamiento...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          No se pudo cargar el entrenamiento: {error}
        </div>
      </div>
    )
  }

  if (!workout) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning" role="alert">
          No se encontro el entrenamiento.
        </div>
      </div>
    )
  }

  const workoutVolume = workout.exercises.reduce(
    (sum, exercise) => sum + totalVolumeKg(exercise.sets),
    0,
  )

  return (
    <div className="container py-4" style={{ maxWidth: 860 }}>
      <h1 className="h3 mb-1 text-capitalize">{formatDate(workout.date)}</h1>
      {workout.notes && <p className="text-body-secondary">{workout.notes}</p>}
      <p className="text-body-secondary mb-4">
        Volumen total: <strong>{workoutVolume.toLocaleString('es-AR')} kg</strong>
      </p>

      {workout.exercises.map((exercise) => (
        <div className="card mb-3" key={exercise.id}>
          <div className="card-header d-flex justify-content-between">
            <strong>{exerciseName(exercise.exerciseId)}</strong>
            <span className="text-body-secondary">
              {totalVolumeKg(exercise.sets).toLocaleString('es-AR')} kg de volumen
            </span>
          </div>
          <div className="table-responsive">
            <table className="table table-sm mb-0">
              <thead>
                <tr>
                  <th scope="col">Serie</th>
                  <th scope="col">Peso</th>
                  <th scope="col">Reps</th>
                  <th scope="col">RIR</th>
                  <th scope="col">RPE</th>
                </tr>
              </thead>
              <tbody>
                {exercise.sets.map((set) => (
                  <tr key={set.id}>
                    <td>{set.setNumber}</td>
                    <td>{set.weightKg} kg</td>
                    <td>{set.repetitions}</td>
                    <td>{set.rir ?? '-'}</td>
                    <td>{set.rpe ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  )
}
