import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { useTouristChartData } from '../../hooks/useTouristChartData';
import { CategorySelect } from './CategorySelect';
import { ChildrenButton } from './ChildrenButton';
import './FiltersPanel.css';

export const FiltersPanel: React.FC = () => {
  const childrenMode = useAppSelector(state => state.filters.childrenMode);
  useTouristChartData();

  return (
    <div className="filters-panel">
      
      {!childrenMode && (
        <div className="filters-panel__section">
          <CategorySelect disabled={childrenMode} />
        </div>
      )}
      
      <div className="filters-panel__section">
        <ChildrenButton />
      </div>
    </div>
  );
}; 