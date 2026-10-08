import { esEstrategiaRedondeoValida } from './estrategiaRedondeo'

/**
 * Entidad inmutable que representa los datos necesarios para dividir una cuenta.
 *
 * - Qué hace: Encapsula y valida los valores ya parseados de la cuenta (monto base, comensales,
 *   propina y estrategia de redondeo), asegurando invariantes de negocio.
 * - Por qué existe: Representa la entidad central de dominio; garantiza que ninguna operación
 *   de cálculo reciba datos corruptos, incompletos o tipos incompatibles.
 * - Qué recibe: Objeto con las propiedades:
 *   * `montoBase` o `monto` (number): Consumo total antes de propina, estrictamente mayor a 0.
 *   * `numeroPersonas` o `personas` (number): Cantidad de comensales, entero positivo mayor o igual a 1.
 *   * `porcentajePropina` o `propina` (number): Porcentaje de propina, mayor o igual a 0.
 *   * `estrategiaRedondeo` o `estrategia` (EstrategiaRedondeo): Objeto que implementa el método `aplicar(valor)`.
 * - Qué devuelve: (Readonly<{montoBase, numeroPersonas, porcentajePropina, estrategiaRedondeo}>) - Objeto inmutable de la cuenta.
 * - Qué errores produce: Lanza Error con mensaje descriptivo si alguna regla o invariante es violada.
 *
 * @param {Object} params
 * @param {number} [params.montoBase]
 * @param {number} [params.monto]
 * @param {number} [params.numeroPersonas]
 * @param {number} [params.personas]
 * @param {number} [params.porcentajePropina]
 * @param {number} [params.propina]
 * @param {import('./estrategiaRedondeo').EstrategiaRedondeo} [params.estrategiaRedondeo]
 * @param {import('./estrategiaRedondeo').EstrategiaRedondeo} [params.estrategia]
 * @returns {Readonly<{montoBase: number, numeroPersonas: number, porcentajePropina: number, estrategiaRedondeo: import('./estrategiaRedondeo').EstrategiaRedondeo}>}
 */
export function crearCuenta({
  montoBase,
  monto,
  numeroPersonas,
  personas,
  porcentajePropina,
  propina,
  estrategiaRedondeo,
  estrategia,
} = {}) {
  const montoVal = montoBase !== undefined ? montoBase : monto
  const personasVal = numeroPersonas !== undefined ? numeroPersonas : personas
  const propinaVal = porcentajePropina !== undefined ? porcentajePropina : (propina !== undefined ? propina : 0)
  const estrategiaVal = estrategiaRedondeo !== undefined ? estrategiaRedondeo : estrategia

  if (typeof montoVal !== 'number' || !Number.isFinite(montoVal) || montoVal <= 0) {
    throw new Error('El monto base debe ser un número finito estrictamente mayor a 0.')
  }

  if (typeof personasVal !== 'number' || !Number.isInteger(personasVal) || personasVal < 1) {
    throw new Error('El número de personas debe ser un entero mayor o igual a 1.')
  }

  if (typeof propinaVal !== 'number' || !Number.isFinite(propinaVal) || propinaVal < 0) {
    throw new Error('El porcentaje de propina debe ser un número no negativo.')
  }

  if (!esEstrategiaRedondeoValida(estrategiaVal)) {
    throw new Error('La estrategia de redondeo debe implementar la función aplicar(valor).')
  }

  return Object.freeze({
    montoBase: montoVal,
    numeroPersonas: personasVal,
    porcentajePropina: propinaVal,
    estrategiaRedondeo: estrategiaVal,
    monto: montoVal,
    personas: personasVal,
    propina: propinaVal,
  })
}
