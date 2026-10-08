import { describe, it, expect } from 'vitest'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { PantallaDivisor } from '../../src/presentation/PantallaDivisor'
import { calcularDivision } from '../../src/domain/calcularDivision'
import { validarEntrada } from '../../src/domain/validarEntrada'
import { redondeoExacto } from '../../src/data/redondeoExacto'
import { redondeoHaciaArriba } from '../../src/data/redondeoHaciaArriba'

describe('Componente: PantallaDivisor (6 Escenarios de Aceptación de la Spec)', () => {
  const dependencias = {
    calcularDivision,
    validarEntrada,
    estrategias: {
      exacto: redondeoExacto,
      haciaArriba: redondeoHaciaArriba,
    },
  }

  it('inicia con los valores por defecto (propina 10% y modo exacto seleccionado)', () => {
    render(<PantallaDivisor dependencias={dependencias} />)

    const inputPropina = screen.getByLabelText(/Porcentaje de Propina/i)
    expect(inputPropina.value).toBe('10')

    const radioExacto = screen.getByLabelText(/^Exacto$/i)
    expect(radioExacto.checked).toBe(true)

    const radioArriba = screen.getByLabelText(/Hacia arriba al entero más cercano/i)
    expect(radioArriba.checked).toBe(false)
  })

  it('Escenario 1: Monto 100.00, 4 personas, 10% propina, exacto -> muestra "27.50"', () => {
    render(<PantallaDivisor dependencias={dependencias} />)

    fireEvent.change(screen.getByLabelText(/Monto Total/i), { target: { value: '100.00' } })
    fireEvent.change(screen.getByLabelText(/Número de Personas/i), { target: { value: '4' } })
    fireEvent.change(screen.getByLabelText(/Porcentaje de Propina/i), { target: { value: '10' } })
    fireEvent.click(screen.getByRole('button', { name: /Calcular/i }))

    const montoPersona = screen.getByTestId('monto-persona')
    expect(montoPersona.textContent).toBe('$27.50')
  })

  it('Escenario 2: Monto 90.00, 3 personas, 0% propina, exacto -> muestra "30.00"', () => {
    render(<PantallaDivisor dependencias={dependencias} />)

    fireEvent.change(screen.getByLabelText(/Monto Total/i), { target: { value: '90.00' } })
    fireEvent.change(screen.getByLabelText(/Número de Personas/i), { target: { value: '3' } })
    fireEvent.change(screen.getByLabelText(/Porcentaje de Propina/i), { target: { value: '0' } })
    fireEvent.click(screen.getByRole('button', { name: /Calcular/i }))

    const montoPersona = screen.getByTestId('monto-persona')
    expect(montoPersona.textContent).toBe('$30.00')
  })

  it('Escenario 3: Monto 10.00, 3 personas, 0% propina, exacto -> muestra "3.33"', () => {
    render(<PantallaDivisor dependencias={dependencias} />)

    fireEvent.change(screen.getByLabelText(/Monto Total/i), { target: { value: '10.00' } })
    fireEvent.change(screen.getByLabelText(/Número de Personas/i), { target: { value: '3' } })
    fireEvent.change(screen.getByLabelText(/Porcentaje de Propina/i), { target: { value: '0' } })
    fireEvent.click(screen.getByRole('button', { name: /Calcular/i }))

    const montoPersona = screen.getByTestId('monto-persona')
    expect(montoPersona.textContent).toBe('$3.33')
  })

  it('Escenario 4: Monto 50.00, 0 personas -> muestra error "Debe haber al menos una persona" y NO muestra resultado', () => {
    render(<PantallaDivisor dependencias={dependencias} />)

    fireEvent.change(screen.getByLabelText(/Monto Total/i), { target: { value: '50.00' } })
    fireEvent.change(screen.getByLabelText(/Número de Personas/i), { target: { value: '0' } })
    fireEvent.click(screen.getByRole('button', { name: /Calcular/i }))

    expect(screen.getByText('Debe haber al menos una persona')).toBeDefined()
    expect(screen.queryByTestId('monto-persona')).toBeNull()
  })

  it('Escenario 5: Monto "abc" -> muestra error "Monto inválido" y NO muestra resultado', () => {
    render(<PantallaDivisor dependencias={dependencias} />)

    fireEvent.change(screen.getByLabelText(/Monto Total/i), { target: { value: 'abc' } })
    fireEvent.change(screen.getByLabelText(/Número de Personas/i), { target: { value: '2' } })
    fireEvent.click(screen.getByRole('button', { name: /Calcular/i }))

    expect(screen.getByText('Monto inválido')).toBeDefined()
    expect(screen.queryByTestId('monto-persona')).toBeNull()
  })

  it('Escenario 6: Monto 10.00, 3 personas, 0% propina, hacia arriba -> muestra "4.00"', () => {
    render(<PantallaDivisor dependencias={dependencias} />)

    fireEvent.change(screen.getByLabelText(/Monto Total/i), { target: { value: '10.00' } })
    fireEvent.change(screen.getByLabelText(/Número de Personas/i), { target: { value: '3' } })
    fireEvent.change(screen.getByLabelText(/Porcentaje de Propina/i), { target: { value: '0' } })

    const radioArriba = screen.getByLabelText(/Hacia arriba al entero más cercano/i)
    fireEvent.click(radioArriba)

    fireEvent.click(screen.getByRole('button', { name: /Calcular/i }))

    const montoPersona = screen.getByTestId('monto-persona')
    expect(montoPersona.textContent).toBe('$4.00')
  })
})

