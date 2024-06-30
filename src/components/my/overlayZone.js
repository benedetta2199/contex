import React, { useState, useEffect } from 'react';
import { GeoJSON } from 'react-leaflet';
import { currentFeature } from 'src/pages/api/state';

export default function OverlayZone() {
  const {getZone} = currentFeature();
  const [geojsonData, setGeojsonData] = useState(null);
  const [selectedZones, setSelectedZones] = useState([]);
  const [zones, setZones] = useState([]);

  const styleDefault = {fillColor: 'rgba(255, 255, 255, 0.4)', weight: 2, color: 'rgba(120, 120, 120, 0.4)'};
  const styleSelect = {fillColor:'rgba(0, 170, 183, 1)', weight: 2, color: 'rgba(0, 96, 128, 1)'}

  useEffect(() => {
    if(zones.length==0){
      const fetchedZone = getZone();
      if (fetchedZone.length > 0) {
        setZones(fetchedZone);
        console.log(fetchedZone);
      }
    }
  }, [getZone]);

  const onEachZone = (zone, layer) => {
    layer.on({
      click: () => {
        if (selectedZones.includes(zone)) {
          selectedZones.splice(selectedZones.indexOf(zone), 1);
          layer.setStyle({ fillColor: 'rgba(255, 255, 255, 0.4)', weight: 2, color: 'rgba(120, 120, 120, 0.4)' });
        } else {
          selectedZones.push(zone);
          layer.setStyle({ fillColor: 'rgba(0, 170, 183, 1)', weight: 2, color: 'rgba(0, 96, 128, 1)' });
        }
      },
    });

    // Add a tooltip with the zone name
    if (zone.properties && zone.properties.name) {
        var TooltipClass = {'className': 'custom-tooltip'}
        layer.bindTooltip(zone.properties.name, {
            ...TooltipClass
          }, TooltipClass)
      }
  };

  return <>
    {zones.map((zone, index) => (
        <GeoJSON key={index} data={zone.data} style={zone.select ? styleSelect : styleDefault} onEachFeature={onEachZone}/>
      ))}
</>
}
