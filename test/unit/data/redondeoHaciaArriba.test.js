import { describe, it, expect } from 'vitest'
import { redondeoHaciaArriba } from '../../../src/data/redondeoHaciaArriba'

describe('Data: redondeoHaciaArriba (US3)', () => {
  it('cumple con el contrato de estrategia exponiendo la función aplicar', () => {
    expect(typeof redondeoHaciaArriba.aplicar).toBe('function')
  })

  it('Escenario 6: redondea hacia arriba al entero más cercano (10 / 3 -> 4)', () => {
    expect(redondeoHaciaArriba.aplicar(10 / 3)).toBe(4)
  })

  it('mantiene enteros exactos sin alteración (4 -> 4)', () => {
    expect(redondeoHaciaArriba.aplicar(4)).toBe(4)
  })

  it('eleva cualquier fracción decimal al entero inmediato superior (4.01 -> 5)', () => {
    expect(redondeoHaciaArriba.aplicar(4.01)).toBe(5)
  })

  it('maneja el valor 0 devolviendo 0', () => {
    expect(redondeoHaciaArriba.aplicar(0)).toBe(0)
  })

  it('lanza un error si el valor no es un número finito', () => {
    expect(() => redondeoHaciaArriba.aplicar(NaN)).toThrow(TypeError)
    expect(() => redondeoHaciaArriba.aplicar('abc')).toThrow(TypeError)
  })
})

