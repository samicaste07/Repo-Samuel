import { describe, it, expect } from 'vitest'
import { crearCuenta } from '../../../src/domain/cuenta'
import { crearResultado } from '../../../src/domain/resultado'
import { esEstrategiaRedondeoValida } from '../../../src/domain/estrategiaRedondeo'

describe('Dominio: Entidades y Contratos Base', () => {
  const dummyEstrategia = { aplicar: (v) => v }

  describe('estrategiaRedondeo', () => {
    it('valida que el objeto contenga una función aplicar', () => {
      expect(esEstrategiaRedondeoValida({ aplicar: () => 1 })).toBe(true)
      expect(esEstrategiaRedondeoValida(null)).toBe(false)
      expect(esEstrategiaRedondeoValida({})).toBe(false)
      expect(esEstrategiaRedondeoValida({ aplicar: 123 })).toBe(false)
    })
  })

  describe('crearCuenta', () => {
    it('crea una cuenta inmutable válida', () => {
      const cuenta = crearCuenta({
        montoBase: 100,
        numeroPersonas: 4,
        porcentajePropina: 10,
        estrategiaRedondeo: dummyEstrategia,
      })

      expect(cuenta.montoBase).toBe(100)
      expect(cuenta.numeroPersonas).toBe(4)
      expect(cuenta.porcentajePropina).toBe(10)
      expect(Object.isFrozen(cuenta)).toBe(true)
    })

    it('rechaza monto base inválido o menor/igual a 0', () => {
      expect(() => crearCuenta({
        montoBase: 0,
        numeroPersonas: 2,
        porcentajePropina: 10,
        estrategiaRedondeo: dummyEstrategia,
      })).toThrow()
    })

    it('rechaza número de personas menor a 1 o no entero', () => {
      expect(() => crearCuenta({
        montoBase: 50,
        numeroPersonas: 0,
        porcentajePropina: 10,
        estrategiaRedondeo: dummyEstrategia,
      })).toThrow()

      expect(() => crearCuenta({
        montoBase: 50,
        numeroPersonas: 1.5,
        porcentajePropina: 10,
        estrategiaRedondeo: dummyEstrategia,
      })).toThrow()
    })

    it('rechaza propina negativa', () => {
      expect(() => crearCuenta({
        montoBase: 50,
        numeroPersonas: 2,
        porcentajePropina: -5,
        estrategiaRedondeo: dummyEstrategia,
      })).toThrow()
    })

    it('rechaza estrategia sin función aplicar', () => {
      expect(() => crearCuenta({
        montoBase: 50,
        numeroPersonas: 2,
        porcentajePropina: 10,
        estrategiaRedondeo: {},
      })).toThrow()
    })
  })

  describe('crearResultado', () => {
    it('crea un resultado inmutable válido', () => {
      const resultado = crearResultado({
        montoPorPersona: 27.5,
        totalPropina: 10,
        totalPagar: 110,
      })

      expect(resultado.montoPorPersona).toBe(27.5)
      expect(resultado.totalPropina).toBe(10)
      expect(resultado.totalPagar).toBe(110)
      expect(Object.isFrozen(resultado)).toBe(true)
    })

    it('rechaza valores negativos o no numéricos', () => {
      expect(() => crearResultado({
        montoPorPersona: -1,
        totalPropina: 10,
        totalPagar: 110,
      })).toThrow()
    })
  })
})

