// src/pages/OperationalControl.js
import React, { useState, useEffect } from 'react';
import BoxScreen from '../components/BoxScreen';

const OperationalControl = ({ onClose }) => {
  // Dummy data for station capacities
  const [stationData, setStationData] = useState([
    { id: 1, name: 'Station A', capacity: 80, maxCapacity: 100, status: 'Normal' },
    { id: 2, name: 'Station B', capacity: 95, maxCapacity: 100, status: 'High' },
    { id: 3, name: 'Station C', capacity: 50, maxCapacity: 100, status: 'Normal' },
    // Add additional stations as needed
  ]);

  // Dummy data for train locations
  const [trainData, setTrainData] = useState([
    { id: 'Train 1', location: 'Station A', status: 'On Time' },
    { id: 'Train 2', location: 'Between Station B and Station C', status: 'Delayed' },
    { id: 'Train 3', location: 'Station C', status: 'On Time' },
    // Add additional trains as needed
  ]);

  // Simulate real-time updates (e.g., fluctuations in station capacities)
  useEffect(() => {
    const interval = setInterval(() => {
      setStationData(prevData =>
        prevData.map(station => {
          // Simulate a small random fluctuation in capacity
          const fluctuation = Math.floor(Math.random() * 5) - 2;
          let newCapacity = station.capacity + fluctuation;
          if (newCapacity > station.maxCapacity) newCapacity = station.maxCapacity;
          if (newCapacity < 0) newCapacity = 0;
          return { ...station, capacity: newCapacity };
        })
      );
    }, 10000); // update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Example control action functions
  const handleEmergencyStop = () => {
    // In a real system, this would trigger an emergency shutdown
    alert('Emergency Stop Activated!');
  };

  const handleAdjustTrainSpacing = () => {
    // In a real system, this would send a command to adjust train spacing
    alert('Control command sent to adjust train spacing.');
  };

  return (
    <BoxScreen title="Operational Control" onClose={onClose}>
      <div style={{ padding: '20px', color: 'white' }}>
        <h3>Station Capacities</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>Station</th>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>Capacity</th>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {stationData.map(station => (
              <tr key={station.id}>
                <td style={{ border: '1px solid #fff', padding: '8px' }}>{station.name}</td>
                <td style={{ border: '1px solid #fff', padding: '8px' }}>
                  {station.capacity} / {station.maxCapacity}
                </td>
                <td style={{ border: '1px solid #fff', padding: '8px' }}>{station.status}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Train Locations</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>Train</th>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>Current Location</th>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {trainData.map(train => (
              <tr key={train.id}>
                <td style={{ border: '1px solid #fff', padding: '8px' }}>{train.id}</td>
                <td style={{ border: '1px solid #fff', padding: '8px' }}>{train.location}</td>
                <td style={{ border: '1px solid #fff', padding: '8px' }}>{train.status}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Control Actions</h3>
        <div>
          <button
            style={{
              padding: '8px 12px',
              marginRight: '10px',
              borderRadius: '5px',
              border: 'none',
              backgroundColor: '#3c8dbc',
              color: 'white',
              cursor: 'pointer'
            }}
            onClick={handleEmergencyStop}
          >
            Emergency Stop
          </button>
          <button
            style={{
              padding: '8px 12px',
              borderRadius: '5px',
              border: 'none',
              backgroundColor: '#3c8dbc',
              color: 'white',
              cursor: 'pointer'
            }}
            onClick={handleAdjustTrainSpacing}
          >
            Adjust Train Spacing
          </button>
        </div>
      </div>
    </BoxScreen>
  );
};

export default OperationalControl;
