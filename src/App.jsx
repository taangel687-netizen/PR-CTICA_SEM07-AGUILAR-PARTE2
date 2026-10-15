import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ThemeProvider, ThemeContext } from './contexts/ThemeContext'
import { useTasksReducer } from './hooks/useTasksReducer'
import { useDebounce } from './hooks/useDebounce'
import TaskForm from './components/TaskForm'
import Controls from './components/Controls'
import TaskList from './components/TaskList'
import SessionClock from './components/SessionClock'
import ProfilerBoundary from './components/ProfilerBoundary'

const Dashboard = () => {
  // useContext: tema claro/oscuro
  const { theme, toggleTheme } = useContext(ThemeContext)

  // useReducer (dentro del hook): estado complejo de la lista (add, remove, toggle, filter, sort)
  const [state, actions] = useTasksReducer()

  // useState: estado de UI local (no merece pasar por el reducer)
  const [query, setQuery] = useState('')
  const [showClock, setShowClock] = useState(true)

  // Hook personalizado: la lista solo se filtra cuando el usuario deja de escribir
  const debouncedQuery = useDebounce(query, 300)

  // useRef: acceso al input de búsqueda sin re-render
  const searchRef = useRef(null)

  // useEffect con cleanup: atajo de teclado global "/" para ir al buscador
  useEffect(() => {
    const handleKeyDown = (event) => {
      const inField =
        event.target instanceof HTMLElement &&
        event.target.closest('input, textarea, select, [contenteditable="true"]')
      if (event.key !== '/' || inField) return
      event.preventDefault()
      searchRef.current?.focus()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // useMemo: valores derivados (no se guardan en estado, se calculan a partir de él)
  const stats = useMemo(() => {
    const total = state.items.length
    const done = state.items.filter((task) => task.done).length
    return { total, done, pending: total - done }
  }, [state.items])

  // useCallback: handlers de botones / inputs con referencia estable
  const handleQuery = useCallback((event) => setQuery(event.target.value), [])
  const handleToggleClock = useCallback(() => setShowClock((visible) => !visible), [])
  const { addTask, removeTask, toggleTask, setFilter, setSort, clearCompleted } = actions
  const handleClearCompleted = useCallback(() => clearCompleted(), [clearCompleted])

  return (
    <div className={`dashboard ${theme}`}>
      <header className="header">
        <div>
          <h1>Gestor de Tareas</h1>
          <p className="subtitle">Dashboard de gestión con estado complejo · React Hooks</p>
        </div>
        <button type="button" className="btn" onClick={toggleTheme}>
          Cambiar Tema ({theme === 'light' ? 'claro' : 'oscuro'})
        </button>
      </header>

      <dl className="stats" aria-label="Resumen">
        <div>
          <dt>Total</dt>
          <dd>{stats.total}</dd>
        </div>
        <div>
          <dt>Pendientes</dt>
          <dd>{stats.pending}</dd>
        </div>
        <div>
          <dt>Completadas</dt>
          <dd>{stats.done}</dd>
        </div>
      </dl>

      <TaskForm onAdd={addTask} />

      <Controls
        filter={state.filter}
        sort={state.sort}
        query={query}
        onFilter={setFilter}
        onSort={setSort}
        onQuery={handleQuery}
        searchRef={searchRef}
      />

      <ProfilerBoundary id="TaskList">
        <TaskList
          tasks={state.items}
          filter={state.filter}
          sort={state.sort}
          query={debouncedQuery}
          onRemove={removeTask}
          onToggle={toggleTask}
        />
      </ProfilerBoundary>

      <footer className="footer">
        <button
          type="button"
          className="btn"
          onClick={handleClearCompleted}
          disabled={stats.done === 0}
        >
          Eliminar completadas
        </button>
        <div className="footer-clock">
          {showClock && <SessionClock />}
          <button type="button" className="btn btn-ghost" onClick={handleToggleClock}>
            {showClock ? 'Ocultar reloj' : 'Mostrar reloj'}
          </button>
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  )
}
