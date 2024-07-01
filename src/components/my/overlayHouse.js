import React, { useState, useEffect } from 'react';
import { renderToString } from 'react-dom/server';
import { Marker, Popup } from 'react-leaflet';
import { currentFeature } from 'src/pages/api/state';
import CustomIcon from 'public/icon/markerHouse';

export default function OverlayHouse() {
  const {getHouse, filterHouse} = currentFeature();
  const [house, setHouse]= useState([]);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);

  
  function getColor(score) {
    const red = { r: 184, g: 42, b: 29 };
    const yellow = { r: 176, g: 176, b: 18 };
    const green = { r: 58, g: 140, b: 46 };

    let normalizedScore = (score - min) / (max - min);

    let r, g, b;
    if (normalizedScore < 0.5) {
        normalizedScore *= 2;
        r = Math.round(red.r + normalizedScore * (yellow.r - red.r));
        g = Math.round(red.g + normalizedScore * (yellow.g - red.g));
        b = Math.round(red.b + normalizedScore * (yellow.b - red.b));
    } else {
        normalizedScore = (normalizedScore - 0.5) * 2;
        r = Math.round(yellow.r + normalizedScore * (green.r - yellow.r));
        g = Math.round(yellow.g + normalizedScore * (green.g - yellow.g));
        b = Math.round(yellow.b + normalizedScore * (green.b - yellow.b));
    } 
    return `rgb(${r}, ${g}, ${b})`;
  }

  const icon = (score) =>{
    return L.divIcon({ html: `${renderToString(<CustomIcon color={getColor(score)} width={18} height={18} />)}`, popupAnchor: [5,-5]});
  }
                
  useEffect(() => {
    console.log(filterHouse);
    const minScore = Math.min(...filterHouse.map(e => e.punteggio));
    const maxScore = Math.max(...filterHouse.map(e => e.punteggio));
    setMin(minScore);
    setMax(maxScore);
  }, [filterHouse]);

  return <>
    {filterHouse.map((e) => (
      <Marker position={[e.latitude, e.longitude]} key={e.id} icon={icon(e.punteggio)} >
        <Popup> 
          <small>Prezzo: {e.prezzo}m² </small>
          <small>Area: {e.metri}€ </small>
        </Popup>
      </Marker>
    ))
    }
  </>
}
