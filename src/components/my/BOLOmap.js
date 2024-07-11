import { Circle, MapContainer, TileLayer, useMapEvents, useMap, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { currentMap, currentValue } from 'src/pages/api/state';
import OverlayHouse from './overlayHouse';
import OverlayZone from './overlayZone';
import OverlayValZone from './overlayValZone';
import OverlaySuggest from './overlaySuggest';
import OverlayHouseTime from './overlayHouseTime';
import OverlayIcon from './overlayIcon';
import { Button } from 'react-bootstrap';
import { useState } from 'react';

/**
 * BOLOMap Component - Displays the map with various overlays and controls.
 * @param {object} props - Component props.
 * @param {string} props.width - Width of the map container.
 * @param {string} props.height - Height of the map container.
 * @param {boolean} props.clickable - If true, makes the map clickable.
 * @param {boolean} props.circle - If true, displays a circle overlay.
 * @param {boolean} props.def - If true, uses default settings and overlays.
 * @returns {JSX.Element} - The rendered component.
 */
export default function BOLOMap(props) {
  const { width, height, clickable, circle, def } = props;
  const { zoom, setZoom, position, setPosition, DEFAULT_POS, getElemMap } = currentMap();
  const { loading, raggio, poi } = currentValue();
  const [map, setMap] = useState(null);

  // Style for the loading overlay
  const style = { position: 'absolute', top: 0, left: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 1000, color: '#fff' };


  return (
    <div style={{ width, height }}>
      {def && ((loading.caseR && getElemMap('caseR')) || (loading.caseT && getElemMap('caseT'))
        || (loading.zone && getElemMap('zone')) || (loading.cluster && getElemMap('consigli'))) && (
        <div className='w-100 h-100 d-flex justify-content-center align-items-center' style={style}>
          Stiamo elaborando i dati
        </div>
      )}
      {def && 
      <Button className='centerPos' variant="secondary" onClick={()=>{map.setView(DEFAULT_POS)}}> 
        <img src='./icon/centerPos.svg' alt=''/>
      </Button>}
      <MapContainer style={{ width: '100%', height: '100%' }} center={position} zoom={zoom} ref={setMap}>
        {def ? (
          <LayersControl position="bottomright" className='text-start'>
            <LayersControl.BaseLayer name="Mappa dettagliata">
              <TileLayer
                url='https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Mappa satellitare">
              <TileLayer
                url='https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
                maxZoom={20}
                subdomains={['mt1', 'mt2', 'mt3']}
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Mappa minimal" checked>
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
            </LayersControl.BaseLayer>
          </LayersControl>
        ) : (
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
        )}

        {def && Array.from(poi).map(([key, value]) => (
          <OverlayIcon key={key} visible={value.visibiliy} coords={value.coords} geom={value.geoJSON} name={key} />
        ))}
        {def && getElemMap('caseR') && <OverlayHouse />}
        {def && getElemMap('caseT') && <OverlayHouseTime />}
        {def && getElemMap('zone') && <OverlayValZone />}
        {def && getElemMap('consigli') && <OverlaySuggest />}
        {clickable && <OverlayZone />}
        {circle && <Circle center={DEFAULT_POS} radius={raggio} pathOptions={{ fillColor: '#718e92', weight: 2, color: '#718e92' }} />}
        <MapEventListener setZoom={setZoom} setPosition={setPosition} />s
      </MapContainer>
    </div>
  );
}

/**
 * MapEventListener Component - Handles map events to update zoom and position state.
 * @param {function} setZoom - Function to set the zoom level.
 * @param {function} setPosition - Function to set the map position.
 * @returns {null} - This component does not render anything.
 */
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

/**
 * CenterMapButton Component - Button to re-center the map.
 * @param {object} props - Component props.
 * @param {array} props.DEFAULT_POS - Default position to center the map.
 * @returns {JSX.Element} - The rendered button component.
 */
const CenterMapButton = ({ DEFAULT_POS }) => {
  const map = useMap();

  const centerMap = () => {
    map.setView(DEFAULT_POS, 13);  // Assuming 13 is the default zoom level
  };

  return (
    <Button className='centerPos' variant="secondary" onClick={centerMap}> 
      <img src='./icon/centerPos.svg' alt=''/>
    </Button>
  );
};
