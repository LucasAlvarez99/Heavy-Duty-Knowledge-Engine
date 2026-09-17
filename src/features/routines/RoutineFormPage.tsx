import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useAsyncData } from '../../hooks/useAsyncData'
import { listExercises } from '../../infrastructure/database/exerciseRepository'
import {
  createRoutine,
  getRoutineWithExercises,
  updateRoutine,
} from '../../infrastructure/database/routineRepository'
import { reorderExercises, validateRoutineInput } from '../../domain/training/routine'
import type { RoutineExerciseInput, RoutineInput, RoutineWithExercises } from '../../domain/training/routine'
import type { Exercise } from '../../domain/training/exercise'
import { EXPERIENCE_LEVEL_LABEL, TRAINING_GOAL_LABEL } from '../../domain/training/athleteProfile'
import { getAdaptationSuggestionsForRoutine } from '../../services/adaptiveTrainingService'
import type { AdaptationSuggestion } from '../../engines/adaptation/adaptationEngine'

const EMPTY_INPUT: RoutineInput = {
  name: '',
  goal: 'muscle_mass',
  level: 'beginner',
  notes: '',
  exercises: [],
}

const FIELD_LABEL: Record<AdaptationSuggestion['field'], string> = {
  targetSets: 'Series',
  targetReps: 'Reps',
  targetRir: 'RIR',
}

function emptyExerciseRow(orderIndex: number, defaultExerciseId: string): RoutineExerciseInput {
  return {
    exerciseId: defaultExerciseId,
    orderIndex,
    targetSets: 3,
    targetReps: 10,
    targetRir: null,
    restSeconds: 90,
  }
}

