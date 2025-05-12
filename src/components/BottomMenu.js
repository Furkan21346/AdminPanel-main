import React from 'react';
import originalMapIcon from '../assets/icons/vector-map.svg';
import leafletMapIcon from '../assets/icons/map.svg';
import analyticsIcon from '../assets/icons/analytics.svg';

const BottomMenu = ({ onVectorMapClick, onLeafletMapClick, onAnalyticsClick }) => {
  const containerStyle = {
    position: 'fixed',
    bottom: 25,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 160,
    padding: 15,
    borderRadius: 50,
    backgroundColor: 'white',
    boxShadow: '0 3px 4px rgba(0,0,0,0.25)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    gap: '20px',
    zIndex: 1100,
  };

  const iconStyle = {
    width: 30,
    height: 30,
    cursor: 'pointer',
  };

  return (
    <div style={containerStyle}>
      <img
        src={originalMapIcon}
        alt="Original Map"
        style={iconStyle}
        title="Original Map"
        onClick={onVectorMapClick}
      />
      <img
        src={leafletMapIcon}
        alt="Leaflet Map"
        style={iconStyle}
        title="Leaflet Map"
        onClick={onLeafletMapClick}
      />
      <img
        src={analyticsIcon}
        alt="Analytics"
        style={iconStyle}
        title="Analytics"
        onClick={onAnalyticsClick}
      />
    </div>
  );
};

export default BottomMenu;
