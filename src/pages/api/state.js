
import { useState } from 'react';
import { useBetween } from 'use-between';

const sharedFeature = () => {
  /*Map dei PoI utilizzati -> key : {name, valueQuestionario, visibiliy}*/
  const [poi, setPoI] = useState(initializePoI);

  /*Vettore delle zone di Bolo-> {name, select, dati geojson}*/
  const [zone, setZone] = useState([]);
  const [valZone, setValZone] = useState([]);

  /*raggio in metri -> float esempio: 30*/
  const [raggio, setRaggio] = useState(0.5);
  
  /*case restituite dalla query in base ai parametri di raggio e risposte questionario*/
  const [house, setHouse] = useState([]);

  //initialFeatureMap, recomZone, setRecomZone
  return { poi, setPoI, raggio, setRaggio, house, setHouse, zone, setZone,valZone, setValZone };
};

export const currentFeature = () => {
  const { poi, setPoI, raggio, setRaggio, house, setHouse, zone, setZone, valZone, setValZone } = useBetween(sharedFeature);


  /*const getFeature = (elem) => {
    return featureMap[elem];
  };*/

  /*funzione per riporate allo stato di partenza tutte le impostazioni PoI*/
  const resetAll = () => {
    setPoI(initializePoI);
    setHouse([]);
    setValZone([]);
  };

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

  const getRispQuestionario = () => {
    let ris ='';
    poi.forEach((values, keys) => {
      ris+=values.value+','});
    return ris.slice(0, -1);
  }

  const initializedZone = async ()=>{
    try {
      const response = await fetch('./db/zoneBO.geojson');
      if (!response.ok) {
        throw new Error('Failed to fetch GeoJSON data');
      }
      const data = await response.json();
      const zonesArray = data.features.map((feature, index) => ({
        name: feature.properties.name,
        select: false,
        data: feature
      }));
      setZone(zonesArray);
      //setZoneGeojsonData(data);
    } catch (error) {
      console.error('Error fetching GeoJSON data:', error);
    }
  }

  const getZone = ()=>{
    return zone;
  }

  const updateSelectZone = (name) => {
    setZone((prevZones) =>
      prevZones.map((zone) =>
        zone.name === name ? { ...zone, select: !zone.select } : zone
      )
    );
  };

  const setValutazioneZone = () => {
    // L'oggetto da inviare come JSON
    let data = {
      'questionario': Array.from(poi.values(), (x)=> x.value), 
      'zona': zone.filter(item => item.select === true).map(item => item.name)
    };

    // La richiesta fetch
    fetch('http://localhost:5000/api/area', {
        method: 'POST', // Specifica il metodo POST
        headers: {
            'Content-Type': 'application/json' // Specifica il tipo di contenuto
        },
        body: JSON.stringify(data) // Converti l'oggetto JavaScript in una stringa JSON
    })
    .then(response => {
        if (!response.ok) { throw new Error('Network response was not ok ' + response.statusText);}
        return response.json();        
    }) // Converti la risposta in un oggetto JSON
    .then(responseData => {
        setValZone(responseData);
    })
    .catch(error => {
        console.error('Error:', error); // Gestisci eventuali errori
    });
  }

  const getValutazioneZone = () => {
    return valZone;
  }

  return {updateVisibilityPoI, updateValuePoI, resetAll, getAllNamePoI,
    initializeHouse, getHouse,
    initializedZone, getZone, updateSelectZone, setValutazioneZone, getValutazioneZone,
    getRispQuestionario, getRaggio, setRaggio};
};





const DEFAULT_ZOOM = 12;
const DEFAULT_POS = [44.4950, 11.3424];


const sharedMap = () => {
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);  
  const [position, setPosition] = useState(DEFAULT_POS);
  const [raggio, setRaggio] = useState(0.5);

  const [elementMap, setElementMap] = useState({case: true, zone: false, consigli: false})

  return { zoom, setZoom, position, setPosition, raggio, setRaggio, elementMap, setElementMap };
};

export const currentMap = () => {
  const { zoom, setZoom, position, setPosition, elementMap, setElementMap } = useBetween(sharedMap);

  const getZoom = () => {
    return zoom
  }

  const getPosition = () =>{
    return position
  }
  

  const resetMap = () => {
    setZoom(DEFAULT_ZOOM);
    setPosition(DEFAULT_POS);
  }

  const updateElementMap = (name) =>{
    const newElementMap={case: false, zone: false, consigli: false}
    const updatedElementMap = {
        ...newElementMap, // Mantieni gli altri attributi invariati
        [name]: true, // Imposta l'attributo specificato a true
      };
      setElementMap(updatedElementMap);
  }

  const getElemMap = (name) =>{
    return elementMap[name] 
  }

  return { getZoom, setZoom, getPosition, setPosition, resetMap, DEFAULT_POS, updateElementMap, getElemMap};
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