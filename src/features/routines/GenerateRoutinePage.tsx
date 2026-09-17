import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useAsyncData } from '../../hooks/useAsyncData'
import { ROUTINE_TEMPLATES, METHODOLOGY_LABEL } from '../../domain/methodologies/templates'
import type { RoutineTemplate } from '../../domain/methodologies/templates'
import { generateRoutinesForUser } from '../../services/adaptiveTrainingService'
import type { GeneratedDay } from '../../engines/routine/routineGenerator'
import { createRoutine } from '../../infrastructure/database/routineRepository'
import { listExercises } from '../../infrastructure/database/exerciseRepository'
import type { Exercise } from '../../domain/training/exercise'
import { TRAINING_GOAL_LABEL, EXPERIENCE_LEVEL_LABEL } from '../../domain/training/athleteProfile'

export function GenerateRoutinePage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [selectedTemplateId, setSelectedTemplateId] = useState(ROUTINE_TEMPLATES[0]?.id ?? '')
  const [generatedDays, setGeneratedDays] = useState<GeneratedDay[] | null>(null)
  const [generating, setGenerating] = useState(false)
  const [generateError, setGenerateError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const selectedTemplate: RoutineTemplate | undefined = ROUTINE_TEMPLATES.find(
    (template) => template.id === selectedTemplateId,
  )

  const { data: exercises } = useAsyncData<Exercise[]>(listExercises, [], [])
  function exerciseName(exerciseId: string): string {
    return exercises.find((exercise) => exercise.id === exerciseId)?.name ?? exerciseId
  }

  async function handleGenerate() {
    if (!user || !selectedTemplate) return
    setGenerating(true)
    setGenerateError(null)
    setGeneratedDays(null)
    try {
      const days = await generateRoutinesForUser(user.id, selectedTemplate)
      setGeneratedDays(days)
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : String(err))
    } finally {
      setGenerating(false)
    }
  }

  async function handleSaveAll() {
    if (!user || !generatedDays) return
    setSaving(true)
    setSaveError(null)
    try {
      for (const day of generatedDays) {
        if (day.routine.exercises.length === 0) continue
        await createRoutine(user.id, day.routine)
      }
      navigate('/rutinas')
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : String(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container py-4" style={{ maxWidth: 860 }}>
      <h1 className="h3 mb-1">Generar rutina automaticamente</h1>
      <p className="text-body-secondary mb-4">
        Elegi una metodologia. El generador arma cada dia con ejercicios de tu catalogo segun tu
        perfil (nivel y objetivo). Vas a poder revisar todo antes de guardar.
      </p>

      <div className="row g-3 align-items-end mb-4">
        <div className="col-md-8">
          <label htmlFor="template" className="form-label">
            Metodologia
          </label>
          <select
            id="template"
            className="form-select"
            value={selectedTemplateId}
            onChange={(event) => {
              setSelectedTemplateId(event.target.value)
              setGeneratedDays(null)
            }}
          >
            {ROUTINE_TEMPLATES.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name} ({METHODOLOGY_LABEL[template.methodology]}, {template.daysPerWeek}{' '}
                dias/semana)
              </option>
            ))}
          </select>
          {selectedTemplate && (
            <div className="form-text">
              Para: {selectedTemplate.goals.map((g) => TRAINING_GOAL_LABEL[g]).join(', ')} ·{' '}
              {selectedTemplate.levels.map((l) => EXPERIENCE_LEVEL_LABEL[l]).join(', ')}
            </div>
          )}
        </div>
        <div className="col-md-4">
          <button
            type="button"
            className="btn btn-primary w-100"
            onClick={handleGenerate}
            disabled={generating || !selectedTemplate}
          >
            {generating ? 'Generando...' : 'Generar preview'}
          </button>
        </div>
      </div>

      {generateError && (
        <div className="alert alert-danger" role="alert">
          {generateError}
        </div>
      )}

      {generatedDays && (
        <>
          {generatedDays.map((day, index) => (
            <div className="card mb-3" key={index}>
              <div className="card-header">
                <strong>{day.label}</strong>
              </div>
              <div className="card-body">
                {day.routine.exercises.length === 0 ? (
                  <p className="text-body-secondary mb-0">
                    No se encontro ningun ejercicio del catalogo para este dia.
                  </p>
                ) : (
                  <ul className="mb-2">
                    {day.routine.exercises.map((exercise) => (
                      <li key={exercise.exerciseId}>
                        {exercise.targetSets}x{exercise.targetReps}
                        {exercise.targetRir !== null ? ` (RIR ${exercise.targetRir})` : ''}
                        {' — '}
                        {exerciseName(exercise.exerciseId)}
                      </li>
                    ))}
                  </ul>
                )}
                {day.unfilledMuscleGroups.length > 0 && (
                  <div className="alert alert-warning py-2 mb-0" role="alert">
                    No hay ejercicios en tu catalogo para: {day.unfilledMuscleGroups.join(', ')}.
                    Podes agregarlos despues de guardar, editando la rutina.
                  </div>
                )}
              </div>
            </div>
          ))}

          {saveError && (
            <div className="alert alert-danger" role="alert">
              {saveError}
            </div>
          )}

          <button type="button" className="btn btn-success" onClick={handleSaveAll} disabled={saving}>
            {saving ? 'Guardando...' : `Guardar ${generatedDays.length > 1 ? 'las rutinas' : 'la rutina'}`}
          </button>
        </>
      )}
    </div>
  )
}
