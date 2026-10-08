import { describe, it, expect } from 'vitest'
import { calcularDivision } from '../../../src/domain/calcularDivision'
import { crearCuenta } from '../../../src/domain/cuenta'
import { redondeoExacto } from '../../../src/data/redondeoExacto'
import { redondeoHaciaArriba } from '../../../src/data/redondeoHaciaArriba'

describe('Dominio: Caso de Uso calcularDivision', () => {
  it('Escenario 1: Monto 100.00, 4 personas, 10% propina -> Cuota 27.50', () => {
    const cuenta = crearCuenta({
      montoBase: 100.0,
      numeroPersonas: 4,
      porcentajePropina: 10.0,
      estrategiaRedondeo: redondeoExacto,
    })

    const resultado = calcularDivision(cuenta)

    expect(resultado.totalPropina).toBe(10.0)
    expect(resultado.totalPagar).toBe(110.0)
    expect(resultado.montoPorPersona).toBe(27.5)
  })

  it('Escenario 2: Monto 90.00, 3 personas, 0% propina -> Cuota 30.00', () => {
    const cuenta = crearCuenta({
      montoBase: 90.0,
      numeroPersonas: 3,
      porcentajePropina: 0.0,
      estrategiaRedondeo: redondeoExacto,
    })

    const resultado = calcularDivision(cuenta)

    expect(resultado.totalPropina).toBe(0.0)
    expect(resultado.totalPagar).toBe(90.0)
    expect(resultado.montoPorPersona).toBe(30.0)
  })

  it('Escenario 3: Monto 10.00, 3 personas, 0% propina -> Cuota 3.33 con decimal periódico', () => {
    const cuenta = crearCuenta({
      montoBase: 10.0,
      numeroPersonas: 3,
      porcentajePropina: 0.0,
      estrategiaRedondeo: redondeoExacto,
    })

    const resultado = calcularDivision(cuenta)

    expect(resultado.totalPropina).toBe(0.0)
    expect(resultado.totalPagar).toBe(10.0)
    expect(resultado.montoPorPersona).toBe(3.33)
  })

  it('Escenario 6: Monto 10.00, 3 personas, 0% propina, modo hacia arriba -> Cuota 4.00', () => {
    const cuenta = crearCuenta({
      montoBase: 10.0,
      numeroPersonas: 3,
      porcentajePropina: 0.0,
      estrategiaRedondeo: redondeoHaciaArriba,
    })

    const resultado = calcularDivision(cuenta)

    expect(resultado.totalPropina).toBe(0.0)
    expect(resultado.totalPagar).toBe(10.0)
    expect(resultado.montoPorPersona).toBe(4)
  })

  it('rechaza llamadas con cuenta nula o inválida', () => {
    expect(() => calcularDivision(null)).toThrow(TypeError)
    expect(() => calcularDivision({})).toThrow(TypeError)
  })
})
