import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Admin.css";
import { config } from "../config";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [tsetseData, setTsetseData] = useState([]);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isTsetseModalOpen, setIsTsetseModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentTsetseData, setCurrentTsetseData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch users and tsetse fly data from the backend when the component mounts
    fetchUsers();
    fetchTsetseData();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${config.serverUrl}/api/users`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.post(`${config.serverUrl}/api/users/delete`, {
        userId,
      });
      // After deleting the user, fetch updated user data
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  // const editUser = async (userId) => {
  //   try {
  //     await axios.post(`/api/users/edit`, {
  //       userId,
  //     });
  //     // After deleting the user, fetch updated user data
  //     fetchUsers();
  //   } catch (error) {
  //     console.error("Error editing user:", error);
  //   }
  // };

  const fetchTsetseData = async () => {
    try {
      const response = await axios.get(
        `${config.serverUrl}/api/tsetse_fly_data`
      );
      setTsetseData(response.data);
    } catch (error) {
      console.error("Error fetching tsetse fly data:", error);
    }
  };

  const deleteTsetseData = async (dataId) => {
    try {
      await axios.post(`${config.serverUrl}/api/tsetse_fly_data/delete`, {
        dataId,
      });
      // After deleting the data, fetch updated tsetse fly data
      fetchTsetseData();
    } catch (error) {
      console.error("Error deleting tsetse fly data:", error);
    }
  };
  // const editTsetseData = async (dataId) => {
  //   try {
  //     await axios.edit(`/api/tsetse_fly_data/${dataId}`);
  //     // After deleting the data, fetch updated tsetse fly data
  //     fetchTsetseData();
  //   } catch (error) {
  //     console.error("Error editing tsetse fly data:", error);
  //   }
  // };

  const openUserModal = (user) => {
    setCurrentUser(user);
    setIsUserModalOpen(true);
  };

  const closeUserModal = () => {
    setIsUserModalOpen(false);
    setCurrentUser(null);
  };

  const openTsetseModal = (data) => {
    setCurrentTsetseData(data);
    setIsTsetseModalOpen(true);
  };

  const closeTsetseModal = () => {
    setIsTsetseModalOpen(false);
    setCurrentTsetseData(null);
  };

  return (
    <div>
      <h2>Admin Panel</h2>
      <h3>Users</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Password</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.password}</td>
              <td>{user.email}</td>
              <td>
                <button className="button" onClick={() => deleteUser(user.id)}>
                  <i class="fa-solid fa-trash-can"></i>DELETE
                </button>
                <button
                  className="button"
                  onClick={() => navigate(`user/edit/${user.id}`)}
                >
                  <i class="fa-solid fa-pen-to-square"></i>EDIT
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Tsetse Fly Data</h3>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Species</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>MonthCaptured</th>
            <th>Country</th>
            <th>CaptureMethod</th>
            <th>ID</th>
            <th>Images</th>
            <th>Tagname</th>
            <th>Disease</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tsetseData.map((data) => (
            <tr key={data.id}>
              <td>{data.username}</td>
              <td>{data.species}</td>
              <td>{data.latitude}</td>
              <td>{data.longitude}</td>
              <td>{data.monthcaptured}</td>
              <td>{data.country}</td>
              <td>{data.capturemethod}</td>
              <td>{data.id}</td>
              <td>{data.images}</td>
              <td>{data.tagname}</td>
              <td>{data.disease}</td>
              <td>
                <button
                  className="button"
                  onClick={() => deleteTsetseData(data.id)}
                >
                  <i class="fa-solid fa-trash-can"></i>DELETE
                </button>
                <button
                  className="button"
                  onClick={() => navigate(`tsetse/edit/${data.id}`)}
                >
                  <i class="fa-solid fa-pen-to-square"></i>EDIT
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isUserModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeUserModal}>
              &times;
            </span>
            <h2>Edit User</h2>
            {/* Form to edit user. Use currentUser for initial values */}
          </div>
        </div>
      )}
      {isTsetseModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeTsetseModal}>
              &times;
            </span>
            <h2>Edit Tsetse Fly Data</h2>
            {/* Form to edit tsetse fly data. Use currentTsetseData for initial values */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
