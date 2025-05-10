// Metro system API service

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

export const fetchMetroData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/metro-system`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching metro data:', error);
    throw error;
  }
};

export const updateMetroData = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/metro-system`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating metro data:', error);
    throw error;
  }
}; 