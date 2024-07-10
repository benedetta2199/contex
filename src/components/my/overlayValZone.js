import React, { useState, useEffect } from 'react';
import { GeoJSON } from 'react-leaflet';
import { currentMap, currentValue } from 'src/pages/api/state';

/**
 * OverlayValZone Component - Displays the evaluation zones on the map.
 * @returns {JSX.Element} - The rendered component.
 */
export default function OverlayValZone() {
  // Extracting values and functions from the state hooks
  const { valZone, zone } = currentValue();
  const { getColor } = currentMap();

  // State to hold the zones to be drawn
  const [drawZones, setDrawZones] = useState(zone);

  // Default style for zones
  const styleDefault = { fillOpacity: 1, color: 'rgba(0, 0, 0, 0.1)', weight: 0 };

  // Effect to update the zones to be drawn when valZone changes
  useEffect(() => {
    const updatedDrawZones = zone.map(z => {
      const p = valZone.get(z.name);
      return p>=0 && z.select ? { ...z, point: p } : { ...z, point: -1 };
    });
    setDrawZones(updatedDrawZones);
  }, [valZone, zone]);

  /**
   * Sets the style for a zone based on its evaluation point.
   * @param {number} point - Evaluation point of the zone.
   * @returns {object} - Style object for the zone.
   */
  const setStyle = (point) => {
    const color = getColor(point, 0, 100);
    return {
      fillColor: `rgb(${color.r},${color.g},${color.b})`, fillOpacity: 0.55, 
      weight: 2, color: `rgba(${color.r}, ${color.g}, ${color.b}, 1)`
    };
  };

  return (
    <>
      {drawZones.map((z, index) => (
        z.select && (
          <GeoJSON key={index} data={z.data} style={z.point == -1 ? styleDefault : setStyle(z.point)}/>
        )
      ))}
    </>
  );
}
