
 1. Análisis de Reutilización de la Especificación (`spec.md`)

### Distribución Porcentual

| Categoría | Cantidad de Enunciados | Porcentaje | Justificación Técnica |

| Viajó intacto | 16 de 16 | 100 % | Enunciados orientados puramente al QUÉ del negocio y la experiencia de usuario |

| Necesitó adaptación | 0 de 16 | 0 % | Ningún requisito dependía de conceptos exclusivos de Flutter o dispositivos móviles. |

| No pudo reutilizarse | 0 de 16 | 0 % | Ningún requisito quedó obsoleto al migrar a la web. |

1. Evidencia del git diff:
   Al ejecutar la comparación directa entre el archivo de especificación del proyecto Flutter y el del proyecto React:

   El comando finaliza con código de salida 0 y cero líneas de diferencia. Ambos archivos son idénticos

2. Evidencia en analisis_spec.md:
   El desglose de los 16 enunciados atómicos nos dice que:
   Enunciados tipo QUÉ: 16 (100 %)
   Enunciados tipo CÓMO: 0 (0 %)
   Enunciados MIXTOS: 0 (0 %)

3. Contexto Temporal:
   No registrado


  2. Clasificación de Reglas de la Constitution

A continuación se comparan las directrices de la Constitución de Flutter frente a la Constitución de React 

| Regla Constitucional | Clasificación | Evidencia en Flutter | Evidencia en React | Justificación |
| I. SOLID - SRP | Adaptada en redacción | "Una clase, una única razón de cambio. La lógica de cálculo NO valida entradas ni formatea cadenas visuales." | "Una función o módulo, una sola razón de cambio. El cálculo no valida ni formatea." | En Dart orientado a objetos la unidad de descomposición es la clase; en JavaScript/ESM moderno es la función o módulo. La separación de responsabilidades es conceptualmente idéntica. |

| I. SOLID - OCP | Adaptada en redacción | "Abierto a extensión, cerrado a modificación. Agregar una nueva regla de redondeo o cálculo no obliga a editar las clases preexistentes." | "Abierto a extensión, cerrado a modificación. Agregar una nueva regla de redondeo no obliga a editar los módulos que ya existen." | Nuevas estrategias de redondeo se añaden creando nuevos archivos sin modificar calcularDivision. |

| I. SOLID - LSP | Adaptada en redacción | "Cualquier implementación de una interfaz DEBE poder sustituir a otra sin que quien la consume requiera comprobar de qué tipo concreto se trata." | "Cualquier implementación de la interfaz de redondeo puede sustituir a otra sin que quien la usa pregunte de qué tipo es." | Se mantiene el principio de sustitución sin condicionales. |

| I. SOLID - ISP | Adaptada en redacción | "Interfaces pequeñas y específicas; ningún cliente ni componente DEBE depender de métodos que no utiliza." | "Interfaces pequeñas; nadie depende de funciones que no usa." | En JS las interfaces son contratos implícitos. |

| I. SOLID - DIP | Idéntica | "La capa presentation depende exclusivamente de abstracciones de domain, nunca de clases concretas de data." | "presentation depende de abstracciones del domain, nunca de implementaciones concretas de data." | La vista y el hook nunca importan de la capa de datos. |

| II. Capas Arquitectónicas | Adaptada en redacción | "Organización estricta en lib/presentation/, lib/domain/ y lib/data/." | "Organización en src/presentation/, src/domain/ y src/data/." | Ajuste a las convenciones estándar del ecosistema: lib/ en proyectos Dart/Flutter frente a src/ en aplicaciones Node/Vite/React. |

| II. Regla de Dependencia | Idéntica | "Flujo unidireccional presentation -> domain <- data." | "presentation -> domain <- data." | El flujo de control y la dirección de dependencias hacia el núcleo del dominio son agnósticos al lenguaje. |

| II. Aislamiento de Dominio | Adaptada en redacción | "lib/domain/ es Dart puro y NO importa bajo ninguna circunstancia package:flutter." | "src/domain/ NO importa React ni nada del DOM: es JavaScript puro." | En ambos casos se protege al dominio de la tecnología visual. |

| II. Punto de Composición | Adaptada en redacción | "main.dart es el ÚNICO punto de entrada y ensamblaje donde se instancian implementaciones concretas." | "src/main.jsx es el ÚNICO lugar donde se instancian implementaciones concretas." | Cambio del archivo raíz de ensamblaje (main.dart a src/main.jsx). |

