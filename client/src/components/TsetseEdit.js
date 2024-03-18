import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./TsetseEdit.css";

function TsetseEdit() {
  const [action, setAction] = useState("Sign Up");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (action === "Sign Up") {
        await handleSignUp();
      } else {
        await handleLogin();
      }
    } catch (error) {
      console.error("Error:", error.response.data);
    }
  };

  const handleSignUp = async () => {
    try {
      // Send the formData object in the axios.post request
      await axios.post("http://localhost:5000/register", formData);
      handleSuccessfulRegistration();
    } catch (error) {
      console.error("Error:", error.response.data);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        formData
      );
      const token = response.data.token;
      localStorage.setItem("token", token); // Store token in local storage
      console.log("Login successful:", token);
      handleSuccessfulLogin();
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

  const handleSuccessfulRegistration = () => {
    // Clear the form data after successful registration
    setFormData({ username: "", email: "", password: "" });

    // Redirect to the home page
    navigate("/", { replace: true });
  };

  const handleSuccessfulLogin = () => {
    // Clear the form data after successful login
    setFormData({ username: "", email: "", password: "" });

    // Redirect to the home page
    navigate("/", { replace: true });
  };

  const handleActionChange = (e) => {
    e.preventDefault();
    setFormData({ username: "", email: "", password: "" });

    if (action === "Sign Up") {
      setAction("Login");
    } else {
      setAction("Sign Up");
    }
  };

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="head">
          <div className="text">{action}</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
          {action === "Login" ? null : (
            <div className="input">
              <i className="fa-solid fa-user"></i>
              <input
                type="text"
                placeholder="Name"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </div>
          )}
          <div className="input">
            <i className="fa-regular fa-envelope"></i>
            <input
              type="email"
              placeholder="Email@gmail.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className="input">
            <i className="fa-solid fa-key"></i>
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
        </div>
        {action === "Sign Up" ? null : (
          <div className="forgot-password">
            Forgot password? <span>Click here</span>{" "}
          </div>
        )}
        <div className="submit-container">
          <div
            className={action === "Login" ? "submit gray" : "submit"}
            onClick={(e) => setAction("Sign Up")}
          >
            Sign Up
          </div>
          <div
            className={action === "Sign Up" ? "submit gray" : "submit"}
            onClick={(e) => setAction("Login")}
          >
            Login
          </div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default TsetseEdit;
