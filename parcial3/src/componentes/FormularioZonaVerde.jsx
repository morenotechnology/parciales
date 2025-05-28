"use client"

import { useState } from "react"
import { usarContextoCiudades } from "../contexto/ContextoCiudades.jsx"

const FormularioZonaVerde = ({ ciudadSeleccionada, onCerrar }) => {
  const { estado, dispatch } = usarContextoCiudades()
  const [nombreZona, setNombreZona] = useState("")
  const [zonaPadre, setZonaPadre] = useState("")
  const [error, setError] = useState("")

  // Obtener todas las zonas disponibles para seleccionar como padre
  const obtenerZonasDisponibles = () => {
    const arbolZonas = estado.grafo.obtenerZonasVerdes(ciudadSeleccionada)
    if (!arbolZonas) return []

    return arbolZonas.obtenerTodosLosNodos()
  }

  const zonasDisponibles = obtenerZonasDisponibles()

  const manejarEnvio = (e) => {
    e.preventDefault()

    // Validaciones
    if (!nombreZona.trim()) {
      setError("El nombre de la zona verde no puede estar vacío")
      return
    }

    // Verificar que no exista una zona con el mismo nombre
    if (zonasDisponibles.includes(nombreZona.trim())) {
      setError("Ya existe una zona verde con ese nombre en esta ciudad")
      return
    }

    // Agregar zona verde
    try {
      dispatch({
        type: "AGREGAR_ZONA_VERDE",
        payload: {
          ciudad: ciudadSeleccionada,
          zona: nombreZona.trim(),
          padre: zonaPadre || null,
        },
      })
      onCerrar()
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-contenido">
        <div className="modal-header">
          <h3>Agregar Zona Verde a {ciudadSeleccionada}</h3>
          <button className="btn-cerrar" onClick={onCerrar}>
            ✕
          </button>
        </div>

        <form onSubmit={manejarEnvio} className="formulario-zona">
          <div className="campo-formulario">
            <label htmlFor="nombreZona">Nombre de la Zona Verde:</label>
            <input
              type="text"
              id="nombreZona"
              value={nombreZona}
              onChange={(e) => {
                setNombreZona(e.target.value)
                setError("")
              }}
              placeholder="Ej: Parque Central, Jardín Botánico"
              autoFocus
            />
          </div>

          <div className="campo-formulario">
            <label htmlFor="zonaPadre">Zona Padre (opcional):</label>
            <select id="zonaPadre" value={zonaPadre} onChange={(e) => setZonaPadre(e.target.value)}>
              <option value="">Seleccionar zona padre...</option>
              {zonasDisponibles.map((zona) => (
                <option key={zona} value={zona}>
                  {zona}
                </option>
              ))}
            </select>
            <small className="ayuda-texto">Si no seleccionas una zona padre, se agregará como zona principal</small>
          </div>

          {error && <div className="error-mensaje">{error}</div>}

          <div className="botones-formulario">
            <button type="button" onClick={onCerrar} className="btn-cancelar">
              Cancelar
            </button>
            <button type="submit" className="btn-agregar">
              Agregar Zona Verde
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormularioZonaVerde
