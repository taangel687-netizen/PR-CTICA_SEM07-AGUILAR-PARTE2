import { useReducer, useEffect, useMemo } from 'react'

const STORAGE_KEY = 'dashboard:tasks'

// 1) Tipos de acción -------------------------------------------------------
export const ACTIONS = {
  ADD: 'ADD',
  REMOVE: 'REMOVE',
  TOGGLE: 'TOGGLE',
  FILTER: 'FILTER',
  SORT: 'SORT',
  CLEAR_COMPLETED: 'CLEAR_COMPLETED',
}

const VALID_FILTERS = ['all', 'pending', 'done']
const VALID_SORTS = ['asc', 'desc', 'recent', 'priority']

export const initialState = { items: [], filter: 'all', sort: 'asc' }

// 2) Reducer: función PURA e INMUTABLE ------------------------------------
// Regla: mismo (state, action) -> mismo resultado, sin efectos secundarios.
// Por eso el id y la fecha NO se generan aquí sino en el creador de la acción
// (StrictMode ejecuta los reducers dos veces en desarrollo para detectar impurezas).
// Si una acción no cambia nada se devuelve el MISMO `state`: React evita el re-render.
function tasksReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD: {
      const { id, title, priority, createdAt } = action.payload
      const cleanTitle = title.trim()
      if (!cleanTitle) return state
      const task = { id, title: cleanTitle, priority, createdAt, done: false }
      return { ...state, items: [task, ...state.items] }
    }

    case ACTIONS.REMOVE:
      return {
        ...state,
        items: state.items.filter((task) => task.id !== action.payload.id),
      }

    case ACTIONS.TOGGLE:
      return {
        ...state,
        items: state.items.map((task) =>
          task.id === action.payload.id ? { ...task, done: !task.done } : task,
        ),
      }

    case ACTIONS.FILTER:
      if (!VALID_FILTERS.includes(action.payload) || action.payload === state.filter) {
        return state
      }
      return { ...state, filter: action.payload }

    case ACTIONS.SORT:
      if (!VALID_SORTS.includes(action.payload) || action.payload === state.sort) {
        return state
      }
      return { ...state, sort: action.payload }

    case ACTIONS.CLEAR_COMPLETED: {
      if (!state.items.some((task) => task.done)) return state
      return { ...state, items: state.items.filter((task) => !task.done) }
    }

    default:
      return state
  }
}

export default tasksReducer

// 3) Estado inicial perezoso (lee localStorage una sola vez) ---------------
const createId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

function seedTasks() {
  const now = Date.now()
  const hour = 3_600_000
  return [
    { id: 'seed-1', title: 'Revisar la rúbrica de la práctica', priority: 'alta', createdAt: now - 1 * hour, done: false },
    { id: 'seed-2', title: 'Grabar una sesión en el Profiler', priority: 'media', createdAt: now - 2 * hour, done: false },
    { id: 'seed-3', title: 'Subir el proyecto a GitHub', priority: 'media', createdAt: now - 3 * hour, done: false },
    { id: 'seed-4', title: 'Instalar React DevTools', priority: 'baja', createdAt: now - 4 * hour, done: true },
  ]
}

function loadInitialState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw === null) return { ...initialState, items: seedTasks() }
    const saved = JSON.parse(raw)
    if (!saved || !Array.isArray(saved.items)) return initialState
    return {
      items: saved.items,
      filter: VALID_FILTERS.includes(saved.filter) ? saved.filter : initialState.filter,
      sort: VALID_SORTS.includes(saved.sort) ? saved.sort : initialState.sort,
    }
  } catch {
    return initialState
  }
}

// 4) Hook: useReducer + persistencia + creadores de acciones estables ------
export function useTasksReducer() {
  const [state, dispatch] = useReducer(tasksReducer, undefined, loadInitialState)

  // Sincronizar con localStorage cuando cambia el estado
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // almacenamiento no disponible: se continúa en memoria
    }
  }, [state])

  // `dispatch` es estable, así que `actions` se crea una sola vez y mantiene
  // la misma referencia entre renders (seguro para pasar a hijos memoizados).
  const actions = useMemo(
    () => ({
      addTask: (title, priority = 'media') =>
        dispatch({
          type: ACTIONS.ADD,
          payload: { id: createId(), title, priority, createdAt: Date.now() },
        }),
      removeTask: (id) => dispatch({ type: ACTIONS.REMOVE, payload: { id } }),
      toggleTask: (id) => dispatch({ type: ACTIONS.TOGGLE, payload: { id } }),
      setFilter: (filter) => dispatch({ type: ACTIONS.FILTER, payload: filter }),
      setSort: (sort) => dispatch({ type: ACTIONS.SORT, payload: sort }),
      clearCompleted: () => dispatch({ type: ACTIONS.CLEAR_COMPLETED }),
    }),
    [dispatch],
  )

  return [state, actions]
}
