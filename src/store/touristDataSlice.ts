import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TouristDataState, TouristFlowData, CalculatedMetrics } from '../types';
import { databaseService } from '../services/databaseService';

// Асинхронный thunk для загрузки данных
export const fetchTouristData = createAsyncThunk(
  'touristData/fetchData',
  async () => {
    const [rawData, calculatedMetrics] = await Promise.all([
      databaseService.getTouristFlowData(),
      databaseService.getCalculatedMetrics()
    ]);
    return { rawData, calculatedMetrics };
  }
);

// Начальное состояние
const initialState: TouristDataState = {
  rawData: [],
  calculatedMetrics: [],
  totalFlow: 0,
  loading: false,
  error: null
};

// Создание slice
const touristDataSlice = createSlice({
  name: 'touristData',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setRawData: (state, action: PayloadAction<TouristFlowData[]>) => {
      state.rawData = action.payload;
    },
    setCalculatedMetrics: (state, action: PayloadAction<CalculatedMetrics[]>) => {
      state.calculatedMetrics = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Обработка fetchTouristData
      .addCase(fetchTouristData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTouristData.fulfilled, (state, action) => {
        state.loading = false;
        state.rawData = action.payload.rawData;
        state.calculatedMetrics = action.payload.calculatedMetrics;
        
        const lastYear = action.payload.rawData[action.payload.rawData.length - 1];
        if (lastYear) {
          state.totalFlow = lastYear.citizens_rf + lastYear.citizens_near_abroad + lastYear.citizens_far_abroad;
        }
      })
      .addCase(fetchTouristData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки данных';
      });
  }
});

export const { clearError, setRawData, setCalculatedMetrics } = touristDataSlice.actions;
export default touristDataSlice.reducer; 