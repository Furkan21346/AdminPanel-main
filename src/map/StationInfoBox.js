import React, { useState, useEffect } from 'react';
import './StationInfoBox.css';

const StationInfoBox = ({
    station,         // Selected station object or null
    editing,        // Boolean: true for edit mode, false for normal mode
    isSelectingStationToEdit, // Boolean: true when editing a station is active
    onSave,          // Handler to save station changes
    onCancel,        // Handler to cancel/close the box
    onDelete,        // Handler to delete the station
    onAddTransfer,   // Handler to open transfer editing UI
    onAddNewStation, // Handler to add a new station (edit mode default panel)
    onDeleteStation, // Handler to delete an existing station (edit mode default panel)
    onAddNewLine,    // Handler to add a new line (edit mode default panel)
    onDeleteLine,     // Handler to delete an existing line (edit mode default panel)
    //isEditModeStationSelected = true, // Boolean: true when a station is selected for editing
}) => {
  // Always call hooks at the top level.
  const [stationName, setStationName] = useState(station ? station.name : '');
  const [availability, setAvailability] = useState(station ? station.availability : 'available');
  // A cycle counter (in seconds) to simulate train timing updates.
  const [cycle, setCycle] = useState(0);
  // For push notification: ensure we notify only once when editMode turns true.
  const [notified, setNotified] = useState(false);

  // Update station values when station prop changes.
  useEffect(() => {
    setStationName(station ? station.name : '');
    setAvailability(station ? station.availability : 'Available');
  }, [station]);

  // Cycle updater: updates every second, cycles from 0 to 119 seconds.
  useEffect(() => {
    const interval = setInterval(() => {
      setCycle(prev => (prev + 1) % 120);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute an offset cycle for direction 2 (e.g., 30 seconds offset)
  const cycle2 = (cycle + 30) % 120;

  // Compute dummy timing texts:
  const getTimeText = (current) => current < 10 ? "Just arrived" : `${current} sec ago`;
  const recentTime1 = getTimeText(cycle);
  const comingTime1 = `in ${120 - cycle} sec`;
  const recentTime2 = getTimeText(cycle2);
  const comingTime2 = `in ${120 - cycle2} sec`;

  // Determine train codes based on station.line (default to "1" if missing)
  const lineNum = station && station.line ? station.line : '1';
  const trainCodeDir1 = `TR${lineNum}01`;
  const trainCodeDir2 = `TR${lineNum}02`;

  // Determine box dimensions based on mode.
  const boxDimensions = editing
    ? { width: '310px', height: '330px' }
    : { width: '310px', height: '310px' };

  // Base box style (using provided fixed position/size, text left-aligned)
  const baseBoxStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: station ? station.lineColor : '#121F48',
    color: 'white',
    borderRadius: '15px',
    padding: '10px',
    zIndex: 1100,
    textAlign: 'left',
    ...boxDimensions,
  };

  // Push notification when editMode is enabled.
  useEffect(() => {
    if (editing && !notified) {
      //alert("Editing mode is enabled on StationInfoBox.");
      setNotified(true);
    }
    if (!editing) {
      setNotified(false);
    }
  }, [editing, notified]);

  // ----- Normal Mode (editMode false) -----
if (!editing && station) {
    //isEditModeStationSelected(false);
    return (
      <div className="station-info-box normal" style={baseBoxStyle}>
        <button className="close-btn" onClick={onCancel}>X</button>
        <h3>{station.stationId}</h3>
        <p>{station.lineName}</p>
        <p>
          { station.isTransfer
            ? `Transfer Station: ${station.interchangeName}`
            : 'Normal Station'
          }
        </p>
        <p><strong>Availability:</strong> { station.availability || 'Available' }</p>
        {/* 2x2 table for trains */}
        <h4>Trains</h4>
        <table className="trains-table" style={{ width: '100%', fontSize: '10pt' }}>
          <thead>
            <tr>
              <th>Recent Train</th>
              <th>Coming Train</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{`${trainCodeDir1} - ${recentTime1}`}</td>
              <td>{`${trainCodeDir1} - ${comingTime1}`}</td>
            </tr>
            <tr>
              <td>{`${trainCodeDir2} - ${recentTime2}`}</td>
              <td>{`${trainCodeDir2} - ${comingTime2}`}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }  

// ----- Edit Mode (always show default panel) -----
if (editing) {
    return (
      <>
        {/* Default Edit Panel */}
        <div className="station-info-box default-edit" style={baseBoxStyle}>
          <h3>Edit Mode: Manage Stations & Lines</h3>
          <div style={{ marginTop: '20px' }}>
            <button onClick={onAddNewStation}>Add New Station</button>
            <button onClick={onDeleteStation}>Delete Existing Station</button>
          </div>
          <div style={{ marginTop: '20px' }}>
            <button onClick={onAddNewLine}>Add New Line</button>
            <button onClick={onDeleteLine}>Delete Existing Line</button>
          </div>
        </div>

        {/* Station Editing Panel (overlaid) */}
        { isSelectingStationToEdit && station && (
          <div className="station-info-box edit" style={baseBoxStyle}>
            <h3 style={{ textAlign: 'left', marginBottom: '10px' }}>
              {station.stationId}
            </h3>
            <button className="close-btn" onClick={onCancel}>X</button>
  
            <div className="edit-row">
              <div className="left">
                <label>Station Name:</label>
                <input
                  type="text"
                  value={stationName}
                  onChange={(e) => setStationName(e.target.value)}
                />
              </div>
              <div className="right">
                <button onClick={() => onSave({ ...station, name: stationName })}>
                  Change Station Name
                </button>
              </div>
            </div>
  
            <div className="edit-row">
              <div className="left">
                <span>
                  Transfer Status:{" "}
                  {station.isTransfer
                    ? `Transfer: ${station.interchangeName}`
                    : "Normal"}
                </span>
              </div>
              <div className="right">
                <button onClick={onAddTransfer}>Add/Edit Transfers</button>
              </div>
            </div>
  
            <div className="edit-row">
              <div className="left">
                <label>Availability:</label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                >
                  <option value="Available">Available</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
              <div className="right">
                <button onClick={() => onSave({ ...station, availability })}>
                  Change Availability
                </button>
              </div>
            </div>
  
            <div className="edit-row">
              <div className="left">
                <button onClick={() => onDelete(station.id)}>Delete Station</button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

export default StationInfoBox;
