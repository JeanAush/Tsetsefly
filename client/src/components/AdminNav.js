import React from "react";
import { Link } from "react-router-dom";
import { AdminMenu } from "./AdminMenu";
import "./Navbar.css";

const AdminNav = () => {
  return (
    <nav className="NavbarItems">
      <h1 className="navbar-logo">TseTse Control</h1>
      <div className="menu-icons"></div>
      <ul className="nav-menu">
        {AdminMenu.map((item, index) => {
          return (
            <li key={index}>
              {item.isButton ? ( // Check if item is a button
                <Link to={item.url} className="nav-links">
                  {item.title}
                </Link>
              ) : (
                <a href={item.url} className={item.cName}>
                  <i className={item.icon}></i>
                  {item.title}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default AdminNav;
