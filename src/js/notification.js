import React, { useState, useEffect } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import { useNavigate } from "react-router-dom";
import "../css/post.css";

const userIdStored = localStorage.getItem("userId");
var stompClient = null;

function NotificationList() {
  const navigate = useNavigate();
  const [notifications, setnotifications] = useState([]);

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
      var showMap = false
      if (notification.notification.includes("lat") && notification.notification.includes("lng")) {
        showMap = true
      }
      const propsToPass = { message: notification.notification, showMap: showMap, notificationId: notification.notificationId };
      navigate("/join", { state: propsToPass });
    };

    return (
      <div className="post">
        <p>{notification.notificationId}</p>
        <button onClick={() => viewNotification(notification)}>View</button>
      </div>
    );
  };

  const connect = () => {
    let Sock = new SockJS("http://localhost:8088/ws");
    stompClient = over(Sock);
    //stompClient.connect({}, onConnected(), onError);
  };

  const onConnected = () => {
    stompClient.subscribe(
      "/user/" + userIdStored + "/notification",
      onPrivateMessage
    );
  };

  const onError = (err) => {
    console.log(err);
  };

  const onPrivateMessage = (payload) => {
    console.log(payload);
    var result = window.confirm("Do you want to do this?");
    console.log(payload);
    if (result) {
      console.log("ok");
    } else {
      console.log("cancel");
    }
  };

  connect();

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
