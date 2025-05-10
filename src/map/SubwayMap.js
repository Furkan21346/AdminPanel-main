// SubwayMap.js
import React, { useState, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

import DepotOverlay from './DepotOverlay';
import SCADAOverlay from './SCADAOverlay';
import Train from './Train';

const margin = 100;
const baseGridSpacing = 50; // Adjust this value as needed

// Define the subway lines using design coordinates (for a 2000x1000 layout)
const lines = [
  { id: 1, name: 'Middle West-East', color: '#EA1975', stationCount: 23, orientation: 'horizontal', y: 500 },
  { id: 2, name: 'Top West-East', color: '#673067', stationCount: 24, orientation: 'horizontal', y: 200 },
  { id: 3, name: 'Middle North-South', color: '#3D7CBF', stationCount: 13, orientation: 'vertical', x: 800 },
  { id: 4, name: 'Right North-South', color: '#4BB851', stationCount: 6, orientation: 'vertical', x: 1200 },
  { id: 5, name: 'Bottom West-East', color: '#63666B', stationCount: 29, orientation: 'horizontal', y: 800 },
  { id: 6, name: 'Left North-South', color: '#C9CB2B', stationCount: 11, orientation: 'vertical', x: 200 },
];

// --- Custom hook to get window dimensions ---
function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return { width, height };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return windowDimensions;
}

// Helper: compute the effective grid spacing based on viewMode
function getEffectiveGridSpacing(viewMode) {
  if (viewMode === 'depot' || viewMode === 'scada') {
    return baseGridSpacing / 4; // 4x smaller
  }
  return baseGridSpacing;
}

// Helper: find the line object by ID
function findLine(lineId) {
  return lines.find((l) => l.id === lineId);
}

function renderScissorRail(scissor, effectiveGridSpacing) {
  const lineObj = findLine(scissor.lineId);
  const railColor = lineObj ? lineObj.color : "purple";
  if (!scissor.stationA || !scissor.stationB) return null;
  
  if (scissor.orientation === 'horizontal') {
    const centerX = (scissor.stationA.x + scissor.stationB.x) / 2;
    const top = scissor.stationA.y;
    const bottom = scissor.stationB.y;
    const boxWidth = 2 * effectiveGridSpacing;
    const left = centerX - boxWidth / 2;
    const right = centerX + boxWidth / 2;
    return (
      <g className="scissor-rail">
        <line x1={left} y1={top} x2={left} y2={bottom} stroke={railColor} strokeWidth={2} />
        <line x1={right} y1={top} x2={right} y2={bottom} stroke={railColor} strokeWidth={2} />
        <line x1={left} y1={top} x2={right} y2={bottom} stroke={railColor} strokeWidth={2} />
        <line x1={left} y1={bottom} x2={right} y2={top} stroke={railColor} strokeWidth={2} />
      </g>
    );
  } else {
    const centerY = (scissor.stationA.y + scissor.stationB.y) / 2;
    const left = scissor.stationA.x;
    const right = scissor.stationB.x;
    const boxHeight = 2 * effectiveGridSpacing;
    const top = centerY - boxHeight / 2;
    const bottom = centerY + boxHeight / 2;
    return (
      <g className="scissor-rail">
        <line x1={left} y1={top} x2={right} y2={top} stroke={railColor} strokeWidth={2} />
        <line x1={left} y1={bottom} x2={right} y2={bottom} stroke={railColor} strokeWidth={2} />
        <line x1={left} y1={top} x2={right} y2={bottom} stroke={railColor} strokeWidth={2} />
        <line x1={right} y1={top} x2={left} y2={bottom} stroke={railColor} strokeWidth={2} />
      </g>
    );
  }
}

