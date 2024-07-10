import { GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';

/**
 * OverlayIcon Component - Displays icons and clusters on the map based on GeoJSON data.
 * @param {object} props - Component props.
 * @param {object} props.geom - GeoJSON data for the markers.
 * @param {boolean} props.visible - Visibility of the markers.
 * @param {string} props.name - Name used for the icon URL.
 * @returns {JSX.Element} - The rendered component.
 */
export default function OverlayIcon({ geom, visible, name }) {
  /**
   * Creates a marker for each point in the GeoJSON data.
   * @param {object} feature - GeoJSON feature.
   * @param {object} latlng - Latitude and longitude of the point.
   * @returns {L.Marker} - Leaflet marker.
   */
  const pointToLayer = (feature, latlng) => {
    const icon = new L.Icon({
      iconUrl: `./icon/${name}.svg`,
      iconSize: [12, 12], // Size of the icon
      iconAnchor: [6, 12], // Position of the icon
    });
    return L.marker(latlng, { icon: icon, forceZIndex: 1 });
  };

  /**
   * Creates a custom icon for the cluster.
   * @param {object} cluster - Cluster object.
   * @returns {L.Icon} - Custom cluster icon.
   */
  const clusterIcon = (cluster) => {
    const size = Math.min(35, 12 + cluster.getChildCount() / 10);
    return new L.Icon({
      iconUrl: `./icon/${name}.svg`,
      iconSize: [size, size], // Size of the icon
      iconAnchor: [size / 2, size], // Position of the icon
      className: 'cluster',
    });
  };

  return (
    <>
      {name !== 'piste_ciclabili'
        ? visible && (
          <MarkerClusterGroup chunkedLoading={true} iconCreateFunction={clusterIcon} maxClusterRadius={50}
            zoomToBoundsOnClick={false} showCoverageOnHover={false} removeOutsideVisibleBounds={true} key={name}>
            <GeoJSON data={geom} pointToLayer={pointToLayer} />
          </MarkerClusterGroup>
        ) : (
          visible && <GeoJSON data={geom} style={{ weight: 3, color: 'rgba(184, 42, 29, .5)' }} />
        )
      }
    </>
  );
}
