import React from 'react';
import AddConsulta from './AddConsulta';
import AddReclamo from './NuevoReclamo';
import Consultas from './Consultas';
import Reclamos from './Reclamos';
import { useDispatch } from 'react-redux';
import { resolverConsulta, resolverReclamo } from './clienteSlice';

export default function ClientCard({ client }) {
  const dispatch = useDispatch();

  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">{client.name}</h2>
      <AddConsulta id={client.id} />
      <AddReclamo id={client.id} />
      <Consultas consultas={client.consultas} onResolve={() => dispatch(resolverConsulta(client.id))} />
      <Reclamos reclamos={client.reclamos} onResolve={() => dispatch(resolverReclamo(client.id))} />
    </div>
  );
}