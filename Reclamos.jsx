import React from 'react';

export default function Reclamos({ reclamos, onResolve }) {
  return (
    <div className="mb-2">
      <h3 className="font-semibold">Reclamos :</h3>
      <ul className="list-disc pl-4">
        {reclamos.map((r, i) => <li key={i}>{r}</li>)}
      </ul>
      {reclamos.length > 0 && (
        <button className="bg-purple-500 text-white px-2 mt-1" onClick={onResolve}>Resolver Reclamo</button>
      )}
    </div>
  );
}