import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleChildrenMode } from '../../store/filtersSlice';
import './ChildrenButton.css';

export const ChildrenButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const childrenMode = useAppSelector(state => state.filters.childrenMode);

  const handleToggle = () => {
    dispatch(toggleChildrenMode());
  };

  return (
    <button
      className={`children-button ${childrenMode ? 'children-button--active' : ''}`}
      onClick={handleToggle}
      type="button"
      aria-pressed={childrenMode}
    >
      Дети
    </button>
  );
}; 