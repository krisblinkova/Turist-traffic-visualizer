import { configureStore } from '@reduxjs/toolkit';
import touristDataReducer from './touristDataSlice';
import filtersReducer from './filtersSlice';

export const store = configureStore({
  reducer: {
    touristData: touristDataReducer,
    filters: filtersReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 