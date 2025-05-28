"use client"

import { useRef } from "react"
import Tree from "react-d3-tree"

const VistaArbolD3 = ({ datosArbol }) => {
  const contenedorRef = useRef(null)

  if (!datosArbol) {
    return <div className="arbol-vacio">No hay datos del árbol disponibles</div>
  }

  const datosD3 = datosArbol.aFormatoD3()

  // Configuración del árbol
  const configuracionArbol = {
    translate: { x: 200, y: 100 },
    orientation: "vertical",
    pathFunc: "diagonal",
    separation: { siblings: 1.5, nonSiblings: 2 },
    nodeSize: { x: 150, y: 100 },
    zoom: 0.8,
  }

  // Estilo personalizado para los nodos
  const renderNodoPersonalizado = ({ nodeDatum, toggleNode }) => (
    <g>
      <circle
        r={20}
        fill={nodeDatum.name === "Raíz" ? "#4CAF50" : "#81C784"}
        stroke="#2E7D32"
        strokeWidth={2}
        onClick={toggleNode}
        style={{ cursor: "pointer" }}
      />
      <text fill="#000" strokeWidth="0" x={0} y={-30} textAnchor="middle" fontSize="12" fontWeight="bold">
        {nodeDatum.name}
      </text>
      {nodeDatum.children && (
        <text fill="#666" strokeWidth="0" x={0} y={35} textAnchor="middle" fontSize="10">
          {nodeDatum.children.length} zona{nodeDatum.children.length !== 1 ? "s" : ""}
        </text>
      )}
    </g>
  )

  return (
    <div className="vista-arbol-d3" ref={contenedorRef}>
      <div style={{ width: "100%", height: "400px" }}>
        <Tree
          data={datosD3}
          {...configuracionArbol}
          renderCustomNodeElement={renderNodoPersonalizado}
          enableLegacyTransitions={true}
          transitionDuration={500}
        />
      </div>
    </div>
  )
}

export default VistaArbolD3
