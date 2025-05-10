import React, { useState, useEffect } from 'react';
import BoxScreen from '../components/BoxScreen';

const SecurityMonitoring = ({ onClose }) => {
  // Dummy data for CCTV feeds
  const [cctvFeeds, setCctvFeeds] = useState([
    { id: 1, location: 'Station A - Platform 1', feedUrl: 'http://example.com/feed1', status: 'Active' },
    { id: 2, location: 'Station B - Entrance', feedUrl: 'http://example.com/feed2', status: 'Active' },
    { id: 3, location: 'Station C - Parking', feedUrl: 'http://example.com/feed3', status: 'Inactive' },
  ]);

  // Dummy data for security alarm systems
  const [alarmStatus, setAlarmStatus] = useState([
    { id: 1, name: 'Station A - Door Alarm', status: 'Normal' },
    { id: 2, name: 'Station B - Emergency Alarm', status: 'Triggered' },
    { id: 3, name: 'Station C - Fire Alarm', status: 'Normal' },
  ]);

  // Dummy data for access control logs
  const [accessLogs, setAccessLogs] = useState([
    { id: 1, user: 'Operator1', action: 'Access Granted', time: '08:00 AM' },
    { id: 2, user: 'Operator2', action: 'Access Denied', time: '08:05 AM' },
    { id: 3, user: 'Operator3', action: 'Access Granted', time: '08:10 AM' },
  ]);

  // Example function to simulate refreshing security data
  const refreshSecurityData = () => {
    console.log('Refreshing security data...');
    // In a real application, you would fetch updated data here.
  };

  useEffect(() => {
    // Simulate periodic data refresh every 15 seconds
    const interval = setInterval(() => {
      refreshSecurityData();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <BoxScreen title="Security and Monitoring" onClose={onClose}>
      <div style={{ padding: '20px', color: 'white' }}>
        <h3>CCTV Feeds</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>Location</th>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>Feed Status</th>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {cctvFeeds.map(feed => (
              <tr key={feed.id}>
                <td style={{ border: '1px solid #fff', padding: '8px' }}>{feed.location}</td>
                <td style={{ border: '1px solid #fff', padding: '8px' }}>{feed.status}</td>
                <td style={{ border: '1px solid #fff', padding: '8px' }}>
                  <button
                    style={{
                      padding: '5px 10px',
                      borderRadius: '3px',
                      border: 'none',
                      backgroundColor: '#3c8dbc',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                    onClick={() => window.open(feed.feedUrl, '_blank')}
                  >
                    View Feed
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Security Alarm Systems</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>Alarm</th>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>Status</th>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {alarmStatus.map(alarm => (
              <tr key={alarm.id}>
                <td style={{ border: '1px solid #fff', padding: '8px' }}>{alarm.name}</td>
                <td style={{ border: '1px solid #fff', padding: '8px' }}>{alarm.status}</td>
                <td style={{ border: '1px solid #fff', padding: '8px' }}>
                  <button
                    style={{
                      padding: '5px 10px',
                      borderRadius: '3px',
                      border: 'none',
                      backgroundColor: '#3c8dbc',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                    onClick={() => alert(`Testing alarm for ${alarm.name}`)}
                  >
                    Test Alarm
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Access Control Logs</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>User</th>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>Action</th>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>Time</th>
            </tr>
          </thead>
          <tbody>
            {accessLogs.map(log => (
              <tr key={log.id}>
                <td style={{ border: '1px solid #fff', padding: '8px' }}>{log.user}</td>
                <td style={{ border: '1px solid #fff', padding: '8px' }}>{log.action}</td>
                <td style={{ border: '1px solid #fff', padding: '8px' }}>{log.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </BoxScreen>
  );
};

export default SecurityMonitoring;
