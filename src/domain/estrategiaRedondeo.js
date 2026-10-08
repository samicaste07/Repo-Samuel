/**
 * Contrato y validación para las estrategias de redondeo en el dominio.
 *
 * - Qué hace: Define la interfaz que toda estrategia de redondeo debe cumplir (método `aplicar`)
 *   y provee una función para validar que un objeto cumpla dicho contrato.
 * - Por qué existe: Cumple con los principios SOLID:
 *   * OCP: Permite extender nuevas estrategias de redondeo sin modificar el caso de uso de cálculo.
 *   * LSP: Garantiza que cualquier estrategia con el método `aplicar` pueda sustituir a otra.
 *   * ISP: Define una interfaz mínima y específica enfocada únicamente en transformar un número.
 * - Qué recibe: `estrategia` (any) - Objeto a validar contra el contrato.
 * - Qué devuelve: `esEstrategiaRedondeoValida` devuelve boolean (`true` si cumple el contrato, `false` si no).
 * - Qué errores produce: No produce errores en tiempo de ejecución; retorna un booleano defensivo.
 *
 * @typedef {Object} EstrategiaRedondeo
 * @property {(valor: number) => number} aplicar - Aplica la regla de redondeo al valor numérico recibido.
 */

/**
 * Verifica si un objeto cumple con el contrato de EstrategiaRedondeo.
 * @param {any} estrategia
 * @returns {boolean}
 */
export function esEstrategiaRedondeoValida(estrategia) {
  return Boolean(
    estrategia &&
    typeof estrategia === 'object' &&
    typeof estrategia.aplicar === 'function'
  )
}

