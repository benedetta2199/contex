
import { useState } from 'react';
import { useBetween } from 'use-between';
/**
 * Hook condiviso per gestire le funzionalità principali dell'applicazione.
 */
const sharedFeature = () => {
  const [poi, setPoI] = useState(initializePoI()); // Mappa dei PoI utilizzati
  const [zone, setZone] = useState([]); // Array di tutte le zone
  const [valZone, setValZone] = useState(new Map()); // Mappa delle zone selezionate e valutate
  const [house, setHouse] = useState([]); // Array delle case restituite per il raggio
  const [filterHouse, setFilterHouse] = useState([]); // Array delle case filtrate per il raggio
  const [houseT, setHouseT] = useState([]); // Array delle case restituite per il tempo in bici
  const [filterHouseT, setFilterHouseT] = useState([]); // Array delle case filtrate per il tempo in bici
  const [raggio, setraggio] = useState(500); // Raggio in metri
  const [time, setTime] = useState(10); // Tempo in minuti
  const [nhouse, setnHouse] = useState(50); // Numero di case da visualizzare rispetto al raggio
  const [nhouseT, setnHouseT] = useState(50); // Numero di case da visualizzare rispetto al tempo in bici
  const [moran, setMoran] = useState(0); // Indice di Moran
  const [loading, setLoading] = useState({caseR: true, caseT: true, zone: true, cluster: true}); // Stato di caricamento delle query
  const [bestArea, setBestArea] = useState([]); // Array delle aree consigliate, migliori rispetto al sondaggio (cluster)

  return {poi, setPoI, zone, setZone, valZone, setValZone, bestArea, setBestArea, loading, setLoading, moran, setMoran,
    house, setHouse, filterHouse, setFilterHouse, nhouseT, setnHouseT, raggio, setraggio, 
    houseT, setHouseT, filterHouseT, setFilterHouseT,nhouse, setnHouse, time, setTime,     
  };
};

const namePoI = ['teatri_cinema', 'chiese', 'scuole', 'impianti_sportivi', 'aree_verdi', 'musei', 'negozi', 'biblio', 'fermate_bus','parcheggi', 'ospedali', 'stazioni', 'piste_ciclabili'];

/**
 * Inizializza i PoI.
 * @returns {Map} Mappa dei PoI inizializzata.
 */
const initializePoI = () => {
  let feature = new Map();
  namePoI.forEach(name => {
    feature.set(name, { name: name.replace('_', ' '), value: 0, visibiliy: false, geoJSON: null});
  });
  return feature;
};

/**
 * Hook per l'inizializzazione delle variabili.
 */
