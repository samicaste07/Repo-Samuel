/**
 * Módulo y función de validación de entradas de texto en la capa de dominio.
 *
 * - Qué hace: Valida las entradas (monto total, número de personas y porcentaje de propina),
 *   garantizando que cumplan con las restricciones de negocio y tipos válidos.
 * - Por qué existe: Cumple con el principio SRP en la capa de dominio; separa la validación defensiva
 *   del caso de uso de cálculo (que opera con números validados) y de la capa de presentación (UI).
 * - Qué recibe: Puede invocarse pasando un objeto `{ monto, personas, propina }` o utilizar sus métodos
 *   específicos (`validarMonto`, `validarPersonas`, `validarPropina`).
 * - Qué devuelve: (string | null) - Un string con el mensaje de error específico si es inválido, o `null` si es válido.
 * - Qué errores produce: No produce excepciones en ejecución normal; retorna cadenas de error descriptivas o `null`.
 */
export function validarEntrada(datos = {}) {
  return validarEntrada.validar(datos)
}

/**
 * Valida conjuntamente las entradas de una cuenta.
 * @param {Object} datos
 * @param {any} [datos.monto]
 * @param {any} [datos.textoMonto]
 * @param {any} [datos.personas]
 * @param {any} [datos.textoPersonas]
 * @param {any} [datos.propina]
 * @param {any} [datos.textoPropina]
 * @returns {string | null}
 */
validarEntrada.validar = function validar(datos = {}) {
  const monto = datos.monto !== undefined ? datos.monto : datos.textoMonto
  const errorMonto = validarEntrada.validarMonto(monto)
  if (errorMonto) return errorMonto

  const personas = datos.personas !== undefined ? datos.personas : datos.textoPersonas
  const errorPersonas = validarEntrada.validarPersonas(personas)
  if (errorPersonas) return errorPersonas

  const propina = datos.propina !== undefined ? datos.propina : datos.textoPropina
  const errorPropina = validarEntrada.validarPropina(propina)
  if (errorPropina) return errorPropina

  return null
}

/**
 * Valida la entrada del monto total.
 * - Restricción: Debe ser un número finito estrictamente mayor a 0.
 * @param {any} texto
 * @returns {string | null}
 */
validarEntrada.validarMonto = function validarMonto(texto) {
  if (texto === null || texto === undefined) {
    return 'Monto inválido'
  }
  const limpio = String(texto).trim()
  if (limpio === '') {
    return 'Monto inválido'
  }
  const numero = Number(limpio)
  if (Number.isNaN(numero) || !Number.isFinite(numero) || numero <= 0) {
    return 'Monto inválido'
  }
  return null
}

/**
 * Valida la entrada del número de personas.
 * - Restricción: Debe ser un número entero mayor o igual a 1.
 * @param {any} texto
 * @returns {string | null}
 */
validarEntrada.validarPersonas = function validarPersonas(texto) {
  if (texto === null || texto === undefined) {
    return 'Debe haber al menos una persona'
  }
  const limpio = String(texto).trim()
  if (limpio === '') {
    return 'Debe haber al menos una persona'
  }
  if (!/^-?\d+$/.test(limpio)) {
    return 'Debe haber al menos una persona'
  }
  const personas = parseInt(limpio, 10)
  if (personas < 1) {
    return 'Debe haber al menos una persona'
  }
  return null
}

/**
 * Valida la entrada del porcentaje de propina.
 * - Restricción: Debe ser un número no negativo (>= 0).
 * @param {any} texto
 * @returns {string | null}
 */
validarEntrada.validarPropina = function validarPropina(texto) {
  if (texto === null || texto === undefined) {
    return 'Propina inválida'
  }
  const limpio = String(texto).trim()
  if (limpio === '') {
    return 'Propina inválida'
  }
  const numero = Number(limpio)
  if (Number.isNaN(numero) || !Number.isFinite(numero) || numero < 0) {
    return 'Propina inválida'
  }
  return null
}
