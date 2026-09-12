import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../infrastructure/auth/AuthProvider'

export function RegisterPage() {
  const { signUpWithPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    const { error: signUpError } = await signUpWithPassword(email, password)
    setSubmitting(false)
    if (signUpError) {
      setError(signUpError)
      return
    }
    setDone(true)
  }

  if (done) {
    return (
      <div className="container py-5" style={{ maxWidth: 420 }}>
        <div className="alert alert-success">
          Cuenta creada. Revisa tu correo para confirmar el registro y despues inicia sesion.
        </div>
        <Link to="/login" className="btn btn-primary w-100">
          Ir a iniciar sesion
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-5" style={{ maxWidth: 420 }}>
      <h1 className="h3 mb-4">Crear cuenta</h1>

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Correo electronico
          </label>
          <input
            id="email"
            type="email"
            className="form-control"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Contrasena
          </label>
          <input
            id="password"
            type="password"
            className="form-control"
            autoComplete="new-password"
            minLength={6}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {error && (
          <div className="alert alert-danger py-2" role="alert">
            {error}
          </div>
        )}

        <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
          {submitting ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>

      <p className="text-body-secondary mt-3 mb-0">
        Ya tenes cuenta? <Link to="/login">Iniciar sesion</Link>
      </p>
    </div>
  )
}
