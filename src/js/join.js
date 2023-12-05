import React, { useEffect, useState } from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { MarkerF } from "@react-google-maps/api";
import "../css/join.css"; // Make sure to create a separate CSS file for styles

const tokenStored = localStorage.getItem("jwt");

const Join = () => {
  const location = useLocation();
  const passedMessage = location.state;
  const showMap = passedMessage.showMap;
  const showForPassenger = passedMessage.forPassenger;
  const postTitle = passedMessage.postTitle;
  const postId = passedMessage.postId;
  const passengerId = passedMessage.passengerId;

  const navigate = useNavigate();

  const [message, setMessage] = useState(passedMessage.message);
  const [tripTime, setTripTime] = useState(0);
  const [longitude, setLongitude] = useState(0.0);
  const [latitude, setLatitude] = useState(0.0);

  console.log("passed message");
  console.log(passedMessage);

  useEffect(() => {
    if (
      passedMessage.message.includes("lat") &&
      passedMessage.message.includes("lng")
    ) {
      const messageBody = JSON.parse(passedMessage.message);
      setMessage(messageBody.message);
      setTripTime(messageBody.geoLocationData.addedTime);
      setLongitude(messageBody.geoLocationData.pin.lng);
      setLatitude(messageBody.geoLocationData.pin.lat);
    }
  }, [message, tripTime, longitude, latitude]);

  const handleApprove = () => {
    console.log("Trip approved");
    console.log("post title: " + postTitle);
    console.log("post id: " + postId);
    console.log("passenger id: " + passengerId);

    const url = "http://localhost:8080/api/rides/approveJoinRequest";

    const requestBody = {
      rideId: postId,
      passengerId: passengerId,
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenStored,
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to approve join request!");
        }
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      })
      .finally(() => {
        handleDeleteNotification();
      });
  };

  const handleReject = () => {
    console.log("Trip rejected");
    console.log("post title: " + postTitle);
    console.log("post id: " + postId);
    console.log("passenger id: " + passengerId);
    const url = "http://localhost:8080/api/rides/rejectJoinRequest";

    const requestBody = {
      rideId: postId,
      rideTitle: postTitle,
      passengerId: passengerId,
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenStored,
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to reject join request!");
        }
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      })
      .finally(() => {
        handleDeleteNotification();
      });
  };

  const handleDeleteNotification = () => {
    fetch(
      `http://localhost:8088/notifications/${passedMessage.notificationId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: tokenStored,
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          console.log("Sucessfully deleted Notification!");
          navigate("/notifications");
        }
      })
      .catch((error) => console.error("Error deleting notification:", error));
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyALoxyWDM0Ut92xSQyZyVS_wVDMXV9SUPg",
  });
  const center = useMemo(
    () => ({ lat: latitude, lng: longitude }),
    [longitude, latitude]
  );

  return (
    <div className="join-request-container">
      <div className="header">
        <h1>{message}</h1>
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
                <MarkerF className="marker" position={center} />
              </GoogleMap>
            )}
          </div>
          <div className="trip-info">
            Trip Time increased by {tripTime} mins
          </div>
        </div>
      ) : (
        <div></div>
      )}
      <div>
        {showForPassenger ? (
          <div className="actions">
            <button
              className="button approve"
              onClick={handleDeleteNotification}
            >
              OK
            </button>
          </div>
        ) : (
          <div className="actions">
            <button className="button approve" onClick={handleApprove}>
              Approve
            </button>
            <button className="button reject" onClick={handleReject}>
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Join;
