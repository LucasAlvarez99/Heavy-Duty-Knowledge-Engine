import { useAuth } from './useAuth'
import { useAsyncData } from './useAsyncData'
import { getAthleteProfile } from '../infrastructure/database/athleteProfileRepository'
import type { AthleteProfileRow } from '../infrastructure/database/athleteProfileRepository'
import { fallbackDisplayName } from '../domain/training/athleteProfile'

export function useDisplayName(): string {
  const { user } = useAuth()

  const { data: profile } = useAsyncData<AthleteProfileRow | null>(
    () => (user ? getAthleteProfile(user.id) : Promise.resolve(null)),
    [user],
    null,
  )

  if (profile?.displayName) return profile.displayName
  return fallbackDisplayName(user?.email)
}
