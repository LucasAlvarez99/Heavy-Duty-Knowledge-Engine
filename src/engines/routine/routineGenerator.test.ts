import { describe, expect, it } from 'vitest'
import { generateRoutinesFromTemplate, selectTemplate } from './routineGenerator'
import type { RoutineTemplate } from '../../domain/methodologies/templates'
import type { Exercise } from '../../domain/training/exercise'

const TEST_TEMPLATES: RoutineTemplate[] = [
  {
    id: 'test_full_body',
    methodology: 'full_body',
    name: 'Full Body de prueba',
    goals: ['muscle_mass'],
    levels: ['beginner'],
    daysPerWeek: 3,
    days: [
      {
        label: 'Full Body',
        slots: [
          { muscleGroup: 'Pecho', targetSets: 3, targetReps: 10, targetRir: 2, restSeconds: 90 },
          { muscleGroup: 'Espalda', targetSets: 3, targetReps: 10, targetRir: 2, restSeconds: 90 },
          { muscleGroup: 'Pantorrilla', targetSets: 3, targetReps: 12, targetRir: 2, restSeconds: 60 },
        ],
      },
    ],
  },
  {
    id: 'test_ppl',
    methodology: 'push_pull_legs',
    name: 'PPL de prueba',
    goals: ['strength'],
    levels: ['advanced'],
    daysPerWeek: 6,
    days: [
      { label: 'Push', slots: [] },
      { label: 'Pull', slots: [] },
      { label: 'Legs', slots: [] },
    ],
  },
]

function exercise(id: string, name: string, muscleGroup: string): Exercise {
  return { id, name, muscleGroup, secondaryMuscles: [], equipment: 'Barra', instructions: '' }
}

const CATALOG: Exercise[] = [
  exercise('ex-1', 'Press de banca', 'Pecho'),
  exercise('ex-2', 'Dominadas', 'Espalda'),
]

describe('selectTemplate', () => {
  it('elige una plantilla que calce con objetivo, nivel y dias exactos', () => {
    const template = selectTemplate('muscle_mass', 'beginner', 3, TEST_TEMPLATES)
    expect(template?.id).toBe('test_full_body')
  })

  it('devuelve null si no hay ninguna plantilla que calce con objetivo/nivel', () => {
    const template = selectTemplate('fat_loss', 'beginner', 3, TEST_TEMPLATES)
    expect(template).toBeNull()
  })

  it('elige la plantilla con los dias por semana mas cercanos si no hay match exacto', () => {
    const template = selectTemplate('strength', 'advanced', 4, TEST_TEMPLATES)
    expect(template?.id).toBe('test_ppl')
  })
})

describe('generateRoutinesFromTemplate', () => {
  it('llena los slots que tienen ejercicio disponible en el catalogo', () => {
    const template = TEST_TEMPLATES[0]
    const [day] = generateRoutinesFromTemplate(template, 'muscle_mass', 'beginner', CATALOG)

    expect(day.routine.exercises).toHaveLength(2)
    expect(day.routine.exercises.map((e) => e.exerciseId)).toEqual(['ex-1', 'ex-2'])
  })

  it('reporta como no cubiertos los grupos musculares sin ejercicio en el catalogo', () => {
    const template = TEST_TEMPLATES[0]
    const [day] = generateRoutinesFromTemplate(template, 'muscle_mass', 'beginner', CATALOG)

    expect(day.unfilledMuscleGroups).toEqual(['Pantorrilla'])
  })

  it('el match de grupo muscular no distingue mayusculas/minusculas', () => {
    const template = TEST_TEMPLATES[0]
    const lowercaseCatalog = [exercise('ex-1', 'Press de banca', 'pecho')]
    const [day] = generateRoutinesFromTemplate(template, 'muscle_mass', 'beginner', lowercaseCatalog)

    expect(day.routine.exercises.some((e) => e.exerciseId === 'ex-1')).toBe(true)
  })

  it('no repite el mismo ejercicio en dos slots del mismo dia', () => {
    const template: RoutineTemplate = {
      ...TEST_TEMPLATES[0],
      days: [
        {
          label: 'Full Body',
          slots: [
            { muscleGroup: 'Pecho', targetSets: 3, targetReps: 10, targetRir: 2, restSeconds: 90 },
            { muscleGroup: 'Pecho', targetSets: 3, targetReps: 10, targetRir: 2, restSeconds: 90 },
          ],
        },
      ],
    }
    const onlyOnePechoExercise = [exercise('ex-1', 'Press de banca', 'Pecho')]
    const [day] = generateRoutinesFromTemplate(template, 'muscle_mass', 'beginner', onlyOnePechoExercise)

    expect(day.routine.exercises).toHaveLength(1)
    expect(day.unfilledMuscleGroups).toEqual(['Pecho'])
  })

  it('genera un RoutineInput por cada dia de la plantilla', () => {
    const template = TEST_TEMPLATES[1]
    const days = generateRoutinesFromTemplate(template, 'strength', 'advanced', CATALOG)
    expect(days).toHaveLength(3)
    expect(days.map((d) => d.label)).toEqual(['Push', 'Pull', 'Legs'])
  })
})
