import React, { useState, useEffect } from "react";
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
  // const [topPosts, setTopPosts] = useState([]);
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
    <div className="recommendation-page">
      <h1 className="sticky-header">Top Recommendations for You</h1>
      {topPosts.length > 0 ? (
        <ul>
          {topPosts.map((post) => (
            <li key={post.postId}>
              <h2>{post.title}</h2>
              <p>From: {post.from}</p>
              <p>To: {post.to}</p>
              <p>{post.details}</p>
              <p>Type: {post.type}</p>
              <p>Seats: {post.noOfSeats}</p>
              <p>Status: {post.status}</p>
              <p>Posted: {post.timestamp}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recommendations available. Check back later!</p>
      )}
    </div>
  );
};

export default Recommendation;
