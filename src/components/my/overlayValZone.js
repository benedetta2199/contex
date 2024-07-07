import React, { useState, useEffect } from 'react';
import { GeoJSON } from 'react-leaflet';
import { currentMap, currentFeature } from 'src/pages/api/state';

export default function OverlayValZone() {
  const { valZone, zone } = currentFeature();
  const { getColor } = currentMap();

  const [drawZones, setDrawZones] = useState(zone);
  
  const styleDefault = { fillOpacity: 1, color: 'rgba(0, 0, 0, 0.1)', weight: 0};

  useEffect(() => {

    const updatedDrawZones = zone.map(z => {
      const p = valZone.get(z.name);
      return p && z.select ? {...z, point: p}  : {...z, point: -1};
    });
    setDrawZones(updatedDrawZones);
  }, [valZone]);

  const setStyle = (point)=>{
    console.log(point);
    const color = getColor(point, 0, 100);
    return {fillColor:` rgb(${color.r},${color.g},${color.b})`, fillOpacity: 0.55, 
          weight: 2, color: `rgba(${color.r}, ${color.g}, ${color.b}, 1)`};
  }

  return <>
    {drawZones.map((z, index) => (
      z.select && <GeoJSON key={index} data={z.data} style={z.punteggio==-1 ? styleDefault : setStyle(z.point)} />
    ))}
  </>
}