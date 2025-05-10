// src/map/SubwayMap.js
import React, { useState, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

import SubwayLines from './SubwayLines';
import SubwayStations from './SubwayStations';
import Overlays from './Overlays';

import DepotOverlay from './DepotOverlay';
import SCADAOverlay from './SCADAOverlay';
import Train from './Train';

import {
  getEffectiveGridSpacing,
  computeLineStations,
  computeImportedStations,
  lines as defaultLines,
  margin,
  splitStationName,
} from './mapUtils';

/**
 * Custom hook to get current window dimensions.
 */
function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return { width, height };
}
function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  useEffect(() => {
    const handleResize = () => setWindowDimensions(getWindowDimensions());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return windowDimensions;
}

/**
 * SubwayMap Component
 * 
 * Props:
 * - editing: boolean (enables dragging)
 * - darkMode: boolean (for theme, passed to StationInfoBox, Overlays, etc.)
 * - showStationNames: boolean
 * - onStationClick: function to handle station clicks
 * - viewMode: string ('normal', 'depot', 'scada') controlling rendering style
 * - depotData, scissorRailData, doubleLineData, transferPairs: overlay data
 * - importedMapData: optional imported map data (lines, stations, grid)
 */
const SubwayMap = ({
  editing,
  darkMode,
  showStationNames,
  onStationClick,
  viewMode,
  depotData,
  scissorRailData,
  doubleLineData,
  transferPairs,
  importedMapData,
}) => {
  const { width, height } = useWindowDimensions();
  const effectiveGridSpacing = getEffectiveGridSpacing(viewMode);
  const activeLines =
    importedMapData && importedMapData.lines
      ? importedMapData.lines
      : defaultLines;

  // Compute station positions (either imported or computed)
  const [allStations, setAllStations] = useState([]);
  useEffect(() => {
    if (importedMapData && importedMapData.stations && importedMapData.grid) {
      const importedStations = computeImportedStations(
        importedMapData.stations,
        importedMapData.grid,
        width,
        height,
        viewMode
      );
      setAllStations(importedStations);
    } else {
      let computedStations = [];
      activeLines.forEach((line) => {
        const lineStations = computeLineStations(line, width, height, effectiveGridSpacing);
        computedStations = computedStations.concat(lineStations);
      });
      setAllStations(computedStations);
    }
  }, [importedMapData, activeLines, width, height, viewMode, effectiveGridSpacing]);

  // Build a mapping from each line id to its stations.
  const lineStationsMap = {};
  activeLines.forEach((line) => {
    lineStationsMap[line.id] = allStations.filter((st) => st.lineId === line.id);
  });

  // --- Editing / Dragging logic ---
  const [draggingStationId, setDraggingStationId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e, station) => {
    if (!editing) return;
    if (e.button !== 0) return;
    const svg = e.target.ownerSVGElement;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursorPt = pt.matrixTransform(svg.getScreenCTM().inverse());
    setDragOffset({ x: cursorPt.x - station.x, y: cursorPt.y - station.y });
    setDraggingStationId(station.id);
  };

  const handleMouseMove = (e) => {
    if (!editing || draggingStationId === null) return;
    const svg = e.currentTarget;
    if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursorPt = pt.matrixTransform(svg.getScreenCTM().inverse());
    const newX = Math.round((cursorPt.x - dragOffset.x) / effectiveGridSpacing) * effectiveGridSpacing;
    const newY = Math.round((cursorPt.y - dragOffset.y) / effectiveGridSpacing) * effectiveGridSpacing;
    setAllStations(prevStations =>
      prevStations.map(st => st.id === draggingStationId ? { ...st, x: newX, y: newY } : st)
    );
  };

  const handleMouseUp = () => {
    if (!editing) return;
    setDraggingStationId(null);
  };

  // When rendering stations, attach the mouseDown handler to enable dragging.
  // We do this by wrapping the onStationClick handler in a function that first calls handleMouseDown.
  const stationMouseDown = (e, station) => {
    handleMouseDown(e, station);
    // Optionally, you can call onStationClick here if you want immediate feedback.
  };

  return (
    <TransformWrapper>
      <TransformComponent>
        <svg
          width={width}
          height={height}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Render Subway Lines */}
          <SubwayLines
            activeLines={activeLines}
            lineStationsMap={lineStationsMap}
            viewMode={viewMode}
            effectiveGridSpacing={effectiveGridSpacing}
          />

          {/* Render Subway Stations */}
          <g>
            {allStations.map((station) => (
              <circle
                key={`station-${station.lineId}-${station.index}`}
                cx={station.x}
                cy={station.y}
                r={8}
                fill="white"
                stroke="black"
                onMouseDown={(e) => stationMouseDown(e, station)}
                onClick={() =>
                  onStationClick({
                    stationId: station.name,
                    lineName: station.name,
                    lineColor: station.lineColor,
                    x: station.x,
                    y: station.y,
                  })
                }                
                style={{ cursor: editing ? 'move' : 'pointer' }}
              />
            ))}
          </g>

          {/* Optionally, render station names directly if not handled by SubwayStations */}
          <SubwayStations
            stations={allStations}
            editing={editing}
            darkMode={darkMode}
            onStationClick={onStationClick}
            showStationNames={showStationNames}
            splitStationName={splitStationName}
          />

          {/* Render Overlays (grid, depots, scissor rails, trains, transfer pairs, etc.) */}
          <Overlays
            isSelectingTransfer={false}      // Replace with actual state if needed
            isSelectingStationToEdit={false} // Replace with actual state if needed
            darkMode={darkMode}
            editing={editing}
            width={width}
            height={height}
            effectiveGridSpacing={effectiveGridSpacing}
            depotData={depotData}
            viewMode={viewMode}
            scissorRailData={scissorRailData}
            doubleLineData={doubleLineData}
            activeLines={activeLines}
            lineStationsMap={lineStationsMap}
            transferPairs={transferPairs}
            onStationClick={onStationClick}
          />
        </svg>
      </TransformComponent>
    </TransformWrapper>
  );
};

export default SubwayMap;
