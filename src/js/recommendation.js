import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Flex,
  Box,
  Heading,
  UnorderedList,
  ListItem,
  Text,
} from "@chakra-ui/react";
import "../css/recommendation.css";
import { over } from "stompjs";
import SockJS from "sockjs-client";

var stompClient = null;
let userIdStored = localStorage.getItem("userId");
let tokenStored = localStorage.getItem("jwt");

const Recommendation = ({}) => {
  const [topPosts, setTopPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    userIdStored = localStorage.getItem("userId");
    tokenStored = localStorage.getItem("jwt");

    const fetchTopPostsForUser = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8080/recommendations/${userIdStored}/top-posts`,
          {
            headers: {
              Authorization: `Bearer ${tokenStored}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Could not fetch top posts");
        }
        const data = await response.json();
        setTopPosts(data);
      } catch (error) {
        setError(error.message);
      }
      setIsLoading(false);
    };

    fetchTopPostsForUser();
  }, [userIdStored]);

  const navigate = useNavigate();
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

  return (
    <Box p={5} width="100%" maxW="1200px" m="auto">
      <Flex justifyContent="center">
        <Heading as="h1" size="xl" mb={4}>
          Recommendations
        </Heading>
      </Flex>
      {isLoading ? (
        <Text>Loading top posts...</Text>
      ) : error ? (
        <Text>Error: {error}</Text>
      ) : topPosts.length > 0 ? (
        <UnorderedList styleType="none" spacing={3}>
          {topPosts.map((post) => (
            <ListItem
              key={post.postId}
              p={3}
              borderWidth="1px"
              borderRadius="2xl" // Increased border radius for more rounded corners
              width="100%" // Adjust width as needed, you can also use maxWidth
              m="auto" // Centers the card in the list
              boxShadow="lg" // Optional: adds a shadow to your cards for better aesthetics
            >
              <Heading as="h2" size="md">
                {post.title}
              </Heading>
              <Text textAlign="left">From: {post.from}</Text>
              <Text textAlign="left">To: {post.to}</Text>
              <Text textAlign="left">{post.details}</Text>
              <Text textAlign="left">Type: {post.type}</Text>
              <Text textAlign="left">Seats: {post.noOfSeats}</Text>
              <Text textAlign="left">Status: {post.status}</Text>
              <Text textAlign="left">Posted: {post.timestamp}</Text>
            </ListItem>
          ))}
        </UnorderedList>
      ) : (
        <Text>No recommendations available. Check back later!</Text>
      )}
    </Box>
  );
};

export default Recommendation;
