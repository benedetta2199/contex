import { Marker } from 'react-leaflet';
import L, { MarkerCluster } from "leaflet";
import MarkerClusterGroup from 'react-leaflet-cluster';


export default function OverlayIcon(props) {
  const { coords, visible, name } = props;

  // Crea l'icona
  const icon = new L.icon({
    iconUrl: `./icon/${name}.svg`,
    iconSize: [12, 12], // dimensioni dell'icona
    iconAnchor: [6, 12], // posizione dell'icona
  });

  const clusterIcon = function (cluster) {
    const n = Math.min(35, 12+cluster.getChildCount()/10);
    console.log(n);
    return new L.Icon({
      iconUrl:`./icon/${name}.svg`,
      iconSize: [n,n], // dimensioni dell'icona
      iconAnchor: [n/2, n], // posizione dell'icona
      className: `cluster`,
    });
  };

  return (
    <>
      {visible && 
        <MarkerClusterGroup chunkedLoading iconCreateFunction={clusterIcon} maxClusterRadius={30} 
          showCoverageOnHover={false} removeOutsideVisibleBounds={true}>
          {coords.map(e => (
            <Marker position={[e[0], e[1]]} key={e[2]} icon={icon}></Marker>
          ))}
        </MarkerClusterGroup>
      }
    </>
  );
}
