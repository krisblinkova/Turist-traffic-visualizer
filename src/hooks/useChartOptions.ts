import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleSelectedYear } from '../store/filtersSlice';
import { formatNumber, formatPercent } from '../utils/chartUtils';

interface UseChartOptionsProps {
  combinedData: any;
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
          label: function(context: any) {
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
          callback: function(value: any) {
            return value + '%';
          }
        }
      },
    },
    onClick: (event: any, elements: any[]) => {
      if (elements.length > 0) {
        const element = elements[0];
        const year = parseInt(combinedData?.labels?.[element.index] as string);
        if (year) {
          dispatch(toggleSelectedYear(year));
        }
      }
    },
    onHover: (event: any, elements: any[]) => {
      event.native.target.style.cursor = elements.length > 0 ? 'pointer' : 'default';
    }
  }), [childrenMode, combinedData?.labels, dispatch]);

  return options;
}; 