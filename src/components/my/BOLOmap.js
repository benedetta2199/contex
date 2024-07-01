import { Circle, MapContainer, TileLayer, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState, useMemo } from 'react';
import { currentFeature, currentMap } from 'src/pages/api/state';
import OverlayHouse from './overlayHouse';
import OverlayZone from './overlayZone';
import OverlayValZone from './overlayValZone';
import OverlaySuggest from './overlaySuggest';

export default function BOLOMap(props) {
  const { width, height, clickable, circle, def } = props;
  const { getZoom, setZoom, getPosition, setPosition, DEFAULT_POS, getElemMap } = currentMap();
  const { getAllNamePoI, recomZone, getRaggio } = currentFeature();

  const [center, setCenter] = useState(getPosition());
  const [mapZoom, setMapZoom] = useState(getZoom);

  useEffect(() => {
    setCenter(getPosition());
  }, [getPosition]);

  useEffect(() => {
    setMapZoom(getZoom());
  }, [getZoom]);

  const mapContainer = useMemo(() => (
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
      {def && getElemMap('case') && <OverlayHouse />}
      {def && getElemMap('zone') && <OverlayValZone />}
      {def && getElemMap('consigli') && <OverlaySuggest />}
      {circle && <Circle center={DEFAULT_POS} radius={getRaggio() * 1000} />}
      <MapEventListener setZoom={setZoom} setPosition={setPosition} />
    </MapContainer>
  ), []);

  return (
    <div style={{ width, height }}>
      {mapContainer}
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
