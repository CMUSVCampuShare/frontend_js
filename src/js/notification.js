import React, { useState, useEffect } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import { useNavigate } from "react-router-dom";
import "../css/post.css";

var stompClient = null;

function NotificationList() {
  const navigate = useNavigate();
  const [notifications, setnotifications] = useState([]);

  const [userData, setUserData] = useState({
    username: localStorage.getItem("userId"),
    connected: false,
  });

  useEffect(() => {
    const userIdStored = localStorage.getItem("userId");
    console.log("connecting");
    if (userIdStored) {
      connect();
    }
  }, []);

  const connect = () => {
    let Sock = new SockJS("http://localhost:8088/ws");
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    setUserData({ ...userData, connected: true });
    stompClient.subscribe(
      "/user/" + userData.username + "/notification",
      onNotification
    );
  };

  const onNotification = (payload) => {
    console.log(payload);
    var payloadData = JSON.parse(payload.body);

    var answer = window.confirm(
      "You have a new notification. Press ok to view!"
    );
    if (answer) {
      var showMap = false;
      if (
        payloadData.notification.includes("lat") &&
        payloadData.notification.includes("lng")
      ) {
        showMap = true;
      }
      const propsToPass = {
        message: payloadData.notification,
        showMap: showMap,
        notificationId: payloadData.notificationId,
      };
      navigate("/join", { state: propsToPass });
    } else {
      console.log("notification to be viewed later");
    }
  };

  const onError = (err) => {
    console.log(err);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notificationResponse = await fetch(
          "http://localhost:8088/notifications?userID=9f0de433-2a3e-4f9f-a03b-53fa6d795363" // TODO change to loggedIn userID
        );
        const notifications = await notificationResponse.json();
        console.log(notifications);
        setnotifications(notifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const Notification = ({ notification }) => {
    const viewNotification = (notification) => {
      console.log(notification);
      console.log(notification.notification);
      var showMap = false;
      if (
        notification.notification.includes("lat") &&
        notification.notification.includes("lng")
      ) {
        showMap = true;
      }
      const propsToPass = {
        message: notification.notification,
        showMap: showMap,
        notificationId: notification.notificationId,
      };
      navigate("/join", { state: propsToPass });
    };

    return (
      <div className="post">
        <p>{JSON.stringify(notification.notification)}</p>
        <button onClick={() => viewNotification(notification)}>View</button>
      </div>
    );
  };

  return (
    <div className="post-wall">
      <h1>Notifications</h1>
      {notifications.map((notification) => (
        <Notification
          key={notification.notificationId}
          notification={notification}
        />
      ))}
    </div>
  );
}
export default NotificationList;
