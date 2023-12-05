import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import Routes
import { ChakraProvider } from "@chakra-ui/react";
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
import Payment from "./js/payment";
import Recommendation from "./js/recommendation";
import "./App.css";
import NotificationList from "./js/notification";

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
    <ChakraProvider>
      {" "}
      {/* 2. Wrap your app with ChakraProvider */}
      <Router>
        <div className="App">
          {/*  <header className={`App-header ${showContent ? "" : "hide-content"}`}>
          <img src={logo} alt="logo" />
          CampuShare
        </header> */}
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/ride" element={<Popup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/post" element={<Post />} />
            <Route path="/join" element={<Join />} />
            <Route path="/notifications" element={<NotificationList />} />
            <Route path="/recommendation" element={<Recommendation />} />
            <Route path="/payment" element={<Payment />} />
          </Routes>
        </div>
      </Router>
    </ChakraProvider>
  );
}

export default App;
