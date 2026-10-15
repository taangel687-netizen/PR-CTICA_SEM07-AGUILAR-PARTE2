import { useState, useEffect } from 'react'

const resolve = (value) => (typeof value === 'function' ? value() : value)

function readValue(key, defaultValue) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw !== null ? JSON.parse(raw) : resolve(defaultValue)
  } catch {
    // JSON corrupto o localStorage bloqueado (modo privado): usar el valor por defecto
    return resolve(defaultValue)
  }
}

/**
 * Hook personalizado reutilizable: estado sincronizado con localStorage.
 *
 * @param {string} key            Clave en localStorage.
 * @param {*|Function} defaultValue Valor inicial (o función que lo calcula, evaluada una sola vez).
 * @returns {[*, Function]}       [value, setValue] - igual que useState (admite actualizador funcional).
 *
 * - Lectura perezosa: localStorage se lee una sola vez, al montar.
 * - Escritura: useEffect guarda cada vez que cambia el valor.
 * - Sincroniza entre pestañas con el evento "storage" (con cleanup).
 * - `setValue` es el setter de useState, por lo tanto es estable entre renders.
 */
export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => readValue(key, defaultValue))

  // Persistir
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Cuota llena o almacenamiento no disponible: la app sigue funcionando en memoria
    }
  }, [key, value])

  // Sincronizar con otras pestañas del navegador
  useEffect(() => {
    const handleStorage = (event) => {
      if (event.storageArea !== window.localStorage) return
      if (event.key !== key || event.newValue === null) return
      try {
        setValue(JSON.parse(event.newValue))
      } catch {
        // valor externo inválido: se ignora
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [key])

  return [value, setValue]
}

export default useLocalStorage
