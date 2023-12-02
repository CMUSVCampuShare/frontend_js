import React from "react";
import logo from "../icons/login.svg";
import { Link } from "react-router-dom";
import "../css/register.css";

function Register() {
  return (
    <div className="login-container">
      {/*       <img src={logo} alt="Login Icon" />
       */}{" "}
      <h2>Sign Up</h2>
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input type="text" id="username" />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input type="text" id="email" />
      </div>
      <div className="form-group">
        <label htmlFor="address" autoComplete="off">
          Address
        </label>
        <input type="text" id="address" />
      </div>
      <div className="form-group">
        <label htmlFor="role">Role</label>
        <select id="role">
          <option value="driver">Driver</option>
          <option value="rider">Rider</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="entry" autoComplete="off">
          Entry Time
        </label>
        <input type="text" id="entry" />
      </div>
      <div className="form-group">
        <label htmlFor="exit" autoComplete="off">
          Exit Time
        </label>
        <input type="text" id="exit" />
      </div>
      {/* <div className="form-group">
        <label htmlFor="schedule">Upload Schedule (.pdf or .ics)</label>
        <input type="file" id="schedule" accept=".pdf, .ics" />
      </div> */}
      <button>Sign Up</button>
      <p>
        Already a user? <Link to="/login">Sign In</Link>
      </p>
    </div>
  );
}

export default Register;
