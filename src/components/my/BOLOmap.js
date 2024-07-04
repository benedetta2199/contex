  import { Circle, MapContainer, TileLayer, useMapEvents, useMap } from 'react-leaflet';
  import 'leaflet/dist/leaflet.css'
  import { useEffect, useState, useMemo } from 'react';
  import { currentFeature, currentMap } from 'src/pages/api/state';
  import OverlayHouse from './overlayHouse';
  import OverlayZone from './overlayZone';
  import OverlayValZone from './overlayValZone';
  import OverlaySuggest from './overlaySuggest';
import OverlayHouseTime from './overlayHouseTime';
import OverlayIcon from './overlayIcon';

  export default function BOLOMap(props) {
    const { width, height, clickable, circle, def } = props;
    const { zoom, setZoom, getPosition, setPosition, DEFAULT_POS, getElemMap } = currentMap();
    const { loadingT, loading, raggio, poi } = currentFeature();

    const [center, setCenter] = useState(getPosition());
    const [mapZoom, setMapZoom] = useState(zoom);

    const style= { position: 'absolute', top: 0, left: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 1000, color: '#fff'};

    useEffect(() => {
      setCenter(getPosition());
    }, [getPosition]);

    useEffect(() => {
      setMapZoom(zoom);
    }, [zoom]);

    return (
      <div style={{ width, height }}>
        {def && (loading && getElemMap('caseR') || (loadingT && getElemMap('caseT'))) && (
          <div className='w-100 h-100 d-flex justify-content-center align-items-center' style={style}>
            Stiamo elaborando i dati
          </div>
        )}
        <MapContainer style={{ width: '100%', height: '100%' }} center={center} zoom={mapZoom}>
        {/*<TileLayer
          url='https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
        />*/}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {clickable && <OverlayZone />}
        {def && Array.from(poi).map(([key, value]) => (<OverlayIcon key={key} visible={value.visibiliy} coords={value.coords} name={key}/>))}
        {def && getElemMap('caseR') && <OverlayHouse />}
        {def && getElemMap('caseT') && <OverlayHouseTime />}
        {def && getElemMap('zone') && <OverlayValZone />}
        {def && getElemMap('consigli') && <OverlaySuggest />}
        {circle && <Circle center={DEFAULT_POS} radius={raggio} pathOptions= {{fillColor: '#718e92', weight: 2, color: '#718e92'}} />}
        <MapEventListener setZoom={setZoom} setPosition={setPosition} />
      </MapContainer>
      </div>
    );
  }

  const MapEventListener = ({ setZoom, setPosition }) => {
    const map = useMap();
    useMapEvents({
      zoomend: () => {
        setZoom(map.getZoom());
      },
      moveend: () => {
        const newCenter = map.getCenter();
        setPosition([newCenter.lat, newCenter.lng]);
      },
    });
    return null;
  };
