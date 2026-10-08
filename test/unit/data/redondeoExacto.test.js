import { describe, it, expect } from 'vitest'
import { redondeoExacto } from '../../../src/data/redondeoExacto'

describe('Data: redondeoExacto', () => {
  it('cumple con el contrato de estrategia exponiendo la función aplicar', () => {
    expect(typeof redondeoExacto.aplicar).toBe('function')
  })

  it('redondea a dos decimales estándar valores con decimales periódicos (10 / 3 -> 3.33)', () => {
    expect(redondeoExacto.aplicar(10 / 3)).toBe(3.33)
  })

  it('mantiene valores exactos de dos decimales (27.5 -> 27.5)', () => {
    expect(redondeoExacto.aplicar(27.5)).toBe(27.5)
  })

  it('redondea hacia arriba cuando el tercer decimal es >= 5 (3.335 -> 3.34)', () => {
    expect(redondeoExacto.aplicar(3.335)).toBe(3.34)
  })

  it('mantiene enteros sin alteración (30 -> 30)', () => {
    expect(redondeoExacto.aplicar(30)).toBe(30)
  })

  it('lanza un error si el valor no es un número finito', () => {
    expect(() => redondeoExacto.aplicar(NaN)).toThrow(TypeError)
    expect(() => redondeoExacto.aplicar('abc')).toThrow(TypeError)
  })
})

