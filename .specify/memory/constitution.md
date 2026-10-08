<!-- Sync Impact Report
Version change: 0.0.0 → 1.0.0 (Ratificación inicial)
List of modified principles:
  - Definición formal de principios rectores sin inventar principios adicionales.
Added sections:
  - I. Calidad de Código (Principios SOLID)
  - II. Arquitectura (Capas y Regla de Dependencia)
  - III. Seguridad
  - IV. Calidad y Pruebas
  - V. Regla de la Materia (Explicabilidad por el Estudiante)
  - Governance
Removed sections:
  - Secciones genéricas de plantilla ([SECTION_2_NAME], [SECTION_3_NAME])
Follow-up TODOs: Ninguno.
-->

# Divisor de Cuenta Web Constitution

## Core Principles

### I. Calidad de Código (Principios SOLID)
Todo el código del proyecto DEBE respetar estrictamente los principios SOLID:
- **SRP (Single Responsibility Principle):** Una función o módulo, una sola razón de cambio. El cálculo no valida ni formatea.
- **OCP (Open/Closed Principle):** Abierto a extensión, cerrado a modificación. Agregar una nueva regla de redondeo no obliga a editar los módulos que ya existen.
- **LSP (Liskov Substitution Principle):** Cualquier implementación de la interfaz de redondeo puede sustituir a otra sin que quien la usa pregunte de qué tipo es.
- **ISP (Interface Segregation Principle):** Interfaces pequeñas; nadie depende de funciones que no usa.
- **DIP (Dependency Inversion Principle):** `presentation` depende de abstracciones del `domain`, nunca de implementaciones concretas de `data`.

### II. Arquitectura (Capas y Regla de Dependencia)
La estructura del código DEBE cumplir estrictamente con las siguientes reglas arquitectónicas:
- **Capas:** Organización en `src/presentation/`, `src/domain/` y `src/data/`.
- **Regla de Dependencia:** `presentation` -> `domain` <- `data`.
- **Aislamiento de Dominio:** `src/domain/` NO importa React ni nada del DOM: es JavaScript puro.
- **Composición e Inyección:** `src/main.jsx` es el ÚNICO lugar donde se instancian implementaciones concretas.

### III. Seguridad
- Nunca guardar secretos ni API keys en el repositorio.

### IV. Calidad y Pruebas
- Toda funcionalidad crítica DEBE tener pruebas.
- Los criterios de aceptación de la spec se DEBEN convertir obligatoriamente en pruebas ejecutables.

### V. Regla de la Materia (Explicabilidad por el Estudiante)
Toda función generada por el agente DEBE poder explicarla el estudiante:
- Qué hace.
- Por qué existe.
- Qué recibe.
- Qué devuelve.
- Qué errores produce.

## Governance
Esta constitución establece las normas no negociables del proyecto `divisor_cuenta_web` y rige todas las especificaciones, planes, tareas y código fuente implementados por agentes o desarrolladores. Cualquier cambio o enmienda a estos principios requiere justificación explícita, actualización de la versión semántica y aprobación formal.

**Version**: 1.0.0 | **Ratified**: 2026-10-08 | **Last Amended**: 2026-10-08
