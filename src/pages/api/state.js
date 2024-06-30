import { useState } from 'react';
import { useBetween } from 'use-between';

/*const sharedState = () => {
  const [elemSelect, setElemSelect] = useState([]);

  return { elemSelect, setElemSelect };
};
export const currentState = () => {
  const { elemSelect, setElemSelect } = useBetween(sharedState);

  const resetSelect = () => { setElemSelect([]) };
  const addSelect = (elem) => {
    setElemSelect((prevElemSelect) => {
      if (prevElemSelect.includes(elem)) {
        return prevElemSelect.filter(e => e !== elem);
      } else {
        return [...prevElemSelect, elem];
      }
    });
  };

  return { elemSelect, addSelect, resetSelect };
};*/

const sharedFeature = () => {
  const feature = [
    'trasporti pubblici', 'piste ciclabili', 'parcheggi', 'stazione', 'ristoranti e bar',
    'centri sportivi', 'supermercati', 'parchi e aree verdi', 'ospedali e cliniche', 'biblioteche',
    'scuole', 'musei', 'cinema e teatri', 'chiese'
  ];

  const initialFeatureMap = ()=>{
    let map = {};
    feature.forEach(element => {map[element] = false;});

    return map;
  }

  const [featureMap, setFeatureMap] = useState(initialFeatureMap);
  const [recomZone, setRecomZone] = useState(false);

  return { feature, featureMap, setFeatureMap, initialFeatureMap, recomZone, setRecomZone};
};

export const currentFeature = () => {
  const { feature, featureMap, setFeatureMap, initialFeatureMap, recomZone, setRecomZone } = useBetween(sharedFeature);

  const getFeature = (elem) => {
    return featureMap[elem];
  };

  const resetFeature = () => {setFeatureMap(initialFeatureMap)};

  const updateFeature = (key, value) => {
    setFeatureMap(prevFeatureMap => ({
      ...prevFeatureMap,
      [key]: value
    }));
  };

  return { feature, updateFeature, getFeature, resetFeature,recomZone, setRecomZone };
};

const DEFAULT_ZOOM = 12;
const DEFAULT_POS = [44.4950, 11.3424];


const sharedMap = () => {
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);  
  const [position, setPosition] = useState(DEFAULT_POS);
  const [raggio, setRaggio] = useState(0.5);

  return { zoom, setZoom, position, setPosition, raggio, setRaggio };
};


export const currentMap = () => {
  const { zoom, setZoom, position, setPosition, raggio, setRaggio } = useBetween(sharedMap);

  const resetMap = () => {
    setZoom(DEFAULT_ZOOM);
    setPosition(DEFAULT_POS);
  }

  return { zoom, setZoom, position, setPosition, resetMap, DEFAULT_ZOOM, DEFAULT_POS, raggio, setRaggio };
};
