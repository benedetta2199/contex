import { Circle, MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import OverlayZone from '@components/my/overlayZone';
import 'leaflet/dist/leaflet.css';
import OverlayIcon from './overlayIcon';
import { useEffect, useState } from 'react';
import { currentFeature, currentMap } from 'src/pages/api/state';
import OverlayZoneRec from './overlayZoneRec';
import OverlayHouse from './overlayHouse';
import OverlayValZone from './overlayValZone';

export default function BOLOMap(props) {
  const { width, height, clickable, circle, def } = props;
  const { getZoom, setZoom, getPosition, setPosition, DEFAULT_POS, getElemMap } = currentMap();
  const { getAllNamePoI, recomZone, getRaggio } = currentFeature();

  const [center, setCenter] = useState(getPosition());
  const [mapZoom, setMapZoom] = useState(getZoom);

  const MapEventListener = ({ setZoom, setPosition }) => {
    useMapEvents({
      zoomend: (event) => {
        const newZoom = event.target.getZoom();
        setZoom(newZoom);
        setMapZoom(newZoom);
      },
      moveend: (event) => {
        const newCenter = event.target.getCenter();
        setPosition([newCenter.lat, newCenter.lng]);
        setCenter([newCenter.lat, newCenter.lng]);
      },
    });
    return null;
  };

  useEffect(() => {
    console.log(`${center} ${mapZoom}`);
    setMapZoom(getZoom());
    setCenter(getPosition());
  }, [getZoom, getPosition]);

  return (
    <div style={{ width, height }}>
      <MapContainer style={{ width: '100%', height: '100%' }} center={center} zoom={mapZoom}>
        <TileLayer
          url='https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
        />

        {clickable && <OverlayZone />}

        {def && getElemMap('case') && <OverlayHouse />}
        {def && getElemMap('zone') && <OverlayValZone />}
        {/* def && getElemMap('consigli') && <OverlayConsigli /> */}

        {recomZone && <OverlayZoneRec />}

        {circle && <Circle center={DEFAULT_POS} radius={getRaggio() * 1000} />}
        <MapEventListener setZoom={setZoom} setPosition={setPosition} />
      </MapContainer>
    </div>
  );
}
