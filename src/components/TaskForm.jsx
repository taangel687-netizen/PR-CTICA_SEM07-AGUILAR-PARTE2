import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { PRIORITIES } from '../utils/taskUtils'

const TaskForm = ({ onAdd }) => {
  // useRef: acceso directo al nodo DOM del input sin provocar re-render
  const inputRef = useRef(null)

  // useState: estado de UI local (no pertenece al estado global de la lista)
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('media')
  const [error, setError] = useState('')

  // Auto-focus al montar el formulario
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleChange = useCallback((event) => {
    setTitle(event.target.value)
    setError('')
  }, [])

  const handlePriority = useCallback((event) => setPriority(event.target.value), [])

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault()
      const clean = title.trim()
      if (!clean) {
        setError('Escribe un título para la tarea.')
        inputRef.current?.focus()
        return
      }
      onAdd(clean, priority)
      setTitle('')
      setError('')
      // Devolver el foco al input tras añadir: se puede encadenar varias tareas seguidas
      inputRef.current?.focus()
    },
    [title, priority, onAdd],
  )

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <label className="field field-grow">
        <span>Nueva tarea</span>
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={handleChange}
          placeholder="Ej. Preparar la exposición del lunes"
          maxLength={120}
          aria-invalid={error ? 'true' : 'false'}
        />
      </label>

      <label className="field">
        <span>Prioridad</span>
        <select value={priority} onChange={handlePriority}>
          {PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </label>

      <button type="submit" className="btn btn-primary">
        Agregar tarea
      </button>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}

export default memo(TaskForm)
