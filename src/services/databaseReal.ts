import * as XLSX from 'xlsx';
import { TouristFlowData, CalculatedMetrics } from '../types';
import excelFile from '../data/realdata.xlsx?url';

interface TouristData {
  year: number;
  category: string;
  value: number;
}

// Утилитарная функция для расчета CAGR
export const calculateCAGR = (currentValue: number, previousValue: number): number => {
  if (previousValue === 0) return 0;
  return ((currentValue / previousValue) * 100) - 100;
};

// Преобразование данных в формат TouristFlowData
export const transformToTouristFlow = (data: TouristData[]): TouristFlowData[] => {
  // Группировка данных по годам
  const groupedByYear = data.reduce((acc, curr) => {
    if (!acc[curr.year]) {
      acc[curr.year] = {
        year: curr.year,
        citizens_rf: 0,
        citizens_near_abroad: 0,
        citizens_far_abroad: 0,
        children_total: 0
      };
    }

    switch (curr.category.toLowerCase()) {
      case 'граждане рф':
        acc[curr.year].citizens_rf += curr.value;
        break;
      case 'граждане стран ближнего зарубежья':
        acc[curr.year].citizens_near_abroad += curr.value;
        break;
      case 'граждане стран дальнего зарубежья':
        acc[curr.year].citizens_far_abroad += curr.value;
        break;
      case 'дети':
        acc[curr.year].children_total += curr.value;
        break;
    }

    return acc;
  }, {} as Record<number, TouristFlowData>);

  // Преобразование в массив и сортировка по годам
  const result = Object.values(groupedByYear).sort((a, b) => a.year - b.year);
  console.log('Transformed tourist flow data:', result); // Отладочный вывод
  return result;
};

// Функция для расчета метрик
export const calculateMetrics = (data: TouristFlowData[]): CalculatedMetrics[] => {
  return data.map((item, index) => {
    const prevItem = index > 0 ? data[index - 1] : null;
    
    const total_flow = item.citizens_rf + item.citizens_near_abroad + item.citizens_far_abroad;
    const prevTotal = prevItem ? 
      prevItem.citizens_rf + prevItem.citizens_near_abroad + prevItem.citizens_far_abroad : 0;

    return {
      year: item.year,
      total_flow,
      cagr_total: prevItem ? calculateCAGR(total_flow, prevTotal) : 0,
      cagr_children: prevItem ? calculateCAGR(item.children_total, prevItem.children_total) : 0,
      cagr_by_category: {
        citizens_rf: prevItem ? calculateCAGR(item.citizens_rf, prevItem.citizens_rf) : 0,
        citizens_near_abroad: prevItem ? calculateCAGR(item.citizens_near_abroad, prevItem.citizens_near_abroad) : 0,
        citizens_far_abroad: prevItem ? calculateCAGR(item.citizens_far_abroad, prevItem.citizens_far_abroad) : 0,
      }
    };
  });
};

export const parseExcelData = async (): Promise<TouristData[]> => {
  try {
    const response = await fetch(excelFile);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    // Адаптируем под реальную структуру данных
    const formattedData: TouristData[] = jsonData.map((row: any) => {
      const year = typeof row['год'] === 'string' ? parseInt(row['год']) : (row['год'] || 0);
      const category = row['категория туриста'] || '';
      const isChild = row['дети'] === 'да';
      const value = typeof row.count_turist === 'string' ? parseFloat(row.count_turist) : (row.count_turist || 0);
      
      const finalCategory = isChild ? 'дети' : category;
      
      return {
        year: isNaN(year) ? 0 : year,
        category: String(finalCategory).trim(),
        value: isNaN(value) ? 0 : value
      };
    }).filter(item => item.year > 0 && item.category && item.value >= 0);

    console.log('Parsed Excel data:', formattedData.slice(0, 5)); // Отладочный вывод
    return formattedData;
  } catch (error) {
    console.error('Ошибка при парсинге Excel файла:', error);
    throw error;
  }
};

// Константы для имитации задержек сети
const NETWORK_DELAYS = {
  TOURIST_DATA: 500,
  METRICS_DATA: 300
} as const;

// Функция для имитации задержки сети
const simulateNetworkDelay = <T>(data: T, delay: number): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

export const getRealTouristFlowData = async (): Promise<TouristFlowData[]> => {
  const rawData = await parseExcelData();
  const transformedData = transformToTouristFlow(rawData);
  return simulateNetworkDelay(transformedData, NETWORK_DELAYS.TOURIST_DATA);
};

export const getRealCalculatedMetrics = async (): Promise<CalculatedMetrics[]> => {
  const rawData = await parseExcelData();
  const transformedData = transformToTouristFlow(rawData);
  const metrics = calculateMetrics(transformedData);
  return simulateNetworkDelay(metrics, NETWORK_DELAYS.METRICS_DATA);
};

export const realDatabaseService = {
  getTouristFlowData: getRealTouristFlowData,
  getCalculatedMetrics: getRealCalculatedMetrics
}; 
