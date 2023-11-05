import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaComments, FaCar, FaUser } from "react-icons/fa";
import "../css/navbar.css";

function Navbar() {
  return (
    <div className="bottom-nav-bar">
      <Link to="/">
        <FaHome className="icon" />
      </Link>
      <Link to="/chat">
        <FaComments className="icon" />
      </Link>
      <Link to="/ride">
        <FaCar className="icon" />
      </Link>
      <Link to="/profile">
        <FaUser className="icon" />
      </Link>
    </div>
  );
}

export default Navbar;
