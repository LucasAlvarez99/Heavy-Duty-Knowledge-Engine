import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useAsyncData } from '../../hooks/useAsyncData'
import { deleteRoutine, listRoutines } from '../../infrastructure/database/routineRepository'
import type { Routine } from '../../domain/training/routine'
import { TRAINING_GOAL_LABEL, EXPERIENCE_LEVEL_LABEL } from '../../domain/training/athleteProfile'

export function RoutinesListPage() {
  const { user } = useAuth()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [deletedIds, setDeletedIds] = useState<string[]>([])

  const {
    data: routines,
    loading,
    error,
  } = useAsyncData<Routine[]>(() => (user ? listRoutines(user.id) : Promise.resolve([])), [user], [])

  const visibleRoutines = routines.filter((routine) => !deletedIds.includes(routine.id))

  async function handleDelete(routine: Routine) {
    if (!window.confirm(`Eliminar la rutina "${routine.name}"? Esta accion no se puede deshacer.`)) {
      return
    }
    setDeletingId(routine.id)
    setDeleteError(null)
    try {
      await deleteRoutine(routine.id)
      setDeletedIds((prev) => [...prev, routine.id])
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : String(err))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Mis rutinas</h1>
        <Link to="/rutinas/nueva" className="btn btn-primary">
          Nueva rutina
        </Link>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando rutinas...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          No se pudieron cargar las rutinas: {error}
        </div>
      )}

      {deleteError && (
        <div className="alert alert-danger" role="alert">
          No se pudo eliminar la rutina: {deleteError}
        </div>
      )}

      {!loading && !error && visibleRoutines.length === 0 && (
        <div className="alert alert-info" role="status">
          Todavia no creaste ninguna rutina. Empeza con "Nueva rutina".
        </div>
      )}

      {!loading && !error && visibleRoutines.length > 0 && (
        <div className="row g-3">
          {visibleRoutines.map((routine) => (
            <div className="col-12 col-md-6 col-lg-4" key={routine.id}>
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <h2 className="h5 card-title">{routine.name}</h2>
                  <p className="card-text text-body-secondary mb-2">
                    {TRAINING_GOAL_LABEL[routine.goal]} · {EXPERIENCE_LEVEL_LABEL[routine.level]}
                  </p>
                  {routine.notes && <p className="card-text small mb-3">{routine.notes}</p>}
                  <div className="mt-auto d-flex gap-2">
                    <Link to={`/rutinas/${routine.id}`} className="btn btn-outline-primary btn-sm">
                      Editar
                    </Link>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      disabled={deletingId === routine.id}
                      onClick={() => handleDelete(routine)}
                    >
                      {deletingId === routine.id ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
