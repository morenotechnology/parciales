import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Gallery from './gallery.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <div> <Gallery /></div>
  </StrictMode>
)
