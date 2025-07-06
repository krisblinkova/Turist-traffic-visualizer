import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { useChartOptions } from '../../hooks/useChartOptions';
import { useTouristChartData } from '../../hooks/useTouristChartData';
import { datalabelsPlugin } from '../../utils/chartPlugins';
import './TouristChart.css';

// Регистрация компонентов Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Регистрируем наш кастомный плагин
ChartJS.register(datalabelsPlugin);

export const TouristChart: React.FC = () => {
  // Используем хук для получения всех данных графика
  const { loading, combinedData } = useTouristChartData();

  // Настройки графика
  const options = useChartOptions({
    combinedData
  });

  if (loading) {
    return (
      <div className="tourist-chart">
        <div className="tourist-chart__loading">
          Загрузка данных...
        </div>
      </div>
    );
  }

  if (!combinedData) {
    return (
      <div className="tourist-chart">
        <div className="tourist-chart__error">
          Нет данных для отображения
        </div>
      </div>
    );
  }

  return (
    <div className="tourist-chart">
      <div className="tourist-chart__container">
        <Chart type="bar" data={combinedData} options={options} />
      </div>
    </div>
  );
}; 