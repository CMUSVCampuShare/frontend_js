import React from "react";
import "../css/join.css"; // Make sure to create a separate CSS file for styles

const Join = () => {
  // Placeholder function for button click handlers
  const handleApprove = () => {
    console.log("Trip approved");
  };

  const handleReject = () => {
    console.log("Trip rejected");
  };

  // Variables for passenger name and trip time
  const passengerName = "Passenger Name Placeholder";
  const tripTimeIncrease = "5"; // in minutes

  return (
    <div className="join-request-container">
      <div className="header">
        <h1>Join Request</h1>
      </div>
      <div className="request-info">
        <div className="label">Request by:</div>
        <div className="passenger-name">{passengerName}</div>
      </div>
      <div className="map-placeholder">
        {/* Placeholder for the map */}
        Map will be displayed here.
      </div>
      <div className="trip-info">
        Trip Time increased by {tripTimeIncrease} mins
      </div>
      <div className="actions">
        <button className="button approve" onClick={handleApprove}>
          Approve
        </button>
        <button className="button reject" onClick={handleReject}>
          Reject
        </button>
      </div>
    </div>
  );
};

export default Join;
