import React, { useState } from "react";
import login_img from "../icons/login.svg";
import { Link } from "react-router-dom";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import "../css/login.css";


var stompClient = null;
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const loginUser = async () => {
    const loginData = {
      username: username,
      password: password
    };

    try {
      console.log(loginData);
      const response = await fetch('http://localhost:8081/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
        credentials: 'include'
      });

      if (response.ok) {
        const token = await response.text();
        localStorage.setItem('userId', token);
        console.log(token);
        connect(token)
      } else {
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const connect = (userID) => {
    //let Sock = new SockJS("http://localhost:8088/ws");
    //stompClient = over(Sock);
    //stompClient.connect({}, onConnected(userID), onError);
  };

  const onConnected = (userId) => {
    stompClient.subscribe(
      "/user/" + userId + "/notification",
      onPrivateMessage
    );
  };

   const onError = (err) => {
     console.log(err);
   };

   const onPrivateMessage = (payload) => {
     console.log(payload);
   };


  return (
    <div className="login-container">
      <img src={login_img} alt="Login Icon" />
      <h2>Login</h2>
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={loginUser}>Login</button>
      <p>
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </div>
  );
}

export default Login;
