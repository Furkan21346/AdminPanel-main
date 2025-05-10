import React from 'react';

const SubwayStations = ({ 
  stations, 
  editing, 
  darkMode, 
  onStationClick, 
  showStationNames, 
  splitStationName 
}) => {
  return (
    <>
      {stations.map((station) => (
        <circle
          key={`station-${station.lineId}-${station.index}`}
          cx={station.x}
          cy={station.y}
          r={8}
          fill="white"
          stroke="black"
          onClick={() =>
            onStationClick({
              stationId: station.name,
              // You might add additional properties as needed
              lineName: station.name,
              lineColor: station.lineColor,
              x: station.x,
              y: station.y,
            })
          }
          style={{ cursor: editing ? 'move' : 'pointer' }}
        />
      ))}
      {showStationNames &&
        stations.map((station) => {
          const nameLines = splitStationName(station.name);
          return (
            <text
              key={`name-${station.id}`}
              x={station.x}
              y={station.y - 12}
              fill={darkMode ? '#fff' : '#000'}
              fontSize="6pt"
              textAnchor="middle"
            >
              <tspan x={station.x} dy="0">
                {nameLines[0]}
              </tspan>
              {nameLines[1] && (
                <tspan x={station.x} dy="1em">
                  {nameLines[1]}
                </tspan>
              )}
            </text>
          );
        })}
    </>
  );
};

export default SubwayStations;
