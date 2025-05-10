import React from 'react';
import { Link } from 'react-router-dom';
import clockIcon from '../assets/icons/clock.svg'; // Service Management and Planning
import mapIcon from '../assets/icons/map.svg'; // Operational Control
import shieldIcon from '../assets/icons/shield.svg'; // Security and Monitoring
import energyIcon from '../assets/icons/battery-charging.svg'; // Energy Management
import twoPeopleIcon from '../assets/icons/users.svg'; // Passenger Information
import processorIcon from '../assets/icons/cpu.svg'; // Monitoring and Data Analytics
import sliderIcon from '../assets/icons/sliders.svg'; // Settings, Management, and System Status

const SideNav = ({ setShowPanel }) => {
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

  const handlePanelClick = () => {
    setShowPanel(true);
  };

  return (
    <div style={navStyle}>
      <Link to="/operational-control" onClick={handlePanelClick}>
        <img src={mapIcon} alt="Operational Control" style={iconStyle} title="Operational Control" />
      </Link>
      <Link to="/service-management" onClick={handlePanelClick}>
        <img src={clockIcon} alt="Service Management and Planning" style={iconStyle} title="Service Management" />
      </Link>
      <Link to="/security-monitoring" onClick={handlePanelClick}>
        <img src={shieldIcon} alt="Security and Monitoring" style={iconStyle} title="Security Monitoring" />
      </Link>
      <Link to="/energy-management" onClick={handlePanelClick}>
        <img src={energyIcon} alt="Energy Management" style={iconStyle} title="Energy Management" />
      </Link>
      <Link to="/passenger-information" onClick={handlePanelClick}>
        <img src={twoPeopleIcon} alt="Passenger Information" style={iconStyle} title="Passenger Information" />
      </Link>
      <Link to="/monitoring-analytics" onClick={handlePanelClick}>
        <img src={processorIcon} alt="Monitoring and Data Analytics" style={iconStyle} title="Monitoring Analytics" />
      </Link>
      <Link to="/settings" onClick={handlePanelClick}>
        <img src={sliderIcon} alt="Settings, Management and System Status" style={iconStyle} title="Settings" />
      </Link>
    </div>
  );
};

export default SideNav;
