import React, { useState } from 'react';
import BoxScreen from '../components/BoxScreen';
import { useNavigate } from 'react-router-dom';

const ServiceManagement = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([
    { id: 1, train: 'Train A', departure: '08:00', arrival: '08:45', status: 'On Time', delay: '0 min' },
    { id: 2, train: 'Train B', departure: '08:30', arrival: '09:15', status: 'Delayed', delay: '5 min' },
    { id: 3, train: 'Train C', departure: '09:00', arrival: '09:45', status: 'On Time', delay: '0 min' },
  ]);

  const [newSchedule, setNewSchedule] = useState({
    train: '',
    departure: '',
    arrival: '',
    status: '',
    delay: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSchedule({ ...newSchedule, [name]: value });
  };

  const addSchedule = () => {
    if (newSchedule.train && newSchedule.departure && newSchedule.arrival) {
      const newEntry = { id: schedules.length + 1, ...newSchedule };
      setSchedules([...schedules, newEntry]);
      setNewSchedule({ train: '', departure: '', arrival: '', status: '', delay: '' });
    }
  };

  const tableStyle = { width: '100%', borderCollapse: 'collapse', marginBottom: '20px' };
  const thTdStyle = { border: '1px solid #fff', padding: '8px', textAlign: 'left' };
  const inputStyle = { padding: '8px', margin: '5px', borderRadius: '5px', border: 'none' };
  const buttonStyle = {
    padding: '8px 12px',
    margin: '5px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#3c8dbc',
    color: 'white',
    cursor: 'pointer',
  };

  return (
    <BoxScreen title="Service Management and Planning" onClose={() => navigate('/')}>
      <div style={{ padding: '20px', color: 'white' }}>
        <h3>Current Train Schedules</h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thTdStyle}>Train</th>
              <th style={thTdStyle}>Departure</th>
              <th style={thTdStyle}>Arrival</th>
              <th style={thTdStyle}>Status</th>
              <th style={thTdStyle}>Delay</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr key={schedule.id}>
                <td style={thTdStyle}>{schedule.train}</td>
                <td style={thTdStyle}>{schedule.departure}</td>
                <td style={thTdStyle}>{schedule.arrival}</td>
                <td style={thTdStyle}>{schedule.status}</td>
                <td style={thTdStyle}>{schedule.delay}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3>Add / Update Schedule</h3>
        <div>
          <input
            type="text"
            name="train"
            placeholder="Train Name"
            value={newSchedule.train}
            onChange={handleInputChange}
            style={inputStyle}
          />
          <input
            type="text"
            name="departure"
            placeholder="Departure Time"
            value={newSchedule.departure}
            onChange={handleInputChange}
            style={inputStyle}
          />
          <input
            type="text"
            name="arrival"
            placeholder="Arrival Time"
            value={newSchedule.arrival}
            onChange={handleInputChange}
            style={inputStyle}
          />
          <input
            type="text"
            name="status"
            placeholder="Status"
            value={newSchedule.status}
            onChange={handleInputChange}
            style={inputStyle}
          />
          <input
            type="text"
            name="delay"
            placeholder="Delay"
            value={newSchedule.delay}
            onChange={handleInputChange}
            style={inputStyle}
          />
          <button onClick={addSchedule} style={buttonStyle}>
            Add Schedule
          </button>
        </div>
        <h3>Performance Metrics</h3>
        <div style={{ backgroundColor: '#fff', color: '#121F48', padding: '20px', borderRadius: '10px' }}>
          <p>Chart Placeholder for Passenger Density, On‑Time Performance, etc.</p>
        </div>
      </div>
    </BoxScreen>
  );
};

export default ServiceManagement;
