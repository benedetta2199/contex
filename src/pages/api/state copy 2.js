
import { useState } from 'react';
import { useBetween } from 'use-between';

const sharedFeature = () => {

  /*Bool true se c'è caricamento dei dati*/
  const [loading, setLoading] = useState({caseR: true, caseT: true, zone: true, cluster: true}
    /*new Map(['caseR', true],['caseT', true],['zone', true])*/);

  /*Map dei PoI utilizzati -> key : {name, valueQuestionario, visibility, geom}*/
  const [poi, setPoI] = useState(initializePoI());

  /*Array delle zone di Bolo-> {name, select, dati geojson}*/
  const [zone, setZone] = useState([]);
  /*Mappa zone selezionate-> {name, punteggio}*/
  const [valZone, setValZone] = useState(new Map());

  /*Int raggio in m */
  const [raggio, setraggio] = useState(500);
  /*Int time in m */
  const [time, setTime] = useState(10);

  /*Float indice di MOran */
  const [moran, setMoran] = useState(0);

  /*case restituite dalla query in base ai parametri di raggio e risposte questionario*/
  const [house, setHouse] = useState([]);
  const [houseT, setHouseT] = useState([]);
  const [filterHouse, setFilterHouse] = useState([]);
  const [filterHouseT, setFilterHouseT] = useState([])

  /*Int N° case restituite*/
  const [nhouse, setnHouse] = useState(50);
  /*Int N° case restituite*/
  const [nhouseT, setnHouseT] = useState(50);

  /*Array con migliori aree in base agli interessi {centroide, altezza, larghezza, xTL, yTL*/
  const [bestArea, setBestArea] = useState([]);

  //initialFeatureMap, recomZone, setRecomZone
  return { poi, setPoI, raggio, setraggio, time, setTime, house, setHouse, houseT, setHouseT, nhouse, setnHouse, nhouseT, setnHouseT, filterHouseT, setFilterHouseT,
    filterHouse, setFilterHouse, zone, setZone,valZone, setValZone, bestArea, setBestArea, loading, setLoading, moran, setMoran};
};

export const currentFeature = () => {
  const { poi, setPoI, raggio, setraggio, time, setTime, house, setHouse, houseT, setHouseT, nhouse, setnHouse, nhouseT, setnHouseT, filterHouseT, setFilterHouseT,
    filterHouse, setFilterHouse, zone, setZone,valZone, setValZone, bestArea, setBestArea, loading, setLoading, 
    moran, setMoran} = useBetween(sharedFeature);

  const setRaggio = (r) =>{
    const value = Math.max(1, Math.min(5000, r));
    setraggio(value);
  }

  /*funzione che va a modificare la visibilità (value) di un PoI spefico definito da name*/
  const updateVisibilityPoI = (name, value) => {
    setPoI(prevPoI => {
      const newPoI = new Map(prevPoI);
      if (newPoI.has(name)) {
        const element = newPoI.get(name);
        newPoI.set(name, { ...element, visibiliy: value });
      }
      return newPoI;
    });
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
      res.push({key: key, name: value.name, value: value.value})
    });
    return res;
  }

  const initializeHouse = async () => {
    setLoading(prevState => ({ ...prevState, caseR: true }));
    return fetch(`http://localhost:5000/api/casa?raggio=${raggio}&questionario=${getRispQuestionario()}`)
    .then(response => {
      if (!response.ok) {throw new Error('Network response was not ok ' + response.statusText);}
      return response.json();
    })
    .then(data => {
      setHouse(data);
      setFilterHouse(data.slice(0,nhouse+1));
      setLoading(prevState => ({ ...prevState, caseR: false }));
      console.log('Load house');
    })
    .catch(error => {console.error('There was a problem with the fetch operation:', error);});
  }
  
  const getHouse = () =>{
    return house.slice(0, nhouse+1);
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
        data: feature,
        point: -1,
      }));
      setZone(zonesArray);
    } catch (error) {
      console.error('Error fetching GeoJSON data:', error);
    }
  }

  const updateSelectZone = (name) => {
    setZone((prevZones) =>
      prevZones.map((zone) =>
        zone.name === name ? { ...zone, select: !zone.select} : zone
      )
    );
  };

  const initializedValutazioneZone = async () => {
    
    setLoading(prevState => ({ ...prevState, zone: true }));
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
      const createdMap = new Map();
      responseData.map((obj) => {
          createdMap.set(obj.nome, obj.punteggio);
      });
      setValZone(createdMap);
      console.log('Load valuetion zone');
      
    setLoading(prevState => ({ ...prevState, zone: false }));
    })
    .catch(error => {
        console.error('Error:', error); // Gestisci eventuali errori
    });
  }
  
