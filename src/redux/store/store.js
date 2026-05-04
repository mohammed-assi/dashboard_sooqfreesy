import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../rootReducer/rootReducer';

export const store = configureStore({
  reducer: rootReducer,
});