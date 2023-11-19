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
  const [editMode, setEditMode] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  // // TO DO: Fetch posts from Springboot API
  // useEffect(() => {
  //   // REMOVE: Placeholder post to see how the post looks
  //   const fetchedPosts = [
  //     {
  //       postId: '1',
  //       userId: 'user123',
  //       title: 'Sample Title',
  //       from: 'Location A',
  //       to: 'Location B',
  //       details: 'Sample details',
  //       type: 'Ride',
  //       noOfSeats: 3,
  //       status: 'Ongoing',
  //       timestamp: new Date().toString(),
  //       comments: [],
  //     },
  //   ];

  //   // TO DO: Update state with fetched posts
  //   setPosts(fetchedPosts);
  // }, []);

  useEffect(() => {
    fetch('http://localhost:8082/posts')
      .then(response => response.json())
      .then(data => setPosts(data))
      .catch(error => console.error('Error fetching posts:', error));
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

    const handleEditPost = (post) => {
      setEditMode(true);
      setEditingPost(post);
      setNewPostData({
        title: post.title,
        from: post.from,
        to: post.to,
        details: post.details,
        type: post.type,
        noOfSeats: post.noOfSeats,
        status: post.status,
        timestamp: post.timestamp,
        comments: post.comments,
      });
    };

    const handleUpdatePost = () => {
      const updatedPosts = posts.map((p) =>
        p.postId === editingPost.postId ? { ...newPostData, postId: p.postId } : p
      );
      setPosts(updatedPosts);
      setEditMode(false);
      setEditingPost(null);
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
      <div className="post">
        {editMode && editingPost.postId === post.postId ? (
          <div className="update-post">
            <h2>Update Existing Post</h2>
            <input
              type="text"
              placeholder="Edit Title"
              value={newPostData.title}
              onChange={(e) => setNewPostData({ ...newPostData, title: e.target.value })}
            />
            <input
              type="text"
              placeholder="Edit From"
              value={newPostData.from}
              onChange={(e) => setNewPostData({ ...newPostData, from: e.target.value })}
            />
            <input
              type="text"
              placeholder="Edit Deatils"
              value={newPostData.details}
              onChange={(e) => setNewPostData({ ...newPostData, from: e.target.value })}
            />
            <p>{post.type}</p>
            <input
              type="number"
              placeholder="Edit Number of Seats"
              value={newPostData.noOfSeats}
              onChange={(e) => setNewPostData({ ...newPostData, from: e.target.value })}
            />
            <select
              value={newPostData.status}
              onChange={(e) => setNewPostData({ ...newPostData, status: e.target.value })}
            >
              <option value="Ongoing">Ongoing</option>
              <option value="Complete">Complete</option>
              <option value="Canceled">Canceled</option>
            </select>
            <p>{post.timestamp}</p>
            <button onClick={handleUpdatePost}>Save Updates</button>
          </div>
        ) : (
          <div>
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
                <button>Join</button>
                <button onClick={() => handleEditPost(post)}>Edit Post</button>
                <button onClick={() => handleDeletePost(post.postId)}>Delete Post</button>
              </div>
            </div>
          </div>
        )}
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

  // const handleDeletePost = (postId) => {
  //   const updatedPosts = posts.filter((p) => p.postId !== postId);
  //   setPosts(updatedPosts);
  // };

  const handleDeletePost = (postId) => {
    fetch(`http://localhost:8082/posts/${postId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          const updatedPosts = posts.filter((p) => p.postId !== postId);
          setPosts(updatedPosts);
        } else {
          throw new Error('Failed to delete post');
        }
      })
      .catch(error => console.error('Error deleting post:', error));
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
