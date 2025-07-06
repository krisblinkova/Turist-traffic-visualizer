import { formatNumber } from './chartUtils';

// Плагин для отображения значений над столбцами
export const datalabelsPlugin = {
  id: 'datalabels',
  afterDatasetsDraw: (chart: any) => {
    const ctx = chart.ctx;
    const chartConfig = chart.config._config;
    const showLabels = chartConfig.options?.plugins?.showDataLabels || false;
    
    if (showLabels) {
      chart.data.datasets.forEach((dataset: any, i: number) => {
        const meta = chart.getDatasetMeta(i);
        if (dataset.type === 'bar' && meta.visible) {
          meta.data.forEach((element: any, index: number) => {
            const value = dataset.data[index];
            if (value > 0) {
              ctx.fillStyle = '#FFFFFF';
              ctx.font = 'bold 12px Arial';
              ctx.textAlign = 'center';
              ctx.fillText(
                formatNumber(value, 1),
                element.x,
                element.y -12
              );
            }
          });
        }
      });
    }
  }
}; 