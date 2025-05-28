"use client"

import { useState } from "react"
import { usarContextoCiudades } from "../contexto/ContextoCiudades.jsx"
import VistaArbolD3 from "./VistaArbolD3.jsx"
import FormularioZonaVerde from "./FormularioZonaVerde.jsx"

const ZonasCiudad = () => {
  const { estado, dispatch } = usarContextoCiudades()
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  const ciudades = Object.keys(estado.grafo.ciudades)
  const ciudadActual = estado.ciudadSeleccionada || ciudades[0]

  const seleccionarCiudad = (nombreCiudad) => {
    dispatch({
      type: "SELECCIONAR_CIUDAD",
      payload: { nombre: nombreCiudad },
    })
  }

  const obtenerMetricas = (nombreCiudad) => {
    if (!nombreCiudad) return { altura: 0, total: 0 }

    return {
      altura: estado.grafo.obtenerAlturaMáximaZonasVerdes(nombreCiudad),
      total: estado.grafo.obtenerTotalZonasVerdes(nombreCiudad),
    }
  }

  if (ciudades.length === 0) {
    return (
      <div className="zonas-ciudad-vacio">
        <p>No hay ciudades disponibles. Agrega una ciudad primero.</p>
      </div>
    )
  }

  const metricas = obtenerMetricas(ciudadActual)

  return (
    <div className="zonas-ciudad">
      <div className="selector-ciudad">
        <label htmlFor="selectCiudad">Seleccionar Ciudad:</label>
        <select id="selectCiudad" value={ciudadActual || ""} onChange={(e) => seleccionarCiudad(e.target.value)}>
          {ciudades.map((ciudad) => (
            <option key={ciudad} value={ciudad}>
              {ciudad}
            </option>
          ))}
        </select>

        <button className="btn-agregar-zona" onClick={() => setMostrarFormulario(true)} disabled={!ciudadActual}>
          + Agregar Zona Verde
        </button>
      </div>

      {ciudadActual && (
        <>
          <div className="metricas-ciudad">
            <div className="metrica">
              <span className="etiqueta">Altura Máxima del Árbol:</span>
              <span className="valor">{metricas.altura}</span>
            </div>
            <div className="metrica">
              <span className="etiqueta">Total de Zonas Verdes:</span>
              <span className="valor">{metricas.total}</span>
            </div>
          </div>

          <div className="contenedor-arbol">
            <h3>Árbol de Zonas Verdes - {ciudadActual}</h3>
            <VistaArbolD3 datosArbol={estado.grafo.obtenerZonasVerdes(ciudadActual)} />
          </div>
        </>
      )}

      {mostrarFormulario && ciudadActual && (
        <FormularioZonaVerde ciudadSeleccionada={ciudadActual} onCerrar={() => setMostrarFormulario(false)} />
      )}
    </div>
  )
}

export default ZonasCiudad
