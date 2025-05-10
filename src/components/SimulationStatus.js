import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import './SimulationStatus.css';

const SimulationStatus = () => {
  const { stations, trains, loading, error, refreshData } = useSimulation();

  if (loading) {
    return <div className="simulation-status loading">Loading simulation data...</div>;
  }

  if (error) {
    return (
      <div className="simulation-status error">
        <p>Error loading simulation data: {error}</p>
        <button onClick={refreshData}>Retry</button>
      </div>
    );
  }

  return (
    <div className="simulation-status">
      <div className="simulation-header">
        <h2>Metro System Simulation</h2>
        <button onClick={refreshData} className="refresh-button">
          Refresh Data
        </button>
      </div>

      <div className="simulation-content">
        <div className="stations-section">
          <h3>Stations</h3>
          <div className="stations-list">
            {stations.map((station, index) => (
              <div key={index} className="station-item">
                <h4>{station.station}</h4>
                <p>Line: {station.line}</p>
                <p>Active Trains: {station.trains.length}</p>
                {station.trains.length > 0 && (
                  <p>Train IDs: {station.trains.join(', ')}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="trains-section">
          <h3>Trains</h3>
          <div className="trains-list">
            {trains.map((train) => (
              <div key={train.id} className="train-item">
                <h4>Train {train.id}</h4>
                <p>Line: {train.line}</p>
                <p>Position: {train.position}</p>
                <p>Speed: {train.speed_kph.toFixed(1)} km/h</p>
                <p>Status: {train.departing ? 'Departing' : 'Arrived'}</p>
                <p>Direction: {train.forward ? 'Forward' : 'Backward'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationStatus; 