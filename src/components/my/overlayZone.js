import React, { useState, useEffect } from 'react';
import { GeoJSON } from 'react-leaflet';
import { Button } from 'react-bootstrap';
import { currentUpdate, currentValue } from 'src/pages/api/state';

/**
 * OverlayZone Component - Displays zones on the map and allows for selection.
 * @returns {JSX.Element} - The rendered component.
 */
export default function OverlayZone() {
  const { zone } = currentValue();
  const { updateSelectZone } = currentUpdate();
  // Default and selected styles for the zones
  const styleDefault = { fillColor: 'rgba(255, 255, 255, 0.4)', weight: 2, color: 'rgba(120, 120, 120, 0.4)' };
  const styleSelect = { fillColor: 'rgba(0, 170, 183, 1)', weight: 2, color: 'rgba(0, 96, 128, 1)' };

  /**
   * Handles each zone by adding click event and tooltip.
   * @param {object} data - GeoJSON data of the zone.
   * @param {object} layer - Leaflet layer of the zone.
   * @param {object} zone - Zone object containing additional data.
   */
  const onEachZone = (data, layer, z) => {
    layer.on({
      click: () => {
        z.select = !z.select
        updateSelectZone(z.name, z.select);
      },
    });

    // Add a tooltip with the zone name
    if (data.properties && z.name) {
      layer.bindTooltip(z.name, { className: 'custom-tooltip' });
    }
  };

  /**
   * Change all zones.
   */
  const changeAllZones = (value) => {
    zone.map((z) => {
      z.select = value;
      updateSelectZone(z.name, value);
    });
  };

  return (
    <>
      <div className="mb-1 button-overlay">
        <Button variant="primary" onClick={()=>changeAllZones(true)} className="me-2">
          Seleziona tutte le zone
        </Button>
        <Button variant="secondary" onClick={()=>changeAllZones(false)}>
          Deseleziona tutte le zone
        </Button>
      </div>
      {zone.map((zone, index) => (
        <GeoJSON key={index} data={zone.data} style={zone.select ? styleSelect : styleDefault}
          onEachFeature={(data, layer) => onEachZone(data, layer, zone)}
        />
      ))}
    </>
  );
}
