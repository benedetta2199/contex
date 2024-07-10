import React from 'react';
import 'leaflet/dist/leaflet.css';
import { Circle, Rectangle } from 'react-leaflet';
import { currentValue } from 'src/pages/api/state';

/**
 * OverlaySuggest Component - Displays suggested areas on the map using rectangles and circles.
 * @returns {JSX.Element} - The rendered component.
 */
export default function OverlaySuggest() {
  // Extracting the bestArea value from the state
  const { bestArea } = currentValue();

  return (
    <>
      {bestArea.map((e, index) => (
        <React.Fragment key={index}>
          <Rectangle 
            bounds={[[e.y, e.x], [e.y - e.height, e.x + e.width]]} 
            pathOptions={{ color: 'gray', weight: 1.5 }} 
          />
          <Circle 
            center={[e.centroide[0], e.centroide[1]]} 
            radius={18} 
            pathOptions={{ color: '#005566', weight: 2 }} 
          />
        </React.Fragment>
      ))}
    </>
  );
}
