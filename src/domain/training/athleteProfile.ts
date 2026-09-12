export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced'

export type TrainingGoal =
  | 'muscle_mass'
  | 'strength'
  | 'fat_loss'
  | 'body_recomposition'
  | 'performance'

export interface AthleteProfileInput {
  birthDate: string
  heightCm: number
  weightKg: number
  experienceLevel: ExperienceLevel
  goal: TrainingGoal
  availableDays: number
  sessionDurationMinutes: number
  equipment: string
}

export const EXPERIENCE_LEVEL_LABEL: Record<ExperienceLevel, string> = {
  beginner: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
}

export const TRAINING_GOAL_LABEL: Record<TrainingGoal, string> = {
  muscle_mass: 'Ganar masa muscular',
  strength: 'Aumentar fuerza',
  fat_loss: 'Perder grasa',
  body_recomposition: 'Recomposicion corporal',
  performance: 'Mejorar rendimiento',
}
