import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserEdit.css";
import { config } from "../config";
import { useParams } from "react-router-dom";

function UserEdit() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [user, setUser] = useState();
  const params = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${config.serverUrl}/api/users/edit/${params.userId}`, {
        ...formData,
      });
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  useEffect(async () => {
    try {
      const response = await axios.get(
        `${config.serverUrl}/api/users/${params.userId}`
      );
      setUser(response.data[0]);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="head">
          <div className="text">Update User</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
          <div className="input">
            <i className="fa-solid fa-user"></i>
            <input
              type="text"
              placeholder="Name"
              value={formData.username || user?.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>
          <div className="input">
            <i className="fa-regular fa-envelope"></i>
            <input
              type="email"
              placeholder="Email@gmail.com"
              value={formData.email || user?.email}
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
              value={formData.password || ""}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
        </div>
        <div className="submit-container">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default UserEdit;