function initializedSuggestArea() {
  setLoading(prevState => ({ ...prevState, cluster: true }));
  // Costruisci l'URL con i parametri della query
  let url = `http://localhost:5000/api/suggest_locations?questionario=${getRispQuestionario()}`;

  // La richiesta fetch
  fetch(url, {method: 'GET', headers: {'Content-Type': 'application/json' }})
  fetch(url)
    .then(response => {
        if (!response.ok) {throw new Error('Network response was not ok ' + response.statusText);}
        return response.json();
    })
    .then(data => { 
      setBestArea(data.rect); 
      setLoading(prevState => ({ ...prevState, cluster: false }));
      console.log('Load cluster');
    })
    .catch(error => {
        console.error('Error:', error);
    });
  }

  function initializeHouseBici()  {
    setLoading(prevState => ({ ...prevState, caseT: true }));
    // Costruisci l'URL con i parametri della query
    let url = `http://localhost:5000/api/bike?tempo=${time}&questionario=${getRispQuestionario()}`;

    // La richiesta fetch
    fetch(url, {
        method: 'GET', // Specifica il metodo GET
        headers: {
            'Content-Type': 'application/json' // Specifica il tipo di contenuto
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    }) // Converti la risposta in un oggetto JSON
    .then(responseData => {
      setHouseT(responseData);
      setFilterHouseT(responseData.slice(0,nhouseT+1));
      setLoading(prevState => ({ ...prevState, caseT: false }));
      console.log('Load house time');
    })
    .catch(error => {
        console.error('Error:', error); // Gestisci eventuali errori
    });
  }

  


  const checkQuestionario = () =>{
    return Array.from(poi).some(item => item[1].value > 0);
  }

  const setNHouse = (n) => {
    setnHouse(n);
    setFilterHouse(house.slice(0, n));
  }

  const setNHouseT = (n) => {
    setnHouse(n);
    setFilterHouseT(houseT.slice(0, n));
  }

                                                                                    /*INIZIALIZZAZIONE DEI DATI */
  /**Inizializzazione dei dati rispetto agli input*/
  const initializeValue = () =>{
    initializeHouse();
    initializeHouseBici();
    initializedValutazioneZone();
    initializedSuggestArea();
    initializeMoran();
  }

  /**Inizializzazione dei dati di default (setup iniziale)*/
  const resetAll = () => {
    initializedZone();
    setPoI(initializePoI());
    initializeGeoPoI();
    setraggio(500);
    setHouse([]);
    setHouseT([]);
  };

  /**Inizializzazione tutti le geometrie dei PoI tramite richiesta al backend*/
  const initializeGeoPoI = () => {
    const tabelle=['teatri','chiese','scuole','impianti_sportivi', 'aree_verdi','musei','negozi','biblio','fermate','parcheggi','ospedali','stazioni','piste_ciclabili']
    let feature = poi;
    let i = 0 //serve per prendere il nome corretto delle tabelle

    poi.forEach((value, name)=>{
        // Costruisci l'URL con i parametri della query
        let url = `http://localhost:5000/api/data?table=${tabelle[i]}`;
        i++;
      
        // La richiesta fetch
        fetch(url, {method: 'GET', headers: {'Content-Type': 'application/json' }})
        fetch(url)
          .then(response => {
            if (!response.ok) {throw new Error('Network response was not ok ' + response.statusText);}
            return response.json();
          })
          .then(data => { 
            feature.set(name, { ...value, geoJSON: convertToGeoJSON(data)});
          }).catch(error => { console.error('Error:', error);});
    })
    console.log('load geom of PoI');
    setPoI(feature);  
  }

  /**Inizializzazione l'indice di Moran, tramite richiesta al backend*/
  const initializeMoran = () => {
    // Costruisci l'URL con i parametri della query
    let url = `http://localhost:5000/api/moran`;

    // La richiesta fetch
    fetch(url, {
        method: 'GET', // Specifica il metodo GET
        headers: {'Content-Type': 'application/json'}// Specifica il tipo di contenuto
    })
    .then(response => {
        if (!response.ok) {throw new Error('Network response was not ok ' + response.statusText);}
        return response.json();
    }) // Converti la risposta in un oggetto JSON
    .then(responseData => { setMoran(responseData); })
    .catch(error => { console.error('Error:', error); });// Gestisci eventuali errori
  }


  return {resetAll, initializeValue, //inizializzazione dati (file e db)
    loading, checkQuestionario, getAllNamePoI,
    updateVisibilityPoI, updateValuePoI, updateSelectZone, poi, bestArea, moran, zone, valZone, 
    filterHouse, nhouse, setNHouse, raggio, setRaggio,
    filterHouseT, nhouseT, setNHouseT, time, setTime, 
  };
};