| III. Seguridad | Idéntica | "Prohibición absoluta de almacenar secretos, credenciales o API keys dentro del repositorio." | "Nunca guardar secretos ni API keys en el repositorio." | Principio universal de seguridad de software. |

| IV. Calidad y Pruebas | Idéntica | "Toda funcionalidad crítica DEBE contar con pruebas automatizadas. Los criterios de aceptación de cada especificación (spec) DEBEN transformarse obligatoriamente en pruebas ejecutables..." | "Toda funcionalidad crítica DEBE tener pruebas. Los criterios de aceptación de la spec se DEBEN convertir obligatoriamente en pruebas ejecutables." | Exigencia idéntica de cobertura de pruebas basada en la especificación. |

| V. Regla de la Materia | Idéntica | "Toda función generada por el agente DEBE poder ser explicada en su totalidad por el estudiante: 1. Qué hace. 2. Por qué existe. 3. Qué recibe. 4. Qué devuelve. 5. Qué errores o excepciones produce..." | "Toda función generada por el agente DEBE poder explicarla el estudiante: Qué hace, Por qué existe, Qué recibe, Qué devuelve, Qué errores produce." | Mandato pedagógico y académico invariable. |

 Idénticas: 5 reglas.
 Adaptadas en redacción: 7 reglas
 Reemplazadas: 0 reglas. Ningún principio arquitectónico fue eliminado ni sustituido.


 3. Modificaciones a la Especificación (spec.md)

Respuesta: No se tuvo que modificar ningún enunciado de la especificación para implementar el proyecto en React.

 ¿Qué permitió reutilizar la spec.md sin cambios?

1. Separación estricta entre el QUÉ y el CÓMO  

2. Requisitos Funcionales Desacoplados

3. Escenarios en formato Given-When-Then

 4. Comparación de los Seis Casos de Aceptación (Flutter vs. React)

A continuación se contrastan los seis escenarios de aceptación definidos en la especificación y verificados en ambas plataformas:

| # | Escenario | Entradas | Modo Redondeo | Salida Esperada en Flutter (`test/widget/pantalla_divisor_test.dart`) | Salida Esperada en React (`test/pantalla.test.jsx`) | ¿Hubo Cambio? |
| 1 | Reparto con propina | Monto: 100.00 Personas: 4 Propina: 10% | Exacto | Cuota: 27.50 | Cuota: 27.50 | NO |

| 2 | Reparto sin propina | Monto: 90.00 Personas: 3 Propina: 0% | Exacto | Cuota: 30.00 | Cuota: 30.00 | NO |

| 3 | Decimal periódico | Monto: 10.00 Personas: 3 Propina: 0% | Exacto | Cuota: 3.33 | Cuota: 3.33 | NO |

| 4 | Error: personas cero | Monto: 50.00 Personas: 0 | Exacto | Error: Debe haber al menos una persona Resultado: Oculto (findsNothing) | Error: Debe haber al menos una persona Resultado: Oculto (not.toBeInTheDocument()) | NO |

| 5 | Error: monto alfabético | Monto: abc Personas: 2 | Exacto | Error: Monto inválido Resultado: Oculto (findsNothing) | Error: Monto inválido Resultado: Oculto (not.toBeInTheDocument()) | NO |

| 6 | Redondeo al entero | Monto: 10.00 Personas: 3 Propina: 0% | Hacia arriba | Cuota: 4.00 | Cuota: 4.00 | NO |

Conclusión
Ningún valor esperado, mensaje de error ni comportamiento de escenario cambió.

 5. Partes del Plan de Flutter que Dejaron de Tener Sentido en React

 Ejemplo 1: El Controlador OOP con ChangeNotifier (DivisorController)
 En Flutter: El plan requería diseñar una clase DivisorController en lib/presentation/controllers/ que extendía de ChangeNotifier o exponía ValueNotifier, acoplada al ciclo de vida de los widgets y al widget ListenableBuilder.

 Por qué dejó de tener sentido en React: En React funcional moderno no se instancian clases controladoras para pantallas individuales; el estado local y su ciclo de vida se gestionan idiomáticamente con hooks.

 Cómo se adaptó: Se reemplazó por el custom hook useDivisor.js en src/presentation/. 

 Ejemplo 2: Jerarquía de Clases Abstractas (abstract class EstrategiaRedondeo)
 En Flutter: En Dart, para aplicar OCP y LSP se requería definir explícitamente una clase abstracta y hacer que RedondeoExacto y RedondeoHaciaArriba implementaran dicha clase con implements.

 Por qué dejó de tener sentido en React:  JavaScript estándar no posee interfaces formales ni clases abstractas en tiempo de ejecución. Forzar una clase abstracta en JS genera código artificial y poco idiomático.

 Cómo se adaptó: En src/domain/estrategiaRedondeo.js se documentó el contrato funcional mediante JSDoc y duck typing


 6. Artefacto Más Reusable y Menos Reusable

 Artefacto MÁS Reusable: spec.md (specs/001-dividir-cuenta/spec.md)
 Nivel de Reutilización: 100 %
 Justificación y Evidencia del Repositorio:
 El comando git diff --no-index entre ambas versiones de spec.md arroja **0 líneas modificadas
   git diff --no-index -- "..\divisor_cuenta\specs\001-dividir-cuenta\spec.md" ".\specs\001-dividir-cuenta\spec.md"
    # Salida: (vacía, código de retorno 0)
  
