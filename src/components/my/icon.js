import L from 'leaflet';

export const getIcon = (type) => {

  const getURL = () =>{
    let name = ''
    switch (type) {
      case 'cinema': name = 'film.svg'; break;
      case 'teatro': name = 'theater.svg'; break;
      case 'stazione': name = 'train.svg'; break;
      case 'ospedale': name = 'hospital.svg'; break;
      case 'bus': name = 'dot.svg'; break;
      case 'sport': name = 'sport.svg'; break;
      case 'museo': name = 'museum.svg'; break;
      case 'supermarket': name = 'supermarket.svg'; break;
      case 'biblioteca': name = 'library.svg'; break;
      case 'lunch': name = 'lunch.svg'; break;
      case 'scuola': name = 'school.svg'; break;
      case 'chiese': name = 'church.svg'; break;
      case 'parchi': name = 'park.svg'; break;
      case 'parcheggi': name = 'carpark.svg'; break;
      default: name = 'museum.svg';
    }
    return './icon/'+name;
  }

  return L.icon({
    iconUrl: getURL(),
    iconSize: [10,10], // dimensioni dell'icona
    iconAnchor: [16, 32], // posizione dell'icona
    popupAnchor: [0, -32] // posizione del popup
  });
};
