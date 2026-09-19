import { Link } from 'react-router-dom'
import { useDisplayName } from '../hooks/useDisplayName'

export function DashboardPage() {
  const displayName = useDisplayName()

  return (
    <div className="container py-4">
      <h1 className="h3 mb-1">Hola, {displayName}</h1>
      <p className="text-body-secondary mb-4">
        Rutinas, entrenamientos y tu evolucion de fuerza, todo en un mismo lugar.
      </p>

      <div className="row g-3">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="h5 card-title">
                <i className="bi bi-clipboard2-pulse me-2 text-primary" aria-hidden="true" />
                Rutinas
              </h2>
              <p className="card-text">Crear y editar tus rutinas de entrenamiento.</p>
              <Link to="/rutinas" className="btn btn-outline-primary btn-sm">
                Ver rutinas
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="h5 card-title">
                <i className="bi bi-journal-check me-2 text-primary" aria-hidden="true" />
                Entrenamientos
              </h2>
              <p className="card-text">
                Registrar un entrenamiento nuevo y revisar el historial de sesiones pasadas.
              </p>
              <Link to="/entrenamientos" className="btn btn-outline-primary btn-sm">
                Ver historial
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="h5 card-title">
                <i className="bi bi-graph-up-arrow me-2 text-primary" aria-hidden="true" />
                Fuerza
              </h2>
              <p className="card-text">
                1RM real y estimado por ejercicio, deteccion automatica de PRs y tabla de %1RM.
              </p>
              <Link to="/fuerza" className="btn btn-outline-primary btn-sm">
                Ver fuerza
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="h5 card-title">
                <i className="bi bi-activity me-2 text-primary" aria-hidden="true" />
                Progreso
              </h2>
              <p className="card-text">
                Estado, tendencia y Confidence Score por ejercicio segun tu historial.
              </p>
              <Link to="/progreso" className="btn btn-outline-primary btn-sm">
                Ver progreso
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="h5 card-title">
                <i className="bi bi-person-vcard me-2 text-primary" aria-hidden="true" />
                Mi perfil
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
                <i className="bi bi-book me-2 text-primary" aria-hidden="true" />
                Biblioteca de conocimiento
              </h2>
              <p className="card-text">
                Principios y rutinas historicas de Heavy Duty, con cita a la fuente original.
              </p>
              <Link to="/conocimiento" className="btn btn-outline-primary btn-sm">
                Explorar
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="h5 card-title">
                <i className="bi bi-list-check me-2 text-primary" aria-hidden="true" />
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
