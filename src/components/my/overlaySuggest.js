import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css'
import { Circle, Rectangle } from 'react-leaflet';
import { currentFeature } from 'src/pages/api/state';

export default function OverlaySuggest() {
  const {getSuggestArea} = currentFeature();
  const bestArea= getSuggestArea();

  return <>
    {bestArea.map((e, index)=>(
      <React.Fragment key={index}>
        <Rectangle bounds={[[e.y, e.x], [e.y-e.height, e.x+e.width]]} key={index+'R'}
          pathOptions={{ color: 'gray', weight: 1.5 }} />
        <Circle center={[e.centroide[0], e.centroide[1]]} radius={18} pathOptions={{ color: '#005566', weight: 2, }} key={index+'C'}/>
      </React.Fragment>
    ))}
  </>
}
