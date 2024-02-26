import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import Navbar from "./Navbar";
import Hero from "./Hero";
import AboutImg from "../Assets/image7.webp";
import Footer from "./Footer";
import "leaflet/dist/leaflet.css";
import "./MapPage.css";
import Image from "./Image";
const createColoredMarkerIcon = (color) => {
  const markerHtml = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" height="50" width="50"><circle cx="50" cy="50" r="40" fill="${color}" /></svg>`
  );

  return L.divIcon({
    className: "custom-marker",
    html: `<img src="data:image/svg+xml,${markerHtml}" class="svg-marker-icon"/>`,
    iconSize: [20, 20],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const MapPage = () => {
  const [data, setData] = useState([]);
  // Initializing all selected filters as empty arrays
  const [selectedFilters, setSelectedFilters] = useState({
    species: [],
    season: [],
    country: [],
    method: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/tsetse_fly_data"
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleCheckboxChange = (filterType, value) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: prevFilters[filterType].includes(value)
        ? prevFilters[filterType].filter((item) => item !== value)
        : [...prevFilters[filterType], value],
    }));
  };

  const extractUniqueOptions = (key) =>
    [...new Set(data.map((item) => item[key]))].sort();

  const FilterCheckbox = ({ filterType, option }) => (
    <label key={option} className="filter-container">
      <p className="filter-label">{option}</p>
      <div className="filter-checkbox">
        <input
          type="checkbox"
          value={option}
          checked={selectedFilters[filterType].includes(option)}
          onChange={() => handleCheckboxChange(filterType, option)}
        />
      </div>
    </label>
  );

  // Filtering data based on selections
  const filteredData = data.filter((item) =>
    Object.keys(selectedFilters).every((filterType) =>
      selectedFilters[filterType].length
        ? selectedFilters[filterType].includes(item[filterType])
        : true
    )
  );

  return (
    <div>
      <Navbar />
      <Hero cName="hero-mid" heroImg={AboutImg} title=" Map Page" />
      <div className="map-page-container">
        <div className="filter-options">
          <div>
            <label>Filter by:</label>
          </div>
          {Object.keys(selectedFilters).map((filterType) => (
            <div key={filterType} className="filter-group">
              <p className="filter-label">
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}:
              </p>
              {extractUniqueOptions(filterType).map((option) => (
                <FilterCheckbox
                  key={option}
                  filterType={filterType}
                  option={option}
                />
              ))}
            </div>
          ))}
        </div>
        <MapContainer
          center={[0, 0]}
          zoom={2}
          style={{ height: "600px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {filteredData.map((entry) => (
            <Marker
              key={entry.id}
              position={[entry.latitude, entry.longitude]}
              icon={createColoredMarkerIcon(getRandomColor())}
            >
              <Popup>
                Species: {entry.species}
                <br />
                Country: {entry.country}
                <br />
                Season: {entry.season}
                <br />
                Method: {entry.method}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <Image />
      <Footer />
    </div>
  );
};

export default MapPage;