// Helper: compute stations for a single line using the current svg dimensions and effective grid spacing.
const computeLineStations = (line, svgWidth, svgHeight, effectiveGridSpacing) => {
  const stations = [];
  if (line.orientation === 'horizontal') {
    const scaledY = (line.y / 1000) * svgHeight;
    for (let i = 0; i < line.stationCount; i++) {
      let x = margin + ((svgWidth - 2 * margin) * i) / (line.stationCount - 1);
      // Snap x to the grid:
      x = Math.round(x / effectiveGridSpacing) * effectiveGridSpacing;
      const y = Math.round(scaledY / effectiveGridSpacing) * effectiveGridSpacing;
      stations.push({
        id: `line-${line.id}-station-${i}`,
        lineId: line.id,
        index: i + 1, // now each station has an index
        x,
        y,
        name: `${line.name} ${i + 1}`
      });      
    }
  } else if (line.orientation === 'vertical') {
    const scaledX = (line.x / 2000) * svgWidth;
    for (let i = 0; i < line.stationCount; i++) {
      let y = margin + ((svgHeight - 2 * margin) * i) / (line.stationCount - 1);
      y = Math.round(y / effectiveGridSpacing) * effectiveGridSpacing;
      const x = Math.round(scaledX / effectiveGridSpacing) * effectiveGridSpacing;
      stations.push({
        id: `line-${line.id}-station-${i}`,
        lineId: line.id,
        x,
        y,
        name: `${line.name} ${i + 1}`
      });
    }
  }
  return stations;
};

// Helper: find the "middle" station of a line's stations
function findMiddleStation(lineStations) {
  const midIndex = Math.floor((lineStations.length - 1) / 2);
  return lineStations[midIndex];
}

// Helper: 
function computeRouteLength(route) {
  let total = 0;
  for (let i = 0; i < route.length - 1; i++) {
    const dx = route[i + 1].x - route[i].x;
    const dy = route[i + 1].y - route[i].y;
    total += Math.sqrt(dx * dx + dy * dy);
  }
  return total;
}

// Helper: compute coordinates for each depot track
function computeDepotTracks(depot, anchorStation, lineOrientation, effectiveGridSpacing) {
  // If line is horizontal => depot tracks are vertical, and vice versa
  const isHorizontalLine = lineOrientation === 'horizontal';
  const trackShapes = [];
  const trackOffsetStep = 3 * effectiveGridSpacing; // adjust as needed
  const startOffset = -((depot.tracks.length - 1) / 2) * trackOffsetStep;

  depot.tracks.forEach((track, i) => {
    const offset = startOffset + i * trackOffsetStep;
    const trackLength = track.length * effectiveGridSpacing;
    if (isHorizontalLine) {
      // For horizontal lines, draw depot tracks vertically from the anchor.
      const x1 = anchorStation.x + offset;
      const y1 = anchorStation.y;
      const x2 = x1;
      const y2 = y1 - trackLength; // adjust direction as needed
      trackShapes.push({ code: track.code, x1, y1, x2, y2 });
    } else {
      // For vertical lines, draw depot tracks horizontally from the anchor.
      const x1 = anchorStation.x;
      const y1 = anchorStation.y + offset;
      const x2 = x1 + trackLength;
      const y2 = y1;
      trackShapes.push({ code: track.code, x1, y1, x2, y2 });
    }
  });
  return trackShapes;
}

const splitStationName = (name) => {
  if (name.length > 8) {
    return [name.slice(0, 8), name.slice(8)];
  }
  return [name];
};

