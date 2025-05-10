import React from 'react';
import Train from './Train'; // Adjust path as necessary
import { findLine, computeDepotTracks } from './mapUtils';

/**
 * Renders a scissor rail overlay given a scissor object and grid spacing.
 */
const renderScissorRail = (scissor, effectiveGridSpacing) => {
  const line = findLine(scissor.lineId);
  const railColor = line ? line.color : 'purple';
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
};

/**
 * Overlays component renders all map overlays:
 * - Transfer-selection and station-editing banners (using foreignObject)
 * - Grid (when in editing mode)
 * - Depot overlays
 * - Scissor rails (both individual and from parallel/double lines)
 * - Trains (for depot/SCADA view)
 * - Transfer pairs
 *
 * Expected props:
 * • isSelectingTransfer, isSelectingStationToEdit, darkMode, editing,
 *   width, height, effectiveGridSpacing, depotData, viewMode,
 *   scissorRailData, doubleLineData, activeLines, lineStationsMap,
 *   transferPairs, onStationClick
 */
const Overlays = ({
  isSelectingTransfer,
  isSelectingStationToEdit,
  darkMode,
  editing,
  width,
  height,
  effectiveGridSpacing,
  depotData,
  viewMode,
  scissorRailData,
  doubleLineData,
  activeLines,
  lineStationsMap,
  transferPairs,
  onStationClick,
}) => {
  // Helper to compute route length for trains.
  const computeRouteLength = (stations) => {
    let total = 0;
    for (let i = 0; i < stations.length - 1; i++) {
      const dx = stations[i + 1].x - stations[i].x;
      const dy = stations[i + 1].y - stations[i].y;
      total += Math.sqrt(dx * dx + dy * dy);
    }
    return total;
  };

  return (
    <>
      {/* Transfer-selection overlay */}
      {isSelectingTransfer && (
        <foreignObject x="0" y="0" width={width} height="50">
          <div
            style={{
              width: '100%',
              height: '50px',
              backgroundColor: darkMode ? '#1c1b1b' : '#adacaa',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '20px', color: darkMode ? '#fff' : '#000' }}>
              Please select the station to connect as a transfer
            </span>
          </div>
        </foreignObject>
      )}

      {/* Station-editing overlay */}
      {isSelectingStationToEdit && !isSelectingTransfer && (
        <foreignObject x="0" y="0" width={width} height="50">
          <div
            style={{
              width: '100%',
              height: '50px',
              backgroundColor: darkMode ? '#1c1b1b' : '#adacaa',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '20px', color: darkMode ? '#fff' : '#000' }}>
              Please select the station to edit
            </span>
          </div>
        </foreignObject>
      )}

      {/* Grid overlay (for editing) */}
      {editing && (
        <g className="grid">
          {Array.from({ length: Math.floor(width / effectiveGridSpacing) + 1 }, (_, col) =>
            Array.from({ length: Math.floor(height / effectiveGridSpacing) + 1 }, (_, row) => {
              const x = col * effectiveGridSpacing;
              const y = row * effectiveGridSpacing;
              return (
                <circle key={`grid-${col}-${row}`} cx={x} cy={y} r={1} fill="lightgray" />
              );
            })
          ).flat()}
        </g>
      )}

      {/* Depot overlays */}
      {(viewMode === 'depot' || viewMode === 'scada') &&
        depotData &&
        depotData.map((depot) => {
          const line = findLine(depot.lineId);
          if (!line) return null;
          const stations = lineStationsMap[line.id];
          if (!stations || !stations.length) return null;
          const midIndex = Math.floor((stations.length - 1) / 2);
          const anchor = stations[midIndex];
          if (!anchor) return null;
          const trackShapes = computeDepotTracks(depot, anchor, line.orientation, effectiveGridSpacing);
          return (
            <g
              key={depot.id}
              className="depot-group"
              style={{ cursor: 'pointer' }}
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

      {/* Scissor Rails overlay */}
      {viewMode === 'scada' &&
        scissorRailData &&
        scissorRailData.map((scissor, index) => (
          <g key={`scissor-${index}`}>{renderScissorRail(scissor, effectiveGridSpacing)}</g>
        ))}

      {/* Double Line (Parallel) Scissor Rails overlay */}
      {viewMode === 'scada' &&
        doubleLineData &&
        doubleLineData.map((doubleLine) => {
          const line = findLine(doubleLine.lineId);
          if (!line) return null;
          const stations = lineStationsMap[line.id];
          if (!stations || stations.length < 2) return null;
          const offset = effectiveGridSpacing;
          const parallelStations =
            line.orientation === 'horizontal'
              ? stations.map((st) => ({ ...st, y: st.y + offset }))
              : stations.map((st) => ({ ...st, x: st.x + offset }));
          const totalSegments = stations.length - 1;
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
                  x: (stations[idx].x + stations[idx + 1].x) / 2,
                  y: (stations[idx].y + stations[idx + 1].y) / 2,
                };
                const parallelMid = {
                  x: (parallelStations[idx].x + parallelStations[idx + 1].x) / 2,
                  y: (parallelStations[idx].y + parallelStations[idx + 1].y) / 2,
                };
                const scissor = {
                  id: `scissor-${doubleLine.id}-${idx}`,
                  lineId: line.id,
                  orientation: line.orientation,
                  stationA: mainMid,
                  stationB: parallelMid,
                };
                const clickX = (mainMid.x + parallelMid.x) / 2;
                const clickY = (mainMid.y + parallelMid.y) / 2;
                return (
                  <g
                    key={scissor.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      onStationClick({
                        stationId: scissor.id,
                        lineName: `Scissor Rail (${line.name})`,
                        lineColor: line.color,
                        x: clickX,
                        y: clickY,
                        isScissor: true,
                      })
                    }
                  >
                    {renderScissorRail(scissor, effectiveGridSpacing)}
                  </g>
                );
              })}
            </g>
          );
        })}

      {/* Trains overlay */}
      {(viewMode === 'depot' || viewMode === 'scada') &&
        activeLines &&
        activeLines.map((line) => {
          const stations = lineStationsMap[line.id];
          if (!stations || stations.length < 2) return null;
          const routeLength = computeRouteLength(stations);
          return (
            <g key={`trains-${line.id}`}>
              <Train route={stations} trainCode={`TR${line.id}01`} speed={1} startDelay={0} />
              <Train
                route={stations}
                trainCode={`TR${line.id}02`}
                speed={1}
                startDelay={routeLength / 2}
              />
            </g>
          );
        })}

      {/* Transfer Pairs overlay */}
      {transferPairs &&
        transferPairs.map((pair) => (
          <g
            key={`${pair.sourceId}-${pair.targetId}`}
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
    </>
  );
};

export default Overlays;
