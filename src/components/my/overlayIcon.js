import { GeoJSON } from 'react-leaflet';
import L from 'leaflet';

export default function OverlayIcon(props) {
  const {value, visible, name} = props
  // Funzione che gestisce ogni marker del GeoJSON

  const pointToLayer = (feature, latlng) => {
    const icon = L.icon({
      iconUrl: './icon/'+name+'.svg',
      iconSize: [10,10], // dimensioni dell'icona
      iconAnchor: [16, 32], // posizione dell'icona
      popupAnchor: [0, -32] // posizione del popup
    })
    return L.marker(latlng, { icon:  icon });
  };

  return (
    <>
      {visible && <GeoJSON data={value} pointToLayer={pointToLayer}/>}
    </>
  );
}