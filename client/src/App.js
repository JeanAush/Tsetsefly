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
        </Routes>
      </Router>
      {/* <Navbar/> */}
    </div>
  );
}

export default App;