const SubwayMap = ({
  editing,
  darkMode,
  showStationNames,
  onStationClick,
  isSelectingTransfer,
  transferPairs,
  zoomRef,
  isSelectingStationToEdit,
  viewMode,
  depotData,
  doubleLineData,
  scissorRailData,
  scadaData, // not used directly here but passed if needed
  importedMapData, // NEW prop for importing map data
}) => {
  const { width, height } = useWindowDimensions();
  // We'll compute all stations for every line into one array.
  const [allStations, setAllStations] = useState([]);
  // If importedMapData is provided, use its lines and stations; otherwise, use default.
  const activeLines = importedMapData ? importedMapData.lines : lines;

  // Use effectiveGridSpacing computed from the current viewMode.
  const effectiveGridSpacing = getEffectiveGridSpacing(viewMode);

  useEffect(() => {
    if (importedMapData) {
      const newStations = computeImportedStations(
        importedMapData.stations,
        importedMapData.grid,
        width,
        height
      );
      setAllStations(newStations);
    } else {
      const newStations = [];
      lines.forEach((line) => {
        const lineStations = computeLineStations(
          line,
          width,
          height,
          effectiveGridSpacing
        );
        newStations.push(...lineStations);
      });
      setAllStations(newStations);
    }
  }, [importedMapData, viewMode, effectiveGridSpacing, width, height]);  

    // For stations, if imported, compute positions from real-world coordinates:
    const computeImportedStations = (stations, grid, svgWidth, svgHeight) => {
      // grid: { minX, maxX, minY, maxY }
      const scaleX = (svgWidth - 2 * margin) / (grid.maxX - grid.minX);
      const scaleY = (svgHeight - 2 * margin) / (grid.maxY - grid.minY);
      const effectiveSpacing = getEffectiveGridSpacing(viewMode);
      return stations.map(station => {
        const x = margin + (station.realX - grid.minX) * scaleX;
        const y = margin + (station.realY - grid.minY) * scaleY;
        // Snap to effective grid:
        return {
          ...station,
          x: Math.round(x / effectiveSpacing) * effectiveSpacing,
          y: Math.round(y / effectiveSpacing) * effectiveSpacing,
          // You might also add a property for lineId if needed:
          lineId: station.line  // note: your TXT file uses a numeric line for stations
        };
      });
    };
  
    // Determine active stations:
    const activeStations = importedMapData
      ? computeImportedStations(importedMapData.stations, importedMapData.grid, width, height)
      : (() => {
          let sts = [];
          activeLines.forEach(line => {
            sts = sts.concat(computeLineStations(line, width, height, getEffectiveGridSpacing(viewMode)));
          });
          return sts;
        })();

  // Build a dictionary mapping line id to its stations.
  const lineStationsMap = {};
  activeLines.forEach((line) => {
  lineStationsMap[line.id] = allStations.filter((st) => st.lineId === line.id);
});


  const [draggingStationId, setDraggingStationId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [mapPanningEnabled, setMapPanningEnabled] = useState(false);

  const handleMouseDown = (e, station) => {
    if (!editing) return;
    if (e.button !== 0) return;
    const svg = e.target.ownerSVGElement;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursorpt = pt.matrixTransform(svg.getScreenCTM().inverse());
    setDragOffset({ x: cursorpt.x - station.x, y: cursorpt.y - station.y });
    setDraggingStationId(station.id);
  };

  const handleMouseMove = (e) => {
    if (!editing || draggingStationId === null) return;
    const svg = e.currentTarget;
    if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const cursorpt = pt.matrixTransform(svg.getScreenCTM().inverse());
    const newX = Math.round((cursorpt.x - dragOffset.x) / effectiveGridSpacing) * effectiveGridSpacing;
    const newY = Math.round((cursorpt.y - dragOffset.y) / effectiveGridSpacing) * effectiveGridSpacing;
    // Update station position:
    setAllStations(prevStations =>
      prevStations.map(st =>
        st.id === draggingStationId ? { ...st, x: newX, y: newY } : st
      )
    );
  };

  const handleMouseUp = () => {
    if (!editing) return;
    setDraggingStationId(null);
  };

  // Define background colors for different modes
const backgroundColors = {
  normal: {
    light: "#f3f3f3",
    dark: "#1b1b1b",
  },
  depot: {
    light: "#f9f1dc", // Light beige for depot mode
    dark: "#2e1b0f",  // Dark brown for depot mode
  },
  scada: {
    light: "#e8f3ff", // Light gray for SCADA mode
    dark: "#0a1826",  // Almost black for SCADA mode
  },
};

// Get the appropriate background color
const backgroundColor = backgroundColors[viewMode]
  ? backgroundColors[viewMode][darkMode ? "dark" : "light"]
  : backgroundColors.normal[darkMode ? "dark" : "light"];


  // Filter out stations that are already part of a transfer pair.
  const filteredStations = allStations.filter(
    (st) =>
      !transferPairs.some(
        (pair) => pair.sourceId === st.id || pair.targetId === st.id
      )
  );

  return (
    <div style={{ position: 'relative' }}>
      {/* Transfer-selection overlay */}
      {isSelectingTransfer && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            height: '50px',
            backgroundColor: darkMode ? '#1c1b1b' : '#adacaa',
            zIndex: 2000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: '20px', color: darkMode ? '#fff' : '#000' }}>
            Please select the station to connect as a transfer
          </div>
        </div>
      )}
      {/* Station-editing overlay */}
      {isSelectingStationToEdit && !isSelectingTransfer && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            height: '50px',
            backgroundColor: darkMode ? '#1c1b1b' : '#adacaa',
            zIndex: 2000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: '20px', color: darkMode ? '#fff' : '#000' }}>
            Please select the station to edit
          </div>
        </div>
      )}

      <TransformWrapper panning={{ disabled: editing ? !mapPanningEnabled : false }} ref={zoomRef}>
        <TransformComponent>
          <svg
            width={width}
            height={height}
            style={{ background: backgroundColor, border: '1px solid #ccc' }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* 1) Render Subway Lines */}
            {activeLines.map((line) => {
  const lineSts = lineStationsMap[line.id] || [];
  if (!lineSts.length) return null;
  if (viewMode === 'normal') {
    // Normal mode: render a single track.
    const pathData = lineSts
      .map((s, idx) => `${idx === 0 ? 'M' : 'L'} ${s.x} ${s.y}`)
      .join(' ');
    return (
      <path
        key={`line-${line.id}`}
        d={pathData}
        stroke={line.color}
        strokeWidth={5}
        fill="none"
      />
    );
  } else {
    // Depot/SCADA mode: render two parallel tracks.
    const offset = getEffectiveGridSpacing(viewMode); // 1 square distance offset
    let parallelStations;
    if (line.orientation === 'horizontal') {
      parallelStations = lineSts.map((st) => ({ ...st, y: st.y + offset }));
    } else {
      parallelStations = lineSts.map((st) => ({ ...st, x: st.x + offset }));
    }
    const mainPathData = lineSts
      .map((s, idx) => `${idx === 0 ? 'M' : 'L'} ${s.x} ${s.y}`)
      .join(' ');
    const parallelPathData = parallelStations
      .map((s, idx) => `${idx === 0 ? 'M' : 'L'} ${s.x} ${s.y}`)
      .join(' ');
    return (
      <g key={`line-${line.id}`}>
        <path d={mainPathData} stroke={line.color} strokeWidth={5} fill="none" />
        <path d={parallelPathData} stroke={line.color} strokeWidth={5} fill="none" />
        {/* Render station markers for the parallel track as rectangles */}
        {parallelStations.map((s, idx) => (
          <rect
            key={`station-${line.id}-${idx}`}
            x={s.x - 4}
            y={s.y - 4}
            width={8}
            height={8}
            fill={line.color}
          />
        ))}
      </g>
    );
  }
})}

            {/* 2) Render Stations */}
            {allStations.map((st) => (
              <circle
                key={`station-${st.lineId}-${st.index}`}
                cx={st.x}
                cy={st.y}
                r={8}
                fill="white"
                stroke="black"
                onMouseDown={(e) => handleMouseDown(e, st)}
                onClick={() =>
                  onStationClick({
                    stationId: st.name, // This will now be "Middle West-East 14", for example.
                    lineName:
                      lines.find((l) => l.id === st.lineId)?.name || 'Unknown Line',
                    lineColor:
                      lines.find((l) => l.id === st.lineId)?.color || '#000',
                    x: st.x,
                    y: st.y,
                  })
                }
                style={{ cursor: editing ? 'move' : 'pointer' }}
              />
            ))}

            {/* 3) Render Station Names */}
            {showStationNames &&
              filteredStations.map((st) => {
                const nameLines = splitStationName(st.name);
                return (
                  <text
                    key={`name-${st.id}`}
                    x={st.x}
                    y={st.y - 12}
                    fill={darkMode ? '#fff' : '#000'}
                    fontSize="6pt"
                    textAnchor="middle"
                  >
                    <tspan x={st.x} dy="0">
                      {nameLines[0]}
                    </tspan>
                    {nameLines[1] && (
                      <tspan x={st.x} dy="1em">
                        {nameLines[1]}
                      </tspan>
                    )}
                  </text>
                );
              })}

            {/* 4) Render Grid Lines (for editing) */}
            {editing && (
              <g className="grid">
                {Array.from({ length: Math.floor(width / effectiveGridSpacing) + 1 }, (_, col) =>
                  Array.from({ length: Math.floor(height / effectiveGridSpacing) + 1 }, (_, row) => {
                    const x = col * effectiveGridSpacing;
                    const y = row * effectiveGridSpacing;
                    return (
                      <circle
                        key={`grid-${col}-${row}`}
                        cx={x}
                        cy={y}
                        r={1}
                        fill="lightgray"
                      />
                    );
                  })
                ).flat()}
              </g>
            )}

            {/* 5) Render Merged Transfer Icons */}
            {transferPairs.map((pair) => (
              <g
                key={pair.sourceId + '-' + pair.targetId}
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  onStationClick({
                    stationId: `${pair.sourceId} / ${pair.targetId}`,
                    lineName: 'Transfer Station',
                    lineColor: pair.lineColor,
                    x: pair.mergedPosition.x,
                    y: pair.mergedPosition.y,
                    isTransfer: true,
                  })
                }
              >
                <line
                  x1={pair.sourceX}
                  y1={pair.sourceY}
                  x2={pair.targetX}
                  y2={pair.targetY}
                  stroke={pair.lineColor}
                  strokeDasharray="4"
                />
                <circle
                  cx={pair.mergedPosition.x}
                  cy={pair.mergedPosition.y}
                  r={12}
                  fill={pair.lineColor}
                  stroke="black"
                />
              </g>
            ))}

