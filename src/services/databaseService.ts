import { TouristFlowData, CalculatedMetrics } from '../types';

// Константы для имитации задержек сети (в миллисекундах)
const NETWORK_DELAYS = {
  TOURIST_DATA: 500,
  METRICS_DATA: 300
} as const;

// Псевдо-данные, имитирующие SQLite базу данных 
const mockTouristData: TouristFlowData[] = [
  {
    year: 2015,
    citizens_rf: 12.5,
    citizens_near_abroad: 2.8,
    citizens_far_abroad: 2.4,
    children_total: 2.4
  },
  {
    year: 2016,
    citizens_rf: 14.2,
    citizens_near_abroad: 2.2,
    citizens_far_abroad: 2.4,
    children_total: 2.6
  },
  {
    year: 2017,
    citizens_rf: 16.5,
    citizens_near_abroad: 2.1,
    citizens_far_abroad: 3.5,
    children_total: 2.8
  },
  {
    year: 2018,
    citizens_rf: 16.5,
    citizens_near_abroad: 2.8,
    citizens_far_abroad: 3.5,
    children_total: 2.9
  },
  {
    year: 2019,
    citizens_rf: 19.2,
    citizens_near_abroad: 2.3,
    citizens_far_abroad: 3.1,
    children_total: 4.3
  },
  {
    year: 2020,
    citizens_rf: 13.2,
    citizens_near_abroad: 1.3,
    citizens_far_abroad: 1.1,
    children_total: 2.9
  },
  {
    year: 2021,
    citizens_rf: 15.1,
    citizens_near_abroad: 1.3,
    citizens_far_abroad: 1.1,
    children_total: 3.8
  },
  {
    year: 2022,
    citizens_rf: 15.3,
    citizens_near_abroad: 2.4,
    citizens_far_abroad: 1.2,
    children_total: 3.8
  }
];

// Утилитарная функция для расчета CAGR (темп прироста год к году)
const calculateCAGR = (currentValue: number, previousValue: number): number => {
  if (previousValue === 0) return 0;
  return ((currentValue / previousValue) * 100) - 100;
};

// Функция для расчета всех метрик на основе исходных данных
const calculateMetrics = (data: readonly TouristFlowData[]): CalculatedMetrics[] => {
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


const simulateNetworkDelay = <T>(data: T, delay: number): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};


const calculatedMetrics = Object.freeze(calculateMetrics(mockTouristData));


export const getTouristFlowData = (): Promise<TouristFlowData[]> => {
  return simulateNetworkDelay([...mockTouristData], NETWORK_DELAYS.TOURIST_DATA);
};

export const getCalculatedMetrics = (): Promise<CalculatedMetrics[]> => {
  return simulateNetworkDelay([...calculatedMetrics], NETWORK_DELAYS.METRICS_DATA);
};

export const databaseService = {
  getTouristFlowData,
  getCalculatedMetrics
}; 