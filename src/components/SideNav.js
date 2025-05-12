import React from 'react';
import { useNavigate } from 'react-router-dom';
import clockIcon from '../assets/icons/clock.svg'; // Service Management and Planning
import mapIcon from '../assets/icons/map.svg'; // Operational Control
import shieldIcon from '../assets/icons/shield.svg'; // Security and Monitoring
import energyIcon from '../assets/icons/battery-charging.svg'; // Energy Management
import twoPeopleIcon from '../assets/icons/users.svg'; // Passenger Information
import processorIcon from '../assets/icons/cpu.svg'; // Monitoring and Data Analytics
import sliderIcon from '../assets/icons/sliders.svg'; // Settings, Management, and System Status

const SideNav = () => {
  const navigate = useNavigate();

  const navStyle = {
    position: 'fixed',
    top: 25,
    left: 25,
    padding: 15,
    borderRadius: 30,
    backgroundColor: 'white',
    boxShadow: '0 3px 4px rgba(0,0,0,0.25)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 1000,
  };

  const iconStyle = {
    width: 30,
    height: 30,
    margin: '10px 0',
    cursor: 'pointer',
  };

  return (
    <div style={navStyle}>
      <img
        src={mapIcon}
        alt="Operational Control"
        style={iconStyle}
        title="Operational Control"
        onClick={() => navigate('/operational-control')}
      />
      <img
        src={clockIcon}
        alt="Service Management and Planning"
        style={iconStyle}
        title="Service Management"
        onClick={() => navigate('/service-management')}
      />
      <img
        src={shieldIcon}
        alt="Security and Monitoring"
        style={iconStyle}
        title="Security Monitoring"
        onClick={() => navigate('/security-monitoring')}
      />
      <img
        src={energyIcon}
        alt="Energy Management"
        style={iconStyle}
        title="Energy Management"
        onClick={() => navigate('/energy-management')}
      />
      <img
        src={twoPeopleIcon}
        alt="Passenger Information"
        style={iconStyle}
        title="Passenger Information"
        onClick={() => navigate('/passenger-information')}
      />
      <img
        src={processorIcon}
        alt="Monitoring and Data Analytics"
        style={iconStyle}
        title="Monitoring Analytics"
        onClick={() => navigate('/monitoring-analytics')}
      />
      <img
        src={sliderIcon}
        alt="Settings, Management and System Status"
        style={iconStyle}
        title="Settings"
        onClick={() => navigate('/settings')}
      />
    </div>
  );
};

export default SideNav;
