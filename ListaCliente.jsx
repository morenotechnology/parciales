import React from 'react';
import { useSelector } from 'react-redux';
import ClientCard from './ClienteCard';

export default function ClientList() {
  const clients = useSelector(state => state.clients);

  return (
    <div className="grid gap-4">
      {clients.map(client => (
        <ClientCard key={client.id} client={client} />
      ))}
    </div>
  );
}