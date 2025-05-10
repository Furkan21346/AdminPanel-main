import React from 'react';
import { useMetro } from '../context/MetroContext';

const MetroSystemStatus = () => {
  const { stations, trains, loading, error, refreshData } = useMetro();

  if (loading) {
    return <div>Loading metro system data...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error loading metro system data: {error}</p>
        <button onClick={refreshData}>Retry</button>
      </div>
    );
  }

  return (
    <div className="metro-system-status">
      <h2>Metro System Status</h2>
      
      <div className="stations-section">
        <h3>Stations</h3>
        <div className="stations-list">
          {stations.map((station, index) => (
            <div key={index} className="station-item">
              <p>Line: {station.line}</p>
              <p>Station: {station.station}</p>
              <p>Trains: {station.trains.join(', ')}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="trains-section">
        <h3>Trains</h3>
        <div className="trains-list">
          {trains.map((train, index) => (
            <div key={index} className="train-item">
              <p>ID: {train.id}</p>
              <p>Line: {train.line}</p>
              <p>Position: {train.position}</p>
              <p>Speed: {train.speed_kph} km/h</p>
              <p>Status: {train.departing ? 'Departing' : 'Arrived'}</p>
              <p>Direction: {train.forward ? 'Forward' : 'Backward'}</p>
            </div>
          ))}
        </div>
      </div>

      <button onClick={refreshData}>Refresh Data</button>
    </div>
  );
};

export default MetroSystemStatus; 