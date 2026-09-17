import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './infrastructure/auth/AuthProvider'
import { NavBar } from './components/NavBar'
import { RequireAuth } from './components/RequireAuth'

// Cada pagina se carga bajo demanda (code splitting por ruta). Con esto el
// bundle inicial no arrastra Supabase, formularios y tablas que el usuario
// puede no visitar; a medida que se sumen paginas en las proximas fases esto
// evita que el chunk principal siga creciendo sin control.
const LoginPage = lazy(() => import('./features/auth/LoginPage').then((m) => ({ default: m.LoginPage })))
const RegisterPage = lazy(() =>
  import('./features/auth/RegisterPage').then((m) => ({ default: m.RegisterPage })),
)
const ProfilePage = lazy(() =>
  import('./features/profile/ProfilePage').then((m) => ({ default: m.ProfilePage })),
)
const ExercisesPage = lazy(() =>
  import('./features/exercises/ExercisesPage').then((m) => ({ default: m.ExercisesPage })),
)
const RoutinesListPage = lazy(() =>
  import('./features/routines/RoutinesListPage').then((m) => ({ default: m.RoutinesListPage })),
)
const RoutineFormPage = lazy(() =>
  import('./features/routines/RoutineFormPage').then((m) => ({ default: m.RoutineFormPage })),
)
const WorkoutLoggerPage = lazy(() =>
  import('./features/workouts/WorkoutLoggerPage').then((m) => ({ default: m.WorkoutLoggerPage })),
)
const WorkoutHistoryPage = lazy(() =>
  import('./features/workouts/WorkoutHistoryPage').then((m) => ({ default: m.WorkoutHistoryPage })),
)
const WorkoutDetailPage = lazy(() =>
  import('./features/workouts/WorkoutDetailPage').then((m) => ({ default: m.WorkoutDetailPage })),
)
const StrengthPage = lazy(() =>
  import('./features/oneRM/StrengthPage').then((m) => ({ default: m.StrengthPage })),
)
const ExerciseStrengthDetailPage = lazy(() =>
  import('./features/oneRM/ExerciseStrengthDetailPage').then((m) => ({
    default: m.ExerciseStrengthDetailPage,
  })),
)
const DashboardPage = lazy(() =>
  import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)

function RouteFallback() {
  return (
    <div className="container py-5 text-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <div className="app-shell">
        <NavBar />

        <main className="app-main">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/registro" element={<RegisterPage />} />

              <Route
                path="/"
                element={
                  <RequireAuth>
                    <DashboardPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/perfil"
                element={
                  <RequireAuth>
                    <ProfilePage />
                  </RequireAuth>
                }
              />
              <Route
                path="/ejercicios"
                element={
                  <RequireAuth>
                    <ExercisesPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/rutinas"
                element={
                  <RequireAuth>
                    <RoutinesListPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/rutinas/nueva"
                element={
                  <RequireAuth>
                    <RoutineFormPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/rutinas/:routineId"
                element={
                  <RequireAuth>
                    <RoutineFormPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/entrenamientos"
                element={
                  <RequireAuth>
                    <WorkoutHistoryPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/entrenamientos/nuevo"
                element={
                  <RequireAuth>
                    <WorkoutLoggerPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/entrenamientos/:workoutId"
                element={
                  <RequireAuth>
                    <WorkoutDetailPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/fuerza"
                element={
                  <RequireAuth>
                    <StrengthPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/fuerza/:exerciseId"
                element={
                  <RequireAuth>
                    <ExerciseStrengthDetailPage />
                  </RequireAuth>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </AuthProvider>
  )
}

export default App