export const currentInitialization = () => {
  const { poi, setPoI, raggio, setraggio, setHouse, setHouseT, nhouse, nhouseT, setFilterHouseT, time,
    setFilterHouse, zone, setZone, setValZone, setBestArea, setLoading, setMoran } = useBetween(sharedFeature);

  /**
   * Inizializza i dati di default e resetta tutti i valori.
   */
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

  /**
   * Inizializza i dati in base agli input.
   */
  const initializeValue = () => {
    initializeHouse();
    initializeHouseBici();
    initializedValutazioneZone();
    initializeSuggestArea();
    initializeMoran();
  };

  /**
   * Inizializza tutte le zone di Bologna tramite dati GeoJSON.
   */
  const initializeZone = () => {
    fetch('./db/zoneBO.geojson')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch GeoJSON data ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        setZone(data.features.map(feature => ({ name: feature.properties.name, select: false, data: feature, point: -1})));
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  /**
   * Inizializza tutte le geometrie dei PoI tramite richiesta al backend.
   */
  const initializeGeoPoI = () => {
    const tabelle = [ 'teatri', 'chiese', 'scuole', 'impianti_sportivi', 'aree_verdi', 'musei', 'negozi', 'biblio', 'fermate', 'parcheggi','ospedali', 'stazioni', 'piste_ciclabili'];
    let feature = poi;
    let i = 0;

    poi.forEach((value, name) => {
      let url = `http://localhost:5000/api/data?table=${tabelle[i]}`;
      i++;
      fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
        .then(response => {
          if (!response.ok) { throw new Error('Network response was not ok ' + response.statusText); }
          return response.json();
        })
        .then(data => {
          feature.set(name, { ...value, geoJSON: convertToGeoJSON(data) });
        })
        .catch(error => { console.error('Error:', error);});
    });
    setPoI(feature);
  };

  
/**
 * Converte gli elementi in GeoJSON.
 * @param {Array} elements - Elementi da convertire.
 * @returns {Object} GeoJSON.
 */
function convertToGeoJSON(elements) {
  const geoJSON = {
    type: "FeatureCollection",
    features: elements.map(element => {
      const geometry = JSON.parse(element.geom);
      return {type: "Feature", geometry, properties: { id: element.id, lat: element.lat, lon: element.lon}};
    })
  }
  return geoJSON;
}

  /**
   * Inizializza le case in base al questionario e al raggio tramite richiesta al backend.
   */
  const initializeHouse = () => {
    setLoading(prevState => ({ ...prevState, caseR: true }));
    setFilterHouse([]);
    let url = `http://localhost:5000/api/casa?raggio=${raggio}&questionario=${getRispQuestionario()}`;

    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
      .then(response => {
        if (!response.ok) { throw new Error('Network response was not ok ' + response.statusText); }
        return response.json();
      })
      .then(responseData => {
        setHouse(responseData);
        setFilterHouse(responseData.slice(0, nhouse + 1));
        setLoading(prevState => ({ ...prevState, caseR: false }));
      })
      .catch(error => { console.error('Error:', error); });
  };

  /**
   * Inizializza le case in base al questionario e al tempo in bici tramite richiesta al backend.
   */
  const initializeHouseBici = () => {
    setLoading(prevState => ({ ...prevState, caseT: true }));
    setFilterHouseT([]);
    let url = `http://localhost:5000/api/bike?tempo=${time}&questionario=${getRispQuestionario()}`;

    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
      .then(response => {
        if (!response.ok) { throw new Error('Network response was not ok ' + response.statusText); }
        return response.json();
      })
      .then(responseData => {
        setHouseT(responseData);
        setFilterHouseT(responseData.slice(0, nhouseT + 1));
        setLoading(prevState => ({ ...prevState, caseT: false }));
      })
      .catch(error => { console.error('Error:', error); });
  };

  /**
   * Inizializza la valutazione delle zone in base al questionario tramite richiesta al backend.
   */
  const initializedValutazioneZone = () => {
    setLoading(prevState => ({ ...prevState, zone: true }));
    let data = {
      'questionario': Array.from(poi.values(), (x) => x.value),
      'zona': zone.filter(item => item.select === true).map(item => item.name)
    };

    fetch('http://localhost:5000/api/area', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (!response.ok) { throw new Error('Network response was not ok ' + response.statusText); }
        return response.json();
      })
      .then(responseData => {
        const createdMap = new Map();
        responseData.forEach(obj => {
          createdMap.set(obj.nome, obj.punteggio);
        });
        setValZone(createdMap);
        setLoading(prevState => ({ ...prevState, zone: false }));
      })
      .catch(error => {console.error('Error:', error);});
  };

  /**
   * Inizializza le zone consigliate (cluster) in base al questionario tramite richiesta al backend.
   */
  const initializeSuggestArea = () => {
    setLoading(prevState => ({ ...prevState, cluster: true }));
    let url = `http://localhost:5000/api/suggest_locations?questionario=${getRispQuestionario()}`;

    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
      .then(response => {
        if (!response.ok) { throw new Error('Network response was not ok ' + response.statusText);}
        return response.json();
      })
      .then(data => {
        setBestArea(data.rect);
        setLoading(prevState => ({ ...prevState, cluster: false }));
      })
      .catch(error => {console.error('Error:', error);});
  };

  /**
   * Inizializza l'indice di Moran tramite richiesta al backend.
   */
  const initializeMoran = () => {
    let url = `http://localhost:5000/api/moran`;

    fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
      .then(response => {
        if (!response.ok) {throw new Error('Network response was not ok ' + response.statusText);}
        return response.json();
      })
      .then(responseData => {
        setMoran(responseData);
      })
      .catch(error => {console.error('Error:', error);});
  };

  /**
   * Restituisce una stringa di risposte del questionario.
   * @returns {string} Stringa delle risposte del questionario.
   */
  const getRispQuestionario = () => {
    let ris = '';
    poi.forEach((values) => {
      ris += values.value + ',';
    });
    return ris.slice(0, -1);
  };

  /**
   * Verifica se almeno un valore del questionario è maggiore di 0.
   * @returns {boolean} True se almeno un valore è maggiore di 0.
   */
  const checkQuestionario = () => {
    return Array.from(poi).some(item => item[1].value > 0);
  };

  return {resetAll, initializeValue, initializedValutazioneZone, initializeHouse, initializeHouseBici, checkQuestionario};
};




/**
 * Hook per l'aggiornamento delle variabili.
 */
