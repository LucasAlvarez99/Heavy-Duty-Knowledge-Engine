import { useState } from 'react'
import { useAsyncData } from '../../hooks/useAsyncData'
import {
  listHistoricalRoutines,
  listKnowledgeSources,
  listPrinciples,
  listStrategies,
} from '../../infrastructure/database/knowledgeRepository'
import type {
  HistoricalRoutine,
  KnowledgeSource,
  Principle,
  Provenance,
  Strategy,
} from '../../domain/knowledge/types'
import { EXPERIENCE_LEVEL_LABEL } from '../../domain/training/athleteProfile'

type Tab = 'principios' | 'estrategias' | 'rutinas' | 'fuentes'

const PROVENANCE_LABEL: Record<Provenance, string> = {
  DOCUMENTED: 'Documentado',
  INTERPRETED: 'Interpretado',
  ADAPTED: 'Adaptado',
}

const PROVENANCE_BADGE: Record<Provenance, string> = {
  DOCUMENTED: 'text-bg-success',
  INTERPRETED: 'text-bg-info',
  ADAPTED: 'text-bg-warning',
}

function ProvenanceBadge({ provenance }: { provenance: Provenance }) {
  return <span className={`badge ${PROVENANCE_BADGE[provenance]}`}>{PROVENANCE_LABEL[provenance]}</span>
}

export function KnowledgePage() {
  const [tab, setTab] = useState<Tab>('principios')

  const { data: sources, loading: loadingSources, error: sourcesError } = useAsyncData<
    KnowledgeSource[]
  >(listKnowledgeSources, [], [])
  const { data: principles, loading: loadingPrinciples, error: principlesError } = useAsyncData<
    Principle[]
  >(listPrinciples, [], [])
  const { data: strategies, loading: loadingStrategies, error: strategiesError } = useAsyncData<
    Strategy[]
  >(listStrategies, [], [])
  const { data: routines, loading: loadingRoutines, error: routinesError } = useAsyncData<
    HistoricalRoutine[]
  >(listHistoricalRoutines, [], [])

  function sourceTitle(sourceId: string): string {
    return sources.find((source) => source.id === sourceId)?.title ?? 'Fuente'
  }

  return (
    <div className="container py-4">
      <h1 className="h3 mb-1">Biblioteca de conocimiento</h1>
      <p className="text-body-secondary mb-4">
        Principios, estrategias y rutinas historicas extraidos de fuentes reales, cada una con su
        cita. <strong>Documentado</strong> es texto original de la fuente primaria,{' '}
        <strong>Interpretado</strong> es una relectura de otra fuente, y <strong>Adaptado</strong> es
        una version modificada para un contexto distinto al original. Nada de esto reemplaza al
        Adaptation Engine: es material de referencia, no una recomendacion automatica para vos.
      </p>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link${tab === 'principios' ? ' active' : ''}`}
            onClick={() => setTab('principios')}
          >
            Principios
          </button>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link${tab === 'estrategias' ? ' active' : ''}`}
            onClick={() => setTab('estrategias')}
          >
            Estrategias
          </button>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link${tab === 'rutinas' ? ' active' : ''}`}
            onClick={() => setTab('rutinas')}
          >
            Rutinas historicas
          </button>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link${tab === 'fuentes' ? ' active' : ''}`}
            onClick={() => setTab('fuentes')}
          >
            Fuentes
          </button>
        </li>
      </ul>

      {tab === 'principios' && (
        <>
          {loadingPrinciples && <p className="text-body-secondary">Cargando...</p>}
          {principlesError && (
            <div className="alert alert-danger" role="alert">
              {principlesError}
            </div>
          )}
          <div className="row g-3">
            {principles.map((principle) => (
              <div className="col-md-6" key={principle.id}>
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h2 className="h5 card-title mb-0">{principle.name}</h2>
                      <ProvenanceBadge provenance={principle.provenance} />
                    </div>
                    <p className="card-text">{principle.description}</p>
                    <p className="card-text small text-body-secondary mb-0">
                      {sourceTitle(principle.sourceId)} — {principle.citation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'estrategias' && (
        <>
          {loadingStrategies && <p className="text-body-secondary">Cargando...</p>}
          {strategiesError && (
            <div className="alert alert-danger" role="alert">
              {strategiesError}
            </div>
          )}
          <div className="row g-3">
            {strategies.map((strategy) => (
              <div className="col-md-6" key={strategy.id}>
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h2 className="h5 card-title mb-0">{strategy.name}</h2>
                      <ProvenanceBadge provenance={strategy.provenance} />
                    </div>
                    <p className="card-text">{strategy.description}</p>
                    <p className="card-text small mb-1">
                      <strong>Objetivo:</strong> {strategy.objective}
                    </p>
                    <p className="card-text small mb-2">
                      Nivel recomendado: {EXPERIENCE_LEVEL_LABEL[strategy.recommendedLevel]} · Riesgo:{' '}
                      {strategy.risk === 'low' ? 'bajo' : strategy.risk === 'medium' ? 'medio' : 'alto'}
                      {strategy.restSecondsBetweenSteps !== null &&
                        ` · Descanso entre pasos: ${strategy.restSecondsBetweenSteps}s`}
                    </p>
                    <p className="card-text small text-body-secondary mb-0">
                      {sourceTitle(strategy.sourceId)} — {strategy.citation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'rutinas' && (
        <>
          {loadingRoutines && <p className="text-body-secondary">Cargando...</p>}
          {routinesError && (
            <div className="alert alert-danger" role="alert">
              {routinesError}
            </div>
          )}
          {routines.map((routine) => (
            <div className="card mb-3" key={routine.id}>
              <div className="card-header d-flex justify-content-between align-items-start">
                <div>
                  <strong>{routine.name}</strong>
                  <div className="small text-body-secondary">
                    {routine.methodology} · {routine.author} · {routine.era}
                  </div>
                </div>
                <ProvenanceBadge provenance={routine.provenance} />
              </div>
              <div className="card-body">
                <p className="card-text">{routine.context}</p>
                <p className="card-text small mb-3">
                  <strong>Frecuencia:</strong> {routine.frequencyDescription}
                </p>
                <div className="table-responsive">
                  <table className="table table-sm mb-2">
                    <thead>
                      <tr>
                        <th scope="col">Ejercicio</th>
                        <th scope="col">Series</th>
                        <th scope="col">Repeticiones</th>
                        <th scope="col">Tecnica</th>
                      </tr>
                    </thead>
                    <tbody>
                      {routine.exercises.map((exercise, index) => (
                        <tr key={index}>
                          <td>
                            {exercise.exerciseName}
                            {exercise.supersetGroup !== null && (
                              <span className="badge text-bg-secondary ms-2">
                                superserie {exercise.supersetGroup}
                              </span>
                            )}
                          </td>
                          <td>{exercise.sets}</td>
                          <td>{exercise.repsDescription}</td>
                          <td>{exercise.technique ?? '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="card-text small text-body-secondary mb-0">
                  {sourceTitle(routine.sourceId)} — {routine.citation}
                </p>
              </div>
            </div>
          ))}
        </>
      )}

      {tab === 'fuentes' && (
        <>
          {loadingSources && <p className="text-body-secondary">Cargando...</p>}
          {sourcesError && (
            <div className="alert alert-danger" role="alert">
              {sourcesError}
            </div>
          )}
          <div className="list-group">
            {sources.map((source) => (
              <div className="list-group-item" key={source.id}>
                <strong>{source.title}</strong>
                <div className="small text-body-secondary">
                  {source.author} · {source.era}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
