import React, { useState, useEffect } from "react";
import { Box, Heading, UnorderedList, ListItem, Text } from "@chakra-ui/react";
import "../css/recommendation.css";

const Recommendation = ({ userId }) => {
  const topPosts = [
    {
      postId: "1",
      title: "Sample Post 1",
      from: "Location A",
      to: "Location B",
      details: "Details of Sample Post 1",
      type: "Type 1",
      noOfSeats: 3,
      status: "ONGOING",
      timestamp: new Date().toString(),
    },
  ];
  //const [topPosts, setTopPosts] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchTopPostsForUser = async () => {
  //     setIsLoading(true);
  //     try {
  //       const response = await fetch(
  //         `http://localhost:8083/recommendations/user10/top-posts`
  //       );
  //       if (!response.ok) {
  //         throw new Error("Could not fetch top posts");
  //       }
  //       const data = await response.json();
  //       setTopPosts(data);
  //     } catch (error) {
  //       setError(error.message);
  //     }
  //     setIsLoading(false);
  //   };

  //   fetchTopPostsForUser();
  // }, [userId]);

  // if (isLoading) {
  //   return <div>Loading top posts...</div>;
  // }

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

  return (
    <Box className="recommendation-page" p={5} textAlign="left">
      <Heading as="h1" size="xl" className="sticky-header" mb={4}>
        Recommendations
      </Heading>
      {topPosts.length > 0 ? (
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