export const currentUpdate = () => {
  const {setPoI, setraggio, setTime, house, houseT, setnHouse, setnHouseT, setFilterHouseT, setFilterHouse, setZone} = useBetween(sharedFeature);

  /**
   * Aggiorna il raggio rispetto ad un range compreso tra 1 e 5000.
   * @param {number} r - Valore del raggio.
   */
  const setRaggio = (r) => {
    setraggio(Math.max(1, Math.min(5000, r)));
  };

  /**
   * Aggiorna l'attributo select di una specifica zona.
   * @param {string} name - Nome della zona.
   */
  const updateSelectZone = (name, value) => {
    setZone((prevZones) =>
      prevZones.map((z) => z.name === name ? { ...z, select: value } : z)
    )
  };

  /**
   * Aggiorna il numero massimo delle case da visualizzare e il vettore delle case filtrate.
   * @param {number} n - Numero massimo delle case da visualizzare.
   */
  const setNHouse = (n) => {
    setnHouse(n);
    setFilterHouse(house.slice(0, n));
  };

  /**
   * Aggiorna il numero massimo delle case da visualizzare per il tempo in bici e il vettore delle case filtrate.
   * @param {number} n - Numero massimo delle case da visualizzare.
   */
  const setNHouseT = (n) => {
    setnHouseT(n);
    setFilterHouseT(houseT.slice(0, n));
  };

  /**
   * Aggiorna la visibilità di un PoI specifico.
   * @param {string} name - Nome del PoI.
   * @param {boolean} value - Visibilità del PoI.
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
   * Aggiorna il valore di un PoI specifico.
   * @param {string} name - Nome del PoI.
   * @param {number} value - Valore del PoI.
   */
  const updateValuePoI = (name, value) => {
    setPoI(prevPoI => {
      const newPoI = new Map(prevPoI);
      if (newPoI.has(name)) {
        const element = newPoI.get(name);
        newPoI.set(name, { ...element, value: value });
      }
      return newPoI;
    });
  };

  return {setRaggio, setTime, updateSelectZone, setNHouse, setNHouseT, updateVisibilityPoI, updateValuePoI};
};

/**FUNZIONI PER LE VARIABILI */
export const currentValue = () => {
  const {poi, loading, raggio, time, nhouse, nhouseT, filterHouseT, filterHouse, zone, valZone, bestArea, moran} = useBetween(sharedFeature);

  /**
   * Restituisce tutti i nomi dei PoI.
   * @returns {Array} Array di oggetti con key, name e value dei PoI.
   */
  const getAllNamePoI = () => {
    let res = [];
    poi.forEach((value, key) => {
      res.push({ key: key, name: value.name, value: value.value });
    });
    return res;
  };

  return { getAllNamePoI, loading, filterHouse, filterHouseT, nhouse, nhouseT, time, poi, moran, zone, valZone, bestArea, raggio};
};



const DEFAULT_ZOOM = 12;
const DEFAULT_POS = [44.4950, 11.3424];

/**
 * Hook condiviso per la gestione della mappa.
 */
const sharedMap = () => {
  const [zoom, setZoom] = useState(DEFAULT_ZOOM); //zoom della mappa
  const [position, setPosition] = useState(DEFAULT_POS); //posizione del centro della mappa
  //const [raggio, setRaggio] = useState(0.5);
  const [elementMap, setElementMap] = useState({ caseR: true, caseT: false, zone: false, consigli: false });

  return { zoom, setZoom, position, setPosition, /*raggio, setRaggio,*/ elementMap, setElementMap };
};

/**
 * Hook per la gestione delle funzionalità della mappa.
 */
export const currentMap = () => {
  const { zoom, setZoom, position, setPosition, elementMap, setElementMap } = useBetween(sharedMap);

  /**
   * Restituisce la posizione corrente.
   * @returns {Array} Posizione corrente.
   */
  const getPosition = () => {
    return position;
  };

  /**
   * Resetta la mappa alla posizione e zoom di default.
   */
  const resetMap = () => {
    setZoom(DEFAULT_ZOOM);
    setPosition(DEFAULT_POS);
  };

  /**
   * Aggiorna l'elemento visualizzato sulla mappa.
   * @param {string} name - Nome dell'elemento da visualizzare.
   */
  const updateElementMap = (name) => {
    const newElementMap = { caseR: false, caseT: false, zone: false, consigli: false };
    const updatedElementMap = {
      ...newElementMap,
      [name]: true
    };
    setElementMap(updatedElementMap);
  };

  /**
   * Restituisce l'elemento della mappa specificato.
   * @param {string} name - Nome dell'elemento.
   * @returns {boolean} Stato dell'elemento.
   */
  const getElemMap = (name) => {
    return elementMap[name];
  };

  /**
   * Restituisce il colore in base al punteggio.
   * @param {number} score - Punteggio.
   * @param {number} min - Punteggio minimo.
   * @param {number} max - Punteggio massimo.
   * @returns {Object} Colore RGB.
   */
  const getColor = (score, min, max) => {
    const red = { r: 184, g: 42, b: 29 };
    const yellow = { r: 176, g: 176, b: 18 };
    const green = { r: 58, g: 140, b: 46 };

    if (max === min) return green;

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

    return { r, g, b };
  };

  return { zoom, setZoom, position, setPosition, resetMap, DEFAULT_POS, updateElementMap, getElemMap, getColor};
};
