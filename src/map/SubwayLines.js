import React from 'react';

const SubwayLines = ({ activeLines, lineStationsMap, viewMode, effectiveGridSpacing }) => {
  return (
    <>
      {activeLines.map((line) => {
        const stations = lineStationsMap[line.id] || [];
        if (!stations.length) return null;

        if (viewMode === 'normal') {
          // Build a single path for normal mode.
          const pathData = stations
            .map((station, idx) => `${idx === 0 ? 'M' : 'L'} ${station.x} ${station.y}`)
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
          const offset = effectiveGridSpacing;
          let parallelStations;
          if (line.orientation === 'horizontal') {
            parallelStations = stations.map((st) => ({ ...st, y: st.y + offset }));
          } else {
            parallelStations = stations.map((st) => ({ ...st, x: st.x + offset }));
          }
          const mainPathData = stations
            .map((station, idx) => `${idx === 0 ? 'M' : 'L'} ${station.x} ${station.y}`)
            .join(' ');
          const parallelPathData = parallelStations
            .map((station, idx) => `${idx === 0 ? 'M' : 'L'} ${station.x} ${station.y}`)
            .join(' ');
          return (
            <g key={`line-${line.id}`}>
              <path
                d={mainPathData}
                stroke={line.color}
                strokeWidth={5}
                fill="none"
              />
              <path
                d={parallelPathData}
                stroke={line.color}
                strokeWidth={5}
                fill="none"
              />
            </g>
          );
        }
      })}
    </>
  );
};

export default SubwayLines;
