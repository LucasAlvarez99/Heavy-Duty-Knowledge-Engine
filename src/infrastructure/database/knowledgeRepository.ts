import { supabase } from './supabaseClient'
import type {
  HistoricalRoutine,
  HistoricalRoutineExerciseSlot,
  KnowledgeSource,
  Principle,
  Provenance,
  Strategy,
  StrategyRisk,
} from '../../domain/knowledge/types'
import type { ExperienceLevel } from '../../domain/training/athleteProfile'

interface SourceDbRow {
  id: string
  title: string
  author: string
  era: string
  source_type: KnowledgeSource['sourceType']
}

interface PrincipleDbRow {
  id: string
  source_id: string
  name: string
  description: string
  provenance: Provenance
  citation: string
}

interface StrategyDbRow {
  id: string
  source_id: string
  name: string
  description: string
  objective: string
  recommended_level: ExperienceLevel
  risk: StrategyRisk
  rest_seconds_between_steps: number | null
  provenance: Provenance
  citation: string
}

interface HistoricalRoutineDbRow {
  id: string
  source_id: string
  name: string
  author: string
  methodology: string
  era: string
  context: string
  frequency_description: string
  provenance: Provenance
  citation: string
}

interface HistoricalRoutineExerciseDbRow {
  historical_routine_id: string
  exercise_name: string
  order_index: number
  sets: number
  reps_description: string
  superset_group: number | null
  technique: string | null
}

function sourceFromRow(row: SourceDbRow): KnowledgeSource {
  return { id: row.id, title: row.title, author: row.author, era: row.era, sourceType: row.source_type }
}

function principleFromRow(row: PrincipleDbRow): Principle {
  return {
    id: row.id,
    sourceId: row.source_id,
    name: row.name,
    description: row.description,
    provenance: row.provenance,
    citation: row.citation,
  }
}

function strategyFromRow(row: StrategyDbRow): Strategy {
  return {
    id: row.id,
    sourceId: row.source_id,
    name: row.name,
    description: row.description,
    objective: row.objective,
    recommendedLevel: row.recommended_level,
    risk: row.risk,
    restSecondsBetweenSteps: row.rest_seconds_between_steps,
    provenance: row.provenance,
    citation: row.citation,
  }
}

function exerciseSlotFromRow(row: HistoricalRoutineExerciseDbRow): HistoricalRoutineExerciseSlot {
  return {
    exerciseName: row.exercise_name,
    orderIndex: row.order_index,
    sets: row.sets,
    repsDescription: row.reps_description,
    supersetGroup: row.superset_group,
    technique: row.technique,
  }
}

export async function listKnowledgeSources(): Promise<KnowledgeSource[]> {
  const { data, error } = await supabase.from('knowledge_sources').select('*').order('title')
  if (error) throw error
  return (data as SourceDbRow[]).map(sourceFromRow)
}

export async function listPrinciples(): Promise<Principle[]> {
  const { data, error } = await supabase.from('principles').select('*').order('name')
  if (error) throw error
  return (data as PrincipleDbRow[]).map(principleFromRow)
}

export async function listStrategies(): Promise<Strategy[]> {
  const { data, error } = await supabase.from('strategies').select('*').order('name')
  if (error) throw error
  return (data as StrategyDbRow[]).map(strategyFromRow)
}

export async function listHistoricalRoutines(): Promise<HistoricalRoutine[]> {
  const { data: routineRows, error: routineError } = await supabase
    .from('historical_routines')
    .select('*')
    .order('methodology')
    .order('name')

  if (routineError) throw routineError

  const rows = routineRows as HistoricalRoutineDbRow[]
  if (rows.length === 0) return []

  const { data: exerciseRows, error: exerciseError } = await supabase
    .from('historical_routine_exercises')
    .select('*')
    .in(
      'historical_routine_id',
      rows.map((row) => row.id),
    )
    .order('order_index', { ascending: true })

  if (exerciseError) throw exerciseError

  const exercises = exerciseRows as HistoricalRoutineExerciseDbRow[]

  return rows.map((row) => ({
    id: row.id,
    sourceId: row.source_id,
    name: row.name,
    author: row.author,
    methodology: row.methodology,
    era: row.era,
    context: row.context,
    frequencyDescription: row.frequency_description,
    provenance: row.provenance,
    citation: row.citation,
    exercises: exercises
      .filter((exercise) => exercise.historical_routine_id === row.id)
      .map(exerciseSlotFromRow),
  }))
}
