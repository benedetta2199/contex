import React, { useState, useEffect } from 'react';
import { GeoJSON } from 'react-leaflet';

export default function OverlayZoneRec() {
  const [geojsonData, setGeojsonData] = useState(null);
  const [selectedZones, setSelectedZones] = useState([]);
  

  useEffect(() => {
    async function fetchGeoJSON() {
      try {
        const response = await fetch('./db/zoneBORec.geojson');
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

  return <GeoJSON data={geojsonData} style={{weight: 0.5, color: 'rgba(44, 163, 33, .8)' }} />;
}
