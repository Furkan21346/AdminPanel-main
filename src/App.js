// src/App.js
import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MetroProvider } from './context/MetroContext';
import { SimulationProvider } from './context/SimulationContext';

import SubwayMap from './map/SubwayMap';
import LeafletMap from './map/LeafletMap';
import StationInfoBox from './map/StationInfoBox';
import Train from './map/Train';

import SideNav from './components/SideNav';
import RightSideNav from './components/RightSideNav';
import ZoomMenu from './components/ZoomMenu';
import BottomMenu from './components/BottomMenu'; // Import the new BottomMenu
import SimulationStatus from './components/SimulationStatus';

import EnergyManagement from './pages/EnergyManagement';
import MonitoringAnalytics from './pages/MonitoringAnalytics';
import OperationalControl from './pages/OperationalControl';
import PassengerInformation from './pages/PassengerInformation';
import SecurityMonitoring from './pages/SecurityMonitoring';
import ServiceManagement from './pages/ServiceManagement';
import Settings from './pages/Settings';
import AnalyticsPage from './pages/AnalyticsPage'; // Replace with your actual analytics component

// Import functions from SubwayLoadSave.js
import { importSubwayData, exportSubwayData } from './map/SubwayLoadSave';

function App() {
  // Global state variables for editing, theme, and UI panels.
  const [editing, setEditing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [showPanel, setShowPanel] = useState(false);
  const [showStationNames, setShowStationNames] = useState(false);
  const [isSelectingTransfer, setIsSelectingTransfer] = useState(false);
  const [transferSourceStation, setTransferSourceStation] = useState(null);
  const [transferPairs, setTransferPairs] = useState([]);
  const [isSelectingStationToEdit, setIsSelectingStationToEdit] = useState(false);

  const [mapMode, setMapMode] = useState('vector');

  // New global state for view modes and extra data
  const [viewMode, setViewMode] = useState('normal'); // 'normal', 'depot', or 'scada'
  const [importedMapData, setImportedMapData] = useState(null); // Imported map data
  const [depotData, setDepotData] = useState([]);       // Example depot data
  const [scadaData, setScadaData] = useState([]);         // Example SCADA data
  const [doubleLineData, setDoubleLineData] = useState([/* your dummy double line data */]);
  const [scissorRailData, setScissorRailData] = useState([/* your dummy scissor rail data */]);

  // Ref for controlling zoom functions via ZoomMenu.
  const zoomRef = useRef(null);

  // Example handler to cycle through view modes
  const handleViewModeChange = () => {
    if (viewMode === 'normal') {
      setViewMode('depot');
    } else if (viewMode === 'depot') {
      setViewMode('scada');
    } else {
      setViewMode('normal');
    }
  };

  // Handle a normal station click (when not selecting a transfer target)
  const handleStationClick = (station) => {
    if (!isSelectingTransfer) {
      setSelectedStation(station);
    }
  };
  
  // Start transfer selection from the station info box.
  const startTransferSelection = (station) => {
    setTransferSourceStation(station);
    setIsSelectingTransfer(true);
    setSelectedStation(null);
  };

  // Listen for "Escape" key to cancel selection modes.
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setIsSelectingTransfer(false);
        setTransferSourceStation(null);
        setIsSelectingStationToEdit(false);
      }
    };
    if (isSelectingTransfer || isSelectingStationToEdit) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isSelectingTransfer, isSelectingStationToEdit]);

  // When a transfer target is selected, compute the merged position.
  const handleTransferTargetSelection = (targetStation) => {
    if (!transferSourceStation) return;
    const mergedX = (transferSourceStation.x + targetStation.x) / 2;
    const mergedY = (transferSourceStation.y + targetStation.y) / 2;
    const newPair = {
      sourceId: transferSourceStation.stationId,
      targetId: targetStation.stationId,
      sourceX: transferSourceStation.x,
      sourceY: transferSourceStation.y,
      targetX: targetStation.x,
      targetY: targetStation.y,
      mergedPosition: { x: mergedX, y: mergedY },
      lineColor: transferSourceStation.lineColor,
    };
    setTransferPairs([...transferPairs, newPair]);
    setIsSelectingTransfer(false);
    setTransferSourceStation(null);
  };

  // Determine if a station is part of a transfer pair.
  const getInterchangeInfo = (stationId) => {
    for (const pair of transferPairs) {
      if (pair.sourceId === stationId || pair.targetId === stationId) {
        return { isTransfer: true, interchangeName: 'Transfer' };
      }
    }
    return { isTransfer: false, interchangeName: '' };
  };

  // Handlers for Import/Export Map (to be triggered from Settings)
  const handleExportMap = () => {
    // For demonstration, assume current map data is constructed from our current state.
    // You might want to build currentMapData from your dummy data and computed stations.
    const currentMapData = {
      lines: importedMapData ? importedMapData.lines : /* default lines */ [],
      stations: importedMapData ? importedMapData.stations : /* default stations */ []
    };
    try {
      const txtData = exportSubwayData(currentMapData);
      alert("Exported Map Data:\n" + txtData);
    } catch (err) {
      alert("Error exporting map data: " + err.message);
    }
  };

  const handleImportMap = (fileText) => {
    try {
      const mapData = importSubwayData(fileText);
      setImportedMapData(mapData);
      alert("Map imported successfully!");
    } catch (err) {
      alert("Error importing map data: " + err.message);
    }
  };

  const handleVectorMapClick = () => {
    console.log('Original Map selected');
    setMapMode('vector');
  };

  const handleLeafletMapClick = () => {
    console.log('Leaflet Map selected');
    setMapMode('leaflet');
  };

  const handleAnalyticsPageClick = () => {
    console.log('Analytics view selected');
    setMapMode('analytics');
  };

  // Handler for canceling (closes the StationInfoBox)
  const onCancelHandler = () => {
    setSelectedStation(null);
  };

  // Dummy stations for Leaflet (in lat/lng). Replace with real data.
  const leafletStations = [
    { lat: 51.505, lng: -0.09, name: 'Station 1' },
    { lat: 51.51, lng: -0.1, name: 'Station 2' },
  ];
  
  // Handler for deleting a station
  const onDeleteHandler = (id) => {
    /*const updatedStations = stations.filter(station => station.id !== id);
    setStations(updatedStations);
    setSelectedStation(null);*/
  };

  // Start transfer selection by prompting for an interchange name,
  // then updating the station to mark it as a transfer.
  /*const startTransferSelection = (station) => {
    const interchangeName = prompt("Enter interchange name for this station:");
    if (interchangeName !== null) {
      const updatedStation = { ...station, isTransfer: true, interchangeName };
      setStations(stations.map(s => s.id === station.id ? updatedStation : s));
      setSelectedStation(updatedStation);
    }
  };*/
  
  // Handler for adding a new station
  const onAddNewStationHandler = () => {
    /*const newStationName = prompt("Enter new station name:");
    if (newStationName) {
      const newStation = {
        id: Date.now(),
        stationId: newStationName,
        lineName: "Unknown",
        availability: "Available",
        isTransfer: false,
        lineColor: "#121F48",
        recentTrains: [],
        comingTrains: [],
      };
      setStations([...stations, newStation]);
    }*/
  };
  
  // Handler for deleting an existing station (default edit panel)
  const onDeleteStationHandler = () => {
    /*if (selectedStation) {
      onDeleteHandler(selectedStation.id);
    } else {
      alert("No station selected to delete.");
    }*/
  };
  
  // Handler for adding a new line
  const onAddNewLineHandler = () => {
    /*const lineName = prompt("Enter new line name:");
    if (lineName) {
      const lineColor = prompt("Enter line color (hex code):", "#000000");
      const numStations = parseInt(prompt("Enter number of stations:"), 10) || 0;
      const coordinates = prompt("Enter line coordinates (comma separated):", "");
      const newLine = {
        id: Date.now(),
        lineName,
        lineColor,
        stationCount: numStations,
        coordinates,
      };
      setLines([...lines, newLine]);
    }*/
  };
  
  // Handler for deleting an existing line
  const onDeleteLineHandler = () => {
    /*const lineNameToDelete = prompt("Enter the line name to delete:");
    if (lineNameToDelete) {
      const updatedLines = lines.filter(line => line.lineName !== lineNameToDelete);
      setLines(updatedLines);
    }*/
  };

  // Define testing depot data: two depots
  const testDepots = [
    {
      id: 'depot-1',
      lineId: 1, // "Middle West-East" line
      name: 'Middle Depot',
      // We'll connect to the middle station of lineId=1
      tracks: [
        // Each track has a code (R1, R2, etc.), a "length" for drawing,
        // and optionally an offset if you want to group them (e.g., repairing, cleaning).
        { code: 'R1', length: 6 },
        { code: 'R2', length: 6 },
        { code: 'R3', length: 6 },
        { code: 'R4', length: 6 },
        { code: 'R5', length: 6 },
        { code: 'R6', length: 6 },
        { code: 'R7', length: 6 },
        { code: 'R8', length: 6 },
        { code: 'R9', length: 6 },
        { code: 'R10', length: 6 },
      ],
    },
    {
      id: 'depot-2',
      lineId: 2, // "Top West-East" line
      name: 'Top Depot',
      tracks: [
        { code: 'R1', length: 8 },
        { code: 'R2', length: 8 },
        { code: 'R3', length: 8 },
        { code: 'R4', length: 8 },
        { code: 'R5', length: 8 },
        { code: 'R6', length: 8 },
        { code: 'R7', length: 8 },
        { code: 'R8', length: 8 },
        { code: 'R9', length: 8 },
        { code: 'R10', length: 8 },
        { code: 'R11', length: 8 },
        { code: 'R12', length: 8 },
        { code: 'R13', length: 8 },
        { code: 'R14', length: 8 },
        { code: 'R15', length: 8 },
      ],
    }, 
  ];

  // Define testing double line data.
  // For simplicity, assume one double line per depot line.
  const testDoubleLines = [
    {
      id: 'double-1',
      lineId: 1,
      name: 'Middle West-East Double Line',
      orientation: 'horizontal',
      y: 520, // offset from main line (500)
      stationCount: 23,
    },
    {
      id: 'double-2',
      lineId: 2,
      name: 'Top West-East Double Line',
      orientation: 'horizontal',
      y: 220, // offset from main line (200)
      stationCount: 24,
    },
  ];

  // Define testing scissor rails data.
  // For each line in your existing "lines" constant, we create 3 scissor rails.
  // (Here we demonstrate for the two horizontal lines; you can extend similarly.)
  // Example test data for scissor rails
