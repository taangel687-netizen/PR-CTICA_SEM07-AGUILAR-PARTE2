import { Profiler } from 'react'

// Envuelve una parte del árbol con <Profiler> de React y registra cada commit en consola
// (solo en desarrollo). Complementa a React DevTools → Profiler.
const onRender = (id, phase, actualDuration, baseDuration) => {
  if (!import.meta.env.DEV) return
  console.debug(
    `[Profiler] ${id} · fase: ${phase} · render: ${actualDuration.toFixed(2)} ms · sin memo: ${baseDuration.toFixed(2)} ms`,
  )
}

const ProfilerBoundary = ({ id, children }) => (
  <Profiler id={id} onRender={onRender}>
    {children}
  </Profiler>
)

export default ProfilerBoundary
