import React from "react";
import { Link, Outlet } from "react-router-dom";
import "../styles/Dashboard.css"; // Import your CSS as needed

const Layout = () => {
  return (
    <div className="container">
      {/* Topbar */}
      <div className="topbar">
        <div className="logo">
          <h3>PTBOX Challenge</h3>
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/" className="active">Run New Scan</Link>
          </li>
          <li>
            <Link to="/scans">All Scans</Link>
          </li>
        </ul>
      </div>
      
      {/* Main Content Area */}
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
