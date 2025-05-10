// Simulation API service

const API_BASE_URL = process.env.REACT_APP_SIMULATION_API_URL || 'http://localhost:5000/api';

export const fetchSimulationData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/metro-system`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching simulation data:', error);
    throw error;
  }
};

// Types for TypeScript (if you're using it)
export const types = {
  Station: {
    line: String,
    station: String,
    trains: Array
  },
  Train: {
    departing: Boolean,
    forward: Boolean,
    id: Number,
    line: String,
    position: String,
    speed_kph: Number
  },
  MetroSystem: {
    stations: Array,
    trains: Array
  }
}; 