import React, { useState, useEffect } from "react";
import logo from "./campushare.png";
import Navbar from "./js/navbar";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  const [showContent, setShowContent] = useState(true);

  // Use useEffect to hide the content after a delay
  useEffect(() => {
    const delay = 3000; // 3000 milliseconds (3 seconds)

    const timer = setTimeout(() => {
      setShowContent(false);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <div className="App">
        <header className={`App-header ${showContent ? "" : "hide-content"}`}>
          <img src={logo} className="" alt="logo" />
          CampuShare
        </header>
        <Navbar></Navbar>
      </div>
    </>
  );
}

export default App;
