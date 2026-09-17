import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useAsyncData } from '../../hooks/useAsyncData'
import {
  getAthleteProfile,
  upsertAthleteProfile,
} from '../../infrastructure/database/athleteProfileRepository'
import type { AthleteProfileRow } from '../../infrastructure/database/athleteProfileRepository'
import type { AthleteProfileInput } from '../../domain/training/athleteProfile'
import {
  EXPERIENCE_LEVEL_LABEL,
  TRAINING_GOAL_LABEL,
  fallbackDisplayName,
} from '../../domain/training/athleteProfile'

const EMPTY_FORM: AthleteProfileInput = {
  displayName: '',
  birthDate: '',
  heightCm: 170,
  weightKg: 70,
  experienceLevel: 'beginner',
  goal: 'muscle_mass',
  availableDays: 3,
  sessionDurationMinutes: 60,
  equipment: '',
}

export function ProfilePage() {
  const { user } = useAuth()
  const [form, setForm] = useState<AthleteProfileInput>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<Date | null>(null)

  const {
    data: existingProfile,
    loading,
    error: loadError,
  } = useAsyncData<AthleteProfileRow | null>(
    () => (user ? getAthleteProfile(user.id) : Promise.resolve(null)),
    [user],
    null,
  )

  // Sincroniza el estado editable del formulario con el perfil recien
  // llegado del servidor. Es una excepcion valida al patron "derivar en
  // render": `form` es editable por el usuario, no puede recalcularse en
  // cada render a partir de `existingProfile`.
  useEffect(() => {
    if (existingProfile) {
      const { id: _id, userId: _userId, ...rest } = existingProfile
      // oxlint-disable-next-line react/set-state-in-effect
      setForm({ ...rest, displayName: rest.displayName || fallbackDisplayName(user?.email) })
      return
    }
    if (!loading && user) {
      // oxlint-disable-next-line react/set-state-in-effect
      setForm((prev) => ({
        ...prev,
        displayName: prev.displayName || fallbackDisplayName(user.email),
      }))
    }
  }, [existingProfile, loading, user])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user) return
    setSaving(true)
    setError(null)
    try {
      await upsertAthleteProfile(user.id, form)
      setSavedAt(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando perfil...</span>
        </div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="container py-5" style={{ maxWidth: 640 }}>
        <div className="alert alert-danger" role="alert">
          No se pudo cargar el perfil: {loadError}
        </div>
      </div>
    )
  }

  return (
    <div className="container py-4" style={{ maxWidth: 640 }}>
      <h1 className="h3 mb-4">Tu perfil</h1>

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-12">
          <h2 className="h6 text-uppercase text-body-secondary mb-2">Identidad</h2>
        </div>

        <div className="col-12">
          <label htmlFor="displayName" className="form-label">
            Nombre de usuario
          </label>
          <input
            id="displayName"
            type="text"
            className="form-control"
            placeholder="Como queres que te llamemos"
            value={form.displayName}
            onChange={(event) => setForm({ ...form, displayName: event.target.value })}
            maxLength={60}
            required
          />
          <div className="form-text">Es lo que se muestra en el panel y el menu, en vez de tu email.</div>
        </div>

        <div className="col-12 mt-4">
          <h2 className="h6 text-uppercase text-body-secondary mb-2">Datos fisicos</h2>
        </div>

        <div className="col-md-6">
          <label htmlFor="birthDate" className="form-label">
            Fecha de nacimiento
          </label>
          <input
            id="birthDate"
            type="date"
            className="form-control"
            value={form.birthDate}
            onChange={(event) => setForm({ ...form, birthDate: event.target.value })}
            required
          />
        </div>

        <div className="col-md-3">
          <label htmlFor="heightCm" className="form-label">
            Altura (cm)
          </label>
          <input
            id="heightCm"
            type="number"
            min={100}
            max={250}
            className="form-control"
            value={form.heightCm}
            onChange={(event) => setForm({ ...form, heightCm: Number(event.target.value) })}
            required
          />
        </div>

        <div className="col-md-3">
          <label htmlFor="weightKg" className="form-label">
            Peso (kg)
          </label>
          <input
            id="weightKg"
            type="number"
            min={30}
            max={300}
            step="0.1"
            className="form-control"
            value={form.weightKg}
            onChange={(event) => setForm({ ...form, weightKg: Number(event.target.value) })}
            required
          />
        </div>

        <div className="col-12 mt-4">
          <h2 className="h6 text-uppercase text-body-secondary mb-2">Entrenamiento</h2>
        </div>

        <div className="col-md-6">
          <label htmlFor="experienceLevel" className="form-label">
            Nivel de experiencia
          </label>
          <select
            id="experienceLevel"
            className="form-select"
            value={form.experienceLevel}
            onChange={(event) =>
              setForm({
                ...form,
                experienceLevel: event.target.value as AthleteProfileInput['experienceLevel'],
              })
            }
          >
            {Object.entries(EXPERIENCE_LEVEL_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label htmlFor="goal" className="form-label">
            Objetivo principal
          </label>
          <select
            id="goal"
            className="form-select"
            value={form.goal}
            onChange={(event) =>
              setForm({ ...form, goal: event.target.value as AthleteProfileInput['goal'] })
            }
          >
            {Object.entries(TRAINING_GOAL_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <label htmlFor="availableDays" className="form-label">
            Dias disponibles por semana
          </label>
          <input
            id="availableDays"
            type="number"
            min={1}
            max={7}
            className="form-control"
            value={form.availableDays}
            onChange={(event) => setForm({ ...form, availableDays: Number(event.target.value) })}
          />
        </div>

        <div className="col-md-4">
          <label htmlFor="sessionDurationMinutes" className="form-label">
            Duracion por sesion (min)
          </label>
          <input
            id="sessionDurationMinutes"
            type="number"
            min={10}
            max={240}
            className="form-control"
            value={form.sessionDurationMinutes}
            onChange={(event) =>
              setForm({ ...form, sessionDurationMinutes: Number(event.target.value) })
            }
          />
        </div>

        <div className="col-md-4">
          <label htmlFor="equipment" className="form-label">
            Equipamiento disponible
          </label>
          <input
            id="equipment"
            type="text"
            className="form-control"
            placeholder="Gimnasio completo, mancuernas en casa, etc."
            value={form.equipment}
            onChange={(event) => setForm({ ...form, equipment: event.target.value })}
          />
        </div>

        {error && (
          <div className="col-12">
            <div className="alert alert-danger py-2 mb-0" role="alert">
              {error}
            </div>
          </div>
        )}

        {savedAt && !error && (
          <div className="col-12">
            <div className="alert alert-success py-2 mb-0" role="status">
              Perfil guardado correctamente.
            </div>
          </div>
        )}

        <div className="col-12">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar perfil'}
          </button>
        </div>
      </form>
    </div>
  )
}
