import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Admin.css";
import { config } from "../config";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [tsetseData, setTsetseData] = useState([]);

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
      await axios.delete(`/api/users/${userId}`);
      // After deleting the user, fetch updated user data
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  const editUser = async (userId) => {
    try {
      await axios.edit(`/api/users/${userId}`);
      // After deleting the user, fetch updated user data
      fetchUsers();
    } catch (error) {
      console.error("Error editing user:", error);
    }
  };

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
      await axios.delete(`/api/tsetse_fly_data/${dataId}`);
      // After deleting the data, fetch updated tsetse fly data
      fetchTsetseData();
    } catch (error) {
      console.error("Error deleting tsetse fly data:", error);
    }
  };
  const editTsetseData = async (dataId) => {
    try {
      await axios.edit(`/api/tsetse_fly_data/${dataId}`);
      // After deleting the data, fetch updated tsetse fly data
      fetchTsetseData();
    } catch (error) {
      console.error("Error editing tsetse fly data:", error);
    }
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
                <button className="button" onClick={() => deleteUser(users.id)}>
                  <i class="fa-solid fa-trash-can"></i>DELETE
                </button>
                <button className="button" onClick={() => editUser(users.id)}>
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
                  onClick={() => editTsetseData(data.id)}
                >
                  <i class="fa-solid fa-pen-to-square"></i>EDIT
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// const Admin = () => {
//   const [users, setUsers] = useState([]);
//   const [tsetseData, setTsetseData] = useState([]);

//   useEffect(() => {
//     // Fetch users and tsetse fly data from the backend when the component mounts
//     fetchUsers();
//     fetchTsetseData();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const response = await axios.get("/api/users");
//       setUsers(response.data);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   };

//   const fetchTsetseData = async () => {
//     try {
//       const response = await axios.get("/api/tsetse_fly_data");
//       setTsetseData(response.data);
//     } catch (error) {
//       console.error("Error fetching tsetse fly data:", error);
//     }
//   };

//   const deleteUser = async (userId) => {
//     try {
//       await axios.delete(`/api/users/${userId}`);
//       // After deleting the user, fetch updated user data
//       fetchUsers();
//     } catch (error) {
//       console.error("Error deleting user:", error);
//     }
//   };

//   const deleteTsetseData = async (dataId) => {
//     try {
//       await axios.delete(`/api/tsetse_fly_data/${dataId}`);
//       // After deleting the data, fetch updated tsetse fly data
//       fetchTsetseData();
//     } catch (error) {
//       console.error("Error deleting tsetse fly data:", error);
//     }
//   };

//   return (
//     <div>
//       <h2>Admin Panel</h2>

//       <h3>Users</h3>
//       <table>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Username</th>
//             <th>Password</th>
//             <th>Email</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((user) => (
//             <tr key={user.id}>
//               <td>{user.id}</td>
//               <td>{user.username}</td>
//               <td>{user.password}</td>
//               <td>{user.email}</td>
//               <td>
//                 <button onClick={() => deleteUser(user.id)}>Delete</button>
//               </td>
//               {/* <td>
//                 <button onClick={() => deleteUser(user.id)}>Delete</button>
//               </td> */}
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <h3>Tsetse Fly Data</h3>
//       <table>
//         <thead>
//           <tr>
//             <th>Username</th>
//             <th>Species</th>
//             <th>Latitude</th>
//             <th>Longitude</th>
//             <th>MonthCaptured</th>
//             <th>Country</th>
//             <th>CaptureMethod</th>
//             <th>ID</th>
//             <th>Images</th>
//             <th>Tagname</th>
//             <th>Disease</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {tsetseData.map((data) => (
//             <tr key={data.id}>
//               <td>{data.username}</td>
//               <td>{data.species}</td>
//               <td>{data.latitude}</td>
//               <td>{data.longitude}</td>
//               <td>{data.monthcaptured}</td>
//               <td>{data.country}</td>
//               <td>{data.capturemethod}</td>
//               <td>{data.id}</td>
//               <td>{data.images}</td>
//               <td>{data.tagname}</td>
//               <td>{data.disease}</td>
//               <td>
//                 <button onClick={() => deleteTsetseData(data.id)}>
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

export default Admin;
