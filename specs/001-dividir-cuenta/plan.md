# Implementation Plan: División de Cuenta Web

**Branch**: `001-dividir-cuenta` | **Date**: 2026-10-08 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-dividir-cuenta/spec.md`

## Summary

Implementar una aplicación web interactiva en React con Vite de una sola pantalla para dividir la cuenta de un restaurante equitativamente, permitiendo ingresar monto, personas y porcentaje de propina, con dos estrategias de redondeo ("exacto" y "hacia arriba al entero"). Se adopta una arquitectura limpia en tres capas (`src/domain/`, `src/data/`, `src/presentation/`) con principios SOLID estrictos, donde el dominio es JavaScript puro (sin React ni DOM), el estado se gestiona localmente con `useState` mediante un custom hook (`useDivisor`) que recibe sus dependencias inyectadas, y `src/main.jsx` actúa como el único punto de composición. Las pruebas se construyen y ejecutan con Vitest.

## Technical Context

**Language/Version**: JavaScript (ESModules) / Node.js 18+

**Primary Dependencies**: React 19 (`react`, `react-dom`), Vite. Sin librerías de gestión de estado externas (Zustand, Redux, etc.).

**Storage**: N/A (100% offline, aplicación sin persistencia ni base de datos).

**Testing**: Vitest (`vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`).

**Target Platform**: Navegadores Web modernos (Chrome, Firefox, Safari, Edge).

**Project Type**: Single Page Web Application (Single screen).

**Performance Goals**: Cálculo y renderizado instantáneo en pantalla en $< 50$ ms tras presionar "Calcular".

**Constraints**:
- Capa `src/domain/` 100% JavaScript puro (prohibido importar React o APIs del DOM).
- Estado local exclusivamente con `useState` encapsulado en el custom hook `useDivisor`.
- Inyección de dependencias estricta: `useDivisor` recibe sus colaboradores (`calcularDivision`, `validarEntrada`, estrategias).
- `src/main.jsx` es el ÚNICO lugar donde se instancian o importan implementaciones concretas de `src/data/`.
- Cobertura completa de los 6 escenarios de aceptación en pruebas ejecutables con Vitest.

**Scale/Scope**: 1 pantalla, 1 caso de uso principal, 2 estrategias de redondeo, 1 validador.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Regla Constitucional | Estado en el Diseño |
| :--- | :--- | :--- |
| **SOLID - SRP** | Cálculo no valida ni formatea; una función/módulo, una razón de cambio. | **PASS**: `calcularDivision.js` solo calcula. `validarEntrada.js` solo valida. `formateadorMoneda.js` solo formatea. |
| **SOLID - OCP** | Extensión sin modificación de módulos preexistentes. | **PASS**: `estrategiaRedondeo.js` define el contrato `aplicar(valor)`. Nuevas reglas de redondeo no modifican `calcularDivision.js`. |
| **SOLID - LSP** | Sustitución transparente de implementaciones. | **PASS**: `redondeoExacto.js` y `redondeoHaciaArriba.js` cumplen la interfaz `aplicar(valor)` y son intercambiables sin chequeo de tipos. |
| **SOLID - ISP** | Interfaces pequeñas y segregadas. | **PASS**: Contrato mínimo: una función/método `aplicar(valor)`. |
| **SOLID - DIP** | Presentation depende de abstracciones de domain, nunca de implementaciones concretas de data. | **PASS**: `useDivisor.js` en `presentation` recibe dependencias inyectadas y no importa de `src/data/`. |
| **Arquitectura** | Capas `presentation -> domain <- data`. | **PASS**: `domain` no depende de nadie; `data` y `presentation` dependen de `domain`. |
| **JS Puro en Dominio** | `src/domain/` NO importa React ni nada del DOM. | **PASS**: Verificado en todos los contratos y módulos de dominio. |
| **Punto de Composición** | `src/main.jsx` es el ÚNICO lugar donde se instancian implementaciones concretas. | **PASS**: `src/main.jsx` ensambla el grafo de dependencias y lo inyecta al componente raíz. |
| **Seguridad** | Cero secretos/API keys en el repositorio. | **PASS**: Aplicación 100% offline sin servicios externos ni credenciales. |
| **Calidad y Pruebas** | Criterios de aceptación convertidos en pruebas ejecutables. | **PASS**: Los 6 escenarios de aceptación de `spec.md` se trasladan a tests automatizados con Vitest. |
| **Regla de la Materia** | Explicabilidad total por el estudiante. | **PASS**: Diseño limpio, estructurado y pedagógicamente explicable en su totalidad. |

## Project Structure

### Documentation (this feature)

```text
specs/001-dividir-cuenta/
├── plan.md              # Este plan de implementación
├── research.md          # Decisiones técnicas y arquitectónicas
├── data-model.md        # Definición de entidades, modelo de datos y reglas
├── quickstart.md        # Guía de validación y ejecución rápida
├── contracts/
│   └── divisor-contract.md # Contratos de interfaces y módulos
└── spec.md              # Especificación funcional de requerimientos (no modificada)
```

### Source Code (repository root)

```text
src/
├── domain/
│   ├── cuenta.js               # Entidad Cuenta (crearCuenta)
│   ├── resultado.js            # Entidad Resultado (crearResultado)
│   ├── calcularDivision.js     # Caso de uso: lógica de cálculo puro
│   ├── validarEntrada.js       # Validador de entradas textuales
│   └── estrategiaRedondeo.js   # Contrato y especificación de redondeo
├── data/
│   ├── redondeoExacto.js       # Implementación concreta: redondeo a 2 decimales
│   └── redondeoHaciaArriba.js  # Implementación concreta: redondeo al entero superior
├── presentation/
│   ├── useDivisor.js           # Custom hook con useState (recibe dependencias)
│   ├── formateadorMoneda.js    # Formateador visual con 2 decimales
│   └── PantallaDivisor.jsx     # Vista principal de la pantalla única
└── main.jsx                    # Único punto de composición y renderizado de React

test/
├── unit/
│   ├── domain/
│   │   ├── calcularDivision.test.js
│   │   └── validarEntrada.test.js
│   ├── data/
│   │   ├── redondeoExacto.test.js
│   │   └── redondeoHaciaArriba.test.js
│   └── presentation/
│       ├── formateadorMoneda.test.js
│       └── useDivisor.test.js
└── component/
    └── PantallaDivisor.test.jsx # Pruebas de integración visual de los 6 escenarios de aceptación
```

**Structure Decision**: Clean Architecture en tres capas estrictas (`src/domain/`, `src/data/`, `src/presentation/`) con JavaScript puro en `src/domain/`, inyección de dependencias en `useDivisor.js` y ensamblaje exclusivo en `src/main.jsx`.

## Complexity Tracking

> **Sin violaciones ni complejidades no justificadas.** El diseño se apega 100% a las directrices de la Constitución y la solicitud del usuario.
