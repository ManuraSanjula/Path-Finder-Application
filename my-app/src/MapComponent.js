import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './styles.css';

const MapComponent = () => {
  const mapRef = useRef(null);
  const location = useLocation();
  const { location: userLocation, des } = location.state;

  useEffect(() => {
    const mapboxAccessToken = 'pk.eyJ1IjoibWFudXgyMDAzIiwiYSI6ImNsemZzNm85ODEwazYyc3NhMnN0eTExNHQifQ.jsbN6UwtLdzriyJU2-7JxA';
    const L = window.L;

    if (!mapRef.current) {
      console.log("Initializing the map...");

      mapRef.current = L.map('map').setView([userLocation.latitude, userLocation.longitude], 13);

      L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`, {
        attribution: '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>',
        maxZoom: 18,
      }).addTo(mapRef.current);

      const start = [userLocation.latitude, userLocation.longitude];
      const end = [des.latitude, des.longitude];

      L.marker(start).addTo(mapRef.current).bindPopup('Start').openPopup();
      L.marker(end).addTo(mapRef.current).bindPopup('End').openPopup();

      async function getDirections(start, end) {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[1]},${start[0]};${end[1]},${end[0]}?geometries=geojson&access_token=${mapboxAccessToken}`;
        console.log("Fetching directions from: ", url);

        const response = await fetch(url);
        const data = await response.json();
        console.log("Directions data: ", data);

        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          return route;
        } else {
          console.error("No routes found");
          return null;
        }
      }

      async function displayDirections() {
        const route = await getDirections(start, end);
        if (!route) return;

        const coords = route.geometry.coordinates;
        const latlngs = coords.map(coord => [coord[1], coord[0]]);

        const polyline = L.polyline(latlngs, { color: 'blue', weight: 5, opacity: 0.7, smoothFactor: 1 }).addTo(mapRef.current);
        mapRef.current.fitBounds(polyline.getBounds());

        const instructions = route.legs[0].steps;
        instructions.forEach((step, index) => {
          console.log(`${index + 1}. ${step.maneuver.instruction}`);
        });
      }

      displayDirections();
    }
  }, [userLocation, des]);

  return (
    <div id="map" style={{ height: '1000px', width: '100%' }}></div>
  );
};

export default MapComponent;
