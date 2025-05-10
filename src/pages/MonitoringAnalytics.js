// src/pages/MonitoringAnalytics.js
import React, { useState, useEffect } from 'react';
import BoxScreen from '../components/BoxScreen';

const MonitoringAnalytics = ({ onClose }) => {
  // Dummy data for Passenger Flow Prediction
  const [passengerFlowData, setPassengerFlowData] = useState([
    { station: 'Station A', predictedCrowd: 'High', predictedOccupancy: '80%' },
    { station: 'Station B', predictedCrowd: 'Medium', predictedOccupancy: '65%' },
    { station: 'Station C', predictedCrowd: 'Low', predictedOccupancy: '40%' },
  ]);

  // Dummy data for Train Performance Analysis
  const [trainPerformance, setTrainPerformance] = useState([
    { train: 'Train 1', onTime: '95%', dwellTime: '30s', headwayAccuracy: '98%' },
    { train: 'Train 2', onTime: '88%', dwellTime: '45s', headwayAccuracy: '92%' },
    { train: 'Train 3', onTime: '90%', dwellTime: '35s', headwayAccuracy: '95%' },
  ]);

  // Dummy data for Fault Detection & Predictive Maintenance
  const [faults, setFaults] = useState([
    { id: 1, component: 'Signal System', issue: 'Intermittent failure', status: 'Alert' },
    { id: 2, component: 'Door Mechanism', issue: 'Delayed closure', status: 'Warning' },
  ]);

  // Dummy data for Energy Efficiency Reports
  const [energyEfficiency, setEnergyEfficiency] = useState({
    averagePowerUsage: '75 kW',
    optimizationSuggestions: 'Reduce idle times and adjust HVAC settings',
  });

  // Dummy data for Service Reliability Metrics
  const [serviceReliability, setServiceReliability] = useState({
    averageDelay: '2 min',
    disruptions: 'Minor technical issues',
    scheduleCompliance: '97%',
  });

  // Dummy state for custom dashboard report
  const [customReport, setCustomReport] = useState('');

  // Function to generate a custom dashboard report
  const generateCustomReport = () => {
    const report = `
Monitoring Analytics Report:

Passenger Flow Predictions:
${passengerFlowData
  .map(
    (data) =>
      `${data.station}: Predicted Crowd = ${data.predictedCrowd}, Occupancy = ${data.predictedOccupancy}`
  )
  .join('\n')}

Train Performance Analysis:
${trainPerformance
  .map(
    (tp) =>
      `${tp.train}: On-Time = ${tp.onTime}, Dwell Time = ${tp.dwellTime}, Headway Accuracy = ${tp.headwayAccuracy}`
  )
  .join('\n')}

Fault Detection & Maintenance:
${faults.map((f) => `${f.component}: ${f.issue} [${f.status}]`).join('\n')}

Energy Efficiency:
- Average Power Usage: ${energyEfficiency.averagePowerUsage}
- Suggestions: ${energyEfficiency.optimizationSuggestions}

Service Reliability:
- Average Delay: ${serviceReliability.averageDelay}
- Disruptions: ${serviceReliability.disruptions}
- Schedule Compliance: ${serviceReliability.scheduleCompliance}
    `;
    setCustomReport(report);
    alert(report);
  };

  // Simulate periodic updates for passenger flow prediction (every 20 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setPassengerFlowData(prevData =>
        prevData.map(item => ({
          ...item,
          // Simulate a random update for predicted occupancy percentage
          predictedOccupancy: `${Math.floor(50 + Math.random() * 50)}%`,
        }))
      );
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  // Simulate periodic updates for train performance analysis (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setTrainPerformance(prevData =>
        prevData.map(item => ({
          ...item,
          onTime: `${Math.floor(85 + Math.random() * 15)}%`,
          dwellTime: `${Math.floor(25 + Math.random() * 20)}s`,
          headwayAccuracy: `${Math.floor(90 + Math.random() * 10)}%`,
        }))
      );
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Simulate periodic fault detection updates (every 40 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setFaults(prevFaults => {
        // Randomly add a new fault or update status of an existing fault
        if (Math.random() > 0.7) {
          const newFault = {
            id: prevFaults.length + 1,
            component: 'Brake System',
            issue: 'Abnormal wear detected',
            status: 'Alert',
          };
          return [...prevFaults, newFault];
        } else {
          return prevFaults.map(fault => ({
            ...fault,
            status: Math.random() > 0.5 ? 'Normal' : fault.status,
          }));
        }
      });
    }, 40000);
    return () => clearInterval(interval);
  }, []);

  return (
    <BoxScreen title="Monitoring and Data Analytics" onClose={onClose}>
      <div style={{ padding: '20px', color: 'white' }}>
        {/* Passenger Flow Prediction */}
        <h3>Passenger Flow Prediction</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>Station</th>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>Predicted Crowd</th>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>Predicted Occupancy</th>
            </tr>
          </thead>
          <tbody>
            {passengerFlowData.map((data, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #fff', padding: '8px' }}>{data.station}</td>
                <td style={{ border: '1px solid #fff', padding: '8px' }}>{data.predictedCrowd}</td>
                <td style={{ border: '1px solid #fff', padding: '8px' }}>{data.predictedOccupancy}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Train Performance Analysis */}
        <h3>Train Performance Analysis</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>Train</th>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>On-Time Performance</th>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>Dwell Time</th>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>Headway Accuracy</th>
            </tr>
          </thead>
          <tbody>
            {trainPerformance.map((tp, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #fff', padding: '8px' }}>{tp.train}</td>
                <td style={{ border: '1px solid #fff', padding: '8px' }}>{tp.onTime}</td>
                <td style={{ border: '1px solid #fff', padding: '8px' }}>{tp.dwellTime}</td>
                <td style={{ border: '1px solid #fff', padding: '8px' }}>{tp.headwayAccuracy}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Fault Detection & Predictive Maintenance */}
        <h3>Fault Detection & Predictive Maintenance</h3>
        <ul style={{ marginBottom: '20px', textAlign: 'left' }}>
          {faults.map(fault => (
            <li key={fault.id}>
              <strong>{fault.component}</strong>: {fault.issue} [{fault.status}]
            </li>
          ))}
        </ul>

        {/* Energy Efficiency Reports */}
        <h3>Energy Efficiency Reports</h3>
        <p>
          Average Power Usage: {energyEfficiency.averagePowerUsage}<br />
          Suggestions: {energyEfficiency.optimizationSuggestions}
        </p>

        {/* Service Reliability Metrics */}
        <h3>Service Reliability Metrics</h3>
        <p>
          Average Delay: {serviceReliability.averageDelay}<br />
          Disruptions: {serviceReliability.disruptions}<br />
          Schedule Compliance: {serviceReliability.scheduleCompliance}
        </p>

        {/* Custom Dashboard & Reports */}
        <h3>Custom Dashboard & Reports</h3>
        <button
          style={{
            padding: '8px 12px',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#3c8dbc',
            color: 'white',
            cursor: 'pointer'
          }}
          onClick={generateCustomReport}
        >
          Generate Custom Report
        </button>
      </div>
    </BoxScreen>
  );
};

export default MonitoringAnalytics;
