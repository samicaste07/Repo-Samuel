import { describe, it, expect } from 'vitest'
import { validarEntrada } from '../../../src/domain/validarEntrada'

describe('Dominio: validarEntrada (US2 - Manejo de Errores y Validaciones)', () => {
  describe('validarMonto', () => {
    it('retorna null para montos válidos estrictamente positivos', () => {
      expect(validarEntrada.validarMonto('100.00')).toBeNull()
      expect(validarEntrada.validarMonto('90')).toBeNull()
      expect(validarEntrada.validarMonto('10.50')).toBeNull()
    })

    it('Escenario 5: retorna "Monto inválido" para valores alfanuméricos como "abc"', () => {
      expect(validarEntrada.validarMonto('abc')).toBe('Monto inválido')
      expect(validarEntrada.validarMonto('100abc')).toBe('Monto inválido')
    })

    it('retorna "Monto inválido" para valores vacíos o espacios', () => {
      expect(validarEntrada.validarMonto('')).toBe('Monto inválido')
      expect(validarEntrada.validarMonto('   ')).toBe('Monto inválido')
      expect(validarEntrada.validarMonto(null)).toBe('Monto inválido')
      expect(validarEntrada.validarMonto(undefined)).toBe('Monto inválido')
    })

    it('retorna "Monto inválido" para números negativos o cero', () => {
      expect(validarEntrada.validarMonto('0')).toBe('Monto inválido')
      expect(validarEntrada.validarMonto('-10')).toBe('Monto inválido')
      expect(validarEntrada.validarMonto('-0.01')).toBe('Monto inválido')
    })
  })

  describe('validarPersonas', () => {
    it('retorna null para enteros mayores o iguales a 1', () => {
      expect(validarEntrada.validarPersonas('1')).toBeNull()
      expect(validarEntrada.validarPersonas('4')).toBeNull()
      expect(validarEntrada.validarPersonas('10')).toBeNull()
    })

    it('Escenario 4: retorna "Debe haber al menos una persona" para 0 personas', () => {
      expect(validarEntrada.validarPersonas('0')).toBe('Debe haber al menos una persona')
    })

    it('retorna "Debe haber al menos una persona" para valores negativos', () => {
      expect(validarEntrada.validarPersonas('-1')).toBe('Debe haber al menos una persona')
      expect(validarEntrada.validarPersonas('-5')).toBe('Debe haber al menos una persona')
    })

    it('retorna "Debe haber al menos una persona" para valores vacíos o no numéricos', () => {
      expect(validarEntrada.validarPersonas('')).toBe('Debe haber al menos una persona')
      expect(validarEntrada.validarPersonas('   ')).toBe('Debe haber al menos una persona')
      expect(validarEntrada.validarPersonas('abc')).toBe('Debe haber al menos una persona')
      expect(validarEntrada.validarPersonas(null)).toBe('Debe haber al menos una persona')
    })

    it('retorna "Debe haber al menos una persona" para números decimales', () => {
      expect(validarEntrada.validarPersonas('1.5')).toBe('Debe haber al menos una persona')
      expect(validarEntrada.validarPersonas('2.8')).toBe('Debe haber al menos una persona')
    })
  })

  describe('validarPropina', () => {
    it('retorna null para porcentajes de propina no negativos', () => {
      expect(validarEntrada.validarPropina('0')).toBeNull()
      expect(validarEntrada.validarPropina('10')).toBeNull()
      expect(validarEntrada.validarPropina('15.5')).toBeNull()
    })

    it('retorna "Propina inválida" para valores negativos o alfanuméricos', () => {
      expect(validarEntrada.validarPropina('-5')).toBe('Propina inválida')
      expect(validarEntrada.validarPropina('abc')).toBe('Propina inválida')
      expect(validarEntrada.validarPropina('')).toBe('Propina inválida')
    })
  })
})

