import { configureStore } from '@reduxjs/toolkit';
import clientReducer from './clienteSlice';

export default configureStore({
  reducer: {
    clients: clientReducer,
  },
});