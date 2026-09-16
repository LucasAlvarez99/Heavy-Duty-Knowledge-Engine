import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `nav-link${isActive ? ' active' : ''}`

export function NavBar() {
  const { user, signOut } = useAuth()

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark">
      <div className="container">
        <NavLink to="/" className="navbar-brand d-flex align-items-center gap-2">
          <i className="bi bi-activity" aria-hidden="true" />
          Gym Progress Intelligence
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#main-nav"
          aria-controls="main-nav"
          aria-expanded="false"
          aria-label="Mostrar navegacion"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="main-nav">
          {user && (
            <ul className="navbar-nav me-auto mb-2 mb-md-0">
              <li className="nav-item">
                <NavLink to="/" end className={linkClass}>
                  Panel
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/perfil" className={linkClass}>
                  Perfil
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/rutinas" className={linkClass}>
                  Rutinas
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/entrenamientos" className={linkClass}>
                  Entrenamientos
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/ejercicios" className={linkClass}>
                  Ejercicios
                </NavLink>
              </li>
            </ul>
          )}

          <ul className="navbar-nav ms-auto">
            {user ? (
              <li className="nav-item d-flex align-items-center gap-2">
                <span className="navbar-text text-truncate" style={{ maxWidth: 200 }}>
                  {user.email}
                </span>
                <button type="button" className="btn btn-outline-light btn-sm" onClick={() => signOut()}>
                  Cerrar sesion
                </button>
              </li>
            ) : (
              <li className="nav-item">
                <NavLink to="/login" className={linkClass}>
                  Iniciar sesion
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
