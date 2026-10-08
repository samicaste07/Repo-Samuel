import { crearResultado } from './resultado'

/**
 * Caso de uso puro para calcular la división equitativa de una cuenta.
 *
 * - Qué hace: Calcula el monto total de la propina, el total a pagar y divide la cuenta
 *   entre el número de personas, delegando el redondeo final a la estrategia inyectada en la entidad Cuenta.
 * - Por qué existe: Es el núcleo de la lógica de negocio de la aplicación (caso de uso principal).
 *   Cumple estrictamente con SRP: ÚNICAMENTE realiza el cálculo matemático, sin validar cadenas de texto
 *   ni formatear números para la vista.
 * - Qué recibe: `cuenta` (Cuenta | Object) - Entidad inmutable de dominio con `montoBase`, `numeroPersonas`,
 *   `porcentajePropina` y `estrategiaRedondeo`.
 * - Qué devuelve: (Resultado) - Entidad inmutable de dominio con `montoPorPersona`, `totalPropina` y `totalPagar`.
 * - Qué errores produce: Lanza TypeError si `cuenta` no es válida o no provee la estrategia requerida.
 *
 * @param {import('./cuenta').crearCuenta extends (...args: any[]) => infer R ? R : any} cuenta
 * @returns {import('./resultado').crearResultado extends (...args: any[]) => infer R ? R : any}
 */
export function calcularDivision(cuenta) {
  if (!cuenta || typeof cuenta !== 'object') {
    throw new TypeError('El argumento cuenta debe ser una entidad Cuenta válida.')
  }

  const montoBase = cuenta.montoBase !== undefined ? cuenta.montoBase : cuenta.monto
  const numeroPersonas = cuenta.numeroPersonas !== undefined ? cuenta.numeroPersonas : cuenta.personas
  const porcentajePropina = cuenta.porcentajePropina !== undefined ? cuenta.porcentajePropina : (cuenta.propina !== undefined ? cuenta.propina : 0)
  const estrategiaRedondeo = cuenta.estrategiaRedondeo !== undefined ? cuenta.estrategiaRedondeo : cuenta.estrategia

  if (
    typeof montoBase !== 'number' ||
    typeof numeroPersonas !== 'number' ||
    typeof porcentajePropina !== 'number' ||
    !estrategiaRedondeo ||
    typeof estrategiaRedondeo.aplicar !== 'function'
  ) {
    throw new TypeError('El argumento cuenta debe ser una entidad Cuenta válida.')
  }

  const totalPropina = montoBase * (porcentajePropina / 100)
  const totalPagar = montoBase + totalPropina
  const cuotaSinRedondeo = totalPagar / numeroPersonas
  const montoPorPersona = estrategiaRedondeo.aplicar(cuotaSinRedondeo)

  return crearResultado({
    montoPorPersona,
    totalPropina,
    totalPagar,
  })
}

/**
 * Alias .ejecutar para compatibilidad polimórfica y similitud con arquitectura de casos de uso.
 */
calcularDivision.ejecutar = calcularDivision
