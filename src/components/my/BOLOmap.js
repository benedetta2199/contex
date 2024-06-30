import { Circle, MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import OverlayZone from '@components/my/overlayZone';
import 'leaflet/dist/leaflet.css';
import OverlayIcon from './overlayIcon';
import { useEffect, useState } from 'react';
import {currentFeature, currentMap } from 'src/pages/api/state';
import OverlayZoneRec from './overlayZoneRec';
import OverlayHouse from './overlayHouse';

export default function BOLOMap(props) {

    const [elem, setElem] = useState([]);
    const {zoom, setZoom, position, setPosition, DEFAULT_POS} = currentMap();
    const {getAllNamePoI, recomZone, getRaggio} = currentFeature();

    const MapEventListener = ({ setZoom, setPosition }) => {
      /*useMapEvents({
        zoomend: (event) => {
          const newZoom = event.target.getZoom();
          setZoom(newZoom);
        },
        moveend: (event) => {
          const newCenter = event.target.getCenter();
          setPosition([newCenter.lat, newCenter.lng]);
        },
      });
      return null;*/
    };


    useEffect(() => {
      if(elem.length==0){
        setElem(getAllNamePoI());
      }
    }, [elem]);
    
    const { width, height, clickable, circle, icon} = props;


    function onEachFeature(feature, layer) {
      if (feature.geometry.type === 'Point') {
          layer.setIcon(getIcon);
      }
  }
  

  return (  
    <div style={{width: width, height: height}}>
    <MapContainer style={{width: '100%', height: '100%'}} center={position} zoom={zoom}>
      <TileLayer
        url='https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
        />
      {clickable && <OverlayZone/>}
      
      {/*icon &&
        elem.map((el, index) => (
            <OverlayIcon type={el.key} key={index}/>
          ))*/
      }

      {icon && <OverlayHouse/>}

      {recomZone && <OverlayZoneRec/>}

      {circle && <Circle center={DEFAULT_POS} radius={getRaggio()*1000} />}
       <MapEventListener setZoom={setZoom} setPosition={setPosition} />
    </MapContainer>
    </div>
  )
}
