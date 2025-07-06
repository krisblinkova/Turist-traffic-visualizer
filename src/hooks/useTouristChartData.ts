import { useMemo } from 'react';
import { useAppSelector } from '../store/hooks';
import { prepareBarChartData, prepareLineChartData } from '../utils/chartUtils';

// Утилитарная функция для фильтрации данных по годам
const filterDataByYears = <T extends { year: number }>(
  data: T[], 
  childrenMode: boolean,
  selectedYears: number[]
): T[] => {
  let filteredData = [...data];

  // Если есть выбранные годы, фильтруем по ним
  if (selectedYears.length > 0) {
    filteredData = filteredData.filter(item => selectedYears.includes(item.year));
  }

  return filteredData;
};

interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor: string | string[];
  borderColor: string | string[];
  borderWidth: number;
  type?: 'bar' | 'line';
  yAxisID?: string;
  order?: number;
  pointBackgroundColor?: string;
  pointBorderColor?: string;
  pointRadius?: number;
  tension?: number;
}

interface CombinedChartData {
  labels: string[];
  datasets: ChartDataset[];
  }

interface ChartHookResult {
  loading: boolean;
  totalFlow: number;
  combinedData: CombinedChartData | null;
}

export const useTouristChartData = (): ChartHookResult => {
  const { rawData, calculatedMetrics, loading } = useAppSelector(state => state.touristData);
  const { selectedCategory, childrenMode, selectedYears } = useAppSelector(state => state.filters);

  // Фильтрация данных
  const filteredData = useMemo(() => 
    filterDataByYears(rawData, childrenMode, selectedYears), 
    [rawData, childrenMode, selectedYears]
  );

  const filteredMetrics = useMemo(() => 
    filterDataByYears(calculatedMetrics, childrenMode, selectedYears), 
    [calculatedMetrics, childrenMode, selectedYears]
  );

  // Вычисление общего потока за последний год
  const totalFlow = useMemo(() => {
    if (!filteredData.length) return 0;
    const lastYear = filteredData[filteredData.length - 1];
    if (!lastYear) return 0;
    
    if (childrenMode) {
      return lastYear.children_total || 0;
    }
    return (lastYear.citizens_rf || 0) + 
           (lastYear.citizens_near_abroad || 0) + 
           (lastYear.citizens_far_abroad || 0);
  }, [filteredData, childrenMode]);

  // Создание объединенных данных для графика
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