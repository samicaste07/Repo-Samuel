import React from 'react'
import { useDivisor } from './useDivisor'
import { formatearMoneda } from './formateadorMoneda'

/**
 * Componente visual de la pantalla única para dividir la cuenta de un restaurante.
 *
 * - Qué hace: Renderiza el formulario con los campos de entrada de monto, comensales y propina,
 *   los selectores del modo de redondeo, el botón "Calcular", las alertas de error de validación
 *   y el panel con la tarjeta de resultados numéricos calculados.
 * - Por qué existe: Representa la interfaz de usuario en la capa de presentación; delega
 *   toda la lógica de estado al hook `useDivisor` y el formato de números a `formateadorMoneda`.
 * - Qué recibe: `props.dependencias` (Object) - Grafo de dependencias inyectado desde `src/main.jsx`.
 * - Qué devuelve: Elemento JSX que conforma la pantalla interactiva de la aplicación.
 * - Qué errores produce: No lanza excepciones no controladas; renderiza retroalimentación visual clara.
 *
 * @param {Object} props
 * @param {Object} props.dependencias - Dependencias requeridas por useDivisor.
 */
export function PantallaDivisor({ dependencias }) {
  const {
    monto,
    setMonto,
    personas,
    setPersonas,
    propina,
    setPropina,
    modoRedondeo,
    setModoRedondeo,
    resultado,
    errorMonto,
    errorPersonas,
    errorPropina,
    calcular,
  } = useDivisor(dependencias)

  const handleSubmit = (e) => {
    e.preventDefault()
    calcular()
  }

  return (
    <div style={{ maxWidth: '480px', margin: '2rem auto', padding: '1.5rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.75rem', margin: 0, color: '#1a1a1a' }}>Divisor de Cuenta</h1>
        <p style={{ margin: '0.5rem 0 0', color: '#666', fontSize: '0.95rem' }}>
          Calcula la división equitativa de tu cuenta y propina
        </p>
      </header>

      <form onSubmit={handleSubmit} noValidate>
        {/* Campo: Monto Total */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="monto" style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>
            Monto Total:
          </label>
          <input
            id="monto"
            name="monto"
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              fontSize: '1rem',
              borderRadius: '6px',
              border: errorMonto ? '1px solid #d32f2f' : '1px solid #ccc',
              boxSizing: 'border-box',
            }}
          />
          {errorMonto && (
            <span role="alert" style={{ color: '#d32f2f', fontSize: '0.85rem', display: 'block', marginTop: '0.25rem' }}>
              {errorMonto}
            </span>
          )}
        </div>

        {/* Campo: Número de Personas */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="personas" style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>
            Número de Personas:
          </label>
          <input
            id="personas"
            name="personas"
            type="text"
            inputMode="numeric"
            placeholder="1"
            value={personas}
            onChange={(e) => setPersonas(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              fontSize: '1rem',
              borderRadius: '6px',
              border: errorPersonas ? '1px solid #d32f2f' : '1px solid #ccc',
              boxSizing: 'border-box',
            }}
          />
          {errorPersonas && (
            <span role="alert" style={{ color: '#d32f2f', fontSize: '0.85rem', display: 'block', marginTop: '0.25rem' }}>
              {errorPersonas}
            </span>
          )}
        </div>

        {/* Campo: Porcentaje de Propina */}
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="propina" style={{ display: 'block', fontWeight: 600, marginBottom: '0.25rem' }}>
            Porcentaje de Propina (%):
          </label>
          <input
            id="propina"
            name="propina"
            type="text"
            inputMode="decimal"
            placeholder="10"
            value={propina}
            onChange={(e) => setPropina(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              fontSize: '1rem',
              borderRadius: '6px',
              border: errorPropina ? '1px solid #d32f2f' : '1px solid #ccc',
              boxSizing: 'border-box',
            }}
          />
          {errorPropina && (
            <span role="alert" style={{ color: '#d32f2f', fontSize: '0.85rem', display: 'block', marginTop: '0.25rem' }}>
              {errorPropina}
            </span>
          )}
        </div>

        {/* Selector: Modo de Redondeo */}
        <fieldset style={{ marginBottom: '1.25rem', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '0.75rem' }}>
          <legend style={{ fontWeight: 600, padding: '0 0.5rem' }}>Modo de Redondeo:</legend>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="modoRedondeo"
                value="exacto"
                checked={modoRedondeo === 'exacto'}
                onChange={() => setModoRedondeo('exacto')}
              />
              Exacto
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="modoRedondeo"
                value="haciaArriba"
                checked={modoRedondeo === 'haciaArriba'}
                onChange={() => setModoRedondeo('haciaArriba')}
              />
              Hacia arriba al entero más cercano
            </label>
          </div>
        </fieldset>

        {/* Botón Acción: Calcular */}
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '1.05rem',
            fontWeight: 600,
            color: '#fff',
            backgroundColor: '#0066cc',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
        >
          Calcular
        </button>
      </form>

      {/* Panel de Resultado (solo se muestra si el cálculo es exitoso sin errores) */}
      {resultado && (
        <section
          aria-label="Resultado de la división"
          style={{
            marginTop: '1.5rem',
            padding: '1.25rem',
            backgroundColor: '#f4f8fa',
            borderRadius: '8px',
            border: '1px solid #d0e2ec',
          }}
        >
          <h2 style={{ fontSize: '1.2rem', margin: '0 0 1rem', color: '#004c8c', textAlign: 'center' }}>
            Resumen del Cálculo
          </h2>
          <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#444' }}>Total de propina:</span>
            <strong style={{ color: '#111' }}>$<span>{formatearMoneda(resultado.totalPropina)}</span></strong>
          </div>
          <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#444' }}>Total a pagar:</span>
            <strong style={{ color: '#111' }}>$<span>{formatearMoneda(resultado.totalPagar)}</span></strong>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid #d0e2ec', margin: '0.75rem 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#111' }}>Cada persona paga:</span>
            <span
              data-testid="monto-persona"
              style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0066cc' }}
            >
              $<span>{formatearMoneda(resultado.montoPorPersona)}</span>
            </span>
          </div>
        </section>
      )}
    </div>
  )
}

