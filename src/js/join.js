import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import "../css/join.css"; // Make sure to create a separate CSS file for styles

const Join = () => {
  // Placeholder function for button click handlers
  const handleApprove = () => {
    console.log("Trip approved");
  };

  const handleReject = () => {
    console.log("Trip rejected");
  };

  // Variables for passenger name, trip time and coordinates
  const passengerName = "Passenger Name Placeholder";
  const tripTimeIncrease = "5"; // in minutes
  const markerPosition = { lat: 37.7749, lng: -122.4194 };

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
        <LoadScript googleMapsApiKey="AIzaSyALoxyWDM0Ut92xSQyZyVS_wVDMXV9SUPg">
          <GoogleMap
            center={markerPosition}
            zoom={12} // You can adjust the zoom level
          >
            <Marker position={markerPosition} />
          </GoogleMap>
        </LoadScript>
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
