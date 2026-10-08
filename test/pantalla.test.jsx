import { describe, it, expect } from 'vitest'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { PantallaDivisor } from '../src/presentation/PantallaDivisor'
import { calcularDivision } from '../src/domain/calcularDivision'
import { validarEntrada } from '../src/domain/validarEntrada'
import { redondeoExacto } from '../src/data/redondeoExacto'
import { redondeoHaciaArriba } from '../src/data/redondeoHaciaArriba'

/**
 * Pruebas de integración visual de la capa de presentación (PantallaDivisor).
 * Utilizan React Testing Library y jsdom para simular la interacción del usuario.
 */
describe('PantallaDivisor - Pruebas de UI con Testing Library', () => {
  const dependencias = {
    calcularDivision,
    validarEntrada,
    estrategias: {
      exacto: redondeoExacto,
      haciaArriba: redondeoHaciaArriba,
    },
  }

  // 1. Ingreso 100, 4 y 10, hago clic en "Calcular" y aparece "27.50" en pantalla.
  it('Ingreso 100, 4 y 10, hago clic en "Calcular" y aparece "27.50" en pantalla', () => {
    render(<PantallaDivisor dependencias={dependencias} />)

    const inputMonto = screen.getByLabelText(/monto total/i)
    const inputPersonas = screen.getByLabelText(/número de personas/i)
    const inputPropina = screen.getByLabelText(/porcentaje de propina/i)
    const botonCalcular = screen.getByRole('button', { name: /calcular/i })

    fireEvent.change(inputMonto, { target: { value: '100' } })
    fireEvent.change(inputPersonas, { target: { value: '4' } })
    fireEvent.change(inputPropina, { target: { value: '10' } })
    fireEvent.click(botonCalcular)

    expect(screen.getByText('27.50')).toBeInTheDocument()
  })

  // 2. Ingreso 50 y 0 personas, hago clic en "Calcular" y aparece
  //    "Debe haber al menos una persona", y NO aparece ningún resultado numérico.
  it('Ingreso 50 y 0 personas, hago clic en "Calcular" y aparece "Debe haber al menos una persona", y NO aparece ningún resultado numérico', () => {
    render(<PantallaDivisor dependencias={dependencias} />)

    const inputMonto = screen.getByLabelText(/monto total/i)
    const inputPersonas = screen.getByLabelText(/número de personas/i)
    const botonCalcular = screen.getByRole('button', { name: /calcular/i })

    fireEvent.change(inputMonto, { target: { value: '50' } })
    fireEvent.change(inputPersonas, { target: { value: '0' } })
    fireEvent.click(botonCalcular)

    expect(screen.getByText('Debe haber al menos una persona')).toBeInTheDocument()
    expect(screen.queryByTestId('monto-persona')).not.toBeInTheDocument()
    expect(screen.queryByText(/resumen del cálculo/i)).not.toBeInTheDocument()
  })

  // 3. Ingreso "abc" en el monto, hago clic en "Calcular" y aparece "Monto inválido".
  it('Ingreso "abc" en el monto, hago clic en "Calcular" y aparece "Monto inválido"', () => {
    render(<PantallaDivisor dependencias={dependencias} />)

    const inputMonto = screen.getByLabelText(/monto total/i)
    const botonCalcular = screen.getByRole('button', { name: /calcular/i })

    fireEvent.change(inputMonto, { target: { value: 'abc' } })
    fireEvent.click(botonCalcular)

    expect(screen.getByText('Monto inválido')).toBeInTheDocument()
    expect(screen.queryByTestId('monto-persona')).not.toBeInTheDocument()
  })
})

