import { useState } from 'react'
import type { FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAuth } from '../../hooks/useAuth'
import { useAsyncData } from '../../hooks/useAsyncData'
import { listExercises } from '../../infrastructure/database/exerciseRepository'
import { createOneRmRecord, listOneRmHistory } from '../../infrastructure/database/oneRmRepository'
import { intensityTable } from '../../domain/strength/oneRepMax'
import type { OneRmRecord } from '../../domain/strength/types'
import type { Exercise } from '../../domain/training/exercise'

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

export function ExerciseStrengthDetailPage() {
  const { exerciseId } = useParams<{ exerciseId: string }>()
  const { user } = useAuth()

  const [manualWeight, setManualWeight] = useState('')
  const [manualDate, setManualDate] = useState(today())
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [manualAdditions, setManualAdditions] = useState<OneRmRecord[]>([])

  const { data: exercises } = useAsyncData<Exercise[]>(listExercises, [], [])
  const exercise = exercises.find((item) => item.id === exerciseId)

  const {
    data: history,
    loading,
    error,
  } = useAsyncData<OneRmRecord[]>(
    () => (user && exerciseId ? listOneRmHistory(user.id, exerciseId) : Promise.resolve([])),
    [user, exerciseId],
    [],
  )

  const fullHistory = [...history, ...manualAdditions].sort((a, b) => a.date.localeCompare(b.date))
  const best = fullHistory.reduce<OneRmRecord | null>((max, record) => {
    if (!max) return record
    if (record.type === 'REAL' && max.type === 'ESTIMATED') return record
    if (record.type === max.type && record.weightKg > max.weightKg) return record
    return max
  }, null)

  async function handleManualSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user || !exerciseId) return

    const weightKg = Number(manualWeight)
    if (!Number.isFinite(weightKg) || weightKg <= 0) {
      setSaveError('Ingresa un peso valido, mayor a 0 kg')
      return
    }

    setSaving(true)
    setSaveError(null)
    try {
      const record = await createOneRmRecord(user.id, {
        exerciseId,
        weightKg,
        type: 'REAL',
        formula: null,
        date: manualDate,
      })
      setManualAdditions((prev) => [...prev, record])
      setManualWeight('')
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : String(err))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          No se pudo cargar el historico: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="container py-4" style={{ maxWidth: 900 }}>
      <h1 className="h3 mb-1">{exercise?.name ?? 'Ejercicio'}</h1>
      <p className="text-body-secondary mb-4">
        Mejor 1RM: {best ? `${best.weightKg} kg (${best.type === 'REAL' ? 'real' : 'estimado'})` : 'sin datos todavia'}
      </p>

      <div className="row g-4">
        <div className="col-lg-7">
          <h2 className="h5 mb-3">Progreso en el tiempo</h2>
          {fullHistory.length === 0 ? (
            <div className="alert alert-info" role="status">
              Todavia no hay marcas registradas para este ejercicio. Se generan automaticamente al
              registrar entrenamientos, o cargalas a mano aca al lado.
            </div>
          ) : (
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <LineChart data={fullHistory.map((r) => ({ date: r.date, weightKg: r.weightKg }))}>
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    domain={['dataMin - 5', 'dataMax + 5']}
                    unit=" kg"
                  />
                  <Tooltip formatter={(value) => [`${value} kg`, '1RM']} />
                  <Line type="monotone" dataKey="weightKg" stroke="#0d6efd" strokeWidth={2} dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {fullHistory.length > 0 && (
            <div className="table-responsive mt-3">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th scope="col">Fecha</th>
                    <th scope="col">Peso</th>
                    <th scope="col">Tipo</th>
                    <th scope="col">Formula</th>
                  </tr>
                </thead>
                <tbody>
                  {[...fullHistory].reverse().map((record) => (
                    <tr key={record.id}>
                      <td>{record.date}</td>
                      <td>{record.weightKg} kg</td>
                      <td>{record.type === 'REAL' ? 'Real' : 'Estimado'}</td>
                      <td>{record.formula ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="col-lg-5">
          <h2 className="h5 mb-3">Registrar 1RM real (test medido)</h2>
          <form onSubmit={handleManualSubmit} className="row g-2 mb-4">
            <div className="col-6">
              <label htmlFor="manualWeight" className="form-label small">
                Peso (kg)
              </label>
              <input
                id="manualWeight"
                type="number"
                min={1}
                step="0.5"
                className="form-control"
                value={manualWeight}
                onChange={(event) => setManualWeight(event.target.value)}
                required
              />
            </div>
            <div className="col-6">
              <label htmlFor="manualDate" className="form-label small">
                Fecha
              </label>
              <input
                id="manualDate"
                type="date"
                className="form-control"
                value={manualDate}
                onChange={(event) => setManualDate(event.target.value)}
                required
              />
            </div>
            {saveError && (
              <div className="col-12">
                <div className="alert alert-danger py-2 mb-0" role="alert">
                  {saveError}
                </div>
              </div>
            )}
            <div className="col-12">
              <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                {saving ? 'Guardando...' : 'Registrar marca'}
              </button>
            </div>
          </form>

          {best && (
            <>
              <h2 className="h5 mb-3">Tabla de %1RM</h2>
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th scope="col">%</th>
                      <th scope="col">Carga</th>
                    </tr>
                  </thead>
                  <tbody>
                    {intensityTable(best.weightKg).map((row) => (
                      <tr key={row.percentage}>
                        <td>{row.percentage}%</td>
                        <td>{row.weightKg} kg</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
