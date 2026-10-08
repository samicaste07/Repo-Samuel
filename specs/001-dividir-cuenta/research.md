# Research & Architectural Decisions: División de Cuenta Web

## 1. Decisiones Técnicas y Arquitectura

### Decisión 1: Manejo de Estado Local con React `useState`
- **Decisión**: Utilizar `useState` nativo de React encapsulado en el custom hook `useDivisor` en `src/presentation/`.
- **Razón**: La aplicación consta de una sola pantalla sin navegación ni estado compartido intermodular. `useState` es nativo, liviano, no agrega dependencias externas y provee reactividad inmediata conforme al requerimiento del usuario.
- **Alternativas consideradas**:
  - `Redux Toolkit` / `Zustand`: Descartados por violar el requerimiento de "sin librerías de estado externas" y añadir complejidad innecesaria (violación de YAGNI/KISS).
  - `Context API`: Innecesario para un árbol de componentes plano de una sola pantalla.

### Decisión 2: Desacoplamiento del Dominio (JavaScript Puro)
- **Decisión**: Todos los módulos de `src/domain/` (`cuenta.js`, `resultado.js`, `calcularDivision.js`, `validarEntrada.js`, `estrategiaRedondeo.js`) se implementan como JavaScript puro (ESModules), sin importar React ni interactuar con el DOM (`window`, `document`).
- **Razón**: Cumple estrictamente el Principio II de la Constitución ("src/domain/ NO importa react ni nada del DOM: es JavaScript puro") y las directrices de Clean Architecture. Permite que el núcleo de negocio sea probado en milisegundos sin entorno de navegador.
- **Alternativas consideradas**:
  - Colocar validaciones y lógica de cálculo dentro de `PantallaDivisor.jsx`: Rechazado rotundamente por violar SRP y la separación de capas.

### Decisión 3: Patrón Estrategia (Strategy Pattern) para Redondeo
- **Decisión**: Definir en `src/domain/estrategiaRedondeo.js` el contrato que estipula que una estrategia de redondeo debe exponer una función `aplicar(valor)`. Las implementaciones concretas (`redondeoExacto.js` y `redondeoHaciaArriba.js`) residen en `src/data/`.
- **Razón**: Cumple con OCP (Open/Closed Principle) y LSP (Liskov Substitution Principle). Si se incorporan nuevas reglas de redondeo (por ejemplo, al múltiplo de 5 o truncado), no se modifica en lo absoluto `calcularDivision.js` ni los módulos preexistentes.
- **Alternativas consideradas**:
  - Condicionales `switch / if-else` en el cálculo: Rechazado por violar OCP y obligar a alterar la función de cálculo ante cada nueva variante.

### Decisión 4: Hook de Presentación con Inyección de Dependencias (`useDivisor.js`)
- **Decisión**: `useDivisor({ calcularDivision, validarEntrada, estrategias })` recibe sus dependencias como parámetros de entrada en lugar de importarlas directamente de `src/data/`.
- **Razón**: Respeta DIP (Dependency Inversion Principle) y garantiza que `presentation` no dependa de implementaciones concretas de `data`. Facilita pruebas unitarias aisladas del hook inyectando stubs si fuera necesario.
- **Alternativas consideradas**:
  - Importar directamente `redondeoExacto` en `useDivisor`: Rechazado porque violaría la regla de dependencia `presentation -> domain <- data` y la Constitución.

### Decisión 5: Composición e Inyección en `src/main.jsx`
- **Decisión**: `src/main.jsx` es el punto de entrada y ensamblaje exclusivo. Importa las implementaciones concretas de `src/data/` y las funciones de `src/domain/`, construyendo el objeto de dependencias que se pasa a `<PantallaDivisor />`.
- **Razón**: Mandato explícito de la Constitución ("src/main.jsx es el ÚNICO lugar donde se instancian implementaciones concretas"). Mantiene limpio el resto del árbol de presentación.
- **Alternativas consideradas**:
  - Ensamblar dependencias dentro de `PantallaDivisor.jsx` o `App.jsx`: Rechazado por violación directa de la regla constitucional de composición.

### Decisión 6: Framework de Pruebas con Vitest
- **Decisión**: Utilizar `vitest` junto con `@testing-library/react` y `jsdom` para pruebas unitarias y de componentes.
- **Razón**: Vitest es la herramienta estándar y nativa para proyectos construidos con Vite; comparte la configuración de plugins, ejecuta pruebas con velocidad instantánea y soporta sintaxis estándar (`describe`, `it`, `expect`).
- **Alternativas consideradas**:
  - `Jest`: Rechazado debido a fricciones de configuración con Vite y transformación de módulos ES.

