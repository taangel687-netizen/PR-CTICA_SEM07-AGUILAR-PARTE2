import { useState, useEffect } from 'react'

/**
 * Hook personalizado reutilizable: retrasa la propagación de un valor.
 * Útil para búsquedas: el valor "debounced" solo cambia cuando el usuario
 * deja de escribir durante `delay` ms.
 *
 * El cleanup cancela el temporizador anterior en cada cambio (evita race conditions)
 * y al desmontar el componente (evita setState sobre un componente desmontado).
 */
export const useDebounce = (value, delay = 300) => {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])

  return debounced
}

export default useDebounce
