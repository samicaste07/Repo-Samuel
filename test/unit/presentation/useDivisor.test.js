import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDivisor } from '../../../src/presentation/useDivisor'
import { calcularDivision } from '../../../src/domain/calcularDivision'
import { validarEntrada } from '../../../src/domain/validarEntrada'
import { redondeoExacto } from '../../../src/data/redondeoExacto'
import { redondeoHaciaArriba } from '../../../src/data/redondeoHaciaArriba'

describe('Presentation: useDivisor Hook (US1, US2, US3)', () => {
  const dependencias = {
    calcularDivision,
    validarEntrada,
    estrategias: {
      exacto: redondeoExacto,
      haciaArriba: redondeoHaciaArriba,
    },
  }

  it('inicia con valores por defecto (propina 10%, modo exacto, sin errores, sin resultado)', () => {
    const { result } = renderHook(() => useDivisor(dependencias))

    expect(result.current.monto).toBe('')
    expect(result.current.personas).toBe('')
    expect(result.current.propina).toBe('10')
    expect(result.current.modoRedondeo).toBe('exacto')
    expect(result.current.resultado).toBeNull()
    expect(result.current.errorMonto).toBeNull()
    expect(result.current.errorPersonas).toBeNull()
    expect(result.current.errorPropina).toBeNull()
  })

  it('ejecuta cálculo exitoso para Escenario 1 (100.00, 4 personas, 10% propina)', () => {
    const { result } = renderHook(() => useDivisor(dependencias))

    act(() => {
      result.current.setMonto('100.00')
      result.current.setPersonas('4')
    })

    act(() => {
      result.current.calcular()
    })

    expect(result.current.errorMonto).toBeNull()
    expect(result.current.errorPersonas).toBeNull()
    expect(result.current.resultado).not.toBeNull()
    expect(result.current.resultado.montoPorPersona).toBe(27.5)
    expect(result.current.resultado.totalPropina).toBe(10)
    expect(result.current.resultado.totalPagar).toBe(110)
  })

  it('Escenario 4: valida cero personas, muestra error y suprime resultado', () => {
    const { result } = renderHook(() => useDivisor(dependencias))

    act(() => {
      result.current.setMonto('50.00')
      result.current.setPersonas('0')
    })

    act(() => {
      result.current.calcular()
    })

    expect(result.current.errorPersonas).toBe('Debe haber al menos una persona')
    expect(result.current.resultado).toBeNull()
  })

  it('Escenario 5: valida monto inválido ("abc"), muestra error y suprime resultado', () => {
    const { result } = renderHook(() => useDivisor(dependencias))

    act(() => {
      result.current.setMonto('abc')
      result.current.setPersonas('2')
    })

    act(() => {
      result.current.calcular()
    })

    expect(result.current.errorMonto).toBe('Monto inválido')
    expect(result.current.resultado).toBeNull()
  })

  it('Escenario 6: calcula con modo redondeo hacia arriba (10.00, 3 personas, 0% propina -> 4.00)', () => {
    const { result } = renderHook(() => useDivisor(dependencias))

    act(() => {
      result.current.setMonto('10.00')
      result.current.setPersonas('3')
      result.current.setPropina('0')
      result.current.setModoRedondeo('haciaArriba')
    })

    act(() => {
      result.current.calcular()
    })

    expect(result.current.resultado.montoPorPersona).toBe(4)
  })

  it('lanza error al inicializar si faltan dependencias requeridas', () => {
    expect(() => renderHook(() => useDivisor({}))).toThrow(TypeError)
  })
})

