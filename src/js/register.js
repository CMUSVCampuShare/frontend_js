import React, { useState } from "react";
import logo from "../icons/login.svg";
import { Link } from "react-router-dom";
import "../css/register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("driver");
  const [entry, setEntry] = useState("");
  const [exit, setExit] = useState("");
  const [seats, setSeats] = useState();

  const handleSignUp = () => {
    // Email format validation
  const emailRegex = /^[^\s@]+@andrew\.cmu\.edu$/;
  const isValidEmail = emailRegex.test(email);

    // Number of seats validation
    const isValidSeats = seats > 0;

    if (!isValidEmail) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!isValidSeats) {
      alert("Number of seats must be greater than 0.");
      return;
    }

    // Additional logic for submitting the form
    // You can send the data to your server or perform other actions here
    console.log("Form submitted successfully!");
  };

  return (
    <div className="login-container">
      <h2>Sign Up</h2>
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
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="address">Address</label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="role">Role</label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="driver">Driver</option>
          <option value="rider">Rider</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="entry">Entry Time</label>
        <input
          type="text"
          id="entry"
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="exit">Exit Time</label>
        <input
          type="text"
          id="exit"
          value={exit}
          onChange={(e) => setExit(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="seats">Number of Seats</label>
        <input
          type="number"
          id="seats"
          value={seats}
          onChange={(e) => setSeats(Number(e.target.value))}
        />
      </div>
      <button onClick={handleSignUp}>Sign Up</button>
      <p>
        Already a user? <Link to="/login">Sign In</Link>
      </p>
    </div>
  );
}

export default Register;
