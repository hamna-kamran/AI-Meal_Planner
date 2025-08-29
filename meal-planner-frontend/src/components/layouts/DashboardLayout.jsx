// src/components/layouts/DashboardLayout.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaBars,
  FaHome,
  FaUser,
  FaClipboardList,
  FaCog,
  FaSignOutAlt,
  FaBell,
  FaSearch,
} from "react-icons/fa";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [username, setUsername] = useState("User");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.name) {
      setUsername(storedUser.name);
    }
  }, []); // Runs once on mount

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="d-flex" style={{ height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <div
        className="text-white position-fixed h-100 p-3"
        style={{
          background: "linear-gradient(180deg, #343a40, #212529)",
          width: isSidebarOpen ? "230px" : "70px",
          transition: "width 0.3s",
          overflowX: "hidden",
        }}
      >
        <h5
  className="text-center mb-4 fw-bold"
  style={{
    whiteSpace: "nowrap",
    opacity: isSidebarOpen ? 1 : 0,
    transition: "opacity 0.3s",
    color: "white",   // 👈 this makes text white
  }}
>
  🍽 Meal Planner
</h5>


        <ul className="nav flex-column text-white">
  <SidebarItem to="/dashboard" icon={<FaHome color="white" />} label="Dashboard" open={isSidebarOpen} />
  <SidebarItem to="/recipes" icon={<FaClipboardList color="white" />} label="Recipes" open={isSidebarOpen} />
  <SidebarItem to="/profile" icon={<FaUser color="white" />} label="Profile" open={isSidebarOpen} />
  <SidebarItem to="/settings" icon={<FaCog color="white" />} label="Settings" open={isSidebarOpen} />
  <SidebarItem to="/logout" icon={<FaSignOutAlt color="white" />} label="Logout" open={isSidebarOpen} />
</ul>

      </div>

      {/* Main Content */}
      <div
        className="flex-grow-1"
        style={{
          marginLeft: isSidebarOpen ? "230px" : "70px",
          transition: "margin-left 0.3s",
          width: "100%",
        }}
      >
        {/* Navbar */}
        <nav className="navbar navbar-light bg-white shadow-sm px-3 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <button
              className="btn btn-link text-dark me-3"
              onClick={toggleSidebar}
              style={{ border: "none" }}
            >
              <FaBars size={22} />
            </button>
            <div className="input-group" style={{ maxWidth: "300px" }}>
              <span className="input-group-text bg-light border-0">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control border-0 bg-light"
                placeholder="Search..."
              />
            </div>
          </div>

          <div className="d-flex align-items-center">
            <button className="btn btn-link text-dark position-relative me-3">
              <FaBell size={20} />
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: "0.6rem" }}
              >
                3
              </span>
            </button>
            <div className="dropdown">
              <button
                className="btn btn-light dropdown-toggle"
                id="profileDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <FaUser className="me-1" /> {username}
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="profileDropdown"
              >
                <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                <li><Link className="dropdown-item" to="/settings">Settings</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><Link className="dropdown-item text-danger" to="/logout">Logout</Link></li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <div className="p-4" style={{ background: "#f4f6f9", minHeight: "calc(100vh - 56px)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ to, icon, label, open }) {
  return (
    <li className="nav-item mb-2">
      <Link to={to} className="nav-link text-white d-flex align-items-center" title={!open ? label : ""}>
        <span className="me-2">{icon}</span>
        {open && label}
      </Link>
    </li>
  );
}
