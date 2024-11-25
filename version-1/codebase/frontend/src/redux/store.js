import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import stateCitySlice from './slices/stateCitySlice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    stateCity: stateCitySlice
  },
});

export default store;
