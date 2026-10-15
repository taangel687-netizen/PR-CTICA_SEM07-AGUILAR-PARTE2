// Funciones puras (sin React) para filtrar, buscar y ordenar tareas.
// Al ser puras se pueden probar en aislamiento y memoizar con useMemo sin riesgo.

export const FILTERS = [
  { value: 'all', label: 'Todas' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'done', label: 'Completadas' },
]

export const SORTS = [
  { value: 'asc', label: 'Título (A-Z)' },
  { value: 'desc', label: 'Título (Z-A)' },
  { value: 'recent', label: 'Más recientes' },
  { value: 'priority', label: 'Prioridad' },
]

export const PRIORITIES = [
  { value: 'alta', label: 'Alta' },
  { value: 'media', label: 'Media' },
  { value: 'baja', label: 'Baja' },
]

const PRIORITY_WEIGHT = { alta: 0, media: 1, baja: 2 }
const collator = new Intl.Collator('es', { sensitivity: 'base' })

const SORTERS = {
  asc: (a, b) => collator.compare(a.title, b.title),
  desc: (a, b) => collator.compare(b.title, a.title),
  recent: (a, b) => b.createdAt - a.createdAt,
  priority: (a, b) =>
    PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority] ||
    b.createdAt - a.createdAt,
}

// Normaliza para buscar sin distinguir mayúsculas ni tildes ("tarea" == "TÁREA")
const normalize = (text) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()

/**
 * Devuelve las tareas visibles según filtro, búsqueda y orden.
 * NO muta el arreglo original: filter() crea uno nuevo y el sort se aplica sobre ese.
 */
export function selectVisibleTasks(items, { filter, sort, query }) {
  const q = normalize(query ?? '')

  const visible = items.filter((task) => {
    if (filter === 'pending' && task.done) return false
    if (filter === 'done' && !task.done) return false
    return q === '' || normalize(task.title).includes(q)
  })

  return visible.sort(SORTERS[sort] ?? SORTERS.asc)
}

export const formatDate = (timestamp) =>
  new Date(timestamp).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
  })

export const formatClock = (totalSeconds) => {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
  const s = String(totalSeconds % 60).padStart(2, '0')
  return `${m}:${s}`
}
