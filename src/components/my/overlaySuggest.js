import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css'
import { Circle, Rectangle } from 'react-leaflet';
import { currentFeature } from 'src/pages/api/state';

export default function OverlaySuggest() {
  const {getSuggestArea} = currentFeature();
  const bestArea= getSuggestArea();
  // const [min, setMin] = useState(0);
  // const [max, setMax] = useState(0);
    /*var rects = data.rect;
        rects.forEach(rect => {
            // Disegna il rettangolo
            const bounds = [
                [rect.y, rect.x], // Angolo in alto a sinistra
                [rect.y - rect.height, rect.x + rect.width] // Angolo in basso a destra
            ];
            L.rectangle(bounds, { color: 'blue', weight: 1, fillOpacity: 0.2 }).addTo(map);

            // Disegna il pallino rosso sul centroide
            const centroid = [rect.centroide[0], rect.centroide[1]]; // Lat, Lng
            L.circleMarker(centroid, { color: 'red', radius: 5 }).addTo(map);
        });*/

  // useEffect(() => {
  //   const minScore = Math.min(...valZones.map(e => e.punteggio));
  //   const maxScore = Math.max(...valZones.map(e => e.punteggio));
  //   setMin(minScore);
  //   setMax(maxScore);
  // }, [valZones]);

  
  // function getStyle(score) {
  //   console.log(score);
  //   const red = { r: 184, g: 42, b: 29 };
  //   const yellow = { r: 176, g: 176, b: 18 };
  //   const green = { r: 58, g: 140, b: 46 };

  //   let normalizedScore = (score - min) / (max - min);

  //   let r, g, b;
  //   if (normalizedScore < 0.5) {
  //     normalizedScore *= 2;
  //       r = Math.round(red.r + normalizedScore * (yellow.r - red.r));
  //       g = Math.round(red.g + normalizedScore * (yellow.g - red.g));
  //       b = Math.round(red.b + normalizedScore * (yellow.b - red.b));
  //   } else {
  //     normalizedScore = (normalizedScore - 0.5) * 2;
  //       r = Math.round(yellow.r + normalizedScore * (green.r - yellow.r));
  //       g = Math.round(yellow.g + normalizedScore * (green.g - yellow.g));
  //       b = Math.round(yellow.b + normalizedScore * (green.b - yellow.b));
  //   }
  //   return {fillColor:` rgb(${r},${g},${b})`, fillOpacity: 0.55, weight: 2, color: `rgba(${r}, ${g}, ${b}, 1)`}
  // }


  return <>
    {bestArea.map((e, index)=>(
      <>
        <Rectangle bounds={[[e.y, e.x], [e.y-e.height, e.x+e.width]]} key={index}
          pathOptions={{ color: 'gray', weight: 1.5 }} />
        <Circle center={[e.centroide[0], e.centroide[1]]} radius={18} pathOptions={{ color: '#005566', weight: 2, }} key={index}/>
      </>
    ))}
  </>
}
