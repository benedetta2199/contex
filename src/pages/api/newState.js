import { geoJSON } from 'leaflet';
import { useState } from 'react';
import { useBetween } from 'use-between';

const sharedFeature = () => {
  /*Map dei PoI utilizzati -> key : {name, valueQuestionario, visibiliy}*/
  const [poi, setPoI] = useState(initializePoI);

  /*Map delle zone -> name : {zone, select}*/
  const [zone, setZone] = useState(initializePoI);

  /*raggio in metri -> float esempio: 30*/
  const [raggio, setRaggio] = useState(0.5);

  /*Array contente i nomi delle zone selezionate dall'utente*/
  //const [zone, setZone] = useState([]);
  
  /*case restituite dalla query in base ai parametri di raggio e risposte questionario*/
  const [house, setHouse] = useState([]);
  //initialFeatureMap, recomZone, setRecomZone

  return { poi, setPoI, raggio, setRaggio, house, setHouse, zone, setZone };
};

export const currentFeature = () => {
  const { poi, setPoI, raggio, setRaggio, house, setHouse, zone, setZone } = useBetween(sharedFeature);
  //const [zoneGeojsonData, setZoneGeojsonData] = useState();

  /*funzion che restituisce un PoI specifico*/
  const getFeature = (elem) => {
    return featureMap[elem];
  };

  /*funzione per riporate allo stato di partenza tutte le impostazioni PoI*/
  const resetPoI = () => {setPoI(initializePoI)};

  /*funzione che va a modificare la visibilità (value) di un PoI spefico definito da name*/
  const updateVisibilityPoI = (name, value) => {
    setPoI(prevPoI => {
      const newPoI = new Map(prevPoI);
      if (newPoI.has(name)) {
        const element = newPoI.get(name);
        newPoI.set(name, { ...element, visibiliy: value });
      }
      return newPoI;
    }
  );
  };

  /*funzione che va a modificare la il valore del questionario (value) di un PoI spefico definito da name*/
  const updateValuePoI = (name, value) => {
    setPoI(prevPoI => {
        const newPoI = new Map(prevPoI);
        if (newPoI.has(name)) {
          const element = newPoI.get(name);
          newPoI.set(name, { ...element, value: value });
        }
        return newPoI;
      }
    );
  }

  const getAllNamePoI = () =>{
    let res =[];
    poi.forEach((value, key) => {
      res.push({key: key, name: value.name})
    });
    return res;
  }

  const getRaggio = () => {
    return raggio
  }

  const initializeHouse = async () => {
    return fetch(`http://localhost:5000/api/casa?raggio=${raggio*1000}&questionario=${getRispQuestionario()}`)
    .then(response => {
      if (!response.ok) {throw new Error('Network response was not ok ' + response.statusText);}
      return response.json();
    })
    .then(data => {setHouse(data);})
    .catch(error => {console.error('There was a problem with the fetch operation:', error);});
  }
  
  const getHouse = () =>{
    return house;
  }

  /*
  const initializedZone = async ()=>{
    try {
      const response = await fetch('./db/zoneBO.geojson');
      if (!response.ok) {
        throw new Error('Failed to fetch GeoJSON data');
      }
      const data = await response.json();
      console.log(data);
      setZoneGeojsonData(data);
    } catch (error) {
      console.error('Error fetching GeoJSON data:', error);
    }
  }*/

  /*const getZoneGeoJSON = () =>{
    return geoJSON
  }*/

/*
  const getZone = ()=>{
    return Array.from(zone.values());
  }*/

  /*
  const updateZone = (name) =>{
    let isInclude = false;
    if(zone.includes(name)){
      setZone(l => l.filter(item => item !== name));
      isInclude = true;
    } else{
      setZone([...zone, name]);
    }
    //console.log(zone);
    return isInclude;
  }*/

  /*
  const getBestZone = () => {
    // L'oggetto da inviare come JSON
    let data = { 
      'questionario': Array.from(poi, ([name, value]) => (value.visibility)), 
      'zona': zone
    };
    // La richiesta fetch
    return fetch('http://localhost:5000/api/area', { 
      method: 'POST', // Specifica il metodo POST
      headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) })
    .then(response => {
        if (!response.ok) { throw new Error('Network response was not ok ' + response.statusText);}
        return response.json();
    }) // Converti la risposta in un oggetto JSON
    .then(responseData => { console.log('Success:', responseData); // Gestisci la risposta di successo
    })
    .catch(error => {
        console.error('Error:', error); // Gestisci eventuali errori
    });
  }*/

    

  /*restituisce la stringa in formato corretto per la query
    NB: slice(0, -1) è per non restituire l'ultima virgola*/
  const getRispQuestionario = () => {
    let ris ='';
    poi.forEach((values, keys) => {
      ris+=values.value+','});
    return ris.slice(0, -1);
  }

  /*return {
    poi, updateVisibilityPoI, updateValuePoI,
    getResQuestionario, getFeature, resetFeature,
    recomZone, setRecomZone
  };*/

  return { getFeature,
    updateVisibilityPoI, updateValuePoI, resetPoI, getAllNamePoI,
    initializeHouse, getHouse,
    //initializedZone, updateZone, getZone,
    getRispQuestionario, getRaggio, setRaggio};
};

const DEFAULT_ZOOM = 12;
const DEFAULT_POS = [44.4950, 11.3424];


const sharedMap = () => {
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);  
  const [position, setPosition] = useState(DEFAULT_POS);

  return { zoom, setZoom, position, setPosition};
};


export const currentMap = () => {
  const { zoom, setZoom, position, setPosition} = useBetween(sharedMap);

  const resetMap = () => {
    setZoom(DEFAULT_ZOOM);
    setPosition(DEFAULT_POS);
  }

  return { zoom, setZoom, position, setPosition, resetMap, DEFAULT_ZOOM, DEFAULT_POS};
};

const initializePoI= ()=>{
  /*'cinema e teatri'*/
  const namePoI = ['teatri_cinema','chiese','scuole','impianti_sportivi', 'aree_verdi','musei','negozi','biblio','fermate_bus',
 'parcheggi','ospedali','stazioni','piste_ciclabili'];

    let feature = new Map();
    namePoI.map((name) => {
      feature.set(name, {name: name.replace('_',' '), value: 0, visibiliy: false})
    });
    return feature;
}