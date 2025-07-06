import { TouristFlowData, CalculatedMetrics, TouristCategory, CategoryColors } from '../types';

// Цветовая схема для категорий туристов
export const CATEGORY_COLORS: CategoryColors = {
  citizens_rf: '#87CEEB',        // Голубой для граждан РФ
  citizens_near_abroad: '#FFB6C1', // Розовый для ближнего зарубежья
  citizens_far_abroad: '#DDA0DD',  // Фиолетовый для дальнего зарубежья
  children: '#FF8C42'            // Оранжевый для детей
};

// Цвет для выделенных столбцов
export const SELECTED_COLOR = '#FFFFFF';

// Функция для создания массива цветов с учетом выделенных годов
export const createColorArray = (
  baseColor: string,
  years: string[],
  selectedYears: number[]
): string[] => {
  return years.map(year => {
    const yearNum = parseInt(year);
    return selectedYears.includes(yearNum) ? SELECTED_COLOR : baseColor;
  });
};

// Функция для получения цвета по категории
export const getCategoryColor = (category: keyof CategoryColors): string => {
  return CATEGORY_COLORS[category];
};

// Функция для получения данных по выбранной категории
export const getDataByCategory = (
  data: TouristFlowData[], 
  category: TouristCategory
): number[] => {
  if (category === 'all') {
    return data.map(item => 
      (item.citizens_rf || 0) + 
      (item.citizens_near_abroad || 0) + 
      (item.citizens_far_abroad || 0)
    );
  }
  
  return data.map(item => item[category] || 0);
};

// Функция для получения данных детей
export const getChildrenData = (data: TouristFlowData[]): number[] => {
  return data.map(item => item.children_total || 0);
};

// Функция для получения CAGR по категории
export const getCAGRByCategory = (
  metrics: CalculatedMetrics[],
  category: TouristCategory
): number[] => {
  if (category === 'all') {
    return metrics.map(item => item.cagr_total || 0);
  }
  
  return metrics.map(item => (item.cagr_by_category?.[category] || 0));
};

// Функция для получения CAGR для детей
export const getChildrenCAGR = (metrics: CalculatedMetrics[]): number[] => {
  return metrics.map(item => item.cagr_children || 0);
};

// Функция для подготовки данных столбчатой диаграммы
export const prepareBarChartData = (
  data: TouristFlowData[],
  category: TouristCategory,
  childrenMode: boolean,
  selectedYears: number[] = []
) => {
  const years = data.map(item => item.year.toString());
  
  if (childrenMode) {
    console.log(getChildrenData(data));
    return {
      labels: years,
      datasets: [{
        label: 'Дети',
        data: getChildrenData(data),
        backgroundColor: createColorArray(CATEGORY_COLORS.children, years, selectedYears),
        borderColor: createColorArray(CATEGORY_COLORS.children, years, selectedYears),
        borderWidth: 1
      }]
    };
  }
  
  if (category === 'all') {
    return {
      labels: years,
      datasets: [
        {
          label: 'Граждане РФ',
          data: data.map(item => item.citizens_rf || 0),
          backgroundColor: createColorArray(CATEGORY_COLORS.citizens_rf, years, selectedYears),
          borderColor: createColorArray(CATEGORY_COLORS.citizens_rf, years, selectedYears),
          borderWidth: 1
        },
        {
          label: 'Граждане стран ближнего зарубежья',
          data: data.map(item => item.citizens_near_abroad || 0),
          backgroundColor: createColorArray(CATEGORY_COLORS.citizens_near_abroad, years, selectedYears),
          borderColor: createColorArray(CATEGORY_COLORS.citizens_near_abroad, years, selectedYears),
          borderWidth: 1
        },
        {
          label: 'Граждане стран дальнего зарубежья',
          data: data.map(item => item.citizens_far_abroad || 0),
          backgroundColor: createColorArray(CATEGORY_COLORS.citizens_far_abroad, years, selectedYears),
          borderColor: createColorArray(CATEGORY_COLORS.citizens_far_abroad, years, selectedYears),
          borderWidth: 1
        }
      ]
    };
  }
  
  // Для конкретной категории
  const categoryLabels = {
    citizens_rf: 'Граждане РФ',
    citizens_near_abroad: 'Ближнее зарубежье',
    citizens_far_abroad: 'Дальнее зарубежье'
  };
  
  const baseColor = getCategoryColor(category as keyof CategoryColors);
  
  return {
    labels: years,
    datasets: [{
      label: categoryLabels[category] || category,
      data: getDataByCategory(data, category),
      backgroundColor: createColorArray(baseColor, years, selectedYears),
      borderColor: createColorArray(baseColor, years, selectedYears),
      borderWidth: 1
    }]
  };
};

// Функция для подготовки данных линейного графика
export const prepareLineChartData = (
  data: TouristFlowData[],
  metrics: CalculatedMetrics[],
  category: TouristCategory,
  childrenMode: boolean
) => {
  const years = data.map(item => item.year.toString());
  
  if (childrenMode) {
    return {
      labels: years,
      datasets: [{
        label: 'Темп прироста, % (год к году)',
        data: getChildrenCAGR(metrics),
        borderColor: '#FFD700',
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointBackgroundColor: '#FFD700',
        pointBorderColor: '#FFD700',
        pointRadius: 4,
        tension: 0.1
      }]
    };
  }
  
  return {
    labels: years,
    datasets: [{
      label: 'Темп прироста, % (год к году)',
      data: getCAGRByCategory(metrics, category),
      borderColor: '#FFD700',
      backgroundColor: 'transparent',
      borderWidth: 2,
      pointBackgroundColor: '#FFD700',
      pointBorderColor: '#FFD700',
      pointRadius: 4,
      tension: 0.1
    }]
  };
};

// Функция для форматирования чисел
export const formatNumber = (value: number | null | undefined, decimals: number = 0): string => {
  if (value === null || value === undefined) return '0';
  return value.toLocaleString('ru-RU', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

// Функция для форматирования процентов
export const formatPercent = (value: number | null | undefined, decimals: number = 1): string => {
  if (value === null || value === undefined) return '0%';
  return `${(value).toLocaleString('ru-RU', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })}%`;
}; 