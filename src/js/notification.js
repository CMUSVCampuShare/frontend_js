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
    userId: localStorage.getItem("userId"),
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
    Sock.onopen = () => {
      stompClient.connect({}, onConnected, onError);
    };
  };

  const onConnected = () => {
    setUserData({ ...userData, connected: true });
    stompClient.subscribe(
      "/user/" + userData.userId + "/notification",
      onNotification
    );
  };

  const onNotification = (payload) => {
    console.log(payload);
    var payloadData = JSON.parse(payload.body);

    var showMap = false;
    var forPassenger = false;
    if (
      payloadData.notification.includes("lat") &&
      payloadData.notification.includes("lng")
    ) {
      showMap = true;
    }
    if (payloadData.notification.includes("rejected")) {
      forPassenger = true;
    }
    const propsToPass = {
      message: payloadData.notification,
      showMap: showMap,
      forPassenger: forPassenger,
      notificationId: payloadData.notificationId,
    };
    navigate("/join", { state: propsToPass });
  };

  const onError = (err) => {
    console.log("Error", err);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notificationResponse = await fetch(
          `http://localhost:8088/notifications?userID=${localStorage.getItem(
            "userId"
          )}`
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
    const [notificationText, setNotificationText] = useState(
      notification.notification
    );

    useEffect(() => {
      if (
        notification.notification.includes("lat") &&
        notification.notification.includes("lng")
      ) {
        const notificationBody = JSON.parse(notification.notification);
        setNotificationText(notificationBody.message);
      }
    }, [notificationText]);

    const viewNotification = (notification) => {
      console.log(notification);
      console.log(notification.notification);
      var showMap = false;
      var forPassenger = false;
      if (
        notification.notification.includes("lat") &&
        notification.notification.includes("lng")
      ) {
        showMap = true;
      }
      if (notification.notification.includes("rejected")) {
        forPassenger = true;
      }
      const propsToPass = {
        message: notification.notification,
        showMap: showMap,
        forPassenger: forPassenger,
        notificationId: notification.notificationId,
      };
      navigate("/join", { state: propsToPass });
    };

    return (
      <div className="post">
        <p>{JSON.stringify(notificationText)}</p>
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
