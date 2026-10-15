import { memo } from 'react'
import { FILTERS, SORTS } from '../utils/taskUtils'

// Barra de filtro / orden / búsqueda.
// Está envuelto en React.memo: solo se vuelve a renderizar si cambian sus props.
// Recibe handlers estables (useCallback / actions memoizadas) desde el Dashboard.
const Controls = ({ filter, sort, query, onFilter, onSort, onQuery, searchRef }) => (
  <section className="controls" aria-label="Filtros y orden">
    <div className="segmented" role="group" aria-label="Filtrar por estado">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          type="button"
          className={`segment${filter === f.value ? ' is-active' : ''}`}
          aria-pressed={filter === f.value}
          onClick={() => onFilter(f.value)}
        >
          {f.label}
        </button>
      ))}
    </div>

    <label className="field">
      <span>Ordenar por</span>
      <select value={sort} onChange={(e) => onSort(e.target.value)}>
        {SORTS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </label>

    <label className="field field-grow">
      <span>Buscar (atajo: tecla /)</span>
      <input
        ref={searchRef}
        type="search"
        value={query}
        onChange={onQuery}
        placeholder="Escribe para buscar…"
      />
    </label>
  </section>
)

export default memo(Controls)
