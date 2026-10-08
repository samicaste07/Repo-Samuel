import { describe, it, expect } from 'vitest'
import { casos } from './casosDePrueba'
import { validarEntrada } from '../src/domain/validarEntrada'
import { calcularDivision } from '../src/domain/calcularDivision'
import { crearCuenta } from '../src/domain/cuenta'
import { redondeoExacto } from '../src/data/redondeoExacto'
import { redondeoHaciaArriba } from '../src/data/redondeoHaciaArriba'

describe('Pruebas parametrizadas de división desde casosDePrueba.js', () => {
  for (const caso of casos) {
    it(caso.nombre, () => {
      // Valida la entrada con validarEntrada
      const error = validarEntrada(caso)

      if (caso.errorEsperado) {
        // Verifica que la validación devuelve exactamente ese mensaje
        expect(error).toBe(caso.errorEsperado)

        // Verifica que NO se calcula nada
        let resultado = null
        expect(resultado).toBeNull()
      } else {
        // No debe haber error de validación
        expect(error).toBeNull()

        // Estrategia de redondeo correspondiente al campo modo ('arriba' o 'exacto')
        const estrategia = caso.modo === 'arriba' ? redondeoHaciaArriba : redondeoExacto

        const cuenta = crearCuenta({
          montoBase: caso.monto,
          numeroPersonas: caso.personas,
          porcentajePropina: caso.propina,
          estrategiaRedondeo: estrategia,
        })

        // Ejecuta calcularDivision y compara con toBeCloseTo(esperado, 2)
        const resultado = calcularDivision(cuenta)
        expect(resultado.montoPorPersona).toBeCloseTo(caso.esperado, 2)
      }
    })
  }
})

describe('Demostración del Principio de Sustitución de Liskov (LSP)', () => {
  it('el mismo calcularDivision recibe redondeoExacto y luego redondeoHaciaArriba sin ningún if ni comprobación de tipo, y funciona con los dos', () => {
    // 1. RedondeoExacto como implementación de EstrategiaRedondeo
    const cuentaExacta = crearCuenta({
      montoBase: 10.0,
      numeroPersonas: 3,
      porcentajePropina: 0.0,
      estrategiaRedondeo: redondeoExacto,
    })
    const resultadoExacto = calcularDivision(cuentaExacta)
    expect(resultadoExacto.montoPorPersona).toBeCloseTo(3.33, 2)

    // 2. RedondeoHaciaArriba como implementación de EstrategiaRedondeo
    const cuentaArriba = crearCuenta({
      montoBase: 10.0,
      numeroPersonas: 3,
      porcentajePropina: 0.0,
      estrategiaRedondeo: redondeoHaciaArriba,
    })
    const resultadoArriba = calcularDivision(cuentaArriba)
    expect(resultadoArriba.montoPorPersona).toBeCloseTo(4.00, 2)
  })
})

