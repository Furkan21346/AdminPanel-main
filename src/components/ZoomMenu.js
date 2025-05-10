import React from 'react';

const ZoomMenu = ({ zoomRef }) => {
    const handleZoomIn = () => {
      if (zoomRef.current) {
        zoomRef.current.zoomIn();
      }
    };
  
    const handleZoomOut = () => {
      if (zoomRef.current) {
        zoomRef.current.zoomOut();
      }
    };
  
    const containerStyle = {
      position: 'fixed',
      top: 25,
      // Position it to the left of the right sidebar; adjust the 'right' value as needed.
      right: 110,
      padding: 15,
      borderRadius: 50,
      backgroundColor: 'white',
      boxShadow: '0 3px 4px rgba(0,0,0,0.25)',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: '10px',
      zIndex: 1100,
    };
  
    const buttonStyle = {
      fontSize: '40px',
      width: '40px',
      height: '40px',
      cursor: 'pointer',
      border: 'none',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent',
    };
  
    return (
      <div style={containerStyle}>
        <button onClick={handleZoomIn} style={buttonStyle}>+</button>
        <button onClick={handleZoomOut} style={buttonStyle}>–</button>
      </div>
    );
  };
  
  export default ZoomMenu;
  
