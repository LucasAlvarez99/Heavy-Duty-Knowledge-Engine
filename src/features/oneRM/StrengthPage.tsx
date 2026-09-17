import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useAsyncData } from '../../hooks/useAsyncData'
import { listExercises } from '../../infrastructure/database/exerciseRepository'
import { listBestOneRmByExercise } from '../../infrastructure/database/oneRmRepository'
import type { Exercise } from '../../domain/training/exercise'
import type { OneRmRecord } from '../../domain/strength/types'

export function StrengthPage() {
  const { user } = useAuth()

  const { data: exercises, loading: loadingExercises, error: exercisesError } = useAsyncData<
    Exercise[]
  >(listExercises, [], [])

  const {
    data: bestByExercise,
    loading: loadingBest,
    error: bestError,
  } = useAsyncData<Map<string, OneRmRecord>>(
    () => (user ? listBestOneRmByExercise(user.id) : Promise.resolve(new Map())),
    [user],
    new Map(),
  )

  const loading = loadingExercises || loadingBest
  const error = exercisesError ?? bestError

  return (
    <div className="container py-4">
      <h1 className="h3 mb-1">Fuerza</h1>
      <p className="text-body-secondary mb-4">
        Mejor 1RM conocido por ejercicio. Las marcas reales (medidas) tienen prioridad sobre las
        estimadas por formula; las estimadas se calculan automaticamente al registrar un
        entrenamiento.
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
          No se pudo cargar la informacion de fuerza: {error}
        </div>
      )}

      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th scope="col">Ejercicio</th>
                <th scope="col">Mejor 1RM</th>
                <th scope="col">Tipo</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {exercises.map((exercise) => {
                const best = bestByExercise.get(exercise.id)
                return (
                  <tr key={exercise.id}>
                    <td>{exercise.name}</td>
                    <td>{best ? `${best.weightKg} kg` : '-'}</td>
                    <td>
                      {best && (
                        <span
                          className={`badge ${best.type === 'REAL' ? 'text-bg-success' : 'text-bg-secondary'}`}
                        >
                          {best.type === 'REAL' ? 'Real' : 'Estimado'}
                        </span>
                      )}
                    </td>
                    <td>
                      <Link to={`/fuerza/${exercise.id}`} className="btn btn-outline-primary btn-sm">
                        Ver detalle
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
