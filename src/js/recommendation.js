import React, { useState, useEffect } from "react";
import {
  Flex,
  Box,
  Heading,
  UnorderedList,
  ListItem,
  Text,
} from "@chakra-ui/react";
import "../css/recommendation.css";

const createMockRecommendations = () => {
  return [
    {
      postId: "1",
      title: "Ride to the Beach",
      from: "City Center",
      to: "Sunny Beach",
      details: "Looking for a fun ride to the beach this weekend.",
      type: "Leisure",
      noOfSeats: "4",
      status: "Open",
      timestamp: "2023-04-01 10:00",
    },
    {
      postId: "2",
      title: "Daily Commute to Office",
      from: "Suburbia",
      to: "Downtown",
      details: "Join me for a daily carpool to the office.",
      type: "Carpool",
      noOfSeats: "3",
      status: "Full",
      timestamp: "2023-04-02 08:00",
    },
    // Add more mock posts as needed
  ];
};

const Recommendation = ({ userId }) => {
  const [topPosts, setTopPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopPostsForUser = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8083/recommendations/${userId}/top-posts`
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
  }, [userId]);

  return (
    <Box p={5}>
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
              borderRadius="lg"
            >
              <Heading as="h2" size="md">
                {post.title}
              </Heading>
              <Text>From: {post.from}</Text>
              <Text>To: {post.to}</Text>
              <Text>{post.details}</Text>
              <Text>Type: {post.type}</Text>
              <Text>Seats: {post.noOfSeats}</Text>
              <Text>Status: {post.status}</Text>
              <Text>Posted: {post.timestamp}</Text>
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
