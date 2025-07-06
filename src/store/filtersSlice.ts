import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FiltersState, TouristCategory } from '../types';

// Начальное состояние фильтров
const initialState: FiltersState = {
  selectedCategory: 'all',
  childrenMode: false,
  selectedYears: []
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<TouristCategory>) => {
      state.selectedCategory = action.payload;
      // При выборе категории отключаем режим детей
      if (action.payload !== 'all') {
        state.childrenMode = false;
      }
    },
    toggleChildrenMode: (state) => {
      state.childrenMode = !state.childrenMode;
      // При включении режима детей сбрасываем фильтр категорий
      if (state.childrenMode) {
        state.selectedCategory = 'all';
      }
    },
    setChildrenMode: (state, action: PayloadAction<boolean>) => {
      state.childrenMode = action.payload;
      if (action.payload) {
        state.selectedCategory = 'all';
      }
    },
    addSelectedYear: (state, action: PayloadAction<number>) => {
      const year = action.payload;
      if (!state.selectedYears.includes(year)) {
        state.selectedYears.push(year);
      }
    },
    removeSelectedYear: (state, action: PayloadAction<number>) => {
      const year = action.payload;
      state.selectedYears = state.selectedYears.filter(y => y !== year);
    },
    toggleSelectedYear: (state, action: PayloadAction<number>) => {
      const year = action.payload;
      const index = state.selectedYears.indexOf(year);
      if (index === -1) {
        state.selectedYears.push(year);
      } else {
        state.selectedYears.splice(index, 1);
      }
    },
    clearSelectedYears: (state) => {
      state.selectedYears = [];
    },
    resetFilters: (state) => {
      state.selectedCategory = 'all';
      state.childrenMode = false;
      state.selectedYears = [];
    }
  }
});

export const {
  setSelectedCategory,
  toggleChildrenMode,
  setChildrenMode,
  addSelectedYear,
  removeSelectedYear,
  toggleSelectedYear,
  clearSelectedYears,
  resetFilters
} = filtersSlice.actions;

export default filtersSlice.reducer; 