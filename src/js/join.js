import React from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import "../css/join.css"; // Make sure to create a separate CSS file for styles

const Join = () => {
  const location = useLocation();
  const passedMessage = location.state;
  const showMap = passedMessage.showMap;
  console.log("passed message");
  console.log(passedMessage);
  // Placeholder function for button click handlers
  const handleApprove = () => {
    console.log("Trip approved");
    handleDeleteNotification(passedMessage.notificationId);
  };

  const handleReject = () => {
    console.log("Trip rejected");
    handleDeleteNotification(passedMessage.notificationId);
  };

  const handleDeleteNotification = (notificationId) => {
    fetch(`http://localhost:8088/notifications/${notificationId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          console.log("Sucessfully deleted Notification!");
        }
      })
      .catch((error) => console.error("Error deleting notification:", error));
  };
  const tripTimeIncrease = "5"; // in minutes

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "",
  });
  const center = useMemo(() => ({ lat: 37.7749, lng: -122.4194 }), []);
  console.log(isLoaded);
  return (
    <div className="join-request-container">
      <div className="header">
        <h1>Join Request</h1>
      </div>
      <div className="request-info">
        <div className="label">{passedMessage.message}</div>
      </div>
      {showMap ? (
        <div>
          <div>
            {!isLoaded ? (
              <h1>Loading...</h1>
            ) : (
              <GoogleMap
                mapContainerClassName="map-placeholder"
                center={center}
                zoom={15}
              >
                <Marker position={{ lat: 37.7749, lng: -122.4194 }} />
              </GoogleMap>
            )}
          </div>
          <div className="trip-info">
            Trip Time increased by {tripTimeIncrease} mins
          </div>
        </div>
      ) : (
        <div></div>
      )}
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
