import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchMetroData } from '../services/metroApi';

const MetroContext = createContext();

export const useMetro = () => {
  const context = useContext(MetroContext);
  if (!context) {
    throw new Error('useMetro must be used within a MetroProvider');
  }
  return context;
};

export const MetroProvider = ({ children }) => {
  const [metroData, setMetroData] = useState({
    stations: [],
    trains: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshData = async () => {
    try {
      setLoading(true);
      const data = await fetchMetroData();
      setMetroData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    // Set up periodic refresh every 30 seconds
    const intervalId = setInterval(refreshData, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const value = {
    stations: metroData.stations,
    trains: metroData.trains,
    loading,
    error,
    refreshData
  };

  return (
    <MetroContext.Provider value={value}>
      {children}
    </MetroContext.Provider>
  );
}; 