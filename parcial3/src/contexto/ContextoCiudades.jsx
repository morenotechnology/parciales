"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import { Grafo } from "../grafo/Grafo.js"
import { NodoArbol } from "../arbol/NodoArbol.js"

const ContextoCiudades = createContext()

const estadoInicial = {
  grafo: new Grafo(),
  ciudadSeleccionada: null,
  notificaciones: [],
}

function reductorCiudades(estado, accion) {
  switch (accion.type) {
    case "CARGAR_DATOS":
      return {
        ...estado,
        grafo: accion.payload,
      }

    case "AGREGAR_CIUDAD":
      const nuevoGrafo = new Grafo()
      // Copiar ciudades existentes
      Object.keys(estado.grafo.ciudades).forEach((nombre) => {
        nuevoGrafo.agregarCiudad(nombre, estado.grafo.ciudades[nombre].zonasVerdes)
      })
      // Copiar conexiones
      estado.grafo.conexiones.forEach((conexion) => {
        nuevoGrafo.conectarCiudades(conexion.origen, conexion.destino)
      })
      // Agregar nueva ciudad
      nuevoGrafo.agregarCiudad(accion.payload.nombre)

      return {
        ...estado,
        grafo: nuevoGrafo,
        notificaciones: [
          ...estado.notificaciones,
          {
            id: Date.now(),
            mensaje: `Ciudad "${accion.payload.nombre}" agregada exitosamente`,
            tipo: "exito",
          },
        ],
      }

    case "ELIMINAR_CIUDAD":
      const grafoSinCiudad = new Grafo()
      // Copiar todas las ciudades excepto la eliminada
      Object.keys(estado.grafo.ciudades).forEach((nombre) => {
        if (nombre !== accion.payload.nombre) {
          grafoSinCiudad.agregarCiudad(nombre, estado.grafo.ciudades[nombre].zonasVerdes)
        }
      })
      // Copiar conexiones que no involucren la ciudad eliminada
      estado.grafo.conexiones.forEach((conexion) => {
        if (conexion.origen !== accion.payload.nombre && conexion.destino !== accion.payload.nombre) {
          grafoSinCiudad.conectarCiudades(conexion.origen, conexion.destino)
        }
      })

      return {
        ...estado,
        grafo: grafoSinCiudad,
        ciudadSeleccionada: estado.ciudadSeleccionada === accion.payload.nombre ? null : estado.ciudadSeleccionada,
        notificaciones: [
          ...estado.notificaciones,
          {
            id: Date.now(),
            mensaje: `Ciudad "${accion.payload.nombre}" eliminada exitosamente`,
            tipo: "advertencia",
          },
        ],
      }

    case "CONECTAR_CIUDADES":
      const grafoConConexion = new Grafo()
      // Copiar ciudades existentes
      Object.keys(estado.grafo.ciudades).forEach((nombre) => {
        grafoConConexion.agregarCiudad(nombre, estado.grafo.ciudades[nombre].zonasVerdes)
      })
      // Copiar conexiones existentes
      estado.grafo.conexiones.forEach((conexion) => {
        grafoConConexion.conectarCiudades(conexion.origen, conexion.destino)
      })
      // Agregar nueva conexión
      grafoConConexion.conectarCiudades(accion.payload.origen, accion.payload.destino)

      return {
        ...estado,
        grafo: grafoConConexion,
      }

    case "AGREGAR_ZONA_VERDE":
      try {
        const grafoConZona = new Grafo()
        // Copiar ciudades existentes con clonación correcta de zonas verdes
        Object.keys(estado.grafo.ciudades).forEach((nombre) => {
          const ciudadOriginal = estado.grafo.ciudades[nombre]
          const zonasVerdesClonadas = grafoConZona.clonarArbolZonas(ciudadOriginal.zonasVerdes)
          grafoConZona.agregarCiudad(nombre, zonasVerdesClonadas)
        })
        // Copiar conexiones
        estado.grafo.conexiones.forEach((conexion) => {
          grafoConZona.conectarCiudades(conexion.origen, conexion.destino)
        })
        // Agregar zona verde
        grafoConZona.agregarZonaVerde(accion.payload.ciudad, accion.payload.zona, accion.payload.padre)

        return {
          ...estado,
          grafo: grafoConZona,
          notificaciones: [
            ...estado.notificaciones,
            {
              id: Date.now(),
              mensaje: `Zona verde "${accion.payload.zona}" agregada a ${accion.payload.ciudad}`,
              tipo: "exito",
            },
          ],
        }
      } catch (error) {
        return {
          ...estado,
          notificaciones: [
            ...estado.notificaciones,
            {
              id: Date.now(),
              mensaje: error.message,
              tipo: "error",
            },
          ],
        }
      }

    case "SELECCIONAR_CIUDAD":
      return {
        ...estado,
        ciudadSeleccionada: accion.payload.nombre,
      }

    case "LIMPIAR_NOTIFICACION":
      return {
        ...estado,
        notificaciones: estado.notificaciones.filter((n) => n.id !== accion.payload.id),
      }

    default:
      return estado
  }
}

export function ProveedorCiudades({ children }) {
  const [estado, dispatch] = useReducer(reductorCiudades, estadoInicial)

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const datosGuardados = localStorage.getItem("redCiudades")
    if (datosGuardados) {
      try {
        const datos = JSON.parse(datosGuardados)
        const grafoRecuperado = new Grafo()

        // Restaurar ciudades y zonas verdes
        Object.keys(datos.ciudades || {}).forEach((nombre) => {
          const ciudadData = datos.ciudades[nombre]
          let zonasVerdes = null

          // Reconstruir el árbol de zonas verdes si existe
          if (ciudadData.zonasVerdes) {
            zonasVerdes = NodoArbol.fromJSON(ciudadData.zonasVerdes)
          }

          grafoRecuperado.agregarCiudad(nombre, zonasVerdes)
        })

        // Restaurar conexiones
        ;(datos.conexiones || []).forEach((conexion) => {
          grafoRecuperado.conectarCiudades(conexion.origen, conexion.destino)
        })

        dispatch({ type: "CARGAR_DATOS", payload: grafoRecuperado })
      } catch (error) {
        console.error("Error al cargar datos:", error)
      }
    }
  }, [])

  // Guardar datos en localStorage cuando cambie el estado
  useEffect(() => {
    const datosParaGuardar = {
      ciudades: estado.grafo.ciudades,
      conexiones: estado.grafo.conexiones,
    }
    localStorage.setItem("redCiudades", JSON.stringify(datosParaGuardar))
  }, [estado.grafo])

  // Limpiar notificaciones automáticamente
  useEffect(() => {
    estado.notificaciones.forEach((notificacion) => {
      setTimeout(() => {
        dispatch({ type: "LIMPIAR_NOTIFICACION", payload: { id: notificacion.id } })
      }, 3000)
    })
  }, [estado.notificaciones])

  return <ContextoCiudades.Provider value={{ estado, dispatch }}>{children}</ContextoCiudades.Provider>
}

export function usarContextoCiudades() {
  const contexto = useContext(ContextoCiudades)
  if (!contexto) {
    throw new Error("usarContextoCiudades debe usarse dentro de ProveedorCiudades")
  }
  return contexto
}
