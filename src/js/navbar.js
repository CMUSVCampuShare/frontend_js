
import React from "react";
import { FaHome, FaComments, FaCar, FaUser } from "react-icons/fa";
import '../css/navbar.css';

function Navbar() {
  return (
    <div className="bottom-nav-bar">
     <FaHome className="icon" />
      <FaCar className="icon" />
      <FaComments className="icon" />
      <FaUser className="icon" />
    </div>
  );
}

export default Navbar;
