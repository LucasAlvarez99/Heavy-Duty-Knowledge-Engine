import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useDisplayName } from '../hooks/useDisplayName'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `nav-link${isActive ? ' active' : ''}`

const dropdownLinkClass = ({ isActive }: { isActive: boolean }) =>
  `dropdown-item${isActive ? ' active' : ''}`

export function NavBar() {
  const { user, signOut } = useAuth()
  const displayName = useDisplayName()

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark hd-navbar">
      <div className="container">
        <NavLink to="/" className="navbar-brand hd-brand">
          <span className="hd-brand-mark">HD</span>
          <span className="hd-brand-name">Heavy Duty</span>
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
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink to="/" end className={linkClass}>
                  Panel
                </NavLink>
              </li>

              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Entrenar
                </a>
                <ul className="dropdown-menu dropdown-menu-dark">
                  <li>
                    <NavLink to="/rutinas" className={dropdownLinkClass}>
                      Rutinas
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/rutinas/generar" className={dropdownLinkClass}>
                      Generar rutina
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/entrenamientos/nuevo" className={dropdownLinkClass}>
                      Registrar entrenamiento
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/entrenamientos" className={dropdownLinkClass}>
                      Historial
                    </NavLink>
                  </li>
                </ul>
              </li>

              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Analisis
                </a>
                <ul className="dropdown-menu dropdown-menu-dark">
                  <li>
                    <NavLink to="/fuerza" className={dropdownLinkClass}>
                      Fuerza
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/progreso" className={dropdownLinkClass}>
                      Progreso
                    </NavLink>
                  </li>
                </ul>
              </li>

              <li className="nav-item">
                <NavLink to="/ejercicios" className={linkClass}>
                  Ejercicios
                </NavLink>
              </li>
            </ul>
          )}

          <ul className="navbar-nav ms-auto align-items-lg-center">
            {user ? (
              <>
                <li className="nav-item">
                  <NavLink to="/perfil" className="nav-link text-truncate" style={{ maxWidth: 200 }}>
                    {displayName}
                  </NavLink>
                </li>
                <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                  <button
                    type="button"
                    className="btn btn-outline-light btn-sm w-100"
                    onClick={() => signOut()}
                  >
                    Cerrar sesion
                  </button>
                </li>
              </>
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
