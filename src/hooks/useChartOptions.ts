import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleSelectedYear } from '../store/filtersSlice';
import { formatNumber, formatPercent } from '../utils/chartUtils';
import { ChartEvent } from 'chart.js';

interface ChartDataset {
  label: string;
  data: number[];
  type?: 'bar' | 'line';
}

interface CombinedChartData {
  labels: string[];
  datasets: ChartDataset[];
}

interface UseChartOptionsProps {
  combinedData: CombinedChartData | null;
}

interface TooltipContext {
  dataset: ChartDataset;
  parsed: {
    y: number;
  };
}

export const useChartOptions = ({ combinedData }: UseChartOptionsProps) => {
  const dispatch = useAppDispatch();
  const childrenMode = useAppSelector(state => state.filters.childrenMode);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 30,
        bottom: 10,
        left: 10,
        right: 10
      }
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    elements: {
      line: {
        tension: 0.1
      },
      point: {
        radius: 5,
        hoverRadius: 7
      }
    },
    plugins: {
      showDataLabels: childrenMode,
      legend: {
        display: true,
        position: 'bottom' as const,
        align: 'start' as const,
        labels: {
          padding: 20,
          font: {
            size: 16
          },
          color: '#FFFFFF',
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: TooltipContext) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            
            if (context.dataset.type === 'line') {
              return `${label}: ${formatPercent(value)}`;
            } else {
              return `${label}: ${formatNumber(value)} млн прибытий`;
            }
          }
        }
      }
    },
    scales: {
      x: {
        type: 'category' as const,
        stacked: !childrenMode,
        grid: {
          display: false
        },
        ticks: {
          color: '#FFFFFF'
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        stacked: !childrenMode,
        min: 0,
        max: childrenMode ? 5 : 30,
        grid: {
          color: 'rgba(255, 255, 255, 0.2)'
        },
        ticks: {
          color: '#FFFFFF',
          stepSize: childrenMode ? 1 : undefined
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        min: -60,
        max: 60,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: '#FFD700',
          callback: function(value: number) {
            return value + '%';
          }
        }
      },
    },
    onClick: (event: ChartEvent, elements: any[]) => {
      if (!event.native || !combinedData?.labels) return;
      
      if (elements.length > 0) {
        const element = elements[0];
        const year = parseInt(combinedData.labels[element.index]);
        if (!isNaN(year)) {
          dispatch(toggleSelectedYear(year));
        }
      }
    },
    onHover: (event: ChartEvent, elements: any[]) => {
      const target = event.native?.target as HTMLCanvasElement | null;
      if (target) {
        target.style.cursor = elements.length > 0 ? 'pointer' : 'default';
      }
    }
  }), [childrenMode, combinedData?.labels, dispatch]);

  return options;
}; 