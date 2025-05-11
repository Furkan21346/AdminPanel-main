// src/pages/Settings.js
import React, { useState } from 'react';
import BoxScreen from '../components/BoxScreen';
import { useNavigate } from 'react-router-dom';

import { importSubwayData, exportSubwayData } from '../map/SubwayLoadSave';

// Dummy current map data (replace with your actual map state)
const currentMapData = {
  lines: [
    { id: 1, name: 'Middle West-East', color: '#EA1975', orientation: 'horizontal' },
    { id: 2, name: 'Top West-East', color: '#673067', orientation: 'vertical' }
  ],
  stations: [
    { name: 'Üsküdar', line: 1, stationNumber: 1, transfer: null, realX: 41.02561, realY: 29.01385 },
    { name: 'Fıstıkağacı', line: 1, stationNumber: 2, transfer: null, realX: 41.02836, realY: 29.02861 }
    // Add more stations as needed
  ]
};

const handleExportMap = () => {
  try {
    const txtData = exportSubwayData(currentMapData);
    // For demonstration, we'll simply alert the text.
    // In a real app, you might trigger a file download.
    alert("Exported Map Data:\n" + txtData);
  } catch (err) {
    alert("Error exporting map data: " + err.message);
  }
};

const handleImportMap = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const mapData = importSubwayData(event.target.result);
      console.log("Imported Map Data:", mapData);
      alert("Map imported successfully!");
      // TODO: Update your application state with mapData as needed.
    } catch (err) {
      alert("Error importing map data: " + err.message);
    }
  };
  reader.readAsText(file);
};

const handleImportMapText = (fileText) => {
  try {
    const mapData = importSubwayData(fileText);
    console.log("Imported Map Data:", mapData);
    alert("Map imported successfully!");
    // TODO: Update your application state with mapData as needed.
  } catch (err) {
    alert("Error importing map data: " + err.message);
  }
};


