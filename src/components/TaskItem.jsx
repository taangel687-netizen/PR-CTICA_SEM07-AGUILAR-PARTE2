import { memo } from 'react'
import { PRIORITIES, formatDate } from '../utils/taskUtils'

const PRIORITY_LABEL = Object.fromEntries(PRIORITIES.map((p) => [p.value, p.label]))

// React.memo + props estables (task inmutable, handlers con useCallback):
// si una tarea no cambió, React se salta su render. Se ve en el Profiler como
// "Did not render" / componente en gris.
const TaskItem = ({ task, onToggle, onRemove }) => (
  <li className={`task${task.done ? ' is-done' : ''}`} data-priority={task.priority}>
    <label className="task-check">
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task.id)}
        aria-label={`Marcar "${task.title}" como ${task.done ? 'pendiente' : 'completada'}`}
      />
    </label>

    <div className="task-body">
      <span className="task-title">{task.title}</span>
      <span className="task-meta">Creada el {formatDate(task.createdAt)}</span>
    </div>

    <span className="badge" data-priority={task.priority}>
      {PRIORITY_LABEL[task.priority] ?? task.priority}
    </span>

    <button
      type="button"
      className="btn btn-ghost"
      onClick={() => onRemove(task.id)}
      aria-label={`Eliminar "${task.title}"`}
    >
      Eliminar
    </button>
  </li>
)

export default memo(TaskItem)
