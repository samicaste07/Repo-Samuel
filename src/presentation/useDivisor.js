import { useState } from 'react'
import { crearCuenta as crearCuentaDefault } from '../domain/cuenta'

/**
 * Custom hook de React que gestiona el estado y la lógica de presentación del divisor de cuentas.
 *
 * - Qué hace: Mantiene el estado local con `useState` para los campos de entrada, modo de redondeo,
 *   errores de validación y resultado del cálculo. Al ejecutar `calcular()`, valida las entradas
 *   usando el validador inyectado; si son válidas, delega el cálculo al caso de uso y actualiza el resultado.
 * - Por qué existe: Desacopla la lógica de estado de React del componente visual (`PantallaDivisor`)
 *   y cumple con DIP (Dependency Inversion Principle) al recibir sus colaboradores del dominio y datos
 *   por inyección de dependencias en lugar de instanciarlos directamente.
 * - Qué recibe: Objeto `dependencias`:
 *   * `calcularDivision` (Function): Caso de uso para calcular la división de la cuenta.
 *   * `validarEntrada` (Object): Validador con métodos `validarMonto`, `validarPersonas`, `validarPropina`.
 *   * `estrategias` (Object): Objeto con las implementaciones `{ exacto, haciaArriba }`.
 *   * `crearCuenta` (Function, opcional): Factoría de la entidad Cuenta (por defecto la de dominio).
 * - Qué devuelve: (Object) con:
 *   * `monto`, `setMonto`: Estado y setter del monto total.
 *   * `personas`, `setPersonas`: Estado y setter de comensales.
 *   * `propina`, `setPropina`: Estado y setter del porcentaje de propina (por defecto "10").
 *   * `modoRedondeo`, `setModoRedondeo`: Modo seleccionado ("exacto" | "haciaArriba", por defecto "exacto").
 *   * `resultado`: Entidad Resultado o `null`.
 *   * `errorMonto`, `errorPersonas`, `errorPropina`: Cadenas de error o `null`.
 *   * `calcular`: Función despachadora para accionar la validación y el cálculo.
 * - Qué errores produce: Lanza TypeError si `calcularDivision`, `validarEntrada` o `estrategias` no son provistos.
 *
 * @param {Object} dependencias
 * @param {Function} dependencias.calcularDivision
 * @param {Object} dependencias.validarEntrada
 * @param {{ exacto: import('../domain/estrategiaRedondeo').EstrategiaRedondeo, haciaArriba: import('../domain/estrategiaRedondeo').EstrategiaRedondeo }} dependencias.estrategias
 * @param {Function} [dependencias.crearCuenta]
 */
export function useDivisor({
  calcularDivision,
  validarEntrada,
  estrategias,
  crearCuenta = crearCuentaDefault,
} = {}) {
  if (
    typeof calcularDivision !== 'function' ||
    !validarEntrada ||
    typeof validarEntrada.validarMonto !== 'function' ||
    !estrategias ||
    !estrategias.exacto ||
    !estrategias.haciaArriba
  ) {
    throw new TypeError(
      'useDivisor requiere calcularDivision, validarEntrada y estrategias { exacto, haciaArriba } inyectadas.'
    )
  }

  // Estado local de entradas (FR-009: por defecto propina 10% y modo exacto)
  const [monto, setMonto] = useState('')
  const [personas, setPersonas] = useState('')
  const [propina, setPropina] = useState('10')
  const [modoRedondeo, setModoRedondeo] = useState('exacto')

  // Estado local de resultados y errores
  const [resultado, setResultado] = useState(null)
  const [errorMonto, setErrorMonto] = useState(null)
  const [errorPersonas, setErrorPersonas] = useState(null)
  const [errorPropina, setErrorPropina] = useState(null)

  /**
   * Ejecuta la validación y el cálculo de la cuenta.
   * Disparado únicamente al presionar la acción "Calcular" (FR-003).
   */
  const calcular = () => {
    const errM = validarEntrada.validarMonto(monto)
    const errP = validarEntrada.validarPersonas(personas)
    const errProp = validarEntrada.validarPropina(propina)

    setErrorMonto(errM)
    setErrorPersonas(errP)
    setErrorPropina(errProp)

    // Si existe algún error, se suprime cualquier resultado anterior (FR-005, FR-006)
    if (errM || errP || errProp) {
      setResultado(null)
      return
    }

    const estrategiaSeleccionada =
      modoRedondeo === 'haciaArriba' ? estrategias.haciaArriba : estrategias.exacto

    const cuenta = crearCuenta({
      montoBase: Number(monto),
      numeroPersonas: parseInt(personas, 10),
      porcentajePropina: Number(propina),
      estrategiaRedondeo: estrategiaSeleccionada,
    })

    const resultadoCalculado = calcularDivision(cuenta)
    setResultado(resultadoCalculado)
  }

  return {
    monto,
    setMonto,
    personas,
    setPersonas,
    propina,
    setPropina,
    modoRedondeo,
    setModoRedondeo,
    resultado,
    errorMonto,
    errorPersonas,
    errorPropina,
    calcular,
  }
}

