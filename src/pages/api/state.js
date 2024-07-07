
import { useState } from 'react';
import { useBetween } from 'use-between';

const sharedFeature = () => {

  /*Map dei PoI utilizzati -> key : {name, value (valore questionario), visibility, geom}*/
  const [poi, setPoI] = useState(initializePoI());

  /*Array di tutte le zone di Bolo-> {name, select, point, dati geojson}*/
  const [zone, setZone] = useState([]);
  /*Mappa delle zone selezionate-> {name, punteggio}*/
  const [valZone, setValZone] = useState(new Map());

  /*Array case restituite dalla query in base ai parametri di raggio e risposte questionario*/
   const [house, setHouse] = useState([]);
  /*Array house filtrate rispetto al paramentro nhouse (numeor di case da visualizzare)*/
   const [filterHouse, setFilterHouse] = useState([]);

   /*Array case restituite dalla query in base ai parametri di tempo in bici e risposte questionario*/
   const [houseT, setHouseT] = useState([]);
   /*Array houseT filtrate rispetto al paramentro nhouseT (numeor di case da visualizzare)*/
   const [filterHouseT, setFilterHouseT] = useState([])
  /*Int N° case restituite*/
  const [nhouse, setnHouse] = useState(50);

  /*Int raggio in m */
  const [raggio, setraggio] = useState(500);
  /*Int time in m */
  const [time, setTime] = useState(10);
  
  /*Int N° case restituite*/
  const [nhouseT, setnHouseT] = useState(50);

  /*Float indice di MOran */
  const [moran, setMoran] = useState(0);

  /*Object Bool che è settato a true se c'è caricamento dei dati, false a caricamento ultimato*/
  const [loading, setLoading] = useState({caseR: true, caseT: true, zone: true, cluster: true});

  /*Array con migliori aree in base agli interessi {centroide, altezza, larghezza, xTL, yTL*/
  const [bestArea, setBestArea] = useState([]);

  //initialFeatureMap, recomZone, setRecomZone
  return { poi, setPoI, raggio, setraggio, time, setTime, house, setHouse, houseT, setHouseT, nhouse, setnHouse, nhouseT, setnHouseT, filterHouseT, setFilterHouseT,
    filterHouse, setFilterHouse, zone, setZone,valZone, setValZone, bestArea, setBestArea, loading, setLoading, moran, setMoran};
};

/**FUNZIONI PER L'INIZIALIZZAZIONE DI VARIABILI */
export const currentInitialization = () => {
  const { poi, setPoI, raggio, setraggio, setHouse, setHouseT, nhouse, nhouseT, setFilterHouseT, time,
       setFilterHouse, zone, setZone, setValZone, setBestArea, setLoading, setMoran} = useBetween(sharedFeature);

  /**Inizializzazione dei dati di default - resetta tutti i valori a quelli del primo utilizzo*/
  const resetAll = () => {
    initializeZone();
    setPoI(initializePoI());
    initializeGeoPoI();
    setraggio(500);
    setHouse([]);
    setFilterHouse([]);
    setHouseT([]);
    setFilterHouseT([]);
    setValZone(new Map());
    initializeMoran();
  };

    /**Inizializzazione dei dati rispetto agli input*/
    const initializeValue = () =>{
      initializeHouse();
      initializeHouseBici();
      initializedValutazioneZone();
      initializeSuggestArea();
      initializeMoran();
    }
  

  /*Inizializzazione di tutte le zone di bologna tramite dati del file geoJSON*/
  const initializeZone = () => {
    fetch('./db/zoneBO.geojson').then(response => {
      if (!response.ok) {throw new Error('Failed to fetch GeoJSON data ' + response.statusText);}
      return response.json();
    })
    .then(data => { 
      setZone(data.features.map(feature => ({ name: feature.properties.name, select: false, data: feature, point: -1})));
    }).catch(error => { console.error('Error:', error);});
  }

  /*Inizializzazione tutti le geometrie dei PoI tramite richiesta al backend*/
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
  };

  /*Inizializzazione delle case in base al questionario e al raggio, tramite richiesta al backend*/
  const initializeHouse = () => {
    setFilterHouse([]);
    setLoading(prevState => ({ ...prevState, caseR: true }));
    let url = `http://localhost:5000/api/casa?raggio=${raggio}&questionario=${getRispQuestionario()}`;

    // La richiesta fetch
    fetch(url, {
        method: 'GET', // Specifica il metodo GET
        headers: { 'Content-Type': 'application/json'} // Specifica il tipo di contenuto

    })
    .then(response => {
        if (!response.ok) {throw new Error('Network response was not ok ' + response.statusText);}
        return response.json();
    }) // Converti la risposta in un oggetto JSON
    .then(responseData => {
      setHouse(responseData);
      setFilterHouse(responseData.slice(0,nhouse+1));
      setLoading(prevState => ({ ...prevState, caseR: false }));
      console.log('Load house');
    })
    .catch(error => {console.error('Error:', error);}); // Gestisci eventuali errori
  };

  /*Inizializzazione delle case in base al questionario e al tempo in bici, tramite richiesta al backend*/
  const initializeHouseBici = () => {
    setFilterHouseT([]);
    setLoading(prevState => ({ ...prevState, caseT: true }));
    // Costruisci l'URL con i parametri della query
    let url = `http://localhost:5000/api/bike?tempo=${time}&questionario=${getRispQuestionario()}`;

    // La richiesta fetch
    fetch(url, {
        method: 'GET', // Specifica il metodo GET
        headers: { 'Content-Type': 'application/json'} // Specifica il tipo di contenuto
        
    })
    .then(response => {
        if (!response.ok) {throw new Error('Network response was not ok ' + response.statusText);}
        return response.json();
    }) // Converti la risposta in un oggetto JSON
    .then(responseData => {
      setHouseT(responseData);
      setFilterHouseT(responseData.slice(0,nhouseT+1));
      setLoading(prevState => ({ ...prevState, caseT: false }));
      console.log('Load house time');
    })
    .catch(error => {console.error('Error:', error);}); // Gestisci eventuali errori
    
  };

  /*Inizializzazione della valutazione delle zone in base al questionario, tramite richiesta al backend*/
  const initializedValutazioneZone = () => {
    setLoading(prevState => ({ ...prevState, zone: true }));
    // L'oggetto da inviare come JSON
    let data = {
      'questionario': Array.from(poi.values(), (x)=> x.value), 
      'zona': zone.filter(item => item.select === true).map(item => item.name)
    };

    // La richiesta fetch
    fetch('http://localhost:5000/api/area', {
        method: 'POST', // Specifica il metodo POST
        headers: {'Content-Type': 'application/json'}, // Specifica il tipo di contenuto
        body: JSON.stringify(data) // Converti l'oggetto JavaScript in una stringa JSON
    })
    .then(response => {
        if (!response.ok) { throw new Error('Network response was not ok ' + response.statusText);}
        return response.json();        
    }) // Converti la risposta in un oggetto JSON
    .then(responseData => {
      const createdMap = new Map();
      responseData.map((obj) => { createdMap.set(obj.nome, obj.punteggio); });
      setValZone(createdMap);
      console.log('Load valuetion zone');
      setLoading(prevState => ({ ...prevState, zone: false }));
    })
    .catch(error => {console.error('Error:', error); // Gestisci eventuali errori
    });
  }

  /*Inizializzazione le zone consigliate (cluster) in base al questionario, tramite richiesta al backend*/
  const initializeSuggestArea = () => {
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
      .catch(error => {console.error('Error:', error);});
  };

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

  /*converte i valori delle risposte del questionarioin una stringa '0,0,...,0' 
  (risultato ha uno slice -1 per non restituire l'ultima virgola)*/
  const getRispQuestionario = () => {
    let ris ='';
    poi.forEach((values, keys) => { ris+=values.value+','});
    return ris.slice(0, -1);
  }

  /**
   * Restituisce un booleano associato alla presenza o meno di valori nel questionario
   * @returns true se almento un elemento del questionario è maggiore di 0
   */
  const checkQuestionario = () =>{
    return Array.from(poi).some(item => item[1].value > 0);
  }

  return {resetAll, initializeValue, initializedValutazioneZone, initializeHouse, initializeHouseBici, checkQuestionario};
};

