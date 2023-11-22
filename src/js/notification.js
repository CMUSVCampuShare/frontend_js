import React, { useState, useEffect } from "react";
import "../css/post.css";

function NotificationList() {
  const [notifications, setnotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notificationResponse = await fetch(
          "http://localhost:8081/notifications?userID=127866655" // TODO change to loggedIn userID
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
      console.log("button clicked");
      window.open("/post", "_self");
    };

    return (
      <div className="post">
        <p>
          <b>Notification:</b> {notification.notificationId}
        </p>
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
