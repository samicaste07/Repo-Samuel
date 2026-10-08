# Data Model & Entidades: División de Cuenta Web

## 1. Capa de Dominio (`src/domain/`)

### Entidad: `Cuenta` (`cuenta.js`)
Representa los datos inmutables y validados de una cuenta a dividir.
- **Factoría**: `crearCuenta({ montoBase, numeroPersonas, porcentajePropina, estrategiaRedondeo })`
- **Campos**:
  - `montoBase`: `number` (Monto total del consumo antes de propina, estrictamente mayor a 0).
  - `numeroPersonas`: `number` (Entero positivo, mayor o igual a 1).
  - `porcentajePropina`: `number` (Porcentaje numérico de propina, mayor o igual a 0).
  - `estrategiaRedondeo`: `object` (Objeto que implementa el contrato `EstrategiaRedondeo` con método `aplicar(valor)`).

### Entidad: `Resultado` (`resultado.js`)
Representa el resultado inmutable del cálculo de división de la cuenta.
- **Factoría**: `crearResultado({ montoPorPersona, totalPropina, totalPagar })`
- **Campos**:
  - `montoPorPersona`: `number` (Cuota individual final tras aplicar la regla de redondeo).
  - `totalPropina`: `number` (Monto monetario correspondiente a la propina calculada).
  - `totalPagar`: `number` (Suma total del monto base más la propina).

### Contrato: `EstrategiaRedondeo` (`estrategiaRedondeo.js`)
Define la especificación de interfaz para cualquier estrategia de redondeo.
- **Método**:
  - `aplicar(valor: number): number`: Recibe el valor numérico con decimales y devuelve el valor redondeado según la regla.

### Caso de Uso: `calcularDivision` (`calcularDivision.js`)
Función pura encargada únicamente de realizar la matemática del reparto.
- **Firma**: `calcularDivision(cuenta: Cuenta): Resultado`
- **Lógica**:
  1. `totalPropina = cuenta.montoBase * (cuenta.porcentajePropina / 100)`
  2. `totalPagar = cuenta.montoBase + totalPropina`
  3. `montoSinRedondeo = totalPagar / cuenta.numeroPersonas`
  4. `montoPorPersona = cuenta.estrategiaRedondeo.aplicar(montoSinRedondeo)`
  5. Retorna `crearResultado({ montoPorPersona, totalPropina, totalPagar })`
- **Restricción**: NO valida cadenas ni formatea textos para la vista (SRP).

### Validador: `validarEntrada` (`validarEntrada.js`)
Módulo puro encargado de la validación de las entradas textuales del usuario.
- **Funciones**:
  - `validarMonto(texto: string): string | null`: Devuelve `"Monto inválido"` si el valor está vacío, no es un número finito positivo o es $\le 0$; de lo contrario `null`.
  - `validarPersonas(texto: string): string | null`: Devuelve `"Debe haber al menos una persona"` si el valor está vacío, no es entero o es $< 1$; de lo contrario `null`.
  - `validarPropina(texto: string): string | null`: Devuelve `"Propina inválida"` si no es número finito o es $< 0$; de lo contrario `null`.
- **Restricción**: Solo valida y retorna mensajes de error; no realiza cálculos ni formatea moneda (SRP).

---

## 2. Capa de Datos (`src/data/`)

### Implementación: `redondeoExacto` (`redondeoExacto.js`)
Implementa el contrato de `EstrategiaRedondeo`.
- **Método**: `aplicar(valor: number): number`
- **Comportamiento**: Redondea a 2 decimales estándar utilizando `Math.round(valor * 100) / 100`.
- **Ejemplo**: `10 / 3 = 3.3333...` $\rightarrow$ `3.33`.

### Implementación: `redondeoHaciaArriba` (`redondeoHaciaArriba.js`)
Implementa el contrato de `EstrategiaRedondeo`.
- **Método**: `aplicar(valor: number): number`
- **Comportamiento**: Redondea hacia arriba al entero más cercano utilizando `Math.ceil(valor)`.
- **Ejemplo**: `10 / 3 = 3.3333...` $\rightarrow$ `4`.

---

## 3. Capa de Presentación (`src/presentation/`)

### Hook: `useDivisor` (`useDivisor.js`)
Custom hook de React que orquesta la interacción entre la interfaz de usuario y las capas de dominio/datos mediante inyección de dependencias.
- **Parámetros recibidos**:
  - `calcularDivision`: Función de cálculo del dominio.
  - `validarEntrada`: Objeto o funciones de validación del dominio.
  - `estrategias`: Diccionario `{ exacto, haciaArriba }` con las estrategias de redondeo.
- **Estado interno (`useState`)**:
  - `monto`: `string` (inicial `""`)
  - `personas`: `string` (inicial `""`)
  - `propina`: `string` (inicial `"10"`)
  - `modoRedondeo`: `string` (`"exacto"` o `"haciaArriba"`, inicial `"exacto"`)
  - `resultado`: `Resultado | null` (inicial `null`)
  - `errorMonto`: `string | null` (inicial `null`)
  - `errorPersonas`: `string | null` (inicial `null`)
  - `errorPropina`: `string | null` (inicial `null`)
- **Acción principal**:
  - `calcular()`:
    1. Ejecuta validaciones con `validarEntrada`.
    2. Si hay errores: actualiza los estados de error y resetea `resultado` a `null`.
    3. Si las entradas son válidas: limpia errores, instancia la `Cuenta` con los números parseados y la estrategia seleccionada, invoca `calcularDivision(cuenta)` y asigna el `resultado`.

### Utilidad: `formateadorMoneda` (`formateadorMoneda.js`)
Formatea valores numéricos para su visualización en la interfaz.
- **Función**: `formatearMoneda(valor: number): string`
- **Comportamiento**: Retorna el número fijado a dos decimales (`valor.toFixed(2)`).
- **Ejemplos**: `27.5` $\rightarrow$ `"27.50"`, `30` $\rightarrow$ `"30.00"`, `3.33` $\rightarrow$ `"3.33"`, `4` $\rightarrow$ `"4.00"`.

### Componente: `PantallaDivisor` (`PantallaDivisor.jsx`)
Vista principal de React (pantalla única):
- Recibe las dependencias necesarias o invoca `useDivisor(dependencias)`.
- Renderiza:
  - Formulario con inputs para monto, comensales y propina.
  - Controles de selección de modo de redondeo ("Exacto", "Hacia arriba al entero").
  - Botón "Calcular".
  - Mensajes de error en caso de entradas inválidas.
  - Tarjeta o panel de resultados con el monto individual formateado a dos decimales y el resumen total.

