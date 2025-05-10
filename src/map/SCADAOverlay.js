import React from 'react';

/**
 * SCADAOverlay Component
 * 
 * Renders a set of SCADA elements (signals, switches, power substations, maintenance alerts, emergency zones, etc.)
 * overlaid on the metro map for full infrastructure & real-time control.
 *
 * Props:
 * - scadaData: Array of SCADA objects, where each object should include:
 *    - id: Unique identifier
 *    - x, y: Coordinates on the map
 *    - type: Type of SCADA element ('signal', 'switch', 'power', 'maintenance', 'emergency', etc.)
 *    - status: For signals, typically 'green', 'yellow', or 'red'; for others, this can be a color or indicator.
 * - darkMode: Boolean to adjust text or element colors for dark mode (optional)
 */
const SCADAOverlay = ({ scadaData, darkMode }) => {
  // Helper function to render each SCADA element based on its type.
  const renderElement = (element) => {
    switch (element.type) {
      case 'signal':
        // Render a signal as a small rectangle with color based on status.
        return (
          <rect
            key={element.id}
            x={element.x}
            y={element.y}
            width={10}
            height={10}
            fill={
              element.status === 'green'
                ? 'green'
                : element.status === 'yellow'
                ? 'yellow'
                : 'red'
            }
            stroke="black"
          />
        );
      case 'switch':
        // Render a rail switch as a simple polygon.
        return (
          <polygon
            key={element.id}
            points={`${element.x},${element.y} ${element.x + 10},${element.y - 5} ${element.x + 10},${element.y + 5}`}
            fill={element.status || 'gray'}
            stroke="black"
          />
        );
      case 'power':
        // Render a power substation or grid element as a circle.
        return (
          <circle
            key={element.id}
            cx={element.x}
            cy={element.y}
            r={6}
            fill={element.status || 'blue'}
            stroke="black"
          />
        );
      case 'maintenance':
        // Render a maintenance alert as a highlighted rectangle.
        return (
          <rect
            key={element.id}
            x={element.x - 5}
            y={element.y - 5}
            width={15}
            height={15}
            fill="orange"
            stroke="black"
            strokeDasharray="3"
          />
        );
      case 'emergency':
        // Render emergency zones (e.g., braking or isolation points) as a red circle.
        return (
          <circle
            key={element.id}
            cx={element.x}
            cy={element.y}
            r={8}
            fill="red"
            stroke="black"
          />
        );
      default:
        // Fallback rendering: a small circle.
        return (
          <circle
            key={element.id}
            cx={element.x}
            cy={element.y}
            r={5}
            fill={element.status || 'gray'}
            stroke="black"
          />
        );
    }
  };

  return (
    <g className="scada-overlay">
      {scadaData.map((element) => renderElement(element))}
      {/* Additional static or dynamic SCADA elements can be added here */}
    </g>
  );
};

export default SCADAOverlay;
