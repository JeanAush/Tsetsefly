import React, { useState } from "react";
import axios from "axios";
import "./FileUpload.css";

function Image() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || !name.trim()) {
      setError("Please select an image and enter the insect name.");
      return;
    }

    setError(null);
    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", name);

    try {
      const response = await axios.post("/api/upload-images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Upload successful:", response.data);
      setSuccessMessage("Image uploaded successfully!");
      // Reset form
      setImage(null);
      setName("");
      // Reset file input
      e.target.reset();
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : "Error uploading image"
      );
      setError("Failed to upload image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="map-page">
      <h2>Upload Insect Image</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleImageChange} accept="image/*" />
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Enter Insect Name"
        />
        <button type="submit" disabled={loading}>
          Upload
        </button>
        {error && <p className="error">{error}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
      </form>
    </div>
  );
}

const CSVUpload = ({ fetchData }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (!selectedFile) {
      console.log("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    const token = localStorage.getItem("token");
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
        console.log("CSV uploaded successfully");
        fetchData(); // Make sure this function is correctly passed as a prop and defined to refresh data
      })
      .catch((error) => {
        console.error("Error uploading CSV:", error);
      });
  };

  return (
    <div className="map-page">
      <h2>Upload CSV</h2>
      <form onSubmit={handleFormSubmit}>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default CSVUpload;

export { Image, CSVUpload };
