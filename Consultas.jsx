import React from 'react';

export default function Consultas({ consultas, onResolve }) {
  return (
    <div className="mb-2">
      <h3 className="font-semibold">Consultas:</h3>
      <ul className="list-disc pl-4">
        {consultas.map((c, i) => <li key={i}>{c}</li>)}
      </ul>
      {consultas.length > 0 && (
        <button className="bg-yellow-500 text-white px-2 mt-1" onClick={onResolve}>Resolver Consulta</button>
      )}
    </div>
  );
}