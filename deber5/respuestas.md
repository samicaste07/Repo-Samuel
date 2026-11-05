
# 1. Arquitectura

LLM (Claude Opus 5.5): decidio que tool usar y con que datos, leyo los resultados y escribio el motivo de la alerta. No ejecuto codigo.

Host (Claude Code): leyo el archivo `.mcp.json`, arranco el servidor, le paso al modelo la lista de tools y me pidio permiso antes de cada llamada.

Cliente MCP: es la parte de Claude Code que habla con el servidor por stdio. Pide la lista de tools y envia cada llamada.

Servidor MCP (`server.py`): tiene las 3 tools, lee `casos.json`, valida los datos y guarda las alertas en memoria.

Quien ejecuto Python: solo el servidor. El modelo nunca ejecuto Python, solo pedia llamadas y recibia respuestas.

# 2. Evidencia (INC-003)

Por que hay que investigarlo: hubo 4 intentos fallidos y luego un acceso exitoso, todos desde la misma IP, contra la cuenta `admin` del panel de administracion y a las 3 de la madrugada. Parece un ataque de fuerza bruta.

Por que no es seguro que fue una intrusion: pudo ser el administrador real que se equivoco de clave. Los logs no dicen de quien es la IP ni que se hizo despues de entrar. Algo sospechoso no es una prueba.

# 3. Validacion y seguridad

Quien rechaza los errores: el servidor. Rechaza `INC-999`, un nivel que no sea `bajo`, `medio` o `alto`, un motivo vacio y una alerta repetida para el mismo caso.

Por que no confiar solo en el modelo: el modelo puede equivocarse, inventar un caso o poner un valor mal. Tambien cualquier cliente puede llamar al servidor directamente. Por eso el servidor tiene que validar todo.

# Agente usado

Use Claude Code en la terminal con el modelo Claude Opus 5.5.

Comprobe que estaba conectado con `/mcp`, que mostraba `detective` como connected. Ademas el agente listo las 3 tools y en la traza se ven las llamadas con sus datos y respuestas.

# Instrucciones

Desde la carpeta `deber5`:

1. Instalar:
   
   pip install "mcp[cli]==2.3.0" pytest
   
2. Correr las pruebas:
   
   pytest mcp-detective -q
   
3. Abrir el Inspector:
   
   npx @modelcontextprotocol/inspector python mcp-detective/server.py

   No use mcp dev mcp-detective/server.py porque arranca el servidor con uv, que tenia que crear un entorno nuevo y descargar dependencias, y la conexion daba timeout a los 30 segundos.

    Con npx @modelcontextprotocol/inspector python mcp-detective/server.py el Inspector usa directamente mi Python, que ya tiene el SDK mcp instalado, y se conecta sin problemas.
   
   Abrir el enlace que sale en la terminal y pulsar Connect.

4. Conectar al agente con el archivo `deber5/.mcp.json`:
   ``` json
   {
     "mcpServers": {
       "detective": {
         "type": "stdio",
         "command": "C:\\Python315\\python.exe",
         "args": ["C:\\Proyectos flutter\\Repo-Samuel\\deber5\\mcp-detective\\server.py"]
       }
     }
   }
   ```
   Luego abrir Claude Code con `claude` en la carpeta `deber5` y aprobar el servidor `detective`.


