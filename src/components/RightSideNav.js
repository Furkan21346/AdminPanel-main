import React from 'react';
import lifeBuoyIcon from '../assets/icons/life-buoy.svg';
import themeIcon from '../assets/icons/moon.svg';
import pencilIcon from '../assets/icons/pencil.svg';
import gearIcon from '../assets/icons/settings.svg';

const RightSideNav = ({
  editing,
  setEditing,
  darkMode,
  setDarkMode,
  toggleStationNames,
  setIsSelectingStationToEdit,
  setSelectedStation,
  viewMode,
  onViewModeChange,  // New prop for toggling view mode
}) => {
  const navStyle = {
    position: 'fixed',
    top: 25,
    right: 25,
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
        src={lifeBuoyIcon}
        alt="Accessibility"
        style={iconStyle}
        title="Toggle Station Names"
        onClick={toggleStationNames}
      />
      <img
        src={themeIcon}
        alt="Theme"
        style={iconStyle}
        title={`Switch ${darkMode ? 'Light' : 'Dark'} Mode`}
        onClick={() => setDarkMode(!darkMode)}
      />
      <img
        src={pencilIcon}
        alt="Map Features"
        style={iconStyle}
        title={editing ? 'Exit Editing Mode' : 'Enter Editing Mode'}
        onClick={() => {
          if (!editing) {
            setEditing(true);
            setIsSelectingStationToEdit(true);
          } else {
            setEditing(false);
            setIsSelectingStationToEdit(false);
            setSelectedStation(null); // Close edit box as well.
          }
        }}
      />
      <img
        src={gearIcon}
        alt="Settings / View Mode"
        style={iconStyle}
        title={`View Mode: ${viewMode} (click to change)`}
        onClick={onViewModeChange}
      />
    </div>
  );
};

export default RightSideNav;
