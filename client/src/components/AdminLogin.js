import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginSignup.css";

function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        formData
      );
      const token = response.data.token;
      localStorage.setItem("token", token); // Store token in local storage
      console.log("Login successful:", token);
      navigate("/admin", { replace: true }); // Redirect to home page
    } catch (error) {
      if (error.response) {
        console.error("Error:", error.response.data.message);
      } else if (error.request) {
        console.error("Request error:", error.request);
      } else {
        console.error("Error:", error.message);
      }
    }
  };

  const handleFormDataChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="head">
          <div className="text">Admin Login</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
          <div className="input">
            <i className="fa-regular fa-envelope"></i>
            <input
              type="email"
              placeholder="email@gmail.com"
              name="email"
              value={formData.email}
              onChange={handleFormDataChange}
            />
          </div>
          <div className="input">
            <i className="fa-solid fa-key"></i>
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleFormDataChange}
            />
          </div>
        </div>
        <div className="submit-container">
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}

export default AdminLogin;
