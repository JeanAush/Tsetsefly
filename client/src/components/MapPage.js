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
import { scaleLinear } from "d3-scale";

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
  const [speciesList, setSpeciesList] = useState([]);
  const [seasonList, setSeasonList] = useState([]);
  const [trapMethodList, setTrapMethodList] = useState([]);
  const [countryList, setCountryList] = useState([]);

  const [selectedSpecies, setSelectedSpecies] = useState([]);
  const [selectedSeasons, setSelectedSeasons] = useState([]);
  const [selectedTrapMethods, setSelectedTrapMethods] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);

  const fetchData = async () => {
    const url = `http://localhost:5000/api/tsetse_fly_data?species=${selectedSpecies.join(
      ","
    )}&season=${selectedSeasons.join(",")}&method=${selectedTrapMethods.join(
      ","
    )}&country=${selectedCountries.join(",")}`;

    await axios
      .get(url)
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchSpeciesList = () => {
    axios
      .get("http://localhost:5000/api/species")
      .then((response) => {
        setSpeciesList(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchSeasonList = () => {
    axios
      .get("http://localhost:5000/api/season")
      .then((response) => {
        setSeasonList(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchTrapMethodList = () => {
    axios
      .get("http://localhost:5000/api/trap-method")
      .then((response) => {
        setTrapMethodList(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchCountryList = () => {
    axios
      .get("http://localhost:5000/api/country")
      .then((response) => {
        setCountryList(response.data);
        console.log("data long-lat", response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchData();
    fetchSpeciesList();
    fetchSeasonList();
    fetchTrapMethodList();
    fetchCountryList();
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token");
    console.log("Token:", token);
    if (!token) {
      console.error("Token not found");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    axios
      .post("http://localhost:5000/api/upload-csv", formData, config)
      .then(() => {
        // Refresh data after successful upload
        fetchData();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const FilterComponent = ({ data }) => {
    return (
      <div key={data} className="filter-container">
        <p className="filter-label">{data}</p>
        <div className="filter-checkbox">
          <input
            type="checkbox"
            value={data}
            checked={selectedSpecies.includes(data)}
            onChange={(e) => {
              const updatedSpecies = e.target.checked
                ? [...selectedSpecies, data]
                : selectedSpecies.filter((item) => item !== data);
              setSelectedSpecies(updatedSpecies);
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      <Navbar />
      <Hero cName="hero-mid" heroImg={AboutImg} title=" Map Page" />
      <div className="map-page-container">
        <div className="filter-options">
          <label>Filter by:</label>
          <div>
            <label>Species:</label>
            <select
              onChange={(e) => setSelectedSpecies([e.target.value])}
              value={selectedSpecies[0] || ""}
            >
              <option value="">All Species</option>
              {speciesList.map((species) => (
                <option key={species} value={species}>
                  {species}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Selected Species:</label>
            {speciesList.map((species) => (
              <FilterComponent data={species} />
            ))}
          </div>
          <div>
            <label>Season:</label>
            <select
              onChange={(e) => setSelectedSeasons([e.target.value])}
              value={selectedSeasons[0] || ""}
            >
              <option value="">All Seasons</option>
              {seasonList.map((season) => (
                <option key={season} value={season}>
                  {season}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Selected Seasons:</label>
            {seasonList.map((season) => (
              <FilterComponent data={season} />
            ))}
          </div>
          <div>
            <label>Trap Method:</label>
            <select
              onChange={(e) => setSelectedTrapMethods([e.target.value])}
              value={selectedTrapMethods[0] || ""}
            >
              <option value="">All Trap Methods</option>
              {trapMethodList.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Selected Trap Methods:</label>
            {trapMethodList.map((method) => (
              <FilterComponent data={method} />
            ))}
          </div>
          <div>
            <label>Country:</label>
            <select
              onChange={(e) => setSelectedCountries([e.target.value])}
              value={selectedCountries[0] || ""}
            >
              <option value="">All Countries</option>
              {countryList.map((country) => (
                <li key={country.id}>
                  Username: {country.username}, Species: {country.species},
                  Latitude: {country.latitude}, Longitude: {country.longitude},
                  Season: {country.season}, Country: {country.country}, Method:{" "}
                  {country.method}
                </li>
              ))}
            </select>
          </div>
          <div>
            <label>Selected Countries:</label>
            {countryList.map((country) => (
              <FilterComponent data={country.country} />
            ))}
          </div>
        </div>
        <input type="file" accept=".csv" onChange={handleFileUpload} />
        <MapContainer
          center={[0, 0]}
          zoom={2}
          style={{ height: "600px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {countryList.map((entry) => (
            <Marker
              key={entry.id}
              position={[entry.latitude, entry.longitude]}
              icon={createColoredMarkerIcon(getRandomColor())} // Assign a random color
            >
              <Popup>
                <div>
                  <p>Species: {entry.species}</p>
                  <p>Country: {entry.country}</p>
                  <p>Season: {entry.season}</p>
                  {/* Add more information as needed */}
                </div>
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
