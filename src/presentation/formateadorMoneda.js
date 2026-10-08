/**
 * Formatea un valor numérico a una representación en cadena con exactamente dos decimales.
 *
 * - Qué hace: Convierte un número en un string fijando exactamente dos posiciones decimales.
 * - Por qué existe: Cumple con el principio SRP en la capa de presentación; aísla la lógica
 *   de presentación visual del monto monetario sin mezclarla con el cálculo matemático ni con la UI.
 * - Qué recibe: `valor` (number) - Número finito a formatear.
 * - Qué devuelve: (string) - Cadena con el número formateado con dos decimales (ej. "27.50").
 * - Qué errores produce: Lanza TypeError si `valor` no es un número finito válido.
 *
 * @param {number} valor
 * @returns {string}
 */
export function formatearMoneda(valor) {
  if (typeof valor !== 'number' || !Number.isFinite(valor)) {
    throw new TypeError('El valor a formatear debe ser un número finito válido.')
  }
  return valor.toFixed(2)
}

