import React, { useState, useEffect } from 'react';
import { GeoJSON } from 'react-leaflet';
import { currentFeature } from 'src/pages/api/state';

export default function OverlayIcon(prop) {
  const {type}=prop;
  const [geojsonData, setGeojsonData] = useState(null);

  const {poi} = currentFeature();

  const customIcon = new L.Icon({
    iconUrl: './icon/fil.svg', // Inserisci l'URL dell'icona personalizzata
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });


  useEffect(() => {
    console.log(poi);
    console.log("prova")
  }, [poi]);

  // Funzione che gestisce ogni marker del GeoJSON
  const pointToLayer = (name, latlng) => {
    console.log("prova");
    console.log(`/icon/${name}.svg`);
    const icon = getIcon(`/icon/${name}.svg`);
    return L.marker(latlng, { icon: icon });
  };

  const onEachFeature = (feature, layer) => {
    if (feature.geometry.type === "Point") {
      layer.setIcon(customIcon);
    }
  };

  if (!geojsonData) {
    return null; // Oppure mostra un messaggio di caricamento
  }

  function point(feature, latlng){
    console.log(feature+' '+latlng)
    return L.circleMarker(latlng);
  }

  const prova = (p, nome) =>{
      console.log(p+' '+nome);
  }

  return <>
    {poi.map((p, name) => ( 
      p.visibility?<GeoJSON data={p.geoJSON} style={{weight: 3, color: 'rgba(219,31,72, .5)' }} />:
      <GeoJSON data={p.geoJSON} pointToLayer={(feature, latlng) => { return L.marker(latlng, { icon: customIcon }); }} 
        onEachFeature={onEachFeature} />
    ))}
  </>
}

const getIcon = (name) => {
  return L.icon({
    iconUrl: './icon/'+name+'.svg',
    iconSize: [25, 41], // dimensioni dell'icona
    iconAnchor: [12, 41], // punto di ancoraggio dell'icona
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};