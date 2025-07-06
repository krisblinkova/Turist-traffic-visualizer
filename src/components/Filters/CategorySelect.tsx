import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setSelectedCategory } from '../../store/filtersSlice';
import { TouristCategory, SelectOption } from '../../types';
import './CategorySelect.css';

const categoryOptions: SelectOption[] = [
  { value: 'all', label: 'Все туристы' },
  { value: 'citizens_rf', label: 'Граждане РФ' },
  { value: 'citizens_near_abroad', label: 'Граждане стран ближнего зарубежья' },
  { value: 'citizens_far_abroad', label: 'Граждане стран дальнего зарубежья' }
];

interface CategorySelectProps {
  disabled?: boolean;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({ disabled = false }) => {
  const dispatch = useAppDispatch();
  const selectedCategory = useAppSelector(state => state.filters.selectedCategory);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as TouristCategory;
    dispatch(setSelectedCategory(value));
  };

  return (
    <div className="category-select">
      <select
        id="category-select"
        className="category-select__dropdown"
        value={selectedCategory}
        onChange={handleCategoryChange}
        disabled={disabled}
      >
        {categoryOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}; 