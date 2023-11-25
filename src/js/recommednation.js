import React, { useState, useEffect } from "react";

const Recommendation = ({ userId }) => {
  const [topPosts, setTopPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopPostsForUser = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8080/recommendations/${userId}/top-posts`
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

  if (isLoading) {
    return <div>Loading top posts...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="recommendation-page">
      <h1>Top Recommendations for You</h1>
      {topPosts.length > 0 ? (
        <ul>
          {topPosts.map((post) => (
            <li key={post.postId}>
              <h2>{post.title}</h2>
              <p>{post.details}</p>
              {/* Additional post details can be added here */}
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
