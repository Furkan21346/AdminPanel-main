import React, { useState } from 'react';

const InterchangeModal = ({ currentStation, onSave, onCancel }) => {
  const [targetStationId, setTargetStationId] = useState('');
  const [groupName, setGroupName] = useState('');

  const modalStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'white',
    padding: '20px',
    zIndex: 1200,
    borderRadius: '10px',
  };

  return (
    <div style={modalStyle}>
      <h3>Select Station for Interchange</h3>
      <input
        type="text"
        placeholder="Target Station ID"
        value={targetStationId}
        onChange={(e) => setTargetStationId(e.target.value)}
        style={{ marginBottom: '10px', width: '100%' }}
      />
      <input
        type="text"
        placeholder="Interchange Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        style={{ marginBottom: '10px', width: '100%' }}
      />
      <div>
        <button onClick={() => onSave(targetStationId, groupName)}>Save</button>
        <button onClick={onCancel} style={{ marginLeft: '10px' }}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default InterchangeModal;
