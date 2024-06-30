import React, { useState, useEffect } from 'react';
import { GeoJSON } from 'react-leaflet';

export default function OverlayZone() {
  const [geojsonData, setGeojsonData] = useState(null);
  const [selectedZones, setSelectedZones] = useState([]);

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
  
  const style = (feature) => {
    if (selectedZones.includes(feature)) {
      return { fillColor: 'rgba(0, 170, 183, 1)', weight: 2, color: 'rgba(0, 96, 128, 1)' };
    }
    return { fillColor: 'rgba(255, 255, 255, 0.4)', weight: 2, color: 'rgba(120, 120, 120, 0.4)' };
  };

  useEffect(() => {
    async function fetchGeoJSON() {
      try {
        const response = await fetch('./db/zoneBO.geojson');
        if (!response.ok) {
          throw new Error('Failed to fetch GeoJSON data');
        }
        const data = await response.json();
        setGeojsonData(data);
      } catch (error) {
        console.error('Error fetching GeoJSON data:', error);
      }
    }

    fetchGeoJSON();
  }, []);

  if (!geojsonData) {
    return null; // Oppure mostra un messaggio di caricamento
  }

  return <GeoJSON data={geojsonData} style={style} onEachFeature={onEachZone} />;
}
