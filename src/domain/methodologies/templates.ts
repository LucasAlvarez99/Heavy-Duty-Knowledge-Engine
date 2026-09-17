import type { ExperienceLevel, TrainingGoal } from '../training/athleteProfile'

export type Methodology = 'full_body' | 'upper_lower' | 'push_pull_legs' | 'bro_split'

export const METHODOLOGY_LABEL: Record<Methodology, string> = {
  full_body: 'Full Body',
  upper_lower: 'Upper / Lower',
  push_pull_legs: 'Push / Pull / Legs',
  bro_split: 'Bro Split (por grupo muscular)',
}

export interface TemplateSlot {
  muscleGroup: string
  targetSets: number
  targetReps: number
  targetRir: number | null
  restSeconds: number | null
}

export interface TemplateDay {
  label: string
  slots: TemplateSlot[]
}

export interface RoutineTemplate {
  id: string
  methodology: Methodology
  name: string
  goals: TrainingGoal[]
  levels: ExperienceLevel[]
  daysPerWeek: number
  days: TemplateDay[]
}

/**
 * Esto NO es el Knowledge Engine (Fase 6/7): son plantillas genericas y
 * conocidas de la industria, escritas a mano como punto de partida
 * razonable. Cuando el Knowledge Engine exista, estas plantillas se van a
 * poder reemplazar o complementar con estructuras extraidas de fuentes
 * documentadas (Mentzer, etc), pero eso es trabajo de una fase futura.
 */
const HYPERTROPHY_SLOT = (muscleGroup: string): TemplateSlot => ({
  muscleGroup,
  targetSets: 3,
  targetReps: 10,
  targetRir: 2,
  restSeconds: 90,
})

const STRENGTH_SLOT = (muscleGroup: string): TemplateSlot => ({
  muscleGroup,
  targetSets: 4,
  targetReps: 5,
  targetRir: 2,
  restSeconds: 150,
})

export const ROUTINE_TEMPLATES: RoutineTemplate[] = [
  {
    id: 'full_body_beginner',
    methodology: 'full_body',
    name: 'Full Body para principiantes',
    goals: ['muscle_mass', 'fat_loss', 'body_recomposition'],
    levels: ['beginner'],
    daysPerWeek: 3,
    days: [
      {
        label: 'Full Body',
        slots: [
          HYPERTROPHY_SLOT('pecho'),
          HYPERTROPHY_SLOT('espalda'),
          HYPERTROPHY_SLOT('pierna'),
          HYPERTROPHY_SLOT('hombro'),
          HYPERTROPHY_SLOT('core'),
        ],
      },
    ],
  },
  {
    id: 'upper_lower_intermediate',
    methodology: 'upper_lower',
    name: 'Upper / Lower intermedio',
    goals: ['muscle_mass', 'strength', 'body_recomposition'],
    levels: ['intermediate'],
    daysPerWeek: 4,
    days: [
      {
        label: 'Tren superior',
        slots: [
          HYPERTROPHY_SLOT('pecho'),
          HYPERTROPHY_SLOT('espalda'),
          HYPERTROPHY_SLOT('hombro'),
          HYPERTROPHY_SLOT('biceps'),
          HYPERTROPHY_SLOT('triceps'),
        ],
      },
      {
        label: 'Tren inferior',
        slots: [
          HYPERTROPHY_SLOT('pierna'),
          HYPERTROPHY_SLOT('gluteo'),
          HYPERTROPHY_SLOT('isquiotibiales'),
          HYPERTROPHY_SLOT('core'),
        ],
      },
    ],
  },
  {
    id: 'push_pull_legs_intermediate',
    methodology: 'push_pull_legs',
    name: 'Push / Pull / Legs',
    goals: ['muscle_mass', 'performance'],
    levels: ['intermediate', 'advanced'],
    daysPerWeek: 6,
    days: [
      {
        label: 'Push (empuje)',
        slots: [HYPERTROPHY_SLOT('pecho'), HYPERTROPHY_SLOT('hombro'), HYPERTROPHY_SLOT('triceps')],
      },
      {
        label: 'Pull (traccion)',
        slots: [HYPERTROPHY_SLOT('espalda'), HYPERTROPHY_SLOT('biceps'), HYPERTROPHY_SLOT('core')],
      },
      {
        label: 'Legs (pierna)',
        slots: [
          HYPERTROPHY_SLOT('pierna'),
          HYPERTROPHY_SLOT('gluteo'),
          HYPERTROPHY_SLOT('isquiotibiales'),
        ],
      },
    ],
  },
  {
    id: 'bro_split_advanced',
    methodology: 'bro_split',
    name: 'Bro Split para fuerza avanzada',
    goals: ['strength', 'performance'],
    levels: ['advanced'],
    daysPerWeek: 5,
    days: [
      { label: 'Pecho', slots: [STRENGTH_SLOT('pecho'), STRENGTH_SLOT('triceps')] },
      { label: 'Espalda', slots: [STRENGTH_SLOT('espalda'), STRENGTH_SLOT('biceps')] },
      { label: 'Pierna', slots: [STRENGTH_SLOT('pierna'), STRENGTH_SLOT('gluteo')] },
      { label: 'Hombro', slots: [STRENGTH_SLOT('hombro'), STRENGTH_SLOT('core')] },
      { label: 'Brazo', slots: [STRENGTH_SLOT('biceps'), STRENGTH_SLOT('triceps')] },
    ],
  },
]
