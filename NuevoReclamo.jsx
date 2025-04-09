import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addReclamo } from './clienteSlice';

export default function AddReclamo({ id }) {
  const [reclamo, setReclamo] = useState('');
  const dispatch = useDispatch();

  return (
    <div className="mb-2">
      <input
        className="border p-1 mr-2"
        placeholder="Reclamo"
        value={reclamo}
        onChange={e => setReclamo(e.target.value)}
      />
      <button className="bg-red-500 text-white px-2" onClick={() => {
        if (reclamo.trim()) {
          dispatch(addReclamo({ id, reclamo }));
          setReclamo('');
        }
      }}>
        Agregar Reclamo
      </button>
    </div>
  );
}