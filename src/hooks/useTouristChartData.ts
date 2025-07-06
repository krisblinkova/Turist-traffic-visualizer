import { useMemo } from 'react';
import { useAppSelector } from '../store/hooks';
import { prepareBarChartData, prepareLineChartData } from '../utils/chartUtils';

// Константы для диапазона лет детского режима
const CHILDREN_MODE_START_YEAR = 2017;
const CHILDREN_MODE_END_YEAR = 2022;

// Утилитарная функция для фильтрации данных по годам детского режима
const filterDataByYears = <T extends { year: number }>(data: T[], childrenMode: boolean): T[] => {
  if (childrenMode) {
    return data.filter(item => item.year >= CHILDREN_MODE_START_YEAR && item.year <= CHILDREN_MODE_END_YEAR);
  }
  return data;
};

export const useTouristChartData = () => {
  const { rawData, calculatedMetrics, loading } = useAppSelector(state => state.touristData);
  const { selectedCategory, childrenMode, selectedYears } = useAppSelector(state => state.filters);

  // Фильтрация данных для режима детей (2017-2022)
  const filteredData = useMemo(() => 
    filterDataByYears(rawData, childrenMode), 
    [rawData, childrenMode]
  );

  const filteredMetrics = useMemo(() => 
    filterDataByYears(calculatedMetrics, childrenMode), 
    [calculatedMetrics, childrenMode]
  );

  // Вычисление общего потока за последний год
  const totalFlow = useMemo(() => {
    if (!filteredData.length) return 0;
    const lastYear = filteredData[filteredData.length - 1];
    if (childrenMode) {
      return lastYear.children_total;
    }
    return lastYear.citizens_rf + lastYear.citizens_near_abroad + lastYear.citizens_far_abroad;
  }, [filteredData, childrenMode]);

  // Прямое создание объединенных данных без промежуточных переменных
  const combinedData = useMemo(() => {
    if (!filteredData.length || !filteredMetrics.length) return null;
    
    const barChartData = prepareBarChartData(filteredData, selectedCategory, childrenMode, selectedYears);
    const lineChartData = prepareLineChartData(filteredData, filteredMetrics, selectedCategory, childrenMode);

    return {
      labels: barChartData.labels,
      datasets: [
        ...barChartData.datasets.map(dataset => ({
          ...dataset,
          type: 'bar' as const,
          yAxisID: 'y',
          order: 2
        })),
        ...lineChartData.datasets.map(dataset => ({
          ...dataset,
          type: 'line' as const,
          yAxisID: 'y1',
          order: 1
        }))
      ]
    };
  }, [filteredData, filteredMetrics, selectedCategory, childrenMode, selectedYears]);

  return {
    loading,
    totalFlow,
    combinedData
  };
}; 