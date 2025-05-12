// src/pages/AnalyticsPage.js
import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { useNavigate } from 'react-router-dom';
import gearIcon from '../assets/icons/settings.svg';

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  useEffect(() => {
    function handleResize() {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return windowDimensions;
}

function TrainOccupancyChart({ data, chartHeight, darkMode }) {
  const chartData = {
    labels: data.map((_, index) => `Train ${index + 1}`),
    datasets: [
      {
        label: 'Train Occupancy (%)',
        data: data,
        backgroundColor: darkMode ? 'rgba(75,192,192,0.8)' : 'rgba(75,192,192,0.6)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: darkMode ? '#fff' : '#000' } }
    },
    scales: {
      x: { 
        ticks: { color: darkMode ? '#fff' : '#000' },
        grid: { color: darkMode ? '#444' : '#ccc' }
      },
      y: { 
        ticks: { color: darkMode ? '#fff' : '#000' },
        grid: { color: darkMode ? '#444' : '#ccc' }
      }
    }
  };
  
  return (
    <div style={{ height: chartHeight, margin: '10px' }}>
      <h3 style={{ color: darkMode ? '#fff' : '#000' }}>Train Occupancy</h3>
      <Bar data={chartData} options={options} />
    </div>
  );
}

function StationFlowChart({ data, chartHeight, darkMode }) {
  const chartData = {
    labels: data.map((_, index) => `Station ${index + 1}`),
    datasets: [
      {
        label: 'Passenger Flow',
        data: data,
        fill: false,
        backgroundColor: darkMode ? 'rgba(153,102,255,0.8)' : 'rgba(153,102,255,0.6)',
        borderColor: 'rgba(153,102,255,1)',
        borderWidth: 2,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: darkMode ? '#fff' : '#000' } }
    },
    scales: {
      x: { 
        ticks: { color: darkMode ? '#fff' : '#000' },
        grid: { color: darkMode ? '#444' : '#ccc' }
      },
      y: { 
        ticks: { color: darkMode ? '#fff' : '#000' },
        grid: { color: darkMode ? '#444' : '#ccc' }
      }
    }
  };
  
  return (
    <div style={{ height: chartHeight, margin: '10px' }}>
      <h3 style={{ color: darkMode ? '#fff' : '#000' }}>Station Passenger Flow</h3>
      <Line data={chartData} options={options} />
    </div>
  );
}

function AiInsightsPanel({ insights, darkMode }) {
  return (
    <div style={{ margin: '10px', color: darkMode ? '#fff' : '#000' }}>
      <h3>AI Insights</h3>
      <ul>
        {insights.map((insight, index) => (
          <li key={index}>{insight}</li>
        ))}
      </ul>
    </div>
  );
}

function App({ darkMode }) {
  const [trainData, setTrainData] = useState([50, 70, 40, 90]);
  const [stationData, setStationData] = useState([120, 80, 150, 100]);
  const [aiInsights, setAiInsights] = useState([
    'All systems nominal',
    'No anomalies detected',
  ]);
  const { height } = useWindowDimensions();
  const chartHeight = Math.max(300, height * 0.3);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setTrainData(prevData =>
        prevData.map(val => Math.max(0, Math.min(100, val + (Math.random() * 20 - 10))))
      );
      setStationData(prevData =>
        prevData.map(val => Math.max(0, Math.min(200, val + (Math.random() * 30 - 15))))
      );
      if (Math.random() > 0.8) {
        setAiInsights(prev => [
          ...prev,
          `Alert: Potential congestion detected at ${new Date().toLocaleTimeString()}`,
        ]);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const containerStyle = {
    padding: '20px',
    backgroundColor: darkMode ? '#121212' : '#fff',
    minHeight: '100vh',
  };

  const iconStyle = {
    width: 30,
    height: 30,
    cursor: 'pointer',
    marginTop: '20px',
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ color: darkMode ? '#fff' : '#000' }}>Analytics Dashboard</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 400px' }}>
          <TrainOccupancyChart data={trainData} chartHeight={chartHeight} darkMode={darkMode} />
        </div>
        <div style={{ flex: '1 1 400px' }}>
          <StationFlowChart data={stationData} chartHeight={chartHeight} darkMode={darkMode} />
        </div>
      </div>
      <div style={{ marginTop: '20px' }}>
        <AiInsightsPanel insights={aiInsights} darkMode={darkMode} />
      </div>
      <img
        src={gearIcon}
        alt="Settings"
        style={iconStyle}
        title="Settings"
        onClick={() => navigate('/settings')}
      />
    </div>
  );
}

export default App;
