import React, { useState, useEffect } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import { useNavigate } from "react-router-dom";
import "../css/post.css";
import { Box, Heading, UnorderedList, ListItem, Text } from "@chakra-ui/react";

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
    const actualNotification = payloadData.notification;

    var showMap = false;
    var forPassenger = false;
    if (
      actualNotification.notificationBody.includes("lat") &&
      actualNotification.notificationBody.includes("lng")
    ) {
      showMap = true;
    }
    if (actualNotification.notificationBody.includes("rejected")) {
      forPassenger = true;
    }
    const propsToPass = {
      message: actualNotification.notificationBody,
      showMap: showMap,
      forPassenger: forPassenger,
      notificationId: payloadData.notificationId,
      postId: actualNotification.postId,
      postTitle: actualNotification.postTitle,
      passengerId: actualNotification.passengerID,
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
    const [notificationText, setNotificationText] = useState(" ");

    useEffect(() => {
      const actualNotification = notification.notification;
      console.log(actualNotification);
      console.log(actualNotification.notificationBody);
      const notificationBody = actualNotification.notificationBody;
      if (
        notificationBody.includes("lat") &&
        notificationBody.includes("lng")
      ) {
        const innerNotificationBody = JSON.parse(notificationBody);
        setNotificationText(innerNotificationBody.message);
      } else {
        setNotificationText(notificationBody);
      }
    }, [notificationText]);

    const viewNotification = (notification) => {
      const actualNotification = notification.notification;
      console.log(actualNotification);
      console.log(actualNotification.notificationBody);
      const notificationBody = actualNotification.notificationBody;
      var showMap = false;
      var forPassenger = false;
      if (
        notificationBody.includes("lat") &&
        notificationBody.includes("lng")
      ) {
        showMap = true;
      }
      if (notificationBody.includes("rejected")) {
        forPassenger = true;
      }
      const propsToPass = {
        message: notificationBody,
        showMap: showMap,
        forPassenger: forPassenger,
        notificationId: notification.notificationId,
        postId: actualNotification.postId,
        postTitle: actualNotification.postTitle,
        passengerId: actualNotification.passengerID,
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
      <Heading as="h1" size="xl" className="sticky-header" mb={4}>
        Notification
      </Heading>
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
