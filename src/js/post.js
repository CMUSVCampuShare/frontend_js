import React, { useState, useEffect } from 'react';
import '../css/post.css';

const PostWall = () => {
  const [posts, setPosts] = useState([]);
  const [newPostData, setNewPostData] = useState({
    title: '',
    from: '',
    to: '',
    details: '',
    type: 'Ride',
    noOfSeats: 0,
    status: 'Ongoing',
    timestamp: new Date().toString(),
    comments: [],
  });

  // TO DO: Fetch posts from Springboot API
  useEffect(() => {
    // REMOVE: Placeholder post to see how the post looks
    const fetchedPosts = [
      {
        postId: '1',
        userId: 'user123',
        title: 'Sample Title',
        from: 'Location A',
        to: 'Location B',
        details: 'Sample details',
        type: 'Ride',
        noOfSeats: 3,
        status: 'Ongoing',
        timestamp: new Date().toString(),
        comments: [],
      },
    ];

    // TO DO: Update state with fetched posts
    setPosts(fetchedPosts);
  }, []);

  const Post = ({ post }) => {
    const [commentText, setCommentText] = useState('');

    const handleAddComment = (postId) => {
      const updatedPosts = posts.map((p) => {
        if (p.postId === postId) {
          const updatedPost = { ...p };
          updatedPost.comments.push({ text: commentText, timestamp: new Date().toString() });
          return updatedPost;
        }
        return p;
      });

      setPosts(updatedPosts);
      setCommentText('');
    };

    return (
      <div className="post">
        <h2>{post.title}</h2>
        <p>From: {post.from}</p>
        <p>To: {post.to}</p>
        <p>Details: {post.details}</p>
        <p>Type: {post.type}</p>
        <p>No of Seats: {post.noOfSeats}</p>
        <p>Status: {post.status}</p>
        <p>Timestamp: {post.timestamp}</p>
        <div className="comments">
          {post.comments.map((comment, index) => (
            <p key={index}>{comment.text}</p>
          ))}
          <div>
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button onClick={() => handleAddComment(post.postId)}>Comment</button>
          </div>
        </div>
      </div>
    );
  };

  const handleCreatePost = () => {
    const updatedPosts = [
      ...posts,
      {
        ...newPostData,
        postId: (posts.length + 1).toString(),
        comments: [],
      },
    ];
    setPosts(updatedPosts);
    setNewPostData({
      title: '',
      from: '',
      to: '',
      details: '',
      type: '',
      noOfSeats: 0,
      status: 'Ongoing',
      timestamp: new Date().toString(),
      comments: [],
    });
  };

  return (
    <div className="post-wall">
      <h1>Post Wall</h1>
      <div className="create-post">
        <h2>Create New Post</h2>
        <input
          type="text"
          placeholder="Title"
          value={newPostData.title}
          onChange={(e) => setNewPostData({ ...newPostData, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="From"
          value={newPostData.from}
          onChange={(e) => setNewPostData({ ...newPostData, from: e.target.value })}
        />
        <input
          type="text"
          placeholder="To"
          value={newPostData.to}
          onChange={(e) => setNewPostData({ ...newPostData, to: e.target.value })}
        />
        <textarea
          placeholder="Details"
          value={newPostData.details}
          onChange={(e) => setNewPostData({ ...newPostData, details: e.target.value })}
        ></textarea>
        <select
          value={newPostData.type}
          onChange={(e) => setNewPostData({ ...newPostData, type: e.target.value })}
        >
          <option value="">Select Type</option>
          <option value="Ride">Ride</option>
          <option value="Lunch">Lunch</option>
          <option value="Food Pickup">Food Pickup</option>
        </select>
        <input
          type="number"
          placeholder="Number of Seats"
          value={newPostData.noOfSeats}
          onChange={(e) =>
            setNewPostData({ ...newPostData, noOfSeats: parseInt(e.target.value) || 0 })
          }
        />
        <select
          value={newPostData.status}
          onChange={(e) => setNewPostData({ ...newPostData, status: e.target.value })}
        >
          <option value="Ongoing">Ongoing</option>
          <option value="Complete">Complete</option>
          <option value="Canceled">Canceled</option>
        </select>
        <button onClick={handleCreatePost}>Create Post</button>
      </div>
      {posts.map((post) => (
        <Post key={post.postId} post={post} />
      ))}
    </div>
  );
};

export default PostWall;
