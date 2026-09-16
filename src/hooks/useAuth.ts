import { useContext } from 'react'
import { AuthContext } from '../infrastructure/auth/AuthContext'
import type { AuthContextValue } from '../infrastructure/auth/AuthContext'

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}
