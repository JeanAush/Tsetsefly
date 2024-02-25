import React, { useState } from "react";
import axios from "axios";
import "./Image.css";

function Image() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setError("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", name);

    try {
      const response = await axios.post("/api/upload-images", formData);
      console.log("Upload successful:", response.data);
      // Optionally, you can handle the success response here
    } catch (error) {
      console.error("Error:", error.response.data);
      // Optionally, you can handle the error response here
    }
  };

  return (
    <div className="map-page">
      <h2>Upload Insect Image</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleImageChange} accept="image/*" />
        <input type="text" value={name} onChange={handleNameChange} placeholder="Enter Insect Name" />
        <button type="submit">Upload</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}

export default Image;
