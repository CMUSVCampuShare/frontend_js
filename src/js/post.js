import React, { useState, useEffect } from "react";
import "../css/post.css";

const initialToPlaceholder = 'To';
const initialSeatsPlaceholder = 0;

const PostWall = () => {
  const [posts, setPosts] = useState([]);
  const [newPostData, setNewPostData] = useState({
    title: "",
    from: "",
    to: "",
    details: "",
    type: "RIDE",
    noOfSeats: 0,
    status: "ONGOING",
    timestamp: new Date().toString(),
    comments: [],
  });
  const [editMode, setEditMode] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    if (newPostData.type === 'FoodPickup') {
      setNewPostData({ ...newPostData, to: initialToPlaceholder, noOfSeats: initialSeatsPlaceholder });
    }

    const fetchPosts = async () => {
      try {
        const postsResponse = await fetch('http://localhost:8082/posts/active');
        const posts = await postsResponse.json();

        const fetchCommentPromises = posts.map(async (post) => {
          try {
            const commentResponse = await fetch(`http://localhost:8082/posts/${post.postId}/comments`);
            const comments = await commentResponse.json();
            console.log(comments);
            return { ...post, comments: comments || [] };
          } catch (error) {
            console.error(`Error fetching comments for post ${post.postId}:`, error);
            return { ...post, comments: [] };
          }
        });

        const updatedPosts = await Promise.all(fetchCommentPromises);
        setPosts(updatedPosts); // TODO : Why comments not appearing on post?
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [newPostData.type]);

  const Post = ({ post }) => {
    const [commentText, setCommentText] = useState("");

    const handleAddComment = (postId) => {
      const commentData = {
        postId: postId,
        comment: commentText,
      };

      fetch(`http://localhost:8082/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Failed to add comment");
          }
        })
        .then((createdComment) => {
          const updatedPosts = posts.map((p) => {
            if (p.postId === postId) {
              const updatedPost = { ...p };
              updatedPost.comments.push({ text: commentText });
              return updatedPost;
            }
            return p;
          });

          setPosts(updatedPosts);
          setCommentText("");
        })
        .catch((error) => console.error("Error adding comment:", error));
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
      const postDataForBackend = {
        userId: "15", // TO DO: Need to update to logged-in userId
        title: newPostData.title,
        from: newPostData.from,
        to: newPostData.to,
        details: newPostData.details,
        type: newPostData.type.toUpperCase(),
        noOfSeats: newPostData.noOfSeats || 0,
        status: newPostData.status.toUpperCase(),
      };

      fetch(`http://localhost:8082/posts/${editingPost.postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postDataForBackend),
      })
        .then((response) => {
          if (response.ok) {
            const updatedPosts = posts.map((p) =>
              p.postId === editingPost.postId
                ? { ...newPostData, postId: p.postId }
                : p
            );
            setPosts(updatedPosts);
            setEditMode(false);
            setEditingPost(null);
            setNewPostData({
              title: "",
              from: "",
              to: "",
              details: "",
              type: "",
              noOfSeats: 0,
              status: "ONGOING",
              timestamp: new Date().toString(),
              comments: [],
            });
          } else {
            throw new Error("Failed to update post");
          }
        })
        .catch((error) => console.error("Error updating post:", error));
    };

    const joinPost = (postId) => {
      const selectedPost = posts.find((post) => post.postId === postId);

      var url = "";
      switch (selectedPost.type) {
        case "RIDE":
          url = `http://localhost:8080/join?postID=${postId}`;
          break;
        default:
          url = `http://localhost:8080/request-food?postID=${postId}`;
          break;
      }
      const joinData = {
        driverID: selectedPost.userId,
        passengerID: "24190f52-f241-41b9-b623-fdc02c6b7cd2", // TO DO: Need to update to logged-in userId
      };

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(joinData),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Failed to send join request");
          }
        })
        .catch((error) => console.error("Error sending join request: ", error));
    };

    // TO DO : Check why it completes the edit form details to create form too!
    // TO DO : Use autocomplete for from and to
    return (
      <div className="post">
        {editMode && editingPost.postId === post.postId ? (
          <div className="update-post">
            <h2>Update Existing Post</h2>
            <input
              type="text"
              placeholder="Edit Title"
              value={newPostData.title}
              onChange={(e) =>
                setNewPostData({ ...newPostData, title: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Edit From"
              value={newPostData.from}
              onChange={(e) =>
                setNewPostData({ ...newPostData, from: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Edit to"
              value={newPostData.to}
              onChange={(e) =>
                setNewPostData({ ...newPostData, to: e.target.value })
              }
              disabled={post.type === 'FOODPICKUP'}
            />
            <input
              type="text"
              placeholder="Edit Deatils"
              value={newPostData.details}
              onChange={(e) =>
                setNewPostData({ ...newPostData, details: e.target.value })
              }
            />
            <p>{post.type}</p>
            <input
              type="number"
              placeholder="Edit Number of Seats"
              value={newPostData.noOfSeats}
              onChange={(e) =>
                setNewPostData({ ...newPostData, noOfSeats: e.target.value })
              }
              disabled={post.type === 'FOODPICKUP'}
            />
            <select
              value={newPostData.status}
              onChange={(e) =>
                setNewPostData({ ...newPostData, status: e.target.value })
              }
            >
              <option value="Ongoing">ONGOING</option>
              <option value="Complete">COMPLETE</option>
              <option value="Canceled">CANCELED</option>
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
                <button onClick={() => handleAddComment(post.postId)}>
                  Comment
                </button>
                <button onClick={() => joinPost(post.postId)}>Join</button>
                <button onClick={() => handleEditPost(post)}>Edit Post</button>
                <button onClick={() => handleDeletePost(post.postId)}>
                  Delete Post
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleCreatePost = () => {
    const newPostDataForBackend = {
      userId: "15", // TO DO: Need to update to logged-in userId
      title: newPostData.title,
      from: newPostData.from,
      to: newPostData.to,
      details: newPostData.details,
      type: newPostData.type.toUpperCase(),
      noOfSeats: newPostData.noOfSeats || 0,
      status: newPostData.status.toUpperCase(),
    };

    fetch("http://localhost:8082/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPostDataForBackend),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to create post");
        }
      })
      .then((createdPost) => {
        setPosts([...posts, createdPost]);
        setNewPostData({
          title: "",
          from: "",
          to: "",
          details: "",
          type: "",
          noOfSeats: 0,
          status: "Ongoing",
          timestamp: new Date().toString(),
          comments: [],
        });
      })
      .catch((error) => console.error("Error creating post:", error));
  };

  const handleDeletePost = (postId) => {
    fetch(`http://localhost:8082/posts/${postId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          const updatedPosts = posts.filter((p) => p.postId !== postId);
          setPosts(updatedPosts);
        } else {
          throw new Error("Failed to delete post");
        }
      })
      .catch((error) => console.error("Error deleting post:", error));
  };

  // TO DO : Use autocomplete for from and to

  return (
    <div className="post-wall">
      <h1>Post Wall</h1>
      <div className="create-post">
        <h2>Create New Post</h2>
        <input
          type="text"
          placeholder="Title"
          value={newPostData.title}
          onChange={(e) =>
            setNewPostData({ ...newPostData, title: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="From"
          value={newPostData.from}
          onChange={(e) =>
            setNewPostData({ ...newPostData, from: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="To"
          value={newPostData.to}
          onChange={(e) =>
            setNewPostData({ ...newPostData, to: e.target.value })
          }
          disabled={newPostData.type === 'FoodPickup'}
        />
        <textarea
          placeholder="Details"
          value={newPostData.details}
          onChange={(e) =>
            setNewPostData({ ...newPostData, details: e.target.value })
          }
        ></textarea>
        <select
          value={newPostData.type}
          onChange={(e) =>
            setNewPostData({ ...newPostData, type: e.target.value })
          }
        >
          <option value="">Select Type</option>
          <option value="Ride">RIDE</option>
          <option value="Lunch">LUNCH</option>
          <option value="FoodPickup">FOODPICKUP</option>
        </select>
        <input
          type="number"
          placeholder="Number of Seats"
          value={newPostData.noOfSeats}
          onChange={(e) =>
            setNewPostData({
              ...newPostData,
              noOfSeats: parseInt(e.target.value) || 0,
            })
          }
          disabled={newPostData.type === 'FoodPickup'}
        />
        <select
          value={newPostData.status}
          onChange={(e) =>
            setNewPostData({ ...newPostData, status: e.target.value })
          }
        >
          <option value="">Select Status</option>
          <option value="Ongoing">ONGOING</option>
          <option value="Complete">COMPLETE</option>
          <option value="Canceled">CANCELED</option>
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
