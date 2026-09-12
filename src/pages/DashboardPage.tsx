import { Link } from 'react-router-dom'
import { useAuth } from '../infrastructure/auth/AuthProvider'

export function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="container py-4">
      <h1 className="h3 mb-1">Hola{user?.email ? `, ${user.email}` : ''}</h1>
      <p className="text-body-secondary mb-4">
        Este es el panel base de la Fase 1. Los motores de progreso, recuperacion y nutricion se
        conectan aca a partir de la Fase 4 en adelante.
      </p>

      <div className="row g-3">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="h5 card-title">
                <i className="bi bi-person-vcard me-2" aria-hidden="true" />
                Perfil del atleta
              </h2>
              <p className="card-text">
                Cargar o actualizar tus datos biometricos, nivel de experiencia y objetivo.
              </p>
              <Link to="/perfil" className="btn btn-outline-primary btn-sm">
                Ir al perfil
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="h5 card-title">
                <i className="bi bi-list-check me-2" aria-hidden="true" />
                Catalogo de ejercicios
              </h2>
              <p className="card-text">
                Consultar los ejercicios disponibles para armar rutinas y registrar entrenamientos.
              </p>
              <Link to="/ejercicios" className="btn btn-outline-primary btn-sm">
                Ver ejercicios
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