const Settings = ({ onClose }) => {
  const navigate = useNavigate();
  // User Access Management dummy state
  const [users, setUsers] = useState([
    { id: 1, name: 'Admin User', role: 'Administrator', permissions: 'All' },
    { id: 2, name: 'Operator User', role: 'Operator', permissions: 'Limited' },
  ]);

  // System Health Monitoring dummy state
  const [systemHealth, setSystemHealth] = useState([
    { component: 'Server', status: 'Operational' },
    { component: 'SCADA', status: 'Operational' },
    { component: 'PLC', status: 'Operational' },
  ]);

  // Log & Audit Trail Management dummy state
  const [logs, setLogs] = useState([
    { id: 1, message: 'Admin logged in.', timestamp: '08:00 AM' },
    { id: 2, message: 'Backup initiated.', timestamp: '08:05 AM' },
  ]);

  // Customizable Alerts & Notifications dummy state
  const [alertSettings, setAlertSettings] = useState({
    thresholdDelay: 5, // minutes
    thresholdTemperature: 75, // °F
  });

  // External API integration dummy data
  const [externalData, setExternalData] = useState({
    weather: 'Sunny, 80°F',
    traffic: 'Moderate',
  });

  // Backup & Disaster Recovery dummy state
  const [backupStatus, setBackupStatus] = useState('Up-to-date');

  // --- Functions ---

  // Add a new user (for User Access Management)
  const addUser = () => {
    const newUser = {
      id: users.length + 1,
      name: `User ${users.length + 1}`,
      role: 'Operator',
      permissions: 'Limited',
    };
    setUsers([...users, newUser]);
    alert('New user added.');
  };

  // Update system health (simulate status changes)
  const updateSystemHealth = () => {
    setSystemHealth(prev =>
      prev.map(item => ({
        ...item,
        status: Math.random() > 0.8 ? 'Degraded' : 'Operational',
      }))
    );
    alert('System health updated.');
  };

  // Clear logs (for Log & Audit Trail Management)
  const clearLogs = () => {
    setLogs([]);
    alert('Logs cleared.');
  };

  // Update alert settings (simulate updating thresholds)
  const updateAlertSettings = () => {
    setAlertSettings({
      thresholdDelay: alertSettings.thresholdDelay + 1,
      thresholdTemperature: alertSettings.thresholdTemperature + 1,
    });
    alert('Alert settings updated.');
  };

  // Update external API data (simulate fetching data)
  const updateExternalData = () => {
    setExternalData({
      weather: 'Cloudy, 70°F',
      traffic: 'Heavy',
    });
    alert('External data updated.');
  };

  // Run backup (simulate backup process)
  const runBackup = () => {
    setBackupStatus('Backup Running');
    setTimeout(() => {
      setBackupStatus('Backup Completed');
      alert('Backup completed successfully.');
    }, 2000);
  };

  // Restore backup (simulate disaster recovery)
  const restoreBackup = () => {
    alert('System restored from backup.');
  };

  return (
    <BoxScreen title="Settings, Management, and System Status" onClose={() => navigate('/')}>
      <div style={{ padding: '20px', color: 'white' }}>
        {/* User Access Management */}
        <h3>User Access Management</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>Name</th>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>Role</th>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>Permissions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td style={{ border: '1px solid #fff', padding: '8px' }}>{user.name}</td>
                <td style={{ border: '1px solid #fff', padding: '8px' }}>{user.role}</td>
                <td style={{ border: '1px solid #fff', padding: '8px' }}>{user.permissions}</td>
              </tr>
            ))}
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
          onClick={addUser}
        >
          Add User
        </button>

        {/* System Health Monitoring */}
        <h3>System Health Monitoring</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>Component</th>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {systemHealth.map((item, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #fff', padding: '8px' }}>{item.component}</td>
                <td style={{ border: '1px solid #fff', padding: '8px' }}>{item.status}</td>
              </tr>
            ))}
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
          onClick={updateSystemHealth}
        >
          Update System Health
        </button>

        {/* Log & Audit Trail Management */}
        <h3>Log & Audit Trail Management</h3>
        <ul style={{ marginBottom: '20px', textAlign: 'left' }}>
          {logs.map(log => (
            <li key={log.id}>
              {log.timestamp}: {log.message}
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
          onClick={clearLogs}
        >
          Clear Logs
        </button>

        {/* Customizable Alerts & Notifications */}
        <h3>Customizable Alerts & Notifications</h3>
        <p>
          Delay Threshold: {alertSettings.thresholdDelay} min, Temperature Threshold: {alertSettings.thresholdTemperature}°F
        </p>
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
          onClick={updateAlertSettings}
        >
          Update Alert Settings
        </button>

        {/* Integration with External APIs */}
        <h3>Integration with External APIs</h3>
        <p>
          Weather: {externalData.weather} <br />
          Traffic: {externalData.traffic}
        </p>
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
          onClick={updateExternalData}
        >
          Update External Data
        </button>

        {/* Backup & Disaster Recovery */}
        <h3>Backup & Disaster Recovery</h3>
        <p>Status: {backupStatus}</p>
        <button
          style={{
            padding: '8px 12px',
            marginRight: '10px',
            marginBottom: '20px',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#3c8dbc',
            color: 'white',
            cursor: 'pointer'
          }}
          onClick={runBackup}
        >
          Run Backup
        </button>
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
          onClick={restoreBackup}
        >
          Restore Backup
        </button>

        // Then, in your Settings component’s render:
<h3>Import/Export Map</h3>
<div style={{ marginBottom: '20px' }}>
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
    onClick={handleExportMap}
  >
    Export Map
  </button>
  <input
  type="file"
  accept=".txt"
  onChange={(e) => {
    if (!e || !e.target || !e.target.files) return; // defensive check
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      handleImportMapText(event.target.result);
    };
    reader.readAsText(file);
  }}
  style={{
    padding: '8px 12px',
    borderRadius: '5px',
    border: '1px solid #3c8dbc',
    backgroundColor: '#fff',
    cursor: 'pointer'
  }}
/>
</div>

      </div>
    </BoxScreen>
  );
};

export default Settings;
