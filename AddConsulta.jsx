import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addConsulta } from './clienteSlice';

export default function AddConsulta({ id }) {
  const [consulta, setConsulta] = useState('');
  const dispatch = useDispatch();

  return (
    <div className="mb-2">
      <input
        className="border p-1 mr-2"
        placeholder="Consulta"
        value={consulta}
        onChange={e => setConsulta(e.target.value)}
      />
      <button className="bg-green-500 text-white px-2" onClick={() => {
        if (consulta.trim()) {
          dispatch(addConsulta({ id, consulta }));
          setConsulta('');
        }
      }}>
        Agregar Consulta
      </button>
    </div>
  );
}