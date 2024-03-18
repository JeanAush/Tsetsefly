import React from "react";
// import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import MapPage from "./components/MapPage";
import HelpPage from "./components/HelpPage";
import AboutPage from "./components/Aboutpage";
import RegisterPage from "./components/RegisterPage";
import LoginSignup from "./components/LoginSignup";
import Admin from "./components/Admin";
import TsetseEdit from "./components/TsetseEdit";
import UserEdit from "./components/UserEdit";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/AboutPage" element={<AboutPage />} />
          <Route path="/HelpPage" element={<HelpPage />} />
          <Route path="MapPage" element={<MapPage />} />
          <Route path="/LoginSignup" element={<LoginSignup />} />
          <Route path="/Admin" element={<Admin />} />
          <Route path="/Admin/tsetse/edit/:dataId" element={<TsetseEdit />} />
          <Route path="/Admin/user/edit/:userId" element={<UserEdit />} />
        </Routes>
      </Router>
      {/* <Navbar/> */}
    </div>
  );
}

export default App;
