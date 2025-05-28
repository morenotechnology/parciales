import { NodoArbol } from "../arbol/NodoArbol.js"

export class Grafo {
  constructor() {
    this.ciudades = {}
    this.conexiones = []
  }

  agregarCiudad(nombre, zonasVerdesExistentes = null) {
    if (this.ciudades[nombre]) {
      throw new Error(`La ciudad "${nombre}" ya existe`)
    }

    this.ciudades[nombre] = {
      nombre,
      zonasVerdes: zonasVerdesExistentes || new NodoArbol("Raíz"),
    }
  }

  eliminarCiudad(nombre) {
    if (!this.ciudades[nombre]) {
      throw new Error(`La ciudad "${nombre}" no existe`)
    }

    delete this.ciudades[nombre]
    this.conexiones = this.conexiones.filter((conexion) => conexion.origen !== nombre && conexion.destino !== nombre)
  }

  conectarCiudades(origen, destino) {
    if (!this.ciudades[origen] || !this.ciudades[destino]) {
      throw new Error("Una o ambas ciudades no existen")
    }

    // Verificar si ya existe la conexión
    const conexionExiste = this.conexiones.some(
      (conexion) =>
        (conexion.origen === origen && conexion.destino === destino) ||
        (conexion.origen === destino && conexion.destino === origen),
    )

    if (!conexionExiste) {
      this.conexiones.push({ origen, destino })
    }
  }

  agregarZonaVerde(nombreCiudad, nombreZona, nombrePadre = null) {
    if (!this.ciudades[nombreCiudad]) {
      throw new Error(`La ciudad "${nombreCiudad}" no existe`)
    }

    const ciudad = this.ciudades[nombreCiudad]

    // Verificar si ya existe una zona con el mismo nombre en cualquier nivel
    const todasLasZonas = ciudad.zonasVerdes.obtenerTodosLosNodos()
    if (todasLasZonas.includes(nombreZona)) {
      throw new Error(`Ya existe una zona verde con el nombre "${nombreZona}" en esta ciudad`)
    }

    if (nombrePadre) {
      const nodoPadre = this.buscarNodoEnArbol(ciudad.zonasVerdes, nombrePadre)
      if (nodoPadre) {
        nodoPadre.agregarHijo(nombreZona)
      } else {
        throw new Error(`La zona padre "${nombrePadre}" no existe`)
      }
    } else {
      ciudad.zonasVerdes.agregarHijo(nombreZona)
    }
  }

  buscarNodoEnArbol(nodo, nombre) {
    if (nodo.nombre === nombre) {
      return nodo
    }

    for (const hijo of nodo.hijos) {
      const resultado = this.buscarNodoEnArbol(hijo, nombre)
      if (resultado) {
        return resultado
      }
    }

    return null
  }

  obtenerAlturaMáximaZonasVerdes(nombreCiudad) {
    if (!this.ciudades[nombreCiudad]) {
      return 0
    }

    return this.ciudades[nombreCiudad].zonasVerdes.obtenerAltura()
  }

  obtenerTotalZonasVerdes(nombreCiudad) {
    if (!this.ciudades[nombreCiudad]) {
      return 0
    }

    return this.ciudades[nombreCiudad].zonasVerdes.contarNodos() - 1 // -1 para excluir la raíz
  }

  obtenerCiudades() {
    return Object.keys(this.ciudades)
  }

  obtenerZonasVerdes(nombreCiudad) {
    if (!this.ciudades[nombreCiudad]) {
      return null
    }

    return this.ciudades[nombreCiudad].zonasVerdes
  }

  // Método helper para clonar un árbol de zonas verdes
  clonarArbolZonas(nodo) {
    const nuevoNodo = new NodoArbol(nodo.nombre)
    nodo.hijos.forEach((hijo) => {
      const hijoClonado = this.clonarArbolZonas(hijo)
      nuevoNodo.hijos.push(hijoClonado)
    })
    return nuevoNodo
  }
}
