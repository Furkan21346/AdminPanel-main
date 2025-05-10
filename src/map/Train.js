import React, { useState, useEffect } from 'react';

function computeTotalRouteLength(route) {
  let total = 0;
  for (let i = 0; i < route.length - 1; i++) {
    const dx = route[i + 1].x - route[i].x;
    const dy = route[i + 1].y - route[i].y;
    total += Math.sqrt(dx * dx + dy * dy);
  }
  return total;
}

const Train = ({ route, trainCode, speed = 1, startDelay = 0 }) => {
  // Calculate total length for looping.
  const totalLength = computeTotalRouteLength(route);

  // The train's current distance (in pixels) along the route.
  const [distance, setDistance] = useState(startDelay);

  useEffect(() => {
    const interval = setInterval(() => {
      setDistance((prev) => {
        const newDistance = prev + speed;
        return newDistance > totalLength ? 0 : newDistance;
      });
    }, 1000); // update every second
    return () => clearInterval(interval);
  }, [speed, totalLength]);

  // Determine current position along the route.
  let pos = route[0];
  let d = distance;
  for (let i = 0; i < route.length - 1; i++) {
    const segStart = route[i];
    const segEnd = route[i + 1];
    const dx = segEnd.x - segStart.x;
    const dy = segEnd.y - segStart.y;
    const segLength = Math.sqrt(dx * dx + dy * dy);
    if (d > segLength) {
      d -= segLength;
    } else {
      const fraction = d / segLength;
      pos = {
        x: segStart.x + fraction * dx,
        y: segStart.y + fraction * dy,
      };
      break;
    }
  }

  return (
    <g className="train">
      <rect
        x={pos.x - 12.5} // center horizontally (25px width)
        y={pos.y - 6.25} // center vertically (12.5px height)
        width={25}
        height={12.5}
        rx={1}
        ry={1}
        fill="yellow"
        stroke="black"
        strokeWidth={1}
      />
      <text
        x={pos.x}
        y={pos.y + 2.5} // adjust vertical centering as needed
        textAnchor="middle"
        fontSize="5pt"
        fill="black"
      >
        {trainCode}
      </text>
    </g>
  );
};

export default Train;
