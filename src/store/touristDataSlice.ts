import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TouristDataState, TouristFlowData, CalculatedMetrics } from '../types';
import { realDatabaseService } from '../services/databaseReal';

interface TouristDataPayload {
  rawData: TouristFlowData[];
  calculatedMetrics: CalculatedMetrics[];
}

// Асинхронный thunk для загрузки данных
export const fetchTouristData = createAsyncThunk<
  TouristDataPayload,
  void,
  { rejectValue: string }
>(
  'touristData/fetchData',
  async (_, { rejectWithValue }) => {
    try {
    const [rawData, calculatedMetrics] = await Promise.all([
        realDatabaseService.getTouristFlowData(),
        realDatabaseService.getCalculatedMetrics()
    ]);
    return { rawData, calculatedMetrics };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Ошибка загрузки данных');
    }
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
      .addCase(fetchTouristData.fulfilled, (state, action: PayloadAction<TouristDataPayload>) => {
        state.loading = false;
        state.error = null;
        state.rawData = action.payload.rawData;
        state.calculatedMetrics = action.payload.calculatedMetrics;
        
        const lastYear = action.payload.rawData[action.payload.rawData.length - 1];
        if (lastYear) {
          state.totalFlow = (lastYear.citizens_rf || 0) + 
                           (lastYear.citizens_near_abroad || 0) + 
                           (lastYear.citizens_far_abroad || 0);
        }
      })
      .addCase(fetchTouristData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Неизвестная ошибка';
        state.rawData = [];
        state.calculatedMetrics = [];
        state.totalFlow = 0;
      });
  }
});

export const { clearError, setRawData, setCalculatedMetrics } = touristDataSlice.actions;
export default touristDataSlice.reducer; 