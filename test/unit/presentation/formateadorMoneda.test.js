import { describe, it, expect } from 'vitest'
import { formatearMoneda } from '../../../src/presentation/formateadorMoneda'

describe('formatearMoneda', () => {
  it('formatea un número decimal a exactamente dos decimales', () => {
    expect(formatearMoneda(27.5)).toBe('27.50')
  })

  it('formatea un número entero agregando .00', () => {
    expect(formatearMoneda(30)).toBe('30.00')
  })

  it('mantiene dos decimales existentes', () => {
    expect(formatearMoneda(3.33)).toBe('3.33')
  })

  it('formatea un entero resultado de redondeo hacia arriba con dos decimales', () => {
    expect(formatearMoneda(4)).toBe('4.00')
  })

  it('formatea el número 0 como 0.00', () => {
    expect(formatearMoneda(0)).toBe('0.00')
  })

  it('lanza un error si el valor no es un número finito', () => {
    expect(() => formatearMoneda(NaN)).toThrow(TypeError)
    expect(() => formatearMoneda('abc')).toThrow(TypeError)
  })
})

