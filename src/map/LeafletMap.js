// src/map/LeafletMap.js
import React, { forwardRef, useImperativeHandle } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const LeafletMapContent = forwardRef(({ stations, darkMode }, ref) => {
  const map = useMap();
  useImperativeHandle(ref, () => ({
    zoomIn: () => map.setZoom(map.getZoom() + 1),
    zoomOut: () => map.setZoom(map.getZoom() - 1),
  }));
  
  return (
    <>
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url={
          darkMode
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        }
      />
      {stations &&
        stations.map((station, index) => (
          <Marker key={index} position={[station.lat, station.lng]}>
            <Popup>{station.name}</Popup>
          </Marker>
        ))}
    </>
  );
});

const LeafletMap = forwardRef(({ stations, darkMode }, ref) => {
  return (
    <MapContainer center={[41.034722, 29.151944]} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <LeafletMapContent stations={stations} darkMode={darkMode} ref={ref} />
    </MapContainer>
  );
});

export default LeafletMap;
