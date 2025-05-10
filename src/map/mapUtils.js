// src/map/mapUtils.js

// Constants used for grid calculations.
export const margin = 100;
export const baseGridSpacing = 50;

// Define your default subway lines (you can also move these to a separate file if preferred).
export const lines = [
  { id: 1, name: 'Middle West-East', color: '#EA1975', stationCount: 23, orientation: 'horizontal', y: 500 },
  { id: 2, name: 'Top West-East', color: '#673067', stationCount: 24, orientation: 'horizontal', y: 200 },
  { id: 3, name: 'Middle North-South', color: '#3D7CBF', stationCount: 13, orientation: 'vertical', x: 800 },
  { id: 4, name: 'Right North-South', color: '#4BB851', stationCount: 6, orientation: 'vertical', x: 1200 },
  { id: 5, name: 'Bottom West-East', color: '#63666B', stationCount: 29, orientation: 'horizontal', y: 800 },
  { id: 6, name: 'Left North-South', color: '#C9CB2B', stationCount: 11, orientation: 'vertical', x: 200 },
];

/**
 * Returns the effective grid spacing based on the current view mode.
 * In depot or SCADA mode, the grid spacing is reduced.
 */
export function getEffectiveGridSpacing(viewMode) {
  if (viewMode === 'depot' || viewMode === 'scada') {
    return baseGridSpacing / 4;
  }
  return baseGridSpacing;
}

/**
 * Finds and returns a line from the default lines array by its id.
 */
export function findLine(lineId) {
  return lines.find((l) => l.id === lineId);
}

/**
 * Computes the station coordinates for a given subway line.
 * Uses the SVG dimensions and effective grid spacing to position each station.
 */
export function computeLineStations(line, svgWidth, svgHeight, effectiveGridSpacing) {
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
        index: i + 1,
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
}

/**
 * Returns the middle station from an array of stations.
 */
export function findMiddleStation(lineStations) {
  const midIndex = Math.floor((lineStations.length - 1) / 2);
  return lineStations[midIndex];
}

/**
 * Computes the total route length of a given array of points (stations).
 */
export function computeRouteLength(route) {
  let total = 0;
  for (let i = 0; i < route.length - 1; i++) {
    const dx = route[i + 1].x - route[i].x;
    const dy = route[i + 1].y - route[i].y;
    total += Math.sqrt(dx * dx + dy * dy);
  }
  return total;
}

/**
 * Computes the coordinates for depot tracks.
 * Based on depot data, an anchor station, the line orientation, and effective grid spacing.
 */
export function computeDepotTracks(depot, anchorStation, lineOrientation, effectiveGridSpacing) {
  const isHorizontalLine = lineOrientation === 'horizontal';
  const trackShapes = [];
  const trackOffsetStep = 3 * effectiveGridSpacing;
  const startOffset = -((depot.tracks.length - 1) / 2) * trackOffsetStep;

  depot.tracks.forEach((track, i) => {
    const offset = startOffset + i * trackOffsetStep;
    const trackLength = track.length * effectiveGridSpacing;
    if (isHorizontalLine) {
      // For horizontal lines, draw depot tracks vertically from the anchor.
      const x1 = anchorStation.x + offset;
      const y1 = anchorStation.y;
      const x2 = x1;
      const y2 = y1 - trackLength;
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

/**
 * Splits a station name into two lines if its length exceeds 8 characters.
 */
export function splitStationName(name) {
  if (name.length > 8) {
    return [name.slice(0, 8), name.slice(8)];
  }
  return [name];
}

/**
 * Computes the positions for imported stations based on their real-world coordinates.
 * The grid object should contain { minX, maxX, minY, maxY } values.
 */
export function computeImportedStations(stations, grid, svgWidth, svgHeight, viewMode) {
  const scaleX = (svgWidth - 2 * margin) / (grid.maxX - grid.minX);
  const scaleY = (svgHeight - 2 * margin) / (grid.maxY - grid.minY);
  const effectiveSpacing = getEffectiveGridSpacing(viewMode);
  return stations.map(station => {
    const x = margin + (station.realX - grid.minX) * scaleX;
    const y = margin + (station.realY - grid.minY) * scaleY;
    return {
      ...station,
      x: Math.round(x / effectiveSpacing) * effectiveSpacing,
      y: Math.round(y / effectiveSpacing) * effectiveSpacing,
      lineId: station.line // assuming the imported station object has a numeric 'line' property
    };
  });
}
