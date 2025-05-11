// src/pages/EnergyManagement.js
import React, { useState, useEffect } from 'react';
import BoxScreen from '../components/BoxScreen';
import { useNavigate } from 'react-router-dom';

const EnergyManagement = () => {
  const navigate = useNavigate();
  // Basic energy management state
  const [energyData, setEnergyData] = useState({
    tractionPowerUsage: 75,      // percentage of traction power usage
    energyConsumption: 1500,     // energy consumption in kWh
    backupStatus: 'Online',      // status of the backup system
  });

  // Transformer statuses (T1, T2, T3)
  const [transformers, setTransformers] = useState({
    T1: 'Normal',
    T2: 'Normal',
    T3: 'Normal',
  });

  // Additional real-time electrical parameters
  const [voltage, setVoltage] = useState(230);     // in volts
  const [current, setCurrent] = useState(100);       // in amps
  const [frequency, setFrequency] = useState(50);    // in Hz

  // Simulate real-time updates every 10 seconds for energy data and electrical parameters
  useEffect(() => {
    const interval = setInterval(() => {
      // Update energy data
      setEnergyData(prevData => ({
        ...prevData,
        tractionPowerUsage: Math.max(
          0,
          Math.min(100, prevData.tractionPowerUsage + (Math.random() * 10 - 5))
        ),
        energyConsumption: Math.max(0, prevData.energyConsumption + (Math.random() * 100 - 50)),
      }));

      // Update electrical parameters with small fluctuations
      setVoltage(prev => Math.max(210, Math.min(250, prev + (Math.random() * 4 - 2))));
      setCurrent(prev => Math.max(80, Math.min(120, prev + (Math.random() * 4 - 2))));
      setFrequency(prev => Math.max(49.5, Math.min(50.5, prev + (Math.random() * 0.2 - 0.1))));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Function to toggle the backup system status
  const handleBackupToggle = () => {
    setEnergyData(prevData => ({
      ...prevData,
      backupStatus: prevData.backupStatus === 'Online' ? 'Offline' : 'Online',
    }));
  };

  // Function 1: Simulate Transformer Failure
  const simulateTransformerFailure = () => {
    const transformerKeys = Object.keys(transformers);
    const randomIndex = Math.floor(Math.random() * transformerKeys.length);
    const failedTransformer = transformerKeys[randomIndex];
    setTransformers(prev => ({
      ...prev,
      [failedTransformer]: 'Fault',
    }));
    alert(`Transformer ${failedTransformer} has failed. Switching to auxiliary transformer.`);
    setEnergyData(prev => ({
      ...prev,
      backupStatus: `Auxiliary for ${failedTransformer} Active`,
    }));
  };

  // Function 2: Generate Energy Consumption Report
  const generateConsumptionReport = () => {
    const report = `Consumption Report:
Traction Power Usage: ${energyData.tractionPowerUsage.toFixed(1)}%
Energy Consumption: ${energyData.energyConsumption.toFixed(0)} kWh
Backup System: ${energyData.backupStatus}`;
    alert(report);
  };

  // Function 3: Optimize Energy Consumption
  const optimizeEnergyConsumption = () => {
    setEnergyData(prev => ({
      ...prev,
      tractionPowerUsage: Math.max(0, prev.tractionPowerUsage - 5),
      energyConsumption: Math.max(0, prev.energyConsumption * 0.95),
    }));
    alert('Energy consumption optimized by 5% reduction.');
  };

  // Function 4: Simulate Voltage Drop
  const simulateVoltageDrop = () => {
    setVoltage(prev => Math.max(200, prev - 10));
    alert('Simulated voltage drop.');
  };

  // Function 5: Simulate Current Surge
  const simulateCurrentSurge = () => {
    setCurrent(prev => Math.min(150, prev + 15));
    alert('Simulated current surge.');
  };

  // Function 6: Generate Power Quality Report
  const generatePowerQualityReport = () => {
    const report = `Power Quality Report:
Voltage: ${voltage.toFixed(1)} V
Current: ${current.toFixed(1)} A
Frequency: ${frequency.toFixed(2)} Hz`;
    alert(report);
  };

  return (
    <BoxScreen title="Energy Management" onClose={() => navigate('/')}>
      <div style={{ padding: '20px', color: 'white' }}>
        {/* Section: Real-Time Energy Tracking */}
        <h3>Real-Time Energy Tracking</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>Parameter</th>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #fff', padding: '8px' }}>Traction Power Usage (%)</td>
              <td style={{ border: '1px solid #fff', padding: '8px' }}>
                {energyData.tractionPowerUsage.toFixed(1)}%
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #fff', padding: '8px' }}>Energy Consumption (kWh)</td>
              <td style={{ border: '1px solid #fff', padding: '8px' }}>
                {energyData.energyConsumption.toFixed(0)} kWh
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #fff', padding: '8px' }}>Backup System Status</td>
              <td style={{ border: '1px solid #fff', padding: '8px' }}>
                {energyData.backupStatus}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Section: Real-Time Electrical Parameters */}
        <h3>Real-Time Electrical Parameters</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>Parameter</th>
              <th style={{ border: '1px solid #fff', padding: '8px', textAlign: 'left' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #fff', padding: '8px' }}>Voltage (V)</td>
              <td style={{ border: '1px solid #fff', padding: '8px' }}>{voltage.toFixed(1)} V</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #fff', padding: '8px' }}>Current (A)</td>
              <td style={{ border: '1px solid #fff', padding: '8px' }}>{current.toFixed(1)} A</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #fff', padding: '8px' }}>Frequency (Hz)</td>
              <td style={{ border: '1px solid #fff', padding: '8px' }}>{frequency.toFixed(2)} Hz</td>
            </tr>
          </tbody>
        </table>

        {/* Section: Reports and Control */}
        <h3>Energy Consumption Reports</h3>
        <p>Detailed consumption reports, charts, and graphs would be displayed here.</p>
        <p>(Placeholder for advanced visualizations and analytics.)</p>

        <h3>Power Backup Management</h3>
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
          onClick={handleBackupToggle}
        >
          Toggle Backup System
        </button>

        {/* Additional Functions */}
        <div style={{ marginTop: '20px' }}>
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
            onClick={simulateTransformerFailure}
          >
            Simulate Transformer Failure
          </button>
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
            onClick={generateConsumptionReport}
          >
            Generate Consumption Report
          </button>
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
            onClick={optimizeEnergyConsumption}
          >
            Optimize Energy Consumption
          </button>
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
            onClick={simulateVoltageDrop}
          >
            Simulate Voltage Drop
          </button>
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
            onClick={simulateCurrentSurge}
          >
            Simulate Current Surge
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
            onClick={generatePowerQualityReport}
          >
            Generate Power Quality Report
          </button>
        </div>
      </div>
    </BoxScreen>
  );
};

export default EnergyManagement;
