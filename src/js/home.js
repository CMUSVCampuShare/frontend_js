import logo from "../campushare.png";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Home() {
    const [showContent, setShowContent] = useState(true);

  return (
    <div className="">
      <header className={`App-header ${showContent ? "" : "hide-content"}`}>
        <img src={logo} alt="logo" />
        CampuShare
      </header>
      <br></br>
     <Link to="/login"><button>Get Started</button></Link>
    </div>
  );
}
export default Home;
