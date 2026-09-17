export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced'

export type TrainingGoal =
  | 'muscle_mass'
  | 'strength'
  | 'fat_loss'
  | 'body_recomposition'
  | 'performance'

export interface AthleteProfileInput {
  displayName: string
  birthDate: string
  heightCm: number
  weightKg: number
  experienceLevel: ExperienceLevel
  goal: TrainingGoal
  availableDays: number
  sessionDurationMinutes: number
  equipment: string
}

/**
 * Nombre para mostrar cuando el atleta todavia no cargo un display_name en
 * su perfil: toma la parte del email antes de la arroba, separa por
 * puntos/numeros y capitaliza. "lucas.perez99@x.com" -> "Lucas Perez".
 * Nunca se muestra el email crudo en la UI (navbar, dashboard, etc).
 */
export function fallbackDisplayName(email: string | null | undefined): string {
  if (!email) return 'Atleta'
  const localPart = email.split('@')[0]
  const words = localPart
    .replace(/[0-9]+/g, ' ')
    .split(/[._-]+/)
    .map((word) => word.trim())
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  return words.length > 0 ? words.join(' ') : 'Atleta'
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
