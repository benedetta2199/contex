import React, { useState, useEffect } from 'react';
import { GeoJSON } from 'react-leaflet';
import { currentFeature } from 'src/pages/api/state';

export default function OverlayZone() {
  const {getZone, updateSelectZone} = currentFeature();
  const [zones, setZones] = useState([]);

  const styleDefault = {fillColor: 'rgba(255, 255, 255, 0.4)', weight: 2, color: 'rgba(120, 120, 120, 0.4)'};
  const styleSelect = {fillColor:'rgba(0, 170, 183, 1)', weight: 2, color: 'rgba(0, 96, 128, 1)'}

  useEffect(() => {
    if(zones.length==0){
      const fetchedZone = getZone();
      if (zones.length==0 && fetchedZone.length > 0) {
        setZones(fetchedZone);
        console.log(fetchedZone);
      }
    }
  }, [getZone]);

  const onEachZone = (data, layer, zone) => {
    layer.on({
      click: () => {
        updateSelectZone(data.name);
        zone.select = !zone.select;
        layer.setStyle(zone.select ? styleSelect : styleDefault);
      },
    });

    // Add a tooltip with the zone name
    if (data.properties && zone.name) {
        var TooltipClass = {'className': 'custom-tooltip'}
        layer.bindTooltip(zone.name, { ...TooltipClass}, TooltipClass)
      }
  };

  return <>
    {zones.map((zone, index) => (
        <GeoJSON key={index} data={zone.data} style={zone.select ? styleSelect : styleDefault} 
        onEachFeature={(data, layer) => onEachZone(data, layer, zone)}/>
      ))}
</>
}
