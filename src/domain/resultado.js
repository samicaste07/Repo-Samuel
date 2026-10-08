/**
 * Entidad inmutable que representa el resultado del cálculo de división de la cuenta.
 *
 * - Qué hace: Encapsula los resultados numéricos finales calculados: la cuota individual por persona,
 *   el monto monetario total de la propina y el total general acumulado a pagar.
 * - Por qué existe: Representa el modelo de salida inmutable del dominio, separando los datos puros
 *   del formato visual que luego aplica la capa de presentación.
 * - Qué recibe: Objeto con las propiedades:
 *   * `montoPorPersona` (number): Monto individual resultante tras aplicar la estrategia de redondeo.
 *   * `totalPropina` (number): Total acumulado correspondiente a la propina calculada.
 *   * `totalPagar` (number): Suma del consumo base más la propina total calculada.
 * - Qué devuelve: (Readonly<{montoPorPersona, totalPropina, totalPagar}>) - Objeto inmutable con los resultados.
 * - Qué errores produce: Lanza Error si alguno de los valores no es un número finito no negativo.
 *
 * @param {Object} params
 * @param {number} params.montoPorPersona
 * @param {number} params.totalPropina
 * @param {number} params.totalPagar
 * @returns {Readonly<{montoPorPersona: number, totalPropina: number, totalPagar: number}>}
 */
export function crearResultado({ montoPorPersona, totalPropina, totalPagar }) {
  if (typeof montoPorPersona !== 'number' || !Number.isFinite(montoPorPersona) || montoPorPersona < 0) {
    throw new Error('El monto por persona debe ser un número no negativo.')
  }

  if (typeof totalPropina !== 'number' || !Number.isFinite(totalPropina) || totalPropina < 0) {
    throw new Error('El total de propina debe ser un número no negativo.')
  }

  if (typeof totalPagar !== 'number' || !Number.isFinite(totalPagar) || totalPagar < 0) {
    throw new Error('El total a pagar debe ser un número no negativo.')
  }

  return Object.freeze({
    montoPorPersona,
    totalPropina,
    totalPagar,
  })
}