{/* 6) Depots: Render only if viewMode is 'depot' or 'scada' */}
{(viewMode === 'depot' || viewMode === 'scada') &&
  depotData &&
  depotData.map((depot) => {
    const line = findLine(depot.lineId);
    if (!line) return null;
    const ls = lineStationsMap[line.id];
    if (!ls || !ls.length) return null;
    const anchor = findMiddleStation(ls);
    if (!anchor) return null;
    const trackShapes = (() => {
      const isHorizontal = line.orientation === 'horizontal';
      const shapes = [];
      const trackOffsetStep = effectiveGridSpacing; // 1 square gap
      const startOffset = -((depot.tracks.length - 1) / 2) * trackOffsetStep;
      depot.tracks.forEach((track, i) => {
        const offset = startOffset + i * trackOffsetStep;
        const trackLength = track.length * effectiveGridSpacing;
        if (isHorizontal) {
          const x1 = anchor.x + offset;
          const y1 = anchor.y;
          const x2 = x1;
          const y2 = y1 - trackLength; // branch upward (adjust as needed)
          shapes.push({ code: track.code, x1, y1, x2, y2 });
        } else {
          const x1 = anchor.x;
          const y1 = anchor.y + offset;
          const x2 = x1 + trackLength;
          const y2 = y1;
          shapes.push({ code: track.code, x1, y1, x2, y2 });
        }
      });
      return shapes;
    })();
    return (
      <g
        key={depot.id}
        className="depot-group"
        onClick={() =>
          onStationClick({
            stationId: depot.id,
            lineName: depot.name,
            lineColor: line.color,
            x: anchor.x,
            y: anchor.y,
            isDepot: true,
          })
        }
        style={{ cursor: 'pointer' }}
      >
        {trackShapes.map((track) => (
          <g key={`${depot.id}-${track.code}`}>
            <line
              x1={track.x1}
              y1={track.y1}
              x2={track.x2}
              y2={track.y2}
              stroke="black"
              strokeWidth={3}
            />
            <text
              x={track.x2}
              y={track.y2}
              fontSize="6pt"
              fill={darkMode ? '#fff' : '#000'}
              textAnchor="middle"
            >
              {track.code}
            </text>
          </g>
        ))}
      </g>
    );
  })}

