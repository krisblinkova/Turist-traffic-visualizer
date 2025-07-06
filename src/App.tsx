import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchTouristData } from './store/touristDataSlice';
import { FiltersPanel } from './components/Filters/FiltersPanel';
import { TouristChart } from './components/Chart/TouristChart';
import './App.css';
import { formatNumber } from './utils/chartUtils';
import { useTouristChartData } from './hooks/useTouristChartData';

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { error } = useAppSelector(state => state.touristData);
  const { totalFlow } = useTouristChartData();

  useEffect(() => {
    dispatch(fetchTouristData());
  }, [dispatch]);

  return (
    <div className="app">
      
      <main className="app__main">
        <div className="main__header">
          <h1 className="main__title">
            Динамика туристского потока <span className="main__total">Итого: {formatNumber(totalFlow)} млн</span>
          </h1>
        </div>
    
        <FiltersPanel />
        
        {error && (
          <div className="app__error">
            <p>Ошибка загрузки данных: {error}</p>
          </div>
        )}
        
        <TouristChart />
      </main>

    </div>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App; 