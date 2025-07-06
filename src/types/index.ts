// Основные данные о туристском потоке
export interface TouristFlowData {
  year: number;
  citizens_rf: number;        // млн прибытий граждан РФ
  citizens_near_abroad: number;  // млн прибытий из ближнего зарубежья
  citizens_far_abroad: number;   // млн прибытий из дальнего зарубежья
  children_total: number;     // млн прибытий детей
}

// Расчетные метрики
export interface CalculatedMetrics {
  year: number;
  total_flow: number;         // общий поток
  cagr_total: number;         // CAGR для общего потока
  cagr_children: number;      // CAGR для детского туризма
  cagr_by_category: {         // CAGR по категориям
    citizens_rf: number;
    citizens_near_abroad: number;
    citizens_far_abroad: number;
  };
}

// Типы категорий туристов
export type TouristCategory = 'all' | 'citizens_rf' | 'citizens_near_abroad' | 'citizens_far_abroad';

// Состояние фильтров
export interface FiltersState {
  selectedCategory: TouristCategory;
  childrenMode: boolean;
  selectedYears: number[];
}

// Состояние UI
export interface UIState {
  tooltipData: any;
  selectedYear: number | null;
}

// Состояние данных
export interface TouristDataState {
  totalFlow: any;
  rawData: TouristFlowData[];
  calculatedMetrics: CalculatedMetrics[];
  loading: boolean;
  error: string | null;
}

// Настройки цветов для категорий
export interface CategoryColors {
  citizens_rf: string;
  citizens_near_abroad: string;
  citizens_far_abroad: string;
  children: string;
}

// Опции для выпадающего списка
export interface SelectOption {
  value: TouristCategory;
  label: string;
} 