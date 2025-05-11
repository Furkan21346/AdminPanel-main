import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchSimulationData } from '../services/simulationApi';

const SimulationContext = createContext();

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};

export const SimulationProvider = ({ children }) => {
  const [simulationData, setSimulationData] = useState({
    stations: [],
    trains: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshData = async () => {
    try {
      setLoading(true);
      const data = await fetchSimulationData();
      
      // Ensure unique keys for stations by combining line and station name
      const processedData = {
        ...data,
        stations: data.stations.map(station => ({
          ...station,
          key: `${station.line}-${station.station}`
        }))
      };
      
      setSimulationData(processedData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    // Set up periodic refresh every 5 seconds
    const intervalId = setInterval(refreshData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const value = {
    stations: simulationData.stations,
    trains: simulationData.trains,
    loading,
    error,
    refreshData
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
}; 