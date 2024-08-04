import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import MapComponent from "./MapComponent";
import Geocoder from "./Geocoder";
import CustomMap from "./CustomMap";
import Login from "./Login";
import Signup from "./Signup";
import ProtectedRoute from "./ProtectedRoute";
import Cookies from "js-cookie";
import axios from "axios";


const Location = require("./temp/Location");
const Graph = require("./Utils/temp/Graph");
const DistanceCalculator = require("./Utils/DistanceCalculator");
const BearingCalculator = require("./Utils/BearingCalculator");
const Dijkstra = require("./Utils/Dijkstra");
const AStar = require("./Utils/A_Star/AStar");

const BearingCalculator_A = require("./Utils/A_Star/BearingCalculator");
const DistanceCalculator_A = require("./Utils/A_Star/DistanceCalculator");
const Location_A = require("./Utils/temp/Location");
const Graph_A = require("./Utils/temp/Graph");

const Home = () => {
  const [navMap, setNavMap] = useState(false);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);
  const [result, setResult] = useState("");
  const [userInput, setUserInput] = useState("");
  const [des, setDes] = useState({ latitude: null, longitude: null });
  const [direction, setDirection] = useState("Please select the destination");
  const [history, setHistory] = useState([]);

  const navigate = useNavigate();

  const getCoordinates = async () => {
    const geocoder = new Geocoder();
    try {
      const coordinates = await geocoder.getCoordinates(userInput);

      setResult(`Latitude: ${coordinates.lat}, Longitude: ${coordinates.lon}`);
      setDes({ latitude: coordinates.lat, longitude: coordinates.lon });
    } catch (error) {
      setResult("Error fetching the coordinates.");
    }
  };

  const a_Star = async () => {
    try {
      const graph = new Graph_A();
      const locA = new Location_A(location.latitude, location.longitude);
      const locB = new Location_A(des.latitude, des.longitude);

      graph.addLocation(locA);
      graph.addLocation(locB);

      const distance = DistanceCalculator_A.calculateDistance(locA, locB);
      graph.addEdge(locA, locB, distance);

      const path = AStar.aStar(graph, locA, locB);

      path.forEach((loc) =>
        console.log(`Lat: ${loc.latitude}, Lon: ${loc.longitude}`)
      );

      for (let i = 0; i < path.length - 1; i++) {
        const direction = BearingCalculator_A.getDirection(path[i], path[i + 1]);
        setDirection(`Go ${direction}`)
        console.log(`Go ${direction}`);
      }
      setNavMap(true);

    } catch (error) {
      setNavMap(false);
    }
  };

  const getTravel = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const token = Cookies.get("user_jwt");

      const data = {
        des,
        location,
        token,
      }
      const response = await axios.put(
        "http://localhost:4000/travelhistory",
        JSON.stringify(data),
        { headers }
      );
      setHistory(response.data.data)

    } catch (error) {
      console.log(error)
      alert("Error to fetch travel history");
    }
  }

  const submitTravel = async () => {
    const userResponse = prompt('Please enter travel-todo name:');
    const token = Cookies.get("user_jwt");

    const data = {
      des,
      location,
      token,
      userResponse
    }

    try {
      const headers = {
        "Content-Type": "application/json",
      };

      const response = await axios.post(
        "http://localhost:4000/travelhistory",
        JSON.stringify(data),
        { headers }
      );
      console.log(response)
    } catch (error) {
      console.log(error)
      alert("Error");
    }
  }

  const submit = async () => {
    try {
      const graph = new Graph();
      const locA = new Location(location.latitude, location.longitude);
      const locB = new Location(des.latitude, des.longitude);

      graph.addLocation(locA);
      graph.addLocation(locB);

      const distance = DistanceCalculator.calculateDistance(locA, locB);
      graph.addEdge(locA, locB, distance);

      const previous = Dijkstra.dijkstra(graph, locA);
      const path = Dijkstra.getShortestPath(previous, locB);

      path.forEach((loc) =>
        console.log(`Lat: ${loc.latitude}, Lon: ${loc.longitude}`)
      );

      for (let i = 0; i < path.length - 1; i++) {
        console.log(
          `Go ${BearingCalculator.getDirection(path[i], path[i + 1])}`
        );
        setDirection(`Go ${BearingCalculator.getDirection(path[i], path[i + 1])}`)
      }
      setNavMap(true);

    } catch (error) {
      setNavMap(false);
    }
  };

  const navigateMap = async () => {
    if (navMap) navigate("/map", { state: { location, des } });
  };

  const navigateCustomMap = async () => {
    if (location.latitude && des.latitude) {
      navigate("/custom-map", { state: { locA: location, locB: des } });
    } else {
      setError("Please set both start and destination locations.");
    }
  }
  useEffect(() => {

    getTravel().then((travel) => {
      {
        console.log(history)
      }
    })

    if ("geolocation" in navigator) {
      const options = {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      };

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          setError(error.message);
        },
        options
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <h1>User's Location</h1>
        {error ? (
          <p>Error: {error}</p>
        ) : (
          <div>
            <p>Latitude: {location.latitude}</p>
            <p>Longitude: {location.longitude}</p>
          </div>
        )}
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter a location name"
        />
        <button onClick={getCoordinates}>Get Coordinates</button>
        <p>{result}</p>
        <button onClick={submit}>Submit Dijkstra</button>
        <button onClick={a_Star}>Submit A_Star</button>
        <button onClick={navigateMap}>Navigate to UI Map</button>
        <button onClick={navigateCustomMap}>Navigate to Custom Map</button>
        <p>Here: {direction}</p>
        <button onClick={submitTravel}>Save</button>
      </div>
      <div style={{ flex: 1, marginLeft: '20px' }}>
        <h2>History</h2>
        <ul>
          {history.map((entry, index) => (
            <React.Fragment key={index}>
              <div>
                <li>
                  Destination Lat: {entry.des.latitude}, Lon: {entry.des.longitude}
                </li>
                <li>
                  User Lat: {entry.location.latitude}, Lon: {entry.location.longitude}
                </li>
                <li>
                  Name: {entry.userResponse}, Url: /{entry.userResponse}
                </li>
                <p></p>
              </div>
            </React.Fragment>
          ))}
        </ul>
      </div>
    </div>
  );

};

const App = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/map" element={<ProtectedRoute><MapComponent /></ProtectedRoute>} />
      <Route path="/custom-map" element={<ProtectedRoute><CustomMap /></ProtectedRoute>} />
    </Routes>
  </Router>
);

export default App;
