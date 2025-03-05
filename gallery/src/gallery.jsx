
import React, { useState } from "react";
import "./gallery.css";
const Gallery = () => { const [imagenes, setImagenes] = useState([
    { src: 'https://picsum.photos/300/200?random=1', titulo: 'imagen 1' },
    { src: 'https://picsum.photos/300/200?random=2', titulo: 'imagen 2' },
    { src: 'https://picsum.photos/300/200?random=3', titulo: 'imagen 3' }
  ]);


  const [filtro, setFiltro] = useState('');

  const agregarImagen = () => {
    const randomNum = Math.floor(Math.random() * 1000); 
    const nuevaImagen = { 
      src: `https://picsum.photos/300/200?random=${randomNum}`,
      titulo: `Imagen ${randomNum}` 
    };
    setImagenes([...imagenes, nuevaImagen]); 
  };

  const filtrarImagenes = (filtro) => {
    return imagenes.filter(imagen => imagen.titulo.toLowerCase().includes(filtro.toLowerCase()));
  };

  return (
    <div className="gallery-container">
      <h1>Galería de Imágenes</h1>
      <h2>Samuel Moreno -2226016</h2>

      {/* AQUI FILTRO*/}
      <input
        type="text"
        placeholder="Filtrar por título"
        onChange={(e) => setFiltro(e.target.value)}
        value={filtro}
        className="filter-input"
      />

      {/* SHOW IMAGENES FILTRADAS*/}
      <div className="gallery">
        {filtrarImagenes(filtro).map((imagen, index) => (
          <div key={index} className="image-card">
            <img src={imagen.src} alt={imagen.titulo} />
            <h3>{imagen.titulo}</h3>
          </div>
        ))}
      </div>

      {/* AGREGAR OTRA*/}
      <button onClick={agregarImagen} className="add-button">Agregar Imagen</button>
    </div>
  );
};

export default Gallery;

