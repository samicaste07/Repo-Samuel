# Contratos de Interfaces y Módulos: División de Cuenta Web

## 1. Contrato: `EstrategiaRedondeo` (`src/domain/estrategiaRedondeo.js`)

Define la interfaz que toda estrategia de redondeo debe implementar:

```javascript
/**
 * @typedef {Object} EstrategiaRedondeo
 * @property {(valor: number) => number} aplicar - Aplica la regla de redondeo al valor numérico.
 */

/**
 * Valida que un objeto cumpla con el contrato de EstrategiaRedondeo.
 * @param {any} estrategia
 * @returns {boolean}
 */
export function esEstrategiaRedondeoValida(estrategia) {
  return Boolean(estrategia && typeof estrategia.aplicar === 'function');
}
```

---

## 2. Contrato: Entidad `Cuenta` (`src/domain/cuenta.js`)

```javascript
/**
 * Crea una instancia inmutable de Cuenta.
 * @param {Object} params
 * @param {number} params.montoBase - Monto base mayor a 0.
 * @param {number} params.numeroPersonas - Entero positivo mayor o igual a 1.
 * @param {number} params.porcentajePropina - Porcentaje no negativo mayor o igual a 0.
 * @param {import('./estrategiaRedondeo').EstrategiaRedondeo} params.estrategiaRedondeo - Estrategia con método aplicar(valor).
 * @returns {Readonly<{montoBase: number, numeroPersonas: number, porcentajePropina: number, estrategiaRedondeo: import('./estrategiaRedondeo').EstrategiaRedondeo}>}
 */
export function crearCuenta({ montoBase, numeroPersonas, porcentajePropina, estrategiaRedondeo }) { ... }
```

---

## 3. Contrato: Entidad `Resultado` (`src/domain/resultado.js`)

```javascript
/**
 * Crea una instancia inmutable de Resultado.
 * @param {Object} params
 * @param {number} params.montoPorPersona - Cuota por comensal tras redondeo.
 * @param {number} params.totalPropina - Monto monetario de propina.
 * @param {number} params.totalPagar - Monto total a pagar (base + propina).
 * @returns {Readonly<{montoPorPersona: number, totalPropina: number, totalPagar: number}>}
 */
export function crearResultado({ montoPorPersona, totalPropina, totalPagar }) { ... }
```

---

## 4. Contrato: Caso de Uso `calcularDivision` (`src/domain/calcularDivision.js`)

```javascript
/**
 * Calcula la división equitativa de la cuenta según la estrategia inyectada.
 * Función pura: no valida entradas de usuario ni formatea textos.
 * @param {ReturnType<typeof import('./cuenta').crearCuenta>} cuenta
 * @returns {ReturnType<typeof import('./resultado').crearResultado>}
 */
export function calcularDivision(cuenta) { ... }
```

---

## 5. Contrato: Validador `validarEntrada` (`src/domain/validarEntrada.js`)

```javascript
export const validarEntrada = {
  /**
   * @param {string} texto
   * @returns {string | null} 'Monto inválido' si no es positivo finito, o null si es válido.
   */
  validarMonto(texto) { ... },

  /**
   * @param {string} texto
   * @returns {string | null} 'Debe haber al menos una persona' si no es entero >= 1, o null si es válido.
   */
  validarPersonas(texto) { ... },

  /**
   * @param {string} texto
   * @returns {string | null} 'Propina inválida' si es negativo, o null si es válido.
   */
  validarPropina(texto) { ... }
};
```

---

## 6. Contrato: Capa de Datos (`src/data/`)

```javascript
// src/data/redondeoExacto.js
/** @type {import('../domain/estrategiaRedondeo').EstrategiaRedondeo} */
export const redondeoExacto = {
  aplicar(valor) { ... }
};

// src/data/redondeoHaciaArriba.js
/** @type {import('../domain/estrategiaRedondeo').EstrategiaRedondeo} */
export const redondeoHaciaArriba = {
  aplicar(valor) { ... }
};
```

---

## 7. Contrato: Hook `useDivisor` (`src/presentation/useDivisor.js`)

```javascript
/**
 * Hook de React para la lógica de presentación del divisor de cuenta.
 * RECIBE sus dependencias inyectadas para cumplir DIP.
 * @param {Object} deps
 * @param {typeof import('../domain/calcularDivision').calcularDivision} deps.calcularDivision
 * @param {typeof import('../domain/validarEntrada').validarEntrada} deps.validarEntrada
 * @param {{ exacto: import('../domain/estrategiaRedondeo').EstrategiaRedondeo, haciaArriba: import('../domain/estrategiaRedondeo').EstrategiaRedondeo }} deps.estrategias
 */
export function useDivisor({ calcularDivision, validarEntrada, estrategias }) {
  // Retorna estado y despachadores:
  // { monto, setMonto, personas, setPersonas, propina, setPropina,
  //   modoRedondeo, setModoRedondeo, resultado, errorMonto, errorPersonas,
  //   errorPropina, calcular }
}
```

---

## 8. Contrato: `formateadorMoneda` (`src/presentation/formateadorMoneda.js`)

```javascript
/**
 * Formatea un número monetario a una cadena con dos decimales exactos.
 * @param {number} valor
 * @returns {string} Ejemplo: 27.5 -> "27.50"
 */
export function formatearMoneda(valor) { ... }
```

---

## 9. Contrato: Componente `PantallaDivisor` (`src/presentation/PantallaDivisor.jsx`)

```jsx
/**
 * Vista principal de la pantalla única.
 * @param {Object} props
 * @param {Object} props.dependencias - Dependencias requeridas por useDivisor.
 */
export function PantallaDivisor({ dependencias }) { ... }
```

