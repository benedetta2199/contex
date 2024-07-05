import { Marker, GeoJSON } from 'react-leaflet';
import L, { MarkerCluster } from "leaflet";
import MarkerClusterGroup from 'react-leaflet-cluster';


export default function OverlayIcon(props) {
  const { geom, visible, name } = props;

  // Funzione che gestisce ogni marker del GeoJSON
  const pointToLayer = (n, latlng) => {
    // Crea l'icona
    const icon = new L.icon({
      iconUrl: `./icon/${name}.svg`,
      iconSize: [12, 12], // dimensioni dell'icona
      iconAnchor: [6, 12], // posizione dell'icona
    });
    return L.marker(latlng, { icon: icon, forceZIndex: 1 });
  };

  const clusterIcon = function (cluster) {
    const n = Math.min(35, 12+cluster.getChildCount()/10);
    return new L.Icon({
      iconUrl:`./icon/${name}.svg`,
      iconSize: [n,n], // dimensioni dell'icona
      iconAnchor: [n/2, n], // posizione dell'icona
      className: `cluster`,
    });
  };


  return (
    <>
      {name!='piste_ciclabili'
        ? visible &&  
          <MarkerClusterGroup chunkedLoading={true} iconCreateFunction={clusterIcon} maxClusterRadius={50} zoomToBoundsOnClick={false}
            showCoverageOnHover={false} removeOutsideVisibleBounds={true} key={name}>
            <GeoJSON data={geom} pointToLayer={pointToLayer}/>
          </MarkerClusterGroup>
        : visible && <GeoJSON data={geom} style={{weight: 3, color:'rgba(184, 42, 29, .5)' }}/>
      }
    </>
  );
}
