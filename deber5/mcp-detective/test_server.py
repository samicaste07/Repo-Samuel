"""Pruebas de la lógica del servidor MCP "detective".

Se prueban las funciones ``logica_*`` que llaman las tools. Cada prueba recibe
un almacén de alertas nuevo (fixture ``alertas``), así no dependen del orden.
"""

import pytest

from server import (
    cargar_casos,
    logica_consultar_eventos,
    logica_listar_casos,
    logica_registrar_alerta,
)


@pytest.fixture
def casos():
    return cargar_casos()


@pytest.fixture
def alertas():
    return {}


def test_listar_casos_devuelve_exactamente_los_tres_casos(casos):
    resultado = logica_listar_casos(casos)

    assert [c["id"] for c in resultado] == ["INC-001", "INC-002", "INC-003"]
    assert {c["id"]: c["cantidad_eventos"] for c in resultado} == {
        "INC-001": 2,
        "INC-002": 6,
        "INC-003": 5,
    }


def test_consultar_eventos_inc_002_tiene_seis_fallos_de_admin(casos):
    eventos = logica_consultar_eventos(casos, "INC-002")

    assert len(eventos) == 6
    assert all(e["evento"] == "LOGIN_FAILED" for e in eventos)
    assert all(e["usuario"] == "admin" for e in eventos)


def test_consultar_eventos_caso_inexistente_lanza_error(casos):
    with pytest.raises(ValueError, match="INC-999"):
        logica_consultar_eventos(casos, "INC-999")


def test_registrar_alerta_valida(casos, alertas):
    motivo = "Cuatro fallos y un acceso exitoso desde la misma IP; requiere investigación"

    alerta = logica_registrar_alerta(casos, alertas, "INC-003", "alto", motivo)

    assert alerta == {
        "caso_id": "INC-003",
        "nivel": "alto",
        "motivo": motivo,
        "estado": "registrada",
    }
    assert "INC-003" in alertas


def test_registrar_alerta_duplicada_se_rechaza(casos, alertas):
    logica_registrar_alerta(casos, alertas, "INC-003", "alto", "Primer registro")

    with pytest.raises(ValueError, match="duplicad"):
        logica_registrar_alerta(casos, alertas, "INC-003", "alto", "Segundo registro")

    assert len(alertas) == 1


def test_registrar_alerta_nivel_invalido(casos, alertas):
    with pytest.raises(ValueError, match="bajo, medio, alto"):
        logica_registrar_alerta(casos, alertas, "INC-002", "critico", "Intentos repetidos")

    assert alertas == {}


def test_registrar_alerta_motivo_en_blanco(casos, alertas):
    with pytest.raises(ValueError, match="motivo"):
        logica_registrar_alerta(casos, alertas, "INC-002", "medio", "   ")

    assert alertas == {}
