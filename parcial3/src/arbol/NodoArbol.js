export class NodoArbol {
  constructor(nombre) {
    this.nombre = nombre
    this.hijos = []
  }

  agregarHijo(nombre) {
    const nuevoHijo = new NodoArbol(nombre)
    this.hijos.push(nuevoHijo)
    return nuevoHijo
  }

  obtenerAltura() {
    if (this.hijos.length === 0) {
      return 1
    }

    const alturasHijos = this.hijos.map((hijo) => hijo.obtenerAltura())
    return 1 + Math.max(...alturasHijos)
  }

  contarNodos() {
    let total = 1 // Contar este nodo

    for (const hijo of this.hijos) {
      total += hijo.contarNodos()
    }

    return total
  }

  obtenerTodosLosNodos() {
    // Comenzamos con el nombre de este nodo
    let nodos = [this.nombre]

    // Agregamos recursivamente los nombres de todos los hijos
    for (const hijo of this.hijos) {
      const nodosHijo = hijo.obtenerTodosLosNodos()
      nodos = [...nodos, ...nodosHijo]
    }

    return nodos
  }

  // Convertir a formato compatible con react-d3-tree
  aFormatoD3() {
    return {
      name: this.nombre,
      children: this.hijos.map((hijo) => hijo.aFormatoD3()),
    }
  }

  // Función estática para reconstruir un NodoArbol desde datos JSON
  static fromJSON(data) {
    const nodo = new NodoArbol(data.nombre)
    if (data.hijos && Array.isArray(data.hijos)) {
      nodo.hijos = data.hijos.map((hijoData) => NodoArbol.fromJSON(hijoData))
    }
    return nodo
  }
}
