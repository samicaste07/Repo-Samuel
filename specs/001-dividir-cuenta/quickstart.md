# Guía de Validación Rápida (Quickstart): División de Cuenta Web

Esta guía describe los pasos para levantar el entorno de desarrollo, ejecutar las pruebas automatizadas y validar de extremo a extremo que la aplicación cumple con los escenarios de aceptación y las reglas de la constitución.

## Prerrequisitos
- Node.js versión 18.0.0 o superior instalado.
- Terminal ubicada en la raíz del proyecto: `c:\Proyectos flutter\Repo-Samuel\divisor_cuenta_web`.

---

## 1. Configuración de Entorno y Dependencias

Asegurar que las dependencias base y las herramientas de pruebas con Vitest estén instaladas:

```bash
npm install
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

---

## 2. Comandos de Verificación Automatizada

### A. Análisis Estático y Linter
Ejecuta la revisión estática de código con Oxlint:
```bash
npm run lint
```
*Resultado esperado*: 0 errores de análisis.

### B. Pruebas Automatizadas con Vitest
Ejecuta la suite completa de pruebas unitarias y de integración/componentes:
```bash
npx vitest run
```
*Resultado esperado*: Todos los tests pasan exitosamente (`All tests passed`).

---

## 3. Servidor de Desarrollo y Prueba Manual

Para probar la interfaz gráfica de forma interactiva en el navegador:

```bash
npm run dev
```
Abre la URL indicada (habitualmente `http://localhost:5173`) en el navegador.

---

## 4. Matriz de Verificación de Escenarios de Aceptación (Spec)

| # | Escenario | Entradas de Prueba | Modo Redondeo | Resultado Esperado |
|---|-----------|-------------------|---------------|--------------------|
| 1 | Básico con propina (10%) | Monto: `100.00`, Personas: `4`, Propina: `10%` | Exacto | Cuota por persona: `27.50` |
| 2 | Sin propina (0%) | Monto: `90.00`, Personas: `3`, Propina: `0%` | Exacto | Cuota por persona: `30.00` |
| 3 | Decimal periódico | Monto: `10.00`, Personas: `3`, Propina: `0%` | Exacto | Cuota por persona: `3.33` |
| 4 | Cero comensales | Monto: `50.00`, Personas: `0` | Cualquier modo | Error: `"Debe haber al menos una persona"`, sin resultado numérico |
| 5 | Monto alfanumérico | Monto: `"abc"`, Personas: `2` | Cualquier modo | Error: `"Monto inválido"`, sin resultado numérico |
| 6 | Redondeo hacia arriba | Monto: `10.00`, Personas: `3`, Propina: `0%` | Hacia arriba | Cuota por persona: `4.00` |

---

## 5. Verificación de Cumplimiento Constitucional

1. **JavaScript Puro en `src/domain/`**:
   - Inspeccionar los archivos en `src/domain/` (`cuenta.js`, `resultado.js`, `calcularDivision.js`, `validarEntrada.js`, `estrategiaRedondeo.js`).
   - Confirmar que ninguno contenga `import React`, imports de hooks, ni referencias a APIs del DOM (`document`, `window`).
2. **Inyección en `useDivisor.js`**:
   - Confirmar que `src/presentation/useDivisor.js` no importa directamente desde `src/data/`, sino que recibe sus dependencias por parámetro.
3. **Punto Único de Composición**:
   - Inspeccionar `src/main.jsx` y verificar que es el único lugar donde se importan e instancian las implementaciones de `src/data/` para proveerlas al componente raíz.

