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
                <img
                  width={200}
                  height={200}
                  src="data:image/jpeg;base64,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"
                />
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
