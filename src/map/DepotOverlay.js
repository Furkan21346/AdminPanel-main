// DepotOverlay.js
import React from 'react';

/**
 * DepotOverlay Component
 * This component renders overlay markers for depot stations,
 * showing active/idle train status, train IDs, route information,
 * and a basic health status indicator.
 *
 * Props:
 * - depotData: Array of depot objects, each should include:
 *    - id: Unique identifier
 *    - x, y: Coordinates for rendering on the map
 *    - trainId: The identifier of the train in the depot
 *    - status: 'active', 'idle', or other status strings (used for color coding)
 *    - route (optional): Route number or name
 *    - health (optional): Health status (percentage or indicator)
 * - darkMode: Boolean indicating whether dark mode is active (for text color adjustments)
 */
const DepotOverlay = ({ depotData, darkMode }) => {
  return (
    <g className="depot-overlay">
      {depotData.map((depot) => (
        <g key={depot.id}>
          <circle
            cx={depot.x}
            cy={depot.y}
            r={10}
            // Use different colors based on depot status
            fill={
              depot.status === 'active'
                ? '#4BB851'
                : depot.status === 'idle'
                ? 'orange'
                : 'gray'
            }
            stroke="black"
            strokeWidth={1}
          />
          <text
            x={depot.x}
            y={depot.y - 12}
            fontSize="6pt"
            textAnchor="middle"
            fill={darkMode ? '#fff' : '#000'}
          >
            {depot.trainId}
            {depot.route && ` (${depot.route})`}
          </text>
          {depot.health !== undefined && (
            <text
              x={depot.x}
              y={depot.y + 15}
              fontSize="5pt"
              textAnchor="middle"
              fill={darkMode ? '#ccc' : '#333'}
            >
              Health: {depot.health}%
            </text>
          )}
        </g>
      ))}
    </g>
  );
};

export default DepotOverlay;
