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
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router-dom';
import "./styles.css";

const Location = require("./Utils/Location");
const Graph = require("./Utils/Graph");
const DistanceCalculator = require("./Utils/DistanceCalculator");
const BearingCalculator = require("./Utils/BearingCalculator");
const Dijkstra = require("./Utils/Dijkstra");
const AStar = require("./Utils/A_Star/AStar");

const BearingCalculator_A = require("./Utils/A_Star/BearingCalculator");
const DistanceCalculator_A = require("./Utils/A_Star/DistanceCalculator");
const Location_A = require("./Utils/A_Star/Location");
const Graph_A = require("./Utils/A_Star/Graph");

const Home = () => {
  const { latitude, longitude, userlatitude, userlongitude, sign, bool, name } = useParams();

  const [navMap, setNavMap] = useState(false);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);
  const [result, setResult] = useState("");
  const [userInput, setUserInput] = useState("");
  const [des, setDes] = useState({ latitude: null, longitude: null });
  const [direction, setDirection] = useState("Please select the destination");
  const [history, setHistory] = useState([]);
  const [uniqueId, setUniqueId] = useState('');

  const navigate = useNavigate();

  const createSlug = (text) => {
    return text
      .toLowerCase()           // Convert to lowercase
      .replace(/ /g, '-')      // Replace spaces with hyphens
      .replace(/[^\w-]+/g, ''); // Remove any non-alphanumeric characters except hyphens
  };

  const generateUniqueId = (name) => {
    return `${name}-${uuidv4()}`;
  };

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
      userResponse: createSlug(userResponse)
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

    if (bool) {
      setLocation({ latitude: userlatitude, longitude: userlongitude });
      setDes({ latitude, longitude })
      setUserInput(name)
      setResult(`Latitude: ${latitude}, Longitude: ${longitude}`);
    }

    if (sign) {
      setDes({ latitude, longitude })
      setUserInput(name)
      setResult(`Latitude: ${latitude}, Longitude: ${longitude}`);
    }

    getTravel().then((travel) => {
      {
        console.log(history)
      }
    })

    if (!bool)
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
  }, [bool]);

  return (
    <div>
      <div className="bg-[#0e2a36] flex flex-col justify-center items-center h-screen w-full fixed z-[100]">
        <div className="rounded-lg shadow-2xl p-5">
          {error ? (
              <p>Error: {error}</p>
          ) : (
              <div className="items-center justify-center flex flex-row text-white my-5">
                <h1 className="m-2 text-xl">Your Location :</h1>
                <p className="m-2 text-xl">Latitude :</p><p
                  className="text-blue-600 underline font-semibold"> {location.latitude}</p>
                <p className="m-2 text-xl">Longitude :</p><p
                  className="text-blue-600 underline font-semibold"> {location.longitude}</p>
              </div>
          )}
          <input className="border rounded-lg px-16 mx-10 my-2"
                 type="text"
                 value={userInput}
                 onChange={(e) => setUserInput(e.target.value)}
                 placeholder="Enter a location you want"
          />
          <button className="border rounded-lg bg-green-500 p-2 my-2 text-white font-semibold"
                  onClick={getCoordinates}>Get Coordinates
          </button>
          <p className="text-white items-center justify-center px-10">{result}</p>
          <div className="items-center justify-center flex flex-col space-y-4 pt-3">
            <button className="text-white border rounded-lg bg-blue-500 p-2 my-2 font-semibold" onClick={submit}>Submit
              Using Dijkstra
            </button>
            <button className="text-white border rounded-lg bg-yellow-400 p-2 my-2 font-semibold"
                    onClick={a_Star}>Submit Using A_Star
            </button>
            <button className="text-white border rounded-lg bg-green-500 p-2 my-2 font-semibold"
                    onClick={navigateMap}>Navigate to UI Map
            </button>
            <button className="text-white border rounded-lg p-2 my-2 font-semibold" onClick={navigateCustomMap}>Navigate
              to Custom Map
            </button>
            <p className="text-white">Here: {direction}</p>
            <button className="text-white border rounded-lg bg-green-500 p-2 my-2 font-semibold"
                    onClick={submitTravel}>Save
            </button>
          </div>
          <div>
            <h2 className="items-center justify-center text-white my-5 text-xl">Your Travel History :</h2>
            <ul>
              {history.map((entry, index) => (
                  <React.Fragment key={index}>
                    <div className="items-center justify-center px-10 text-white py-4">
                      <li>
                        Destination Lat: <span className="text-blue-500 underline">{entry.des.latitude}</span>, Lon: <span className="text-blue-500 underline">{entry.des.longitude}</span>
                      </li>
                      <li>
                        User Lat: {entry.location.latitude}, Lon: {entry.location.longitude}
                      </li>
                      <li>
                        Name: {entry.userResponse}, Url: <a className="text-blue-500 underline"
                          href={`/${entry.des.latitude}/${entry.des.longitude}/${entry.location.latitude}/${entry.location.longitude}/${true}/${entry.userResponse}`}>{entry.userResponse}</a>
                      </li>
                      <p></p>
                    </div>
                  </React.Fragment>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

};

const App = () => (
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>}/>
        <Route path="/map" element={<ProtectedRoute><MapComponent/></ProtectedRoute>}/>
        <Route path="/custom-map" element={<ProtectedRoute><CustomMap/></ProtectedRoute>}/>
        <Route path="/:latitude/:longitude/:userlatitude/:userlongitude/:bool/:name"
               element={<ProtectedRoute><Home/></ProtectedRoute>}/>
      </Routes>
    </Router>
);

export default App;
