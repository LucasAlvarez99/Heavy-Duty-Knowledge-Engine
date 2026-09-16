import { useEffect, useState } from 'react'

interface AsyncDataState<T> {
  data: T
  loading: boolean
  error: string | null
}

/**
 * Ejecuta `fetcher` cada vez que cambian las `deps`, manejando el estado de
 * carga/error y evitando setear estado si el componente se desmonto o las
 * dependencias cambiaron antes de que la promesa resuelva (condicion de
 * carrera clasica en useEffect + fetch).
 *
 * Reemplaza el patron repetido de "loading/error/cancelled" que aparecia
 * identico en ProfilePage y ExercisesPage.
 */
export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  deps: unknown[],
  initialData: T,
): AsyncDataState<T> {
  const [state, setState] = useState<AsyncDataState<T>>({
    data: initialData,
    loading: true,
    error: null,
  })

  // Las dependencias las define quien usa el hook (parametro `deps`), no
  // esta funcion: por diseno no se pueden listar de forma estatica aca.
  // oxlint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let cancelled = false
    setState((prev) => ({ ...prev, loading: true, error: null }))

    fetcher()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null })
      })
      .catch((err) => {
        if (!cancelled) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: err instanceof Error ? err.message : String(err),
          }))
        }
      })

    return () => {
      cancelled = true
    }
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}
