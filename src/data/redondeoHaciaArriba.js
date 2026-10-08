/**
 * Implementación concreta de la estrategia de redondeo hacia arriba al entero más cercano.
 *
 * - Qué hace: Eleva cualquier valor numérico fraccionario al entero inmediatamente superior utilizando `Math.ceil(valor)`.
 * - Por qué existe: Cumple con el principio OCP y el patrón Strategy; provee la alternativa de cobro
 *   redondeado en billetes/enteros para evitar centavos sueltos en efectivo.
 * - Qué recibe: `valor` (number) - Número finito a redondear.
 * - Qué devuelve: (number) - Número entero elevado hacia arriba (ej. 3.3333... -> 4).
 * - Qué errores produce: Lanza TypeError si `valor` no es un número finito.
 *
 * @type {import('../domain/estrategiaRedondeo').EstrategiaRedondeo}
 */
export const redondeoHaciaArriba = {
  aplicar(valor) {
    if (typeof valor !== 'number' || !Number.isFinite(valor)) {
      throw new TypeError('El valor a redondear debe ser un número finito válido.')
    }
    return Math.ceil(valor)
  },
}

