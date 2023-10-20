import React, { useState } from "react";
import "../css/post.css";

function Post() {
  const [showComments, setShowComments] = useState(false);

  const comments = [
    "Great! See you then.",
    "Is there still a spot left?",
    "I might join too!",
  ];

  return (
    <div className="post-container">
      <div className="post-content">
        <div className="post-author">ANDREW</div>
        <div className="post-message">Hi! I'll be riding to campus at 11.</div>

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

          <div className="post-availability">2/5</div>
          <button className="join-ride-button">Join Ride</button>
        </div>
      </div>
    </div>
  );
}

export default Post;
