import { createContext, useCallback, useEffect, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
})

// Valor por defecto: respeta la preferencia del sistema si no hay nada guardado.
// Se pasa como función para que se evalúe solo una vez (inicialización perezosa).
const getDefaultTheme = () =>
  window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

export const ThemeProvider = ({ children }) => {
  // Persistencia en localStorage delegada al hook personalizado
  const [theme, setTheme] = useLocalStorage('dashboard:theme', getDefaultTheme)

  // Aplicar la clase al <body>; el cleanup quita la clase anterior antes de aplicar la nueva
  useEffect(() => {
    const className = `theme-${theme}`
    document.body.classList.add(className)
    return () => document.body.classList.remove(className)
  }, [theme])

  // Actualizador funcional: no depende de `theme`, por eso la función es estable
  const toggleTheme = useCallback(
    () => setTheme((current) => (current === 'light' ? 'dark' : 'light')),
    [setTheme],
  )

  // Value memoizado: los consumidores solo se re-renderizan si `theme` cambia de verdad
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
