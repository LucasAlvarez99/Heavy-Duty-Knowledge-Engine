import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useAsyncData } from '../../hooks/useAsyncData'
import { listExercises } from '../../infrastructure/database/exerciseRepository'
import { getRoutineWithExercises, listRoutines } from '../../infrastructure/database/routineRepository'
import { createWorkout } from '../../infrastructure/database/workoutRepository'
import { validateWorkoutInput } from '../../domain/training/workout'
import type { SetInput, WorkoutExerciseInput, WorkoutInput } from '../../domain/training/workout'
import type { Exercise } from '../../domain/training/exercise'
import type { Routine } from '../../domain/training/routine'

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function emptySet(setNumber: number, reps: number | null = null): SetInput {
  return {
    setNumber,
    weightKg: 0,
    repetitions: reps ?? 0,
    rir: null,
    rpe: null,
    restSeconds: null,
  }
}

export function WorkoutLoggerPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [selectedRoutineId, setSelectedRoutineId] = useState('')
  const [loadingTemplate, setLoadingTemplate] = useState(false)
  const [templateError, setTemplateError] = useState<string | null>(null)
  const [date, setDate] = useState(today())
  const [notes, setNotes] = useState('')
  const [exercises, setExercises] = useState<WorkoutExerciseInput[]>([])
  const [formErrors, setFormErrors] = useState<string[]>([])
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const { data: routines } = useAsyncData<Routine[]>(
    () => (user ? listRoutines(user.id) : Promise.resolve([])),
    [user],
    [],
  )
  const { data: exerciseCatalog } = useAsyncData<Exercise[]>(listExercises, [], [])

  function exerciseName(exerciseId: string): string {
    return exerciseCatalog.find((exercise) => exercise.id === exerciseId)?.name ?? 'Ejercicio'
  }

  async function loadRoutineTemplate() {
    if (!selectedRoutineId) return
    setLoadingTemplate(true)
    setTemplateError(null)
    try {
      const routine = await getRoutineWithExercises(selectedRoutineId)
      if (routine) {
        setExercises(
          routine.exercises.map((exercise) => ({
            exerciseId: exercise.exerciseId,
            orderIndex: exercise.orderIndex,
            sets: Array.from({ length: exercise.targetSets }, (_, i) =>
              emptySet(i + 1, exercise.targetReps),
            ),
          })),
        )
      }
    } catch (err) {
      setTemplateError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoadingTemplate(false)
    }
  }

  function addExercise() {
    const defaultExerciseId = exerciseCatalog[0]?.id ?? ''
    setExercises((prev) => [
      ...prev,
      { exerciseId: defaultExerciseId, orderIndex: prev.length, sets: [emptySet(1)] },
    ])
  }

  function removeExercise(index: number) {
    setExercises((prev) =>
      prev.filter((_, i) => i !== index).map((exercise, i) => ({ ...exercise, orderIndex: i })),
    )
  }

  function updateExerciseId(index: number, exerciseId: string) {
    setExercises((prev) =>
      prev.map((exercise, i) => (i === index ? { ...exercise, exerciseId } : exercise)),
    )
  }

  function addSet(exerciseIndex: number) {
    setExercises((prev) =>
      prev.map((exercise, i) =>
        i === exerciseIndex
          ? { ...exercise, sets: [...exercise.sets, emptySet(exercise.sets.length + 1)] }
          : exercise,
      ),
    )
  }

  function removeSet(exerciseIndex: number, setIndex: number) {
    setExercises((prev) =>
      prev.map((exercise, i) =>
        i === exerciseIndex
          ? {
              ...exercise,
              sets: exercise.sets
                .filter((_, si) => si !== setIndex)
                .map((set, si) => ({ ...set, setNumber: si + 1 })),
            }
          : exercise,
      ),
    )
  }

  function updateSet(exerciseIndex: number, setIndex: number, patch: Partial<SetInput>) {
    setExercises((prev) =>
      prev.map((exercise, i) =>
        i === exerciseIndex
          ? {
              ...exercise,
              sets: exercise.sets.map((set, si) => (si === setIndex ? { ...set, ...patch } : set)),
            }
          : exercise,
      ),
    )
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user) return

    const input: WorkoutInput = {
      routineId: selectedRoutineId || null,
      date,
      notes,
      exercises,
    }

    const errors = validateWorkoutInput(input)
    setFormErrors(errors)
    if (errors.length > 0) return

    setSaving(true)
    setSubmitError(null)
    try {
      await createWorkout(user.id, input)
      navigate('/entrenamientos')
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : String(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container py-4" style={{ maxWidth: 900 }}>
      <h1 className="h3 mb-4">Registrar entrenamiento</h1>

      <div className="row g-3 mb-4">
        <div className="col-md-5">
          <label htmlFor="date" className="form-label">
            Fecha
          </label>
          <input
            id="date"
            type="date"
            className="form-control"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
          />
        </div>

        <div className="col-md-5">
          <label htmlFor="routine" className="form-label">
            Rutina (opcional)
          </label>
          <select
            id="routine"
            className="form-select"
            value={selectedRoutineId}
            onChange={(event) => setSelectedRoutineId(event.target.value)}
          >
            <option value="">Entrenamiento libre</option>
            {routines.map((routine) => (
              <option key={routine.id} value={routine.id}>
                {routine.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-2 d-flex align-items-end">
          <button
            type="button"
            className="btn btn-outline-primary w-100"
            disabled={!selectedRoutineId || loadingTemplate}
            onClick={loadRoutineTemplate}
          >
            {loadingTemplate ? 'Cargando...' : 'Cargar ejercicios'}
          </button>
        </div>

        <div className="col-12">
          <label htmlFor="notes" className="form-label">
            Notas (opcional)
          </label>
          <input
            id="notes"
            type="text"
            className="form-control"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </div>
      </div>

      {templateError && (
        <div className="alert alert-danger" role="alert">
          No se pudo cargar la rutina: {templateError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h5 mb-0">Ejercicios registrados</h2>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={addExercise}
            disabled={exerciseCatalog.length === 0}
          >
            Agregar ejercicio
          </button>
        </div>

        {exercises.length === 0 && (
          <p className="text-body-secondary">
            Elegi una rutina y presiona "Cargar ejercicios", o agrega ejercicios manualmente.
          </p>
        )}

        {exercises.map((exercise, exerciseIndex) => (
          <div className="card mb-3" key={exerciseIndex}>
            <div className="card-header d-flex justify-content-between align-items-center gap-2">
              <select
                className="form-select form-select-sm w-auto"
                value={exercise.exerciseId}
                onChange={(event) => updateExerciseId(exerciseIndex, event.target.value)}
              >
                {exerciseCatalog.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={() => removeExercise(exerciseIndex)}
              >
                Quitar ejercicio
              </button>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-sm align-middle mb-2">
                  <thead>
                    <tr>
                      <th scope="col">Serie</th>
                      <th scope="col">Peso (kg)</th>
                      <th scope="col">Reps</th>
                      <th scope="col">RIR</th>
                      <th scope="col">RPE</th>
                      <th scope="col">Descanso (s)</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {exercise.sets.map((set, setIndex) => (
                      <tr key={setIndex}>
                        <td>{set.setNumber}</td>
                        <td>
                          <input
                            type="number"
                            min={0}
                            step="0.5"
                            className="form-control form-control-sm"
                            value={set.weightKg}
                            onChange={(event) =>
                              updateSet(exerciseIndex, setIndex, { weightKg: Number(event.target.value) })
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min={0}
                            className="form-control form-control-sm"
                            value={set.repetitions}
                            onChange={(event) =>
                              updateSet(exerciseIndex, setIndex, {
                                repetitions: Number(event.target.value),
                              })
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min={0}
                            max={10}
                            className="form-control form-control-sm"
                            value={set.rir ?? ''}
                            placeholder="-"
                            onChange={(event) =>
                              updateSet(exerciseIndex, setIndex, {
                                rir: event.target.value === '' ? null : Number(event.target.value),
                              })
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min={0}
                            max={10}
                            className="form-control form-control-sm"
                            value={set.rpe ?? ''}
                            placeholder="-"
                            onChange={(event) =>
                              updateSet(exerciseIndex, setIndex, {
                                rpe: event.target.value === '' ? null : Number(event.target.value),
                              })
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            min={0}
                            max={900}
                            className="form-control form-control-sm"
                            value={set.restSeconds ?? ''}
                            placeholder="-"
                            onChange={(event) =>
                              updateSet(exerciseIndex, setIndex, {
                                restSeconds: event.target.value === '' ? null : Number(event.target.value),
                              })
                            }
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => removeSet(exerciseIndex, setIndex)}
                          >
                            &times;
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => addSet(exerciseIndex)}
              >
                Agregar serie a {exerciseName(exercise.exerciseId)}
              </button>
            </div>
          </div>
        ))}

        {formErrors.length > 0 && (
          <div className="alert alert-danger" role="alert">
            <ul className="mb-0">
              {formErrors.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </div>
        )}

        {submitError && (
          <div className="alert alert-danger" role="alert">
            {submitError}
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar entrenamiento'}
        </button>
      </form>
    </div>
  )
}