const DEFAULT_ZOOM = 12;
const DEFAULT_POS = [44.4950, 11.3424];


const sharedMap = () => {
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);  
  const [position, setPosition] = useState(DEFAULT_POS);
  const [raggio, setRaggio] = useState(0.5);

  /*pagina del main visualizzata*/
  const [elementMap, setElementMap] = useState({caseR: true, caseT: false, zone: false, consigli: false})

  return { zoom, setZoom, position, setPosition, raggio, setRaggio, elementMap, setElementMap };
};

export const currentMap = () => {
  const { zoom, setZoom, position, setPosition, elementMap, setElementMap } = useBetween(sharedMap);

  const getPosition = () =>{
    return position
  }

  const resetMap = () => {
    setZoom(DEFAULT_ZOOM);
    setPosition(DEFAULT_POS);
  }

  const updateElementMap = (name) =>{
    const newElementMap={caseR: false, caseT: false, zone: false, consigli: false}
    const updatedElementMap = {
        ...newElementMap, // Mantieni gli altri attributi invariati
        [name]: true, // Imposta l'attributo specificato a true
      };
      setElementMap(updatedElementMap);
  }

  const getElemMap = (name) =>{
    return elementMap[name] 
  }

  const getColor = (score, min, max) => {
    const red = { r: 184, g: 42, b: 29 };
    const yellow = { r: 176, g: 176, b: 18 };
    const green = { r: 58, g: 140, b: 46 };

    if (max === min) return { r: 58, g: 140, b: 46 };

    let normalizedScore = (score - min) / (max - min);

    let r, g, b;
    if (normalizedScore < 0.5) {
      normalizedScore *= 2;
      r = Math.round(red.r + normalizedScore * (yellow.r - red.r));
      g = Math.round(red.g + normalizedScore * (yellow.g - red.g));
      b = Math.round(red.b + normalizedScore * (yellow.b - red.b));
    } else {
      normalizedScore = (normalizedScore - 0.5) * 2;
      r = Math.round(yellow.r + normalizedScore * (green.r - yellow.r));
      g = Math.round(yellow.g + normalizedScore * (green.g - yellow.g));
      b = Math.round(yellow.b + normalizedScore * (green.b - yellow.b));
    }
    return {r:r, g:g, b:b};
  }

  return { zoom, setZoom, getPosition, setPosition, resetMap, DEFAULT_POS, updateElementMap, getElemMap, getColor};
};

const namePoI = ['teatri_cinema','chiese','scuole','impianti_sportivi', 'aree_verdi','musei','negozi','biblio','fermate_bus',
 'parcheggi','ospedali','stazioni','piste_ciclabili'];

const initializePoI= ()=>{
  let feature = new Map();
  namePoI.map((name) => {
    feature.set(name, {name: name.replace('_',' '), value: 0, visibiliy: false, coords: [], geoJSON:null})
  });
  return feature;
}

function convertToGeoJSON(elements) {
  const geoJSON = {
    type: "FeatureCollection",
    features: elements.map(element => {
      const geometry = JSON.parse(element.geom);
      return {
        type: "Feature",
        geometry: geometry,
        properties: {
          id: element.id,
          lat: element.lat,
          lon: element.lon
        }
      };
    })
  };
  
  return geoJSON;
}