// Slice para clientes
import { createSlice, nanoid } from '@reduxjs/toolkit';
const clientSlice = createSlice({
  name: 'clients',
  initialState: [],
  reducers: {
    addClient: (state, action) => {
      state.push({
        id: nanoid(),
        name: action.payload,
        consultas: [],
        reclamos: [],
      });
    },
    // Agregar una consulta a un cliente
    addConsulta: (state, action) => {
      const client = state.find(c => c.id === action.payload.id);
      if (client) client.consultas.push(action.payload.consulta);
    },
    // Agregar un reclamo a un cliente
    addReclamo: (state, action) => {
      const client = state.find(c => c.id === action.payload.id);
      if (client) client.reclamos.unshift(action.payload.reclamo);
    }, 
    // Resolver una consulta
    resolverConsulta: (state, action) => {
      const client = state.find(c => c.id === action.payload);
      if (client) client.consultas.pop();
    }, 
    // Resolver un reclamo
    resolverReclamo: (state, action) => {
      const client = state.find(c => c.id === action.payload);
      if (client) client.reclamos.shift();
    },
  },
});

export const { addClient, addConsulta, addReclamo, resolverConsulta, resolverReclamo } = clientSlice.actions;
export default clientSlice.reducer;