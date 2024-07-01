import { MissingStaticPage } from 'next/dist/shared/lib/utils';
import React, { useState, useEffect } from 'react';
import { GeoJSON } from 'react-leaflet';
import { currentFeature } from 'src/pages/api/state';

export default function OverlayValZone() {
  const {getValutazioneZone} = currentFeature();
  const [valZones, setValZones] = useState([]);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  
  useEffect(() => {
      const fetchedZone = getValutazioneZone();
      console.log(fetchedZone);
      if (fetchedZone.length > 0) {
        setValZones(fetchedZone);
      }
  }, [getValutazioneZone]);

  useEffect(() => {
    const minScore = Math.min(...valZones.map(e => e.punteggio));
    const maxScore = Math.max(...valZones.map(e => e.punteggio));
    setMin(minScore);
    setMax(maxScore);
  }, [valZones]);

  
  function getStyle(score) {
    console.log(score);
    const red = { r: 184, g: 42, b: 29 };
    const yellow = { r: 176, g: 176, b: 18 };
    const green = { r: 58, g: 140, b: 46 };

    let normalizedScore = (score - min) / (max - min);

    let r, g, b;
    if (normalizedScore < 0.5) {
      normalizedScore *= 2;
        r = Math.round(red.r + normalizedScore * (yellow.r - red.r));
        g = Math.round(red.g + normalizedScore * (yellow.g - red.g));
        b = Math.round(red.b + normalizedScore * (yellow.b - red.b));
    } else {
      normalizedScore = (normalizedScore - 0.5) * 2;
        r = Math.round(yellow.r + normalizedScore * (green.r - yellow.r));
        g = Math.round(yellow.g + normalizedScore * (green.g - yellow.g));
        b = Math.round(yellow.b + normalizedScore * (green.b - yellow.b));
    }
    return {fillColor:` rgb(${r},${g},${b})`, fillOpacity: 0.55, weight: 2, color: `rgba(${r}, ${g}, ${b}, 1)`}
  }
/*

  const onEachZone = (data, layer, zone) => {
    layer.on({
      click: () => {
        updateSelectZone(data.name);
        zone.select = !zone.select;
        layer.setStyle(zone.select ? styleSelect : styleDefault);
      },
    });

    // Add a tooltip with the zone name
    if (data.properties && zone.name) {
        var TooltipClass = {'className': 'custom-tooltip'}
        layer.bindTooltip(zone.name, { ...TooltipClass}, TooltipClass)
      }
  };

  return <>
    {valZones.map((zone, index) => (
        <GeoJSON key={index} data={zone.data} style={zone.select ? styleSelect : styleDefault} 
        onEachFeature={(data, layer) => onEachZone(data, layer, zone)}/>
      ))}
</>
}

  /*styleDefault*/
  return <>
    {valZones.map((zone, index) => (
        <GeoJSON key={index} data={JSON.parse(zone.geom)} style={getStyle(zone.punteggio)}/>
      ))}
  </>
}