{/* 8) Render Grid Lines (for editing) */}
{editing && (
  <g className="grid">
    {Array.from(
      { length: Math.floor(width / effectiveGridSpacing) + 1 },
      (_, col) =>
        Array.from(
          { length: Math.floor(height / effectiveGridSpacing) + 1 },
          (_, row) => {
            const x = col * effectiveGridSpacing;
            const y = row * effectiveGridSpacing;
            return (
              <circle
                key={`grid-${col}-${row}`}
                cx={x}
                cy={y}
                r={1}
                fill="lightgray"
              />
            );
          }
        )
    ).flat()}
  </g>
)}

{/* 7) Scissor Rails: Render only in SCADA mode */}
{viewMode === 'scada' &&
  scissorRailData &&
  scissorRailData.map((scissor) =>
    renderScissorRail(scissor, effectiveGridSpacing)
  )}

{/* 9) Scissor Rails from Parallel (Double) Lines: Render only in SCADA mode */}
{/* Scissor Rails for Double Lines: Render only in SCADA mode */}
{viewMode === 'scada' && doubleLineData && doubleLineData.map((doubleLine) => {
  const mainLine = findLine(doubleLine.lineId);
  if (!mainLine) return null;
  const mainStations = lineStationsMap[mainLine.id];
  if (!mainStations || mainStations.length < 2) return null;
  
  const offset = effectiveGridSpacing;
  const parallelStations = mainLine.orientation === 'horizontal'
    ? mainStations.map((st) => ({ ...st, y: st.y + offset }))
    : mainStations.map((st) => ({ ...st, x: st.x + offset }));
  
  // For demonstration, create scissor rails for a selected set of segments (e.g. first, middle, last)
  const totalSegments = mainStations.length - 1;
  let indices = [];
  if (totalSegments >= 3) {
    indices = [0, Math.floor(totalSegments / 2), totalSegments - 1];
  } else {
    indices = [...Array(totalSegments).keys()];
  }
  
  return (
    <g key={`scissor-double-${doubleLine.id}`}>
      {indices.map((idx) => {
         const mainMid = {
           x: (mainStations[idx].x + mainStations[idx + 1].x) / 2,
           y: (mainStations[idx].y + mainStations[idx + 1].y) / 2,
         };
         const parallelMid = {
           x: (parallelStations[idx].x + parallelStations[idx + 1].x) / 2,
           y: (parallelStations[idx].y + parallelStations[idx + 1].y) / 2,
         };
         const scissor = {
           id: `scissor-${doubleLine.id}-${idx}`,
           lineId: mainLine.id,
           orientation: mainLine.orientation,
           stationA: mainMid,
           stationB: parallelMid,
         };
         // Compute the overall midpoint of the scissor rail for clicking.
         const clickX = (mainMid.x + parallelMid.x) / 2;
         const clickY = (mainMid.y + parallelMid.y) / 2;
         const scissorElement = renderScissorRail(scissor, effectiveGridSpacing);
         return (
           <g
             key={scissor.id}
             onClick={() =>
               onStationClick({
                 stationId: scissor.id,
                 lineName: `Scissor Rail (${findLine(scissor.lineId)?.name})`,
                 lineColor: findLine(scissor.lineId)?.color,
                 x: clickX,
                 y: clickY,
                 isScissor: true,
               })
             }
             style={{ cursor: 'pointer' }}
           >
             {scissorElement}
           </g>
         );
      })}
    </g>
  );
})}
{/* 10) Render Trains (only in depot/SCADA mode) */}
{(viewMode === 'depot' || viewMode === 'scada') &&
  activeLines.map((line) => {
    const route = lineStationsMap[line.id]; // route is an array of {x, y} for the main track.
    if (!route || route.length < 2) return null;
    const routeLength = computeRouteLength(route);
    return (
      <g key={`trains-${line.id}`}>
        <Train route={route} trainCode={`TR${line.id}01`} speed={1} startDelay={0} />
        <Train route={route} trainCode={`TR${line.id}02`} speed={1} startDelay={routeLength / 2} />
      </g>
    );
  })}
          </svg>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default SubwayMap;