export function RoutineFormPage() {
  const { routineId } = useParams<{ routineId: string }>()
  const isEditing = Boolean(routineId)
  const navigate = useNavigate()
  const { user } = useAuth()

  const [form, setForm] = useState<RoutineInput>(EMPTY_INPUT)
  const [saving, setSaving] = useState(false)
  const [formErrors, setFormErrors] = useState<string[]>([])
  const [submitError, setSubmitError] = useState<string | null>(null)

  const { data: exercises, loading: loadingExercises } = useAsyncData<Exercise[]>(
    listExercises,
    [],
    [],
  )

  const { data: existingRoutine, loading: loadingRoutine, error: loadError } =
    useAsyncData<RoutineWithExercises | null>(
      () => (routineId ? getRoutineWithExercises(routineId) : Promise.resolve(null)),
      [routineId],
      null,
    )

  const { data: suggestions, loading: loadingSuggestions } = useAsyncData<AdaptationSuggestion[]>(
    () =>
      user && routineId ? getAdaptationSuggestionsForRoutine(user.id, routineId) : Promise.resolve([]),
    [user, routineId],
    [],
  )
  const [dismissedSuggestions, setDismissedSuggestions] = useState<number[]>([])
  const visibleSuggestions = suggestions.filter((_, index) => !dismissedSuggestions.includes(index))

  // Precarga el formulario cuando llega la rutina a editar. Ver la nota
  // equivalente en ProfilePage: es una sincronizacion valida de estado
  // editable a partir de datos asincronos, no un valor derivable en render.
  useEffect(() => {
    if (!existingRoutine) return
    // oxlint-disable-next-line react/set-state-in-effect
    setForm({
      name: existingRoutine.name,
      goal: existingRoutine.goal,
      level: existingRoutine.level,
      notes: existingRoutine.notes,
      exercises: existingRoutine.exercises.map((exercise) => ({
        exerciseId: exercise.exerciseId,
        orderIndex: exercise.orderIndex,
        targetSets: exercise.targetSets,
        targetReps: exercise.targetReps,
        targetRir: exercise.targetRir,
        restSeconds: exercise.restSeconds,
      })),
    })
  }, [existingRoutine])

  function addExercise() {
    const defaultExerciseId = exercises[0]?.id ?? ''
    setForm((prev) => ({
      ...prev,
      exercises: [...prev.exercises, emptyExerciseRow(prev.exercises.length, defaultExerciseId)],
    }))
  }

  function removeExercise(index: number) {
    setForm((prev) => ({
      ...prev,
      exercises: reorderExercises(prev.exercises.filter((_, i) => i !== index)),
    }))
  }

  function updateExercise(index: number, patch: Partial<RoutineExerciseInput>) {
    setForm((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise, i) => (i === index ? { ...exercise, ...patch } : exercise)),
    }))
  }

  function applySuggestion(suggestionIndex: number, suggestion: AdaptationSuggestion) {
    setForm((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise) =>
        exercise.exerciseId === suggestion.exerciseId
          ? { ...exercise, [suggestion.field]: suggestion.suggestedValue }
          : exercise,
      ),
    }))
    setDismissedSuggestions((prev) => [...prev, suggestionIndex])
  }

  function dismissSuggestion(suggestionIndex: number) {
    setDismissedSuggestions((prev) => [...prev, suggestionIndex])
  }

  function exerciseName(exerciseId: string): string {
    return exercises.find((exercise) => exercise.id === exerciseId)?.name ?? 'Ejercicio'
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user) return

    const errors = validateRoutineInput(form)
    setFormErrors(errors)
    if (errors.length > 0) return

    setSaving(true)
    setSubmitError(null)
    try {
      if (routineId) {
        await updateRoutine(routineId, form)
      } else {
        await createRoutine(user.id, form)
      }
      navigate('/rutinas')
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : String(err))
    } finally {
      setSaving(false)
    }
  }

  if (isEditing && loadingRoutine) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando rutina...</span>
        </div>
      </div>
    )
  }

  if (isEditing && loadError) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          No se pudo cargar la rutina: {loadError}
        </div>
      </div>
    )
  }

  return (
    <div className="container py-4" style={{ maxWidth: 860 }}>
      <h1 className="h3 mb-4">{isEditing ? 'Editar rutina' : 'Nueva rutina'}</h1>

      <form onSubmit={handleSubmit}>
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label htmlFor="name" className="form-label">
              Nombre de la rutina
            </label>
            <input
              id="name"
              type="text"
              className="form-control"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />
          </div>

          <div className="col-md-3">
            <label htmlFor="goal" className="form-label">
              Objetivo
            </label>
            <select
              id="goal"
              className="form-select"
              value={form.goal}
              onChange={(event) =>
                setForm({ ...form, goal: event.target.value as RoutineInput['goal'] })
              }
            >
              {Object.entries(TRAINING_GOAL_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label htmlFor="level" className="form-label">
              Nivel
            </label>
            <select
              id="level"
              className="form-select"
              value={form.level}
              onChange={(event) =>
                setForm({ ...form, level: event.target.value as RoutineInput['level'] })
              }
            >
              {Object.entries(EXPERIENCE_LEVEL_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12">
            <label htmlFor="notes" className="form-label">
              Notas (opcional)
            </label>
            <textarea
              id="notes"
              className="form-control"
              rows={2}
              value={form.notes}
              onChange={(event) => setForm({ ...form, notes: event.target.value })}
            />
          </div>
        </div>

        {isEditing && !loadingSuggestions && visibleSuggestions.length > 0 && (
          <div className="mb-4">
            <h2 className="h5 mb-3">Sugerencias de adaptacion</h2>
            <p className="text-body-secondary small">
              Basadas en tu progreso reciente. No se aplican solas: revisalas y decidi.
            </p>
            {suggestions.map((suggestion, index) => {
              if (dismissedSuggestions.includes(index)) return null
              return (
                <div className="alert alert-light border d-flex justify-content-between align-items-center gap-3" key={index}>
                  <div>
                    <strong>{exerciseName(suggestion.exerciseId)}</strong>: {suggestion.reason}
                    <div className="small text-body-secondary">
                      {FIELD_LABEL[suggestion.field]} {suggestion.currentValue ?? '-'} →{' '}
                      {suggestion.suggestedValue}
                    </div>
                  </div>
                  <div className="d-flex gap-2 flex-shrink-0">
                    <button
                      type="button"
                      className="btn btn-outline-success btn-sm"
                      onClick={() => applySuggestion(index, suggestion)}
                    >
                      Aplicar
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => dismissSuggestion(index)}
                    >
                      Descartar
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h5 mb-0">Ejercicios</h2>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={addExercise}
            disabled={loadingExercises || exercises.length === 0}
          >
            Agregar ejercicio
          </button>
        </div>

        {loadingExercises && <p className="text-body-secondary">Cargando catalogo de ejercicios...</p>}

        {!loadingExercises && exercises.length === 0 && (
          <div className="alert alert-warning" role="alert">
            No hay ejercicios cargados en el catalogo todavia. Cargalos antes de armar una rutina.
          </div>
        )}

        {form.exercises.length === 0 && !loadingExercises && exercises.length > 0 && (
          <p className="text-body-secondary">Todavia no agregaste ejercicios a esta rutina.</p>
        )}

        {form.exercises.map((exercise, index) => (
          <div className="card mb-2" key={index}>
            <div className="card-body row g-2 align-items-end">
              <div className="col-12 col-md-4">
                <label className="form-label small mb-1">Ejercicio</label>
                <select
                  className="form-select form-select-sm"
                  value={exercise.exerciseId}
                  onChange={(event) => updateExercise(index, { exerciseId: event.target.value })}
                >
                  {exercises.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-6 col-md-2">
                <label className="form-label small mb-1">Series</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  className="form-control form-control-sm"
                  value={exercise.targetSets}
                  onChange={(event) => updateExercise(index, { targetSets: Number(event.target.value) })}
                />
              </div>

              <div className="col-6 col-md-2">
                <label className="form-label small mb-1">Reps</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  className="form-control form-control-sm"
                  value={exercise.targetReps}
                  onChange={(event) => updateExercise(index, { targetReps: Number(event.target.value) })}
                />
              </div>

              <div className="col-6 col-md-2">
                <label className="form-label small mb-1">RIR objetivo</label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  className="form-control form-control-sm"
                  value={exercise.targetRir ?? ''}
                  placeholder="-"
                  onChange={(event) =>
                    updateExercise(index, {
                      targetRir: event.target.value === '' ? null : Number(event.target.value),
                    })
                  }
                />
              </div>

              <div className="col-6 col-md-1">
                <label className="form-label small mb-1">Descanso (s)</label>
                <input
                  type="number"
                  min={0}
                  max={900}
                  className="form-control form-control-sm"
                  value={exercise.restSeconds ?? ''}
                  placeholder="-"
                  onChange={(event) =>
                    updateExercise(index, {
                      restSeconds: event.target.value === '' ? null : Number(event.target.value),
                    })
                  }
                />
              </div>

              <div className="col-12 col-md-1 text-md-end">
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => removeExercise(index)}
                >
                  Quitar
                </button>
              </div>
            </div>
          </div>
        ))}

        {formErrors.length > 0 && (
          <div className="alert alert-danger mt-3" role="alert">
            <ul className="mb-0">
              {formErrors.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </div>
        )}

        {submitError && (
          <div className="alert alert-danger mt-3" role="alert">
            {submitError}
          </div>
        )}

        <div className="mt-4">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear rutina'}
          </button>
        </div>
      </form>
    </div>
  )
}
