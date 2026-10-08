/**
 * Implementación concreta de la estrategia de redondeo exacto (a 2 decimales estándar).
 *
 * - Qué hace: Redondea un número a dos posiciones decimales estándar utilizando la fórmula `Math.round(valor * 100) / 100`.
 * - Por qué existe: Satisface el principio OCP y el patrón Strategy; provee el comportamiento
 *   por defecto para calcular la cuota individual sin elevar enteros artificialmente.
 * - Qué recibe: `valor` (number) - Número finito a redondear.
 * - Qué devuelve: (number) - Número redondeado con precisión de dos decimales (ej. 3.3333... -> 3.33).
 * - Qué errores produce: Lanza TypeError si `valor` no es un número finito.
 *
 * @type {import('../domain/estrategiaRedondeo').EstrategiaRedondeo}
 */
export const redondeoExacto = {
  aplicar(valor) {
    if (typeof valor !== 'number' || !Number.isFinite(valor)) {
      throw new TypeError('El valor a redondear debe ser un número finito válido.')
    }
    return Math.round(valor * 100) / 100
  },
}

