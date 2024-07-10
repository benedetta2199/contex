import React, { useState, useEffect } from 'react';
import { renderToString } from 'react-dom/server';
import { Marker, Popup } from 'react-leaflet';
import { currentMap, currentValue } from 'src/pages/api/state';
import CustomIcon from 'public/icon/markerHouse';
import L from 'leaflet';

/**
 * OverlayHouseTime Component - Displays markers for houses based on time criteria.
 * @returns {JSX.Element} - The rendered component.
 */
export default function OverlayHouseTime() {
  const { filterHouseT } = currentValue(); // Get filtered houses based on time
  const { getColor } = currentMap(); // Get the color function from the map state
  const [max, setMax] = useState(0); // State to store the maximum score

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
      html: `${renderToString(<CustomIcon color={getScoreColor(score)} width={18} height={18} />)}`,
      popupAnchor: [5, -5]
    });
  }

  // Effect to calculate and set the maximum score from the filtered houses
  useEffect(() => {
    const maxScore = Math.max(...filterHouseT.map(e => e.punteggio));
    setMax(maxScore);
  }, [filterHouseT]);

  return (
    <>
      {filterHouseT.map((e) => (
        <Marker position={[e.latitude, e.longitude]} key={e.id} icon={icon(e.punteggio)}>
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