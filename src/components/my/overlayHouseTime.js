import React, { useState, useEffect } from 'react';
import { renderToString } from 'react-dom/server';
import { Marker, Popup, useMap } from 'react-leaflet';
import { currentFeature, currentMap } from 'src/pages/api/state';
import CustomIcon from 'public/icon/markerHouse';
import L from 'leaflet';

export default function OverlayHouseTime() {
  const { filterHouseT } = currentFeature();
  const { getColor } = currentMap();
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);

  function getScoreColor(score) {
    const color = getColor(score, min, max);
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
  }

  const icon = (score) => {
    return L.divIcon({ html: `${renderToString(<CustomIcon color={getScoreColor(score)} width={18} height={18} />)}`, popupAnchor: [5, -5] });
  }

  useEffect(() => {
    const minScore = Math.min(...filterHouseT.map(e => e.punteggio));
    const maxScore = Math.max(...filterHouseT.map(e => e.punteggio));
    setMin(minScore);
    setMax(maxScore);
  }, [filterHouseT]);


  return (
    <>
      {filterHouseT.map((e) => (
        <Marker position={[e.latitude, e.longitude]} key={e.id} icon={icon(e.punteggio)} >
          <Popup>
            <small>Prezzo: {e.prezzo}€</small>
            <br/>
            <small>Area: {e.metri}m² </small>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
