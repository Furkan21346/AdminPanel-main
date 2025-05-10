import React from 'react';

const BoxScreen = ({ title, children, onClose }) => {
  const boxStyle = {
    backgroundColor: '#121F48',
    position: 'fixed',
    top: '25px',
    left: '110px',
    bottom: '10px',
    height: 'calc(100vh - 100px)',
    width: '400px',
    borderRadius: '30px',
    padding: '20px 15px',
    textAlign: 'left',
    color: 'white',
    overflow: 'hidden', // Enables the vertical scrollbar when needed
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'left',
  };

  const contentStyle = {
    height: 'calc(100% - 100px)',
    overflowY: 'auto', // Scroll only if needed
    paddingRight: '0px', // Adds padding to prevent overlap with scrollbar
  };

  return (
    <div className="boxScreen" style={boxStyle}>
      <div style={headerStyle}>
        <h2 style={{ marginLeft: '10px' }}>{title}</h2>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            fontSize: '16px',
            cursor: 'pointer',
          }}
          title="Close Panel"
        >
          X
        </button>
      </div>
      <div style={contentStyle}>
        {children}
      </div>
    </div>
  );
};

export default BoxScreen;
