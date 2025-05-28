"use client"

import { useState } from "react"
import { usarContextoCiudades } from "../contexto/ContextoCiudades.jsx"

const FormularioCiudad = ({ onCerrar }) => {
  const { estado, dispatch } = usarContextoCiudades()
  const [nombreCiudad, setNombreCiudad] = useState("")
  const [error, setError] = useState("")

  const manejarEnvio = (e) => {
    e.preventDefault()

    // Validaciones
    if (!nombreCiudad.trim()) {
      setError("El nombre de la ciudad no puede estar vacío")
      return
    }

    if (estado.grafo.ciudades[nombreCiudad]) {
      setError("Ya existe una ciudad con ese nombre")
      return
    }

    // Agregar ciudad
    try {
      dispatch({
        type: "AGREGAR_CIUDAD",
        payload: { nombre: nombreCiudad.trim() },
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
          <h3>Agregar Nueva Ciudad</h3>
          <button className="btn-cerrar" onClick={onCerrar}>
            ✕
          </button>
        </div>

        <form onSubmit={manejarEnvio} className="formulario-ciudad">
          <div className="campo-formulario">
            <label htmlFor="nombreCiudad">Nombre de la Ciudad:</label>
            <input
              type="text"
              id="nombreCiudad"
              value={nombreCiudad}
              onChange={(e) => {
                setNombreCiudad(e.target.value)
                setError("")
              }}
              placeholder="Ingresa el nombre de la ciudad"
              autoFocus
            />
            {error && <span className="error-mensaje">{error}</span>}
          </div>

          <div className="botones-formulario">
            <button type="button" onClick={onCerrar} className="btn-cancelar">
              Cancelar
            </button>
            <button type="submit" className="btn-agregar">
              Agregar Ciudad
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormularioCiudad
