import React, { useState, useEffect } from 'react';
import { GeoJSON } from 'react-leaflet';
import { getIcon } from './icon';
import { currentFeature } from 'src/pages/api/state';

export default function OverlayIcon(prop) {
  const {type}=prop;
  const [geojsonData, setGeojsonData] = useState(null);

  const {getFeature} = currentFeature();

  const [url, setUrl] = useState('');
  const [img, setImg] = useState('');

  const setType = (type)=>{
    /*'piste ciclabili'*/
    switch(type){
      case 'cinema e teatri': 
        setUrl('teatri-cinema.geojson');
        break;
      case 'stazione': 
        setUrl('stazioniferroviarie.geojson');
        setImg('stazione');
        break;
      case 'ospedali e cliniche': 
        setUrl('strutture-sanitarie.geojson');
        setImg('ospedale');
        break;
      case 'trasporti pubblici':
        setUrl('tper-fermate-autobus.geojson');
        setImg('bus');
      break;
      case 'centri sportivi':
          setUrl('impianti_sportivi_comunali.geojson');
          setImg('sport');
      break;
      case 'musei':
          setUrl('musei.geojson');
          setImg('museo');
      break;
      case 'supermercati':
          setUrl('musei.geojson');
          setImg('supermarket');
      break;
      case 'ristoranti e bar':
        setUrl('musei.geojson');
        setImg('lunch');
      break;
      case 'biblioteche':
        setUrl('musei.geojson');
        setImg('biblioteca');
      break;
      case 'scuole':
        setUrl('musei.geojson');
        setImg('scuola');
      break;
      case 'parchi e aree verdi':
        setUrl('musei.geojson');
        setImg('parchi');
      break;
      case 'chiese':
        setUrl('musei.geojson');
        setImg('chiese');
      break;
      case 'parcheggi':
        setUrl('musei.geojson');
        setImg('parcheggi');
      break;
      case 'piste ciclabili':
        setUrl('piste-ciclopedonali.geojson');
        setImg('');
      break;
      default: return '';
    }
  }

  useEffect(() => {
    setType(type);
    async function fetchGeoJSON() {
      if(url!=''){
        try {
          const response = await fetch('./db/'+url);
          if (!response.ok) {
            console.log(url)
            throw new Error('Failed to fetch GeoJSON data');
          }
          const data = await response.json();
          setGeojsonData(data);
        } catch (error) {
          console.log(url)
          console.error('Error fetching GeoJSON data:', error);
        }
      }
    }
    fetchGeoJSON();
  }, [url,img]);

  // Funzione che gestisce ogni marker del GeoJSON
  const pointToLayer = (feature, latlng) => {
    const icon = getIcon(img==''?feature.properties.tipologia.toLowerCase():img);
    return L.marker(latlng, { icon: icon });
  };

  if (!geojsonData) {
    return null; // Oppure mostra un messaggio di caricamento
  }

  const level = ()=>{
    if(type==="piste ciclabili"){
      return <GeoJSON data={geojsonData} style={{weight: 3, color: 'rgba(219,31,72, .5)' }} />
    } else {
      return <GeoJSON data={geojsonData} pointToLayer={pointToLayer} />
    }
  }

  return <>{ getFeature(type) && level() }
  </>
}
