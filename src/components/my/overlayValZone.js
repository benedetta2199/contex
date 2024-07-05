import React, { useState, useEffect } from 'react';
import { GeoJSON } from 'react-leaflet';
import { currentFeature, currentMap } from 'src/pages/api/state';

export default function OverlayValZone() {
  const { valZone, zone } = currentFeature();
  const { getColor } = currentMap();
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [drawZones, setDrawZones] = useState([]);
  
  const styleDefault = { fillOpacity: 1, color: 'rgba(0, 0, 0, 0.1)', weight: 0};

  useEffect(() => {
    if (valZone && valZone.length > 0) {
      const minScore = Math.min(...valZone.map(e => e.punteggio));
      const maxScore = Math.max(...valZone.map(e => e.punteggio));
      setMin(minScore);
      setMax(maxScore);
    }
    const updatedDrawZones = zone.map(z => {
      const matchedValZone = valZone.find(vz => vz.nome === z.name);
      return {...z, punteggio: matchedValZone ? matchedValZone.punteggio : -1};
    });
    setDrawZones(updatedDrawZones);
    console.log(setDrawZones);
  }, [valZone]);

  const setStyle = (point)=>{
    const color = getColor(point, min, max);
    return {fillColor:` rgb(${color.r},${color.g},${color.b})`, fillOpacity: 0.55, 
          weight: 2, color: `rgba(${color.r}, ${color.g}, ${color.b}, 1)`};
  }

  return <>
    {drawZones.map((zone, index) => (
      <GeoJSON key={index} data={zone.data} style={zone.punteggio==-1 ? styleDefault : setStyle(zone.punteggio)} 
      /*onEachFeature={(data, layer) => onEachZone(data, layer, zone)*//>
    ))}
  </>
}

/*import React, { useState, useEffect } from 'react';
import { GeoJSON } from 'react-leaflet';
import { currentFeature, currentMap } from 'src/pages/api/state';

export default function OverlayValZone() {
  const {valZone} = currentFeature();
  const { getColor } = currentMap();
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);

  useEffect(() => {
    console.log(valZone);
    const minScore = Math.min(...valZone.map(e => e.punteggio));
    const maxScore = Math.max(...valZone.map(e => e.punteggio));
    setMin(minScore);
    setMax(maxScore);
  }, [valZone]);

  
  function getStyle(score) {
    const color = getColor(score, min, max);
    return {fillColor:` rgb(${color.r},${color.g},${color.b})`, fillOpacity: 0.55, 
              color: `rgba(${color.r}, ${color.g}, ${color.b}, 1)`, weight: 2}
  }

  return <>
    {valZone.map((zone, index) => (
        <GeoJSON key={index} data={JSON.parse(zone.geom)} style={getStyle(zone.punteggio)}/>
      ))}
  </>
}
*/