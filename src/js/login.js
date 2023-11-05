import React from "react";
import login_img from "../icons/login.svg";
import { Link } from "react-router-dom";
import "../css/login.css";


function Login() {
  return (
    <div className="login-container">
      <img src={login_img} alt="Login Icon" />
      <h2>Login</h2>
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input type="text" id="username" />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" />
      </div>
      <button>Login</button>
      <p>
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </div>
  );
}

export default Login;
