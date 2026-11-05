"""Servidor MCP "detective": expone casos de incidentes de seguridad por stdio.

La lógica vive en funciones puras (prefijo ``_logica``) que reciben los datos
como parámetros, para poder probarlas con pytest sin levantar el servidor.
"""

from __future__ import annotations

import copy
import json
from pathlib import Path

from mcp.server import MCPServer

RUTA_CASOS = Path(__file__).resolve().parent / "casos.json"
NIVELES_VALIDOS = ("bajo", "medio", "alto")


# ---------------------------------------------------------------------------
# Lógica (sin dependencias de MCP)
# ---------------------------------------------------------------------------

def cargar_casos(ruta: Path = RUTA_CASOS) -> dict[str, dict]:
    """Lee el archivo JSON de casos y devuelve el diccionario completo."""
    with open(ruta, encoding="utf-8") as archivo:
        return json.load(archivo)


def logica_listar_casos(casos: dict[str, dict]) -> list[dict]:
    """Devuelve id, sistema y cantidad de eventos de cada caso, sin conclusiones."""
    return [
        {
            "id": caso_id,
            "sistema": datos["sistema"],
            "cantidad_eventos": len(datos["eventos"]),
        }
        for caso_id, datos in casos.items()
    ]


def _validar_caso_existe(casos: dict[str, dict], caso_id: str) -> None:
    """Lanza ValueError si el caso no existe."""
    if not isinstance(caso_id, str) or caso_id not in casos:
        disponibles = ", ".join(sorted(casos))
        raise ValueError(
            f"El caso '{caso_id}' no existe. Casos disponibles: {disponibles}."
        )


def logica_consultar_eventos(casos: dict[str, dict], caso_id: str) -> list[dict]:
    """Devuelve una copia de los eventos exactos del caso indicado."""
    _validar_caso_existe(casos, caso_id)
    return copy.deepcopy(casos[caso_id]["eventos"])


def logica_registrar_alerta(
    casos: dict[str, dict],
    alertas: dict[str, dict],
    caso_id: str,
    nivel: str,
    motivo: str,
) -> dict:
    """Valida y guarda una alerta en ``alertas`` (una por caso)."""
    _validar_caso_existe(casos, caso_id)

    if not isinstance(nivel, str) or nivel not in NIVELES_VALIDOS:
        raise ValueError(
            f"Nivel inválido: '{nivel}'. Debe ser uno de: {', '.join(NIVELES_VALIDOS)}."
        )

    if not isinstance(motivo, str) or not motivo.strip():
        raise ValueError("El motivo no puede estar vacío ni contener solo espacios.")

    if caso_id in alertas:
        raise ValueError(
            f"Ya existe una alerta registrada para el caso '{caso_id}'; no se admiten duplicados."
        )

    alerta = {
        "caso_id": caso_id,
        "nivel": nivel,
        "motivo": motivo,
        "estado": "registrada",
    }
    alertas[caso_id] = alerta
    return dict(alerta)


# ---------------------------------------------------------------------------
# Estado del servidor y tools MCP
# ---------------------------------------------------------------------------

CASOS: dict[str, dict] = cargar_casos()
ALERTAS: dict[str, dict] = {}

mcp = MCPServer("mcp-detective")


@mcp.tool()
def listar_casos() -> list[dict]:
    """Lista los casos disponibles con su id, sistema y cantidad de eventos.

    No incluye conclusiones ni interpretaciones sobre los casos.
    """
    return logica_listar_casos(CASOS)


@mcp.tool()
def consultar_eventos(caso_id: str) -> list[dict]:
    """Devuelve los eventos exactos registrados para un caso.

    Args:
        caso_id: Identificador del caso, por ejemplo "INC-001".

    Raises:
        ValueError: Si el caso no existe.
    """
    return logica_consultar_eventos(CASOS, caso_id)


@mcp.tool()
def registrar_alerta(caso_id: str, nivel: str, motivo: str) -> dict:
    """Registra en memoria una alerta para un caso existente.

    Args:
        caso_id: Identificador de un caso existente.
        nivel: Nivel de la alerta: "bajo", "medio" o "alto".
        motivo: Justificación de la alerta; no puede estar vacía ni ser solo espacios.

    Returns:
        Diccionario con caso_id, nivel, motivo y estado "registrada".

    Raises:
        ValueError: Si el caso no existe, el nivel es inválido, el motivo está
            vacío o ya hay una alerta registrada para ese caso.
    """
    return logica_registrar_alerta(CASOS, ALERTAS, caso_id, nivel, motivo)


if __name__ == "__main__":
    mcp.run(transport="stdio")
