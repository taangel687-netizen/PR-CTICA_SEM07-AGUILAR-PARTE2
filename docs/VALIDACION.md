# Validación final (Entregable 2)

> Completa cada sección con **tus propias palabras** y tus **capturas de pantalla** (guárdalas en `docs/capturas/`).
> Cada sección indica qué hacer, qué debes observar y qué explicar.

---

## 1. ESLint: cero warnings de `react-hooks/exhaustive-deps`

**Pasos**

1. En la raíz del proyecto ejecuta `npm install` (si aún no lo hiciste).
2. Ejecuta `npm run dev` y deja el servidor abierto.
3. En otra terminal ejecuta `npm run lint`.
4. (Opcional) Abre los archivos en VS Code con la extensión ESLint: no debe aparecer ningún subrayado amarillo en los hooks.

**Qué debes observar**: `npm run lint` termina sin imprimir problemas (el script usa `--max-warnings 0`, así que cualquier warning haría fallar el comando).

**Captura:** `capturas/01-eslint.png`

**Explicación con mis palabras** (qué regla verifica `exhaustive-deps`, por qué importa declarar todas las dependencias y qué bug podría aparecer si falta alguna):

> _Escribe aquí…_

---

## 2. React DevTools Profiler: `useMemo` / `useCallback` reducen commits

**Pasos**

1. Instala la extensión **React Developer Tools** en Chrome o Edge.
2. Con la app abierta, F12 → pestaña **Profiler** → engranaje → activa *"Record why each component rendered while profiling"*.
3. Pulsa **Record**, y realiza estas interacciones:
   - a) Marca una tarea como completada.
   - b) Escribe varias letras en el buscador.
   - c) Cambia el tema claro/oscuro.
   - d) Deja pasar unos segundos con el reloj visible.
4. Pulsa **Stop** y revisa el *Flamegraph* / *Ranked* de cada commit.

**Qué debes observar**

| Interacción | Resultado esperado |
|---|---|
| a) Completar una tarea | Solo se re-renderiza el `TaskItem` modificado; los demás aparecen en gris ("Did not render"). |
| b) Escribir en el buscador | `Dashboard` y `Controls` se renderizan, pero `TaskList` no recalcula la lista hasta que pasan 300 ms (debounce); los `TaskItem` no se renderizan. |
| c) Cambiar tema | Se re-renderizan `Dashboard` y los consumidores del contexto; los `TaskItem` no. |
| d) Reloj | En cada commit solo se renderiza `SessionClock`. |

**Comparación recomendada (evidencia fuerte)**: quita temporalmente `memo(...)` de `TaskItem` (`export default TaskItem`), repite la acción (a) y compara el número de componentes renderizados. Después restaura el `memo`.

**También puedes ver** los logs `[Profiler] TaskList · fase: update · ...` en la pestaña Console.

**Capturas:** `capturas/02-profiler-con-memo.png`, `capturas/02-profiler-sin-memo.png`

**Explicación con mis palabras** (qué es un commit, qué componentes se renderizaron y cuáles no, y por qué):

> _Escribe aquí…_

---

## 3. `useEffect` con cleanup activo

**Pasos**

1. Abre la consola del navegador (F12 → Console) con la app en `npm run dev`.
2. Al cargar verás (por StrictMode se ejecuta montar → cleanup → montar):
   `[SessionClock] efecto iniciado: intervalo creado`
   `[SessionClock] cleanup: intervalo limpiado`
   `[SessionClock] efecto iniciado: intervalo creado`
3. Pulsa **Ocultar reloj**: el componente se desmonta y debe aparecer `[SessionClock] cleanup: intervalo limpiado`. Los segundos dejan de contarse.
4. Pulsa **Mostrar reloj**: se monta de nuevo y el contador empieza desde 00:00.
5. Prueba el atajo `/`: enfoca el buscador. Cambia de tema varias veces y comprueba en Elements que `<body>` tiene **una sola** clase `theme-light` o `theme-dark` (el cleanup quita la anterior).

**Captura:** `capturas/03-cleanup-consola.png`, `capturas/03-body-clase-tema.png`

**Explicación con mis palabras** (qué pasaría sin cleanup: intervalos duplicados, memory leaks, listeners acumulados, actualizaciones sobre componentes desmontados):

> _Escribe aquí…_

---

## 4. Persistencia y sincronización (prueba extra recomendada)

1. Agrega tareas, cambia tema, filtro y orden; recarga la página (F5): todo debe conservarse.
2. F12 → Application → Local Storage: revisa las claves `dashboard:tasks` y `dashboard:theme`.
3. Abre la app en dos pestañas y cambia el tema en una: la otra se actualiza (evento `storage`).

**Captura:** `capturas/04-localstorage.png`

---

## 5. Entrega

- [ ] Repositorio en GitHub con `package.json`, `src/`, `README.md` (y `docs/`).
- [ ] Proyecto comprimido en **.rar** subido al **ADESA** (sin la carpeta `node_modules`).
- [ ] Capturas de las secciones 1 a 3 con su explicación.
