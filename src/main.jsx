import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Capa de Datos: implementaciones concretas de redondeo
import { redondeoExacto } from './data/redondeoExacto'
import { redondeoHaciaArriba } from './data/redondeoHaciaArriba'

// Capa de Dominio: caso de uso puro y validador
import { calcularDivision } from './domain/calcularDivision'
import { validarEntrada } from './domain/validarEntrada'

// Capa de Presentación: componente raíz
import { PantallaDivisor } from './presentation/PantallaDivisor'

/**
 * Punto Único de Composición de la Aplicación.
 *
 * Cumple con el Principio II de la Constitución:
 * - "src/main.jsx es el ÚNICO lugar donde se instancian implementaciones concretas."
 * - Ensambla el grafo de dependencias inyectando las implementaciones concretas de la capa de datos
 *   y las funciones de la capa de dominio en la vista principal de la capa de presentación.
 */
const dependencias = {
  calcularDivision,
  validarEntrada,
  estrategias: {
    exacto: redondeoExacto,
    haciaArriba: redondeoHaciaArriba,
  },
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PantallaDivisor dependencias={dependencias} />
  </StrictMode>,
)
