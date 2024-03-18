import axios from "axios";
import React, { useEffect, useState } from "react";
import { config } from "../config";
import { useParams } from "react-router-dom";

const TsetseEdit = () => {
  const [tsetseFlyData, settsetseFlyData] = useState(null);
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${config.serverUrl}/api/tsetse_fly_data/${params.dataId}`
        );
        settsetseFlyData(response.data[0]);
      } catch (error) {
        console.error("Error fetching tsetse fly data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (tsetseFlyData) {
      setFormData({
        species: tsetseFlyData.species || "",
        latitude: tsetseFlyData.latitude || "",
        longitude: tsetseFlyData.longitude || "",
        monthcaptured: tsetseFlyData.monthcaptured || "",
        country: tsetseFlyData.country || "",
        capturemethod: tsetseFlyData.capturemethod || "",
        tagname: tsetseFlyData.tagname || "",
        disease: tsetseFlyData.disease || "",
        image: null, // For image upload
      });
    }
  }, [tsetseFlyData]); // This useEffect depends on tsetseFlyData being set

  const [formData, setFormData] = useState({
    species: "",
    latitude: "",
    longitude: "",
    monthcaptured: "",
    country: "",
    capturemethod: "",
    tagname: "",
    disease: "",
    image: null, // For image upload
  });

  const onUpdate = async (formData) => {
    // Create an instance of FormData
    const updateData = new FormData();

    // Append each form field to the FormData instance
    for (const key in formData) {
      if (key !== "image") {
        updateData.append(key, formData[key]);
      }
    }

    // Append the image file to the FormData, if present
    if (formData.image) {
      updateData.append("image", formData.image);
    }

    try {
      // Make the request to your backend to update the tsetse fly data
      const response = await fetch(
        `${config.serverUrl}/api/tsetse_fly_data/edit/${params.dataId}`,
        {
          method: "POST",
          body: updateData,
          // Do not set 'Content-Type' header when sending FormData
          // The browser will set it with the proper 'boundary'
          headers: {
            // Authorization header if needed, e.g., 'Bearer your_jwt_token_here'
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log(result.message); // Or handle the response as needed
      // Optionally, invoke a callback or state update to indicate success
    } catch (error) {
      console.error("Error updating tsetse fly data:", error);
      // Handle the error, e.g., by setting an error message in your component's state
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="head">
          <div className="text">Update Tsetse Fly Data</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
          {/* Iterate over each field except the image to create input elements */}
          {Object.keys(formData)
            .filter((key) => key !== "image")
            .map((key) => (
              <div className="input" key={key}>
                <i
                  className={`fa-solid ${
                    key === "species" ? "fa-bug" : "fa-circle-info"
                  }`}
                ></i>
                <input
                  type="text"
                  placeholder={key}
                  value={formData[key]}
                  onChange={(e) =>
                    setFormData({ ...formData, [key]: e.target.value })
                  }
                />
              </div>
            ))}
          <div className="input">
            <i className="fa-solid fa-image"></i>
            <input type="file" onChange={handleImageChange} />
          </div>
        </div>
        <div className="submit-container">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default TsetseEdit;
