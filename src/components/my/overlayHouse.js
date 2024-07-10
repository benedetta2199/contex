import React, { useState, useEffect } from 'react';
import { renderToString } from 'react-dom/server';
import { Marker, Popup, useMap } from 'react-leaflet';
import { currentMap, currentValue } from 'src/pages/api/state';
import CustomIcon from 'public/icon/markerHouse';
import L from 'leaflet';

/**
 * GradientCircle Component - Displays a gradient circle around a selected marker.
 * @param {object} props - Component props.
 * @param {array} props.center - Center coordinates of the circle.
 * @param {number} props.radius - Radius of the circle.
 * @param {string} props.color - Color of the circle.
 * @returns {null} - This component does not render anything directly.
 */
function GradientCircle({ center, radius, color }) {
  const { zoom } = currentMap();
  const map = useMap();

  useEffect(() => {
    if (!center) return;

    const scale = 1 / (2 ** (16.8 - zoom)); // Adjust the scale factor as needed
    const svgCircle = L.divIcon({
      className: 'gradient-circle',
      html: `
        <svg height="${radius * 2}" width="${radius * 2}" viewBox="0 0 ${radius * 2} ${radius * 2}" style="transform: scale(${scale}); z-index: 50 !important">
          <defs>
            <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" style="stop-color:${color};stop-opacity:0.7" />
              <stop offset="100%" style="stop-color:${color};stop-opacity:0.1" />
            </radialGradient>
          </defs>
          <circle cx="${radius}" cy="${radius}" r="${radius}" fill="url(#grad1)" stroke="${color}" stroke-width="2" />
        </svg>
      `,
      iconAnchor: [radius, radius]
    });

    const layer = L.marker(center, { icon: svgCircle }).addTo(map);

    return () => {
      map.removeLayer(layer);
    };
  }, [center, radius, color, zoom, map]);

  return null;
}

/**
 * OverlayHouse Component - Displays markers for houses on the map and highlights selected markers with a gradient circle.
 * @returns {JSX.Element} - The rendered component.
 */
export default function OverlayHouse() {
  const { raggio, filterHouse } = currentValue(); // Get current radius and filtered houses
  const { getColor } = currentMap(); // Get the color function from the map state
  const [max, setMax] = useState(0); // State to store the maximum score
  const [selectedMarker, setSelectedMarker] = useState(null); // State to store the selected marker

  /**
   * Returns the color for a given score based on the maximum score.
   * @param {number} score - The score to get the color for.
   * @returns {string} - The color in RGB format.
   */
  function getScoreColor(score) {
    const color = getColor(score, 0, max);
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
  }

  /**
   * Returns a custom icon for a given score.
   * @param {number} score - The score to create the icon for.
   * @returns {L.DivIcon} - The Leaflet div icon.
   */
  const icon = (score) => {
    return L.divIcon({
      html: `${renderToString(<CustomIcon color={getScoreColor(score)} width={18} height={18} className='up' />)}`,
      popupAnchor: [5, -5]
    });
  }

  // Effect to calculate and set the maximum score from the filtered houses
  useEffect(() => {
    const maxScore = Math.max(...filterHouse.map(e => e.punteggio));
    setMax(maxScore);
  }, [filterHouse]);

  return (
    <>
      {selectedMarker && (
        <GradientCircle center={[selectedMarker.latitude, selectedMarker.longitude]} radius={raggio} color={getScoreColor(selectedMarker.punteggio)}/>
      )}
      {filterHouse.map((e) => (
        <Marker position={[e.latitude, e.longitude]} key={e.id} icon={icon(e.punteggio)}
          eventHandlers={{ popupopen: () => { setSelectedMarker(e) }, popupclose: () => { setSelectedMarker(null) }}}>
          <Popup>
            <small>Prezzo: {e.prezzo}€</small>
            <br />
            <small>Area: {e.metri}m²</small>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