// (Assuming baseGridSpacing is 50 so effectiveGridSpacing becomes 50/4 = 12.5 in depot/SCADA mode)
const testScissorRails = [
  // For Middle West-East (line id: 1)
  /*{
    id: 'scissor-1-1',
    lineId: 1,
    orientation: 'horizontal',
    // For demonstration, assume the main track station is at y=500
    // and the parallel (double) track is at y = 500 + 12.5 (one square below)
    stationA: { x: 300, y: 500 },
    stationB: { x: 300, y: 500 + 12.5 },
  },
  {
    id: 'scissor-1-2',
    lineId: 1,
    orientation: 'horizontal',
    stationA: { x: 500, y: 500 },
    stationB: { x: 500, y: 500 + 12.5 },
  },
  {
    id: 'scissor-1-3',
    lineId: 1,
    orientation: 'horizontal',
    stationA: { x: 700, y: 500 },
    stationB: { x: 700, y: 500 + 12.5 },
  },
  // For Top West-East (line id: 2)
  {
    id: 'scissor-2-1',
    lineId: 2,
    orientation: 'horizontal',
    stationA: { x: 300, y: 200 },
    stationB: { x: 300, y: 200 + 12.5 },
  },
  {
    id: 'scissor-2-2',
    lineId: 2,
    orientation: 'horizontal',
    stationA: { x: 500, y: 200 },
    stationB: { x: 500, y: 200 + 12.5 },
  },
  {
    id: 'scissor-2-3',
    lineId: 2,
    orientation: 'horizontal',
    stationA: { x: 700, y: 200 },
    stationB: { x: 700, y: 200 + 12.5 },
  },*/
];

  return (
    <SimulationProvider>
      <MetroProvider>
        <Router>
          <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
            <SideNav setShowPanel={setShowPanel} />
            <div className="main-content">
              <Routes>
                <Route path="/" element={
                  <>
                    {mapMode === 'vector' && (
                      <SubwayMap
                        editing={editing}
                        onStationClick={handleStationClick}
                        showStationNames={showStationNames}
                        isSelectingTransfer={isSelectingTransfer}
                        onTransferTargetSelect={handleTransferTargetSelection}
                        transferPairs={transferPairs}
                        getInterchangeInfo={getInterchangeInfo}
                        viewMode={viewMode}
                        depotData={testDepots}
                        scadaData={scadaData}
                        doubleLineData={testDoubleLines}
                        scissorRailData={testScissorRails}
                      />
                    )}
                    {mapMode === 'leaflet' && (
                      <LeafletMap stations={leafletStations} />
                    )}
                    {mapMode === 'analytics' && (
                      <AnalyticsPage />
                    )}
                    {selectedStation && (
                      <StationInfoBox
                        station={selectedStation}
                        onCancel={onCancelHandler}
                        onDelete={onDeleteHandler}
                        onStartTransfer={startTransferSelection}
                      />
                    )}
                    <ZoomMenu ref={zoomRef} />
                    <BottomMenu
                      onVectorMapClick={handleVectorMapClick}
                      onLeafletMapClick={handleLeafletMapClick}
                      onAnalyticsClick={handleAnalyticsPageClick}
                      mapMode={mapMode}
                    />
                    <SimulationStatus />
                  </>
                } />
                <Route path="/energy-management" element={<EnergyManagement onClose={() => setShowPanel(false)} />} />
                <Route path="/monitoring-analytics" element={<MonitoringAnalytics onClose={() => setShowPanel(false)} />} />
                <Route path="/operational-control" element={<OperationalControl onClose={() => setShowPanel(false)} />} />
                <Route path="/passenger-information" element={<PassengerInformation onClose={() => setShowPanel(false)} />} />
                <Route path="/security-monitoring" element={<SecurityMonitoring onClose={() => setShowPanel(false)} />} />
                <Route path="/service-management" element={<ServiceManagement onClose={() => setShowPanel(false)} />} />
                <Route path="/settings" element={<Settings onExportMap={handleExportMap} onImportMap={handleImportMap} />} />
              </Routes>
            </div>
            <RightSideNav
              showPanel={showPanel}
              setShowPanel={setShowPanel}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              editing={editing}
              setEditing={setEditing}
              showStationNames={showStationNames}
              setShowStationNames={setShowStationNames}
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
            />
          </div>
        </Router>
      </MetroProvider>
    </SimulationProvider>
  );
}

export default App;
