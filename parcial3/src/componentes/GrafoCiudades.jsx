"use client"

import React, { useState, useCallback } from "react"
import { usarContextoCiudades } from "../contexto/ContextoCiudades.jsx"
import FormularioCiudad from "./FormularioCiudad.jsx"
import Notificaciones from "./Notificaciones.jsx"

const GrafoCiudades = () => {
  const { estado, dispatch } = usarContextoCiudades()
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [posicionesCiudades, setPosicionesCiudades] = useState({})

  const ciudades = Object.keys(estado.grafo.ciudades)

  // Generar posiciones iniciales solo cuando se agregan nuevas ciudades
  const generarPosicionesIniciales = useCallback(() => {
    const nuevasPosiciones = { ...posicionesCiudades }
    let hayNuevasCiudades = false

    ciudades.forEach((ciudad, index) => {
      if (!nuevasPosiciones[ciudad]) {
        const angulo = (index * 2 * Math.PI) / Math.max(ciudades.length, 1)
        const radio = Math.min(150, 50 + ciudades.length * 10)
        nuevasPosiciones[ciudad] = {
          x: 300 + radio * Math.cos(angulo),
          y: 200 + radio * Math.sin(angulo),
        }
        hayNuevasCiudades = true
      }
    })

    // Remover posiciones de ciudades eliminadas
    Object.keys(nuevasPosiciones).forEach((ciudad) => {
      if (!ciudades.includes(ciudad)) {
        delete nuevasPosiciones[ciudad]
        hayNuevasCiudades = true
      }
    })

    if (hayNuevasCiudades) {
      setPosicionesCiudades(nuevasPosiciones)
    }
  }, [ciudades, posicionesCiudades])

  // Solo ejecutar cuando cambie la lista de ciudades
  React.useEffect(() => {
    generarPosicionesIniciales()
  }, [ciudades.length, ciudades.join(",")]) // Dependencias específicas para evitar loops

  const eliminarCiudad = useCallback(
    (nombreCiudad) => {
      if (window.confirm(`¿Estás seguro de que quieres eliminar la ciudad "${nombreCiudad}"?`)) {
        dispatch({
          type: "ELIMINAR_CIUDAD",
          payload: { nombre: nombreCiudad },
        })
      }
    },
    [dispatch],
  )

  const seleccionarCiudad = useCallback(
    (nombreCiudad) => {
      dispatch({
        type: "SELECCIONAR_CIUDAD",
        payload: { nombre: nombreCiudad },
      })
    },
    [dispatch],
  )

  const actualizarPosicion = useCallback((nombreCiudad, nuevaX, nuevaY) => {
    setPosicionesCiudades((prev) => ({
      ...prev,
      [nombreCiudad]: { x: nuevaX, y: nuevaY },
    }))
  }, [])

  const manejarMouseDown = useCallback(
    (nombreCiudad, evento) => {
      evento.preventDefault()
      const svg = evento.currentTarget.closest("svg")
      const rect = svg.getBoundingClientRect()

      const manejarMouseMove = (e) => {
        const nuevaX = e.clientX - rect.left
        const nuevaY = e.clientY - rect.top
        actualizarPosicion(nombreCiudad, nuevaX, nuevaY)
      }

      const manejarMouseUp = () => {
        document.removeEventListener("mousemove", manejarMouseMove)
        document.removeEventListener("mouseup", manejarMouseUp)
      }

      document.addEventListener("mousemove", manejarMouseMove)
      document.addEventListener("mouseup", manejarMouseUp)
    },
    [actualizarPosicion],
  )

  const conectarCiudades = useCallback(
    (ciudad1, ciudad2) => {
      if (ciudad1 !== ciudad2) {
        dispatch({
          type: "CONECTAR_CIUDADES",
          payload: {
            origen: ciudad1,
            destino: ciudad2,
          },
        })
      }
    },
    [dispatch],
  )

  const manejarConexion = useCallback(() => {
    const ciudad1 = document.getElementById("ciudad1")?.value
    const ciudad2 = document.getElementById("ciudad2")?.value
    if (ciudad1 && ciudad2 && ciudad1 !== ciudad2) {
      conectarCiudades(ciudad1, ciudad2)
      document.getElementById("ciudad1").value = ""
      document.getElementById("ciudad2").value = ""
    }
  }, [conectarCiudades])

  return (
    <div className="grafo-ciudades">
      <div className="controles-grafo">
        <button className="btn-agregar-ciudad" onClick={() => setMostrarFormulario(true)}>
          + Agregar Ciudad
        </button>

        <div className="info-grafo">
          <span>Ciudades: {ciudades.length}</span>
          <span>Conexiones: {estado.grafo.conexiones.length}</span>
        </div>
      </div>

      <div className="contenedor-grafo-svg">
        <svg width="600" height="400" className="grafo-svg">
          {/* Renderizar conexiones */}
          {estado.grafo.conexiones.map((conexion, index) => {
            const pos1 = posicionesCiudades[conexion.origen]
            const pos2 = posicionesCiudades[conexion.destino]

            if (!pos1 || !pos2) return null

            return (
              <line
                key={`conexion-${index}`}
                x1={pos1.x}
                y1={pos1.y}
                x2={pos2.x}
                y2={pos2.y}
                stroke="#3498db"
                strokeWidth="2"
                className="conexion-linea"
              />
            )
          })}

          {/* Renderizar ciudades */}
          {ciudades.map((ciudad) => {
            const posicion = posicionesCiudades[ciudad]
            if (!posicion) return null

            const metricas = {
              altura: estado.grafo.obtenerAlturaMáximaZonasVerdes(ciudad),
              total: estado.grafo.obtenerTotalZonasVerdes(ciudad),
            }

            return (
              <g key={ciudad} className="nodo-ciudad-grupo">
                {/* Círculo de la ciudad */}
                <circle
                  cx={posicion.x}
                  cy={posicion.y}
                  r="40"
                  fill={estado.ciudadSeleccionada === ciudad ? "#e74c3c" : "#3498db"}
                  stroke="#2c3e50"
                  strokeWidth="3"
                  className="nodo-ciudad-circulo"
                  onClick={() => seleccionarCiudad(ciudad)}
                  onMouseDown={(e) => manejarMouseDown(ciudad, e)}
                  style={{ cursor: "pointer" }}
                />

                {/* Nombre de la ciudad */}
                <text
                  x={posicion.x}
                  y={posicion.y - 5}
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                  className="nombre-ciudad-texto"
                  onClick={() => seleccionarCiudad(ciudad)}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  {ciudad}
                </text>

                {/* Métricas */}
                <text
                  x={posicion.x}
                  y={posicion.y + 8}
                  textAnchor="middle"
                  fill="white"
                  fontSize="10"
                  className="metricas-ciudad-texto"
                  style={{ userSelect: "none" }}
                >
                  A:{metricas.altura} Z:{metricas.total}
                </text>

                {/* Botón eliminar */}
                <circle
                  cx={posicion.x + 30}
                  cy={posicion.y - 30}
                  r="12"
                  fill="#e74c3c"
                  stroke="white"
                  strokeWidth="2"
                  className="btn-eliminar-circulo"
                  onClick={(e) => {
                    e.stopPropagation()
                    eliminarCiudad(ciudad)
                  }}
                  style={{ cursor: "pointer" }}
                />
                <text
                  x={posicion.x + 30}
                  y={posicion.y - 26}
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                  onClick={(e) => {
                    e.stopPropagation()
                    eliminarCiudad(ciudad)
                  }}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  ✕
                </text>
              </g>
            )
          })}
        </svg>

        {/* Panel de conexiones */}
        <div className="panel-conexiones">
          <h4>Conectar Ciudades</h4>
          <div className="selector-conexiones">
            {ciudades.length >= 2 && (
              <div className="formulario-conexion">
                <select id="ciudad1" className="select-ciudad">
                  <option value="">Seleccionar ciudad 1...</option>
                  {ciudades.map((ciudad) => (
                    <option key={ciudad} value={ciudad}>
                      {ciudad}
                    </option>
                  ))}
                </select>
                <select id="ciudad2" className="select-ciudad">
                  <option value="">Seleccionar ciudad 2...</option>
                  {ciudades.map((ciudad) => (
                    <option key={ciudad} value={ciudad}>
                      {ciudad}
                    </option>
                  ))}
                </select>
                <button className="btn-conectar" onClick={manejarConexion}>
                  Conectar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Instrucciones */}
      <div className="instrucciones-grafo">
        <p>
          <strong>Instrucciones:</strong>
        </p>
        <ul>
          <li>Haz clic en una ciudad para seleccionarla</li>
          <li>Arrastra las ciudades para reorganizar el grafo</li>
          <li>Usa los selectores para conectar ciudades</li>
          <li>Haz clic en ✕ para eliminar una ciudad</li>
        </ul>
      </div>

      {mostrarFormulario && <FormularioCiudad onCerrar={() => setMostrarFormulario(false)} />}

      <Notificaciones />
    </div>
  )
}

export default GrafoCiudades
