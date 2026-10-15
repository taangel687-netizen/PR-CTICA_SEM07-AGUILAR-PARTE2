import { useEffect, useState } from 'react'
import { formatClock } from '../utils/taskUtils'

// Componente con un efecto que REQUIERE cleanup (setInterval).
// Sirve para validar el punto 3 de la guía: al ocultarlo desde el Dashboard se
// desmonta, React ejecuta el cleanup y el intervalo se limpia (ver consola).
// Además, solo este componente se re-renderiza cada segundo: ideal para el Profiler.
const SessionClock = () => {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    if (import.meta.env.DEV) console.debug('[SessionClock] efecto iniciado: intervalo creado')

    return () => {
      clearInterval(id)
      if (import.meta.env.DEV) console.debug('[SessionClock] cleanup: intervalo limpiado')
    }
  }, [])

  return (
    <span className="clock" role="timer" aria-live="off">
      Tiempo en esta sesión: <strong>{formatClock(seconds)}</strong>
    </span>
  )
}

export default SessionClock
