import { useMemo, useCallback } from 'react'
import TaskItem from './TaskItem'
import { selectVisibleTasks } from '../utils/taskUtils'

const TaskList = ({ tasks, filter, sort, query, onRemove, onToggle }) => {
  // useMemo: filtrar + buscar + ordenar solo cuando cambian las entradas reales.
  // Si el Dashboard se re-renderiza por otra causa (tema, escribir en el buscador
  // antes del debounce, etc.) NO se recalcula la lista.
  const processedTasks = useMemo(
    () => selectVisibleTasks(tasks, { filter, sort, query }),
    [tasks, filter, sort, query],
  )

  // useCallback: referencias estables para los hijos memoizados (React.memo)
  const handleRemove = useCallback((id) => onRemove(id), [onRemove])
  const handleToggle = useCallback((id) => onToggle(id), [onToggle])

  if (tasks.length === 0) {
    return (
      <p className="empty">
        Aún no hay tareas. Escribe la primera en el formulario de arriba.
      </p>
    )
  }

  if (processedTasks.length === 0) {
    return (
      <p className="empty">
        Ninguna tarea coincide con el filtro o la búsqueda actual. Cambia el filtro o borra el texto.
      </p>
    )
  }

  return (
    <ul className="task-list">
      {processedTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={handleToggle}
          onRemove={handleRemove}
        />
      ))}
    </ul>
  )
}

export default TaskList