Contiene exclusivamente historias de usuario, reglas de negocio, validaciones y criterios de aceptación funcionales. Al no haber sido contaminado con detalles de implementación del framework, sirvió como contrato inmutable para ambas aplicaciones.

 Artefacto MENOS Reusable: tasks.md (specs/001-dividir-cuenta/tasks.md)
 Nivel de Reutilización: Menor al 25 %
 Justificación y Evidencia del Repositorio:
 Al ejecutar el git diff --stat entre los archivos tasks.md:
    git diff --no-index --stat -- "..\divisor_cuenta\specs\001-dividir-cuenta\tasks.md" ".\specs\001-dividir-cuenta\tasks.md"
    # Salida: 144 modificaciones (99 adiciones, 45 eliminaciones)

tasks.md es la descomposición del CÓMO técnico ejecutable paso a paso. Las tareas de Flutter involucraban comandos como flutter pub get, configuración de pubspec.yaml, creación de clases en lib/ y ejecución de flutter test. En React, debieron reemplazarse por la inicialización con package.json, configuración de Vite y Vitest, creación de módulos funcionales .jsx en src/, npm test


7. Salidas de terminal

Salida de npm test:

> divisor_cuenta_web@0.0.0 test
> vitest run

 RUN  v5.0.3 C:/Proyectos flutter/Repo-Samuel/divisor_cuenta_web

 ✓ test/unit/domain/validarEntrada.test.js (11 tests) 31ms
 ✓ test/unit/data/redondeoExacto.test.js (6 tests) 24ms
 ✓ test/unit/domain/entidades.test.js (8 tests) 36ms
 ✓ test/division.test.js (7 tests) 25ms
 ✓ test/unit/domain/calcularDivision.test.js (5 tests) 46ms
 ✓ test/unit/presentation/useDivisor.test.js (6 tests) 161ms
 ✓ test/unit/presentation/formateadorMoneda.test.js (6 tests) 19ms
 ✓ test/unit/data/redondeoHaciaArriba.test.js (6 tests) 17ms
 ✓ test/pantalla.test.jsx (3 tests) 1248ms
   ✓ PantallaDivisor - Pruebas de UI con Testing Library (3)
     ✓ Ingreso 100, 4 y 10, hago clic en "Calcular" y aparece "27.50" en pantalla 1031ms
 ✓ test/component/PantallaDivisor.test.jsx (7 tests) 1607ms
   ✓ Componente: PantallaDivisor (6 Escenarios de Aceptación de la Spec) (7)
     ✓ Escenario 1: Monto 100.00, 4 personas, 10% propina, exacto -> muestra "27.50" 779ms

 Test Files  10 passed (10)
      Tests  65 passed (65)
   Start at  15:28:40
   Duration  7.55s (environment 63%, setup 20%, transform 7%, tests 6%, import 3%, worker 2%)


Salida de npm run build:

> divisor_cuenta_web@0.0.0 build
> vite build

vite v8.3.4 building client environment for production...
transforming...
✓ 25 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.46 kB │ gzip:  0.30 kB
dist/assets/index-nqMpL4T3.css    1.78 kB │ gzip:  0.81 kB
dist/assets/index-QITC1TAy.js   229.51 kB │ gzip: 71.36 kB

✓ built in 396ms


Salida de git diff --no-index entre specs:

git diff --no-index -- "..\divisor_cuenta\specs\001-dividir-cuenta\spec.md" ".\specs\001-dividir-cuenta\spec.md"
(Salida vacía, código de retorno 0, archivos idénticos)


Salida de git grep react en dominio:

git grep "from 'react'" -- src/domain/
(Salida vacía, código de retorno 1, sin importaciones de React en el dominio)