/**FUNZIONI PER L'UPDATE DI VARIABILI */
export const currentUpdate = () => {

  const { setPoI, setraggio, setTime, house, houseT, setnHouse, setnHouseT, setFilterHouseT, setFilterHouse, setZone} = useBetween(sharedFeature);

  /**
   * Aggiorna il raggio rispetto ad un range compresono tra 1 e 5000
   * @param {r} r: valore del raggio
   */
  const setRaggio = (r) =>{setraggio(Math.max(1, Math.min(5000, r)));}

  /**
   * Aggiorna l'attributo select di una specifica zona
   * @param {name} name: nome della zona
   */
  const updateSelectZone = (name) => {
    setZone((prevZones) =>prevZones.map((zone) =>zone.name === name ? { ...zone, select: !zone.select} : zone));
  };

  /**
   * Aggiorna il numero massimo delle case (in base al raggio) da visualizare e anche il vettore delle case filtrate
   * @param {n} n numero massimo delle case da visualizzare
   */
  const setNHouse = (n) => {
    setnHouse(n);
    setFilterHouse(house.slice(0, n));
  }

  /**
   * Aggiorna il numero massimo delle case (in base al tempo) da visualizare e anche il vettore delle case filtrate
   * @param {n} n numero massimo delle case da visualizzare
   */
  const setNHouseT = (n) => {
    setnHouseT(n);
    setFilterHouseT(houseT.slice(0, n));
  }

  /**
   * Aggiorna la visibilità (value) di un PoI spefico definito da name
   * @param {*} name nome del PoI
   * @param {*} value visibilità
   */
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

  /**
   * Aggiorna il valore (value) di un PoI spefico definito da name
   * @param {*} name nome del PoI
   * @param {*} value visibilità
   */
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

  return {setRaggio, setTime, updateSelectZone, setNHouse, setNHouseT, updateVisibilityPoI, updateValuePoI}
}

/**FUNZIONI PER LE VARIABILI */
export const currentValue = () =>{

  const { poi, loading, raggio, time, nhouse, nhouseT, filterHouseT, filterHouse, zone, valZone, bestArea, moran} = useBetween(sharedFeature);
  
  const getAllNamePoI = () =>{
    let res =[];
    poi.forEach((value, key) => {
      res.push({key: key, name: value.name, value: value.value})
    });
    return res;
  }
  return {getAllNamePoI, loading, filterHouse, filterHouseT, nhouse, nhouseT, time, poi, moran, zone, valZone, bestArea, raggio}
    
}


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