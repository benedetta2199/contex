import React, { useState, useEffect } from 'react';
import { renderToString } from 'react-dom/server';
import { Marker, Popup, useMap } from 'react-leaflet';
import { currentFeature, currentMap } from 'src/pages/api/state';
import CustomIcon from 'public/icon/markerHouse';
import L from 'leaflet';

function GradientCircle({ center, radius, color }) {
  const {zoom} = currentMap();
  const map = useMap();
  useEffect(() => {
    if (!center) return;

    const scale = 1 / (2 ** (16.8 - zoom)); // Adjust the scale factor as needed
    const svgCircle = L.divIcon({
      className: 'gradient-circle',
      html: `
        <svg height="${radius * 2}" width="${radius * 2}" viewBox="0 0 ${radius * 2} ${radius * 2}"  style="transform: scale(${scale});">
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

export default function OverlayHouse() {
  const { getHouse, raggio, filterHouse } = currentFeature();
  const { getColor } = currentMap();
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [selectedMarker, setSelectedMarker] = useState(null);

  function getScoreColor(score) {
    const color = getColor(score, min, max);
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
  }

  const icon = (score) => {
    return L.divIcon({ html: `${renderToString(<CustomIcon color={getScoreColor(score)} width={18} height={18} />)}`, popupAnchor: [5, -5] });
  }

  useEffect(() => {
    const minScore = Math.min(...filterHouse.map(e => e.punteggio));
    const maxScore = Math.max(...filterHouse.map(e => e.punteggio));
    setMin(minScore);
    setMax(maxScore);
  }, [filterHouse]);

  return (
    <>
      {selectedMarker && (
        <GradientCircle center={[selectedMarker.latitude, selectedMarker.longitude]}
          radius={raggio} // Imposta un raggio maggiore per il cerchio
          color={getScoreColor(selectedMarker.punteggio)}
        />
      )}
      {filterHouse.map((e) => (
        <Marker position={[e.latitude, e.longitude]} key={e.id} icon={icon(e.punteggio)}
           eventHandlers={{  popupopen: () => { setSelectedMarker(e)}, popupclose: () => { setSelectedMarker(null)} }}>
          <Popup>
            <small>Prezzo: {e.prezzo}€</small>
            <br/>
            <small>Area: {e.metri}m²  </small>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
