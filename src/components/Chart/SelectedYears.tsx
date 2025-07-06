import React from 'react';
import { useAppSelector } from '../../store/hooks';

export const SelectedYears: React.FC = () => {
  const { selectedYears } = useAppSelector(state => state.filters);

  if (selectedYears.length === 0) return null;

  return (
    <div className="tourist-chart__selected-years">
      Выбранные годы:
      {selectedYears.map(year => (
        <span key={year} className="tourist-chart__selected-year">
          {year}
        </span>
      ))}
    </div>
  );
}; 