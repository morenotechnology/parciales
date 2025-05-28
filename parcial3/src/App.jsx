import { ProveedorCiudades } from "./contexto/ContextoCiudades.jsx"
import GrafoCiudades from "./componentes/GrafoCiudades.jsx"
import ZonasCiudad from "./componentes/ZonasCiudad.jsx"
import "./App.css"

function App() {
  return (
    <ProveedorCiudades>
      <div className="app">
        <header className="app-header">
          <h1>Red de Ciudades y Zonas Verdes</h1>
        </header>

        <main className="app-main">
          <div className="seccion-grafo">
            <h2>Red de Ciudades</h2>
            <GrafoCiudades />
          </div>

          <div className="seccion-zonas">
            <h2>Zonas Verdes por Ciudad</h2>
            <ZonasCiudad />
          </div>
        </main>
      </div>
    </ProveedorCiudades>
  )
}

export default App
