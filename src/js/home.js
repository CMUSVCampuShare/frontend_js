import logo from "../campushare.png";
import React, { useState, useEffect } from "react";

function Home() {
    const [showContent, setShowContent] = useState(true);

  return (
    <div className="">
      <header className={`App-header ${showContent ? "" : "hide-content"}`}>
        <img src={logo} alt="logo" />
        CampuShare
      </header>
    </div>
  );
}
export default Home;
