// src/pages/PassengerInformation.js
import React, { useState, useEffect } from 'react';
import BoxScreen from '../components/BoxScreen';
import { useNavigate } from 'react-router-dom';

const PassengerInformation = ({ onClose }) => {
  const navigate = useNavigate();
  // State for live service updates and train statuses
  const [trainStatuses, setTrainStatuses] = useState([
    { id: 'Train 1', arrival: '08:05', delay: 0, disruption: '' },
    { id: 'Train 2', arrival: '08:10', delay: 5, disruption: 'Minor delay' },
    { id: 'Train 3', arrival: '08:15', delay: 0, disruption: '' },
  ]);

  // State for automated public announcements
  const [announcements, setAnnouncements] = useState([
    "Welcome aboard. Please mind the gap.",
    "Next train on platform 2 will arrive shortly.",
  ]);

  // State for passenger crowding heatmap (dummy data for stations)
  const [crowdData, setCrowdData] = useState([
    { station: 'Station A', crowdLevel: 'High' },
    { station: 'Station B', crowdLevel: 'Medium' },
    { station: 'Station C', crowdLevel: 'Low' },
  ]);

  // State for ticketing system integration
  const [ticketingData, setTicketingData] = useState({
    ticketsSold: 1200,
    ticketsValidated: 1150,
    revenue: 35000,
  });

  // State for lost & found management
  const [lostFound, setLostFound] = useState([
    { id: 1, item: 'Umbrella', description: 'Black umbrella left at platform 1', reportedAt: '08:00 AM' },
    { id: 2, item: 'Wallet', description: 'Brown leather wallet lost at Station B', reportedAt: '08:10 AM' },
  ]);

  // State for accessibility assistance system
  const [accessibilityStatus, setAccessibilityStatus] = useState({
    Elevators: 'Operational',
    Escalators: 'Under Maintenance',
    'Accessible Transport': 'Available',
  });

  // Simulate live updates for train statuses and announcements every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTrainStatuses(prevStatuses =>
        prevStatuses.map(status => ({
          ...status,
          delay: Math.random() > 0.7 ? Math.floor(Math.random() * 10) : status.delay,
          disruption: Math.random() > 0.8 ? 'Technical issue causing disruption' : '',
        }))
      );
      if (Math.random() > 0.8) {
        setAnnouncements(prev => [
          ...prev,
          "New announcement: Please check platform 3 for updated information.",
        ]);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Function to update ticketing data
  const updateTicketingData = () => {
    setTicketingData(prev => ({
      ticketsSold: prev.ticketsSold + Math.floor(Math.random() * 10),
      ticketsValidated: prev.ticketsValidated + Math.floor(Math.random() * 10),
      revenue: prev.revenue + Math.floor(Math.random() * 500),
    }));
    alert('Ticketing data updated.');
  };

  // Function to add a new lost item report
  const addLostFoundItem = () => {
    const newItem = {
      id: lostFound.length + 1,
      item: 'Smartphone',
      description: 'Black smartphone reported lost at Station C',
      reportedAt: new Date().toLocaleTimeString(),
    };
    setLostFound(prev => [...prev, newItem]);
    alert('Lost item reported.');
  };

  // Function to update accessibility status (e.g., toggle escalators status)
  const updateAccessibilityStatus = () => {
    setAccessibilityStatus(prev => ({
      ...prev,
      Escalators: prev.Escalators === 'Operational' ? 'Under Maintenance' : 'Operational',
    }));
    alert('Accessibility status updated.');
  };

  return (
    <BoxScreen title="Passenger Information" onClose={() => navigate('/')}>
      <div style={{ padding: '20px', color: 'white' }}>
        {/* Live Service Updates & Delay Notifications */}
        <h3>Live Service Updates & Delay Notifications</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>Train</th>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>Arrival</th>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>Delay (min)</th>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>Disruption</th>
            </tr>
          </thead>
          <tbody>
            {trainStatuses.map(train => (
              <tr key={train.id}>
                <td style={{ border: '1px solid #fff', padding: '8px' }}>{train.id}</td>
                <td style={{ border: '1px solid #fff', padding: '8px' }}>{train.arrival}</td>
                <td style={{ border: '1px solid #fff', padding: '8px' }}>{train.delay}</td>
                <td style={{ border: '1px solid #fff', padding: '8px' }}>{train.disruption}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Automated Public Announcements */}
        <h3>Automated Public Announcements</h3>
        <ul style={{ marginBottom: '20px', textAlign: 'left' }}>
          {announcements.map((announcement, index) => (
            <li key={index} style={{ marginBottom: '5px' }}>{announcement}</li>
          ))}
        </ul>

        {/* Passenger Crowding Heatmap */}
        <h3>Passenger Crowding Heatmap</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>Station</th>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>Crowd Level</th>
            </tr>
          </thead>
          <tbody>
            {crowdData.map(data => (
              <tr key={data.station}>
                <td style={{ border: '1px solid #fff', padding: '8px' }}>{data.station}</td>
                <td style={{ border: '1px solid #fff', padding: '8px' }}>{data.crowdLevel}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Ticketing System Integration */}
        <h3>Ticketing System Integration</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>Tickets Sold</th>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>Tickets Validated</th>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>Revenue ($)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #fff', padding: '8px' }}>{ticketingData.ticketsSold}</td>
              <td style={{ border: '1px solid #fff', padding: '8px' }}>{ticketingData.ticketsValidated}</td>
              <td style={{ border: '1px solid #fff', padding: '8px' }}>{ticketingData.revenue}</td>
            </tr>
          </tbody>
        </table>
        <button
          style={{
            padding: '8px 12px',
            marginBottom: '20px',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#3c8dbc',
            color: 'white',
            cursor: 'pointer'
          }}
          onClick={updateTicketingData}
        >
          Update Ticketing Data
        </button>

        {/* Lost & Found Management */}
        <h3>Lost & Found Management</h3>
        <ul style={{ marginBottom: '20px', textAlign: 'left' }}>
          {lostFound.map(item => (
            <li key={item.id}>
              <strong>{item.item}</strong>: {item.description} (Reported at {item.reportedAt})
            </li>
          ))}
        </ul>
        <button
          style={{
            padding: '8px 12px',
            marginBottom: '20px',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#3c8dbc',
            color: 'white',
            cursor: 'pointer'
          }}
          onClick={addLostFoundItem}
        >
          Report Lost Item
        </button>

        {/* Accessibility Assistance System */}
        <h3>Accessibility Assistance System</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>System</th>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(accessibilityStatus).map(([system, status]) => (
              <tr key={system}>
                <td style={{ border: '1px solid #fff', padding: '8px' }}>{system}</td>
                <td style={{ border: '1px solid #fff', padding: '8px' }}>{status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          style={{
            padding: '8px 12px',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#3c8dbc',
            color: 'white',
            cursor: 'pointer'
          }}
          onClick={updateAccessibilityStatus}
        >
          Update Accessibility Status
        </button>
      </div>
    </BoxScreen>
  );
};

export default PassengerInformation;
