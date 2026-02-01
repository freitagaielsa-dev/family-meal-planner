import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

/**
 * Hook to access the App context
 * Must be used within AppProvider
 */
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
