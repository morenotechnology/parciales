"use client"

import { usarContextoCiudades } from "../contexto/ContextoCiudades.jsx"

const Notificaciones = () => {
  const { estado, dispatch } = usarContextoCiudades()

  const cerrarNotificacion = (id) => {
    dispatch({
      type: "LIMPIAR_NOTIFICACION",
      payload: { id },
    })
  }

  if (estado.notificaciones.length === 0) {
    return null
  }

  return (
    <div className="contenedor-notificaciones">
      {estado.notificaciones.map((notificacion) => (
        <div key={notificacion.id} className={`notificacion notificacion-${notificacion.tipo}`}>
          <span className="mensaje-notificacion">{notificacion.mensaje}</span>
          <button className="btn-cerrar-notificacion" onClick={() => cerrarNotificacion(notificacion.id)}>
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}

export default Notificaciones
