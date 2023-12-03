import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import "../css/post.css";
import { Box, Heading, UnorderedList, ListItem, Text } from "@chakra-ui/react";
import Navbar from "./navbar";

const initialToPlaceholder = "To";
const initialSeatsPlaceholder = 0;
const userIdStored = localStorage.getItem("userId");
var stompClient = null;

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
  const [editedPostData, setEditedPostData] = useState({
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
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (newPostData.type === "FoodPickup" && !editMode) {
      setNewPostData({
        ...newPostData,
        to: initialToPlaceholder,
        noOfSeats: initialSeatsPlaceholder,
      });
    }

    if (successMessage) {
      alert(successMessage);
      setSuccessMessage(null);
    }
    if (errorMessage) {
      alert(errorMessage);
      setErrorMessage(null);
    }

    const fetchPosts = async () => {
      try {
        const postsResponse = await fetch("http://localhost:8082/posts/active");
        const posts = await postsResponse.json();

        const fetchCommentPromises = posts.map(async (post) => {
          try {
            const commentResponse = await fetch(
              `http://localhost:8082/posts/${post.postId}/comments`
            );
            const comments = await commentResponse.json();
            return { ...post, comments: comments || [] };
          } catch (error) {
            console.error(
              `Error fetching comments for post ${post.postId}:`,
              error
            );
            return { ...post, comments: [] };
          }
        });

        const updatedPosts = await Promise.all(fetchCommentPromises);
        setPosts(updatedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [newPostData.type, successMessage, errorMessage, newPostData, editMode]);

  const Post = ({ post }) => {
    const [commentText, setCommentText] = useState("");

    const handleAddComment = (postId) => {
      if (commentText.trim() === "") {
        setErrorMessage("Failed to add comment. Cannot add an empty comment!");
        return;
      }

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
            setErrorMessage("Failed to add comment");
            throw new Error("Failed to add comment");
          }
        })
        .then((createdComment) => {
          const updatedPosts = posts.map((p) => {
            if (p.postId === postId) {
              const updatedPost = { ...p };
              updatedPost.comments.push({ comment: commentText });
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
      setEditedPostData({
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
        userId: userIdStored, // TO DO: Need to update to logged-in userId
        title: editedPostData.title,
        from: editedPostData.from,
        to: editedPostData.to,
        details: editedPostData.details,
        type: editedPostData.type.toUpperCase(),
        noOfSeats: editedPostData.noOfSeats || 0,
        status: editedPostData.status.toUpperCase(),
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
                ? { ...editedPostData, postId: p.postId }
                : p
            );
            setPosts(updatedPosts);
            setEditMode(false);
            setEditingPost(null);
            setEditedPostData({
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
            setSuccessMessage("Successfully updated post");
          } else {
            setErrorMessage("Failed to update post");
            throw new Error("Failed to update post");
          }
        })
        .catch((error) => console.error("Error updating post:", error));
    };

    const joinPost = (postId) => {
      const selectedPost = posts.find((post) => post.postId === postId);

      var url = "";
      var joinData = {};
      switch (selectedPost.type) {
        case "RIDE":
          url = `http://localhost:8086/join?post=${selectedPost.title}`;
          joinData = {
            driverID: selectedPost.userId,
            passengerID: userIdStored, // "24190f52-f241-41b9-b623-fdc02c6b7cd2" // TO DO: Need to update to logged-in userId
            from: selectedPost.from,
            to: selectedPost.to,
          };
          break;
        default:
          url = `http://localhost:8086/request-food?post=${selectedPost.title}`;
          joinData = {
            driverID: selectedPost.userId,
            passengerID: userIdStored, // "24190f52-f241-41b9-b623-fdc02c6b7cd2" // TO DO: Need to update to logged-in userId
          };
          break;
      }

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(joinData),
      })
        .then((response) => {
          if (response.ok) {
            setSuccessMessage("Successfully sent join request");
            return response.json();
          } else {
            setErrorMessage("Failed to send join request");
            throw new Error("Failed to send join request");
          }
        })
        .catch((error) => console.error("Error sending join request: ", error));
    };

    // TO DO : Use autocomplete for from and to
    return (
      <div className="post">
        {editMode && editingPost.postId === post.postId ? (
          <div className="update-post">
            <h2>Update Existing Post</h2>
            <input
              type="text"
              placeholder="Edit Title"
              value={editedPostData.title}
              onChange={(e) =>
                setEditedPostData({ ...editedPostData, title: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Edit From"
              value={editedPostData.from}
              onChange={(e) =>
                setEditedPostData({ ...editedPostData, from: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Edit to"
              value={editedPostData.to}
              onChange={(e) =>
                setEditedPostData({ ...editedPostData, to: e.target.value })
              }
              disabled={post.type === "FOODPICKUP"}
            />
            <textarea
              type="text"
              placeholder="Edit Deatils"
              value={editedPostData.details}
              onChange={(e) =>
                setEditedPostData({
                  ...editedPostData,
                  details: e.target.value,
                })
              }
            />
            <p>{post.type}</p>
            <input
              type="number"
              placeholder="Edit Number of Seats"
              value={editedPostData.noOfSeats}
              onChange={(e) =>
                setEditedPostData({
                  ...editedPostData,
                  noOfSeats: e.target.value,
                })
              }
              disabled={post.type === "FOODPICKUP"}
            />
            <select
              value={editedPostData.status}
              onChange={(e) =>
                setEditedPostData({ ...editedPostData, status: e.target.value })
              }
            >
              <option value="Created">CREATED</option>
              <option value="Ongoing">ONGOING</option>
              <option value="Full">FULL</option>
              <option value="Complete">COMPLETE</option>
              <option value="Canceled">CANCELED</option>
            </select>
            <p>{post.timestamp}</p>
            <button onClick={handleUpdatePost}>Save Updates</button>
          </div>
        ) : (
          <div>
            <h2>{post.title}</h2>
            <p>
              <b>From:</b> {post.from}
            </p>
            <p>
              <b>To:</b> {post.to}
            </p>
            <p>
              <b>Details:</b> {post.details}
            </p>
            <p>
              <b>Type:</b> {post.type}
            </p>
            <p>
              <b>No of Seats:</b> {post.noOfSeats}
            </p>
            <p>
              <b>Status:</b> {post.status}
            </p>
            <p>
              <b>Timestamp:</b> {post.timestamp}
            </p>
            <div className="comments">
              {post.comments.map((comment, index) => (
                <p key={index}>
                  <b>Comment:</b> {comment.comment}
                </p>
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
                {/* <button onClick={() => joinPost(post.postId)}>Join</button>
                 <button onClick={() => handleEditPost(post)}>Edit Post</button>
                <button onClick={() => handleDeletePost(post.postId)}>
                  Delete Post
                </button>  */}
                {userIdStored !== post.userId && (
                  <button
                    className="join-button"
                    onClick={() => joinPost(post.postId)}
                  >
                    Join
                  </button>
                )}
                {userIdStored === post.userId && (
                  <button onClick={() => handleEditPost(post)}>
                    Edit Post
                  </button>
                )}
                {userIdStored === post.userId && (
                  <button
                    className="delete-button"
                    onClick={() => handleDeletePost(post.postId)}
                  >
                    Delete Post
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleCreatePost = () => {
    const newPostDataForBackend = {
      userId: userIdStored, // TO DO: Need to update to logged-in userId
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
          setSuccessMessage("Successfully created post");
          return response.json();
        } else {
          setErrorMessage("Failed to create post");
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
          setSuccessMessage("Successfully deleted post");
        } else {
          setErrorMessage("Failed to delete post");
          throw new Error("Failed to delete post");
        }
      })
      .catch((error) => console.error("Error deleting post:", error));
  };

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
  // TO DO : Use autocomplete for from and to
  return (
    <div className="post-wall">
      <Heading as="h1" size="xl" className="sticky-header" mb={4}>
        Post Wall
      </Heading>

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
          disabled={newPostData.type === "FoodPickup"}
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
          disabled={newPostData.type === "FoodPickup"}
        />
        <select
          value={newPostData.status}
          onChange={(e) =>
            setNewPostData({ ...newPostData, status: e.target.value })
          }
        >
          <option value="Created">CREATED</option>
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
