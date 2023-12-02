import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import Routes
import logo from "./campushare.png";
import Navbar from "./js/navbar";
import Home from "./js/home";
import Chat from "./js/chat";
import Ride from "./js/ride";
import Profile from "./js/profile";
import Login from "./js/login";
import Register from "./js/register";
import Post from "./js/post";
import Join from "./js/join";
import Popup from "./js/popup";
import "./App.css";

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
    <Router>
      <div className="App">

   


        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/ride" element={<Popup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post" element={<Post />} />
          <Route path="/join" element={<Join />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
