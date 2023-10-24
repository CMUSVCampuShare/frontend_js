import React, { useState } from "react";
import "../css/post.css";

function Post({ author, message, availability, comments }) {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="post-container">
      <div className="post-content">
        <div className="post-author">{author}</div>
        <div className="post-message">{message}</div>

        <div className="post-join-section">
          <button
            className="comment-post-button"
            onClick={() => setShowComments(!showComments)}
          >
            🗨️
          </button>

          <div className={`comments-dropdown ${showComments ? "active" : ""}`}>
            {comments.map((comment, index) => (
              <div key={index} className="comment-item">
                {comment}
              </div>
            ))}
          </div>

          <div className="post-availability">{availability}</div>
          <button className="join-ride-button">Join Ride</button>
        </div>
      </div>
    </div>
  );
}

function Posts() {
  const postData = [
    {
      author: "ANDREW",
      message:
        "Hi! I'll be riding to campus at 11am. Join my ride by clicking the button below!",
      availability: "2/5",
      comments: ["Great! See you then.", "Is there still a spot left?"],
    },
    {
      author: "EMILY",
      message: "Riding to the downtown library at 1pm. Anyone interested?",
      availability: "3/4",
      comments: ["Sounds good!", "Count me in!"],
    },
  ];

  return (
    <div className="posts-container">
      {postData.map((post, index) => (
        <Post
          key={index}
          author={post.author}
          message={post.message}
          availability={post.availability}
          comments={post.comments}
        />
      ))}
    </div>
  );
}

export default Posts;
