import React, { useEffect } from "react";
import L from "leaflet";
import { useLocation } from "react-router-dom";
import Location from "./Utils/Location";
import Graph from "./Utils/A_Star/Graph";
import DistanceCalculator from "./Utils/DistanceCalculator";
import AStar from "./Utils/A_Star/AStar";
import BearingCalculator from "./Utils/BearingCalculator";

const CustomMap = () => {
  const location = useLocation();
  const { locA, locB } = location.state;

  useEffect(() => {
    const mapContainer = L.DomUtil.get('map');
    if (mapContainer != null) {
      mapContainer._leaflet_id = null;
    }

    const map = L.map("map").setView([locA.latitude, locA.longitude], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    const graph = new Graph();
    const start = new Location(locA.latitude, locA.longitude);
    const end = new Location(locB.latitude, locB.longitude);

    graph.addLocation(start);
    graph.addLocation(end);

    const distance = DistanceCalculator.calculateDistance(start, end);
    graph.addEdge(start, end, distance);

    const path = AStar.aStar(graph, start, end);

    path.forEach((loc) => {
      L.marker([loc.latitude, loc.longitude]).addTo(map);
    });

    const latlngs = path.map((loc) => [loc.latitude, loc.longitude]);
    const polyline = L.polyline(latlngs, { color: "blue" }).addTo(map);

    map.fitBounds(polyline.getBounds());

    for (let i = 0; i < path.length - 1; i++) {
      const direction = BearingCalculator.getDirection(path[i], path[i + 1]);
      console.log(`Go ${direction}`);
    }

    return () => {
      map.remove();
    };
  }, [locA, locB]);

  return <div id="map" style={{ height: "100vh" }}></div>;
};

export default CustomMap;
