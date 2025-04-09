//agregar cliente
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addClient } from './clienteSlice';
// funcion para añadrls
export default function AddClient() {
  const [name, setName] = useState('');
  const dispatch = useDispatch();

  return (
    <div className="mb-4">
      <input
        className="border p-1 mr-2"
        placeholder="Nombre del cliente"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button className="bg-blue-500 text-white px-2" onClick={() => {
        if (name.trim()) {
          dispatch(addClient(name));
          setName('');
        }
      }}>
        Agregar Cliente
      </button>
    </div>
  );
}
