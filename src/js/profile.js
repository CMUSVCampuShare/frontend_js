import React, { useState } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import "../css/profile.css";

const userIdStored = localStorage.getItem("userId");
var stompClient = null;
function EditProfileModal({ isOpen, onClose, profile, onSave }) {
  const [updatedProfile, setUpdatedProfile] = useState(profile);

  const handleSave = () => {
    onSave(updatedProfile);
    onClose();
  };

  return (
    <div className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          X
        </button>
        <h2>Edit Profile</h2>

        <label>Username</label>
        <input
          type="text"
          value={updatedProfile.username}
          onChange={(e) =>
            setUpdatedProfile((prev) => ({ ...prev, username: e.target.value }))
          }
        />
        {/* Add other fields similarly... */}

        <button className="modal-confirm" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
}

function Profile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profile, setProfile] = useState({
    username: "Jane Doe",
    phoneNumber: "+1650776899",
    email: "jane****@andrew.cmu.edu",
    address: "NASA Research park",
    role: "Driver",
    payment: "PayPal xx24xx33xx45",
    rewards: "100 Points",
  });

  const handleEdit = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  const connect = () => {
    //let Sock = new SockJS("http://localhost:8088/ws");
    //stompClient = over(Sock);
    //stompClient.connect({}, onConnected(), onError);
  };

  const onConnected = () => {
    stompClient.subscribe(
      "/user/" + userIdStored + "/notification",
      onPrivateMessage
    );
  };

  const onError = (err) => {
    console.log(err);
  };

  const onPrivateMessage = (payload) => {
    console.log(payload);
  };

  connect();

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src="../campushare.png"
          alt="User profile"
          className="profile-pic"
        />
        <h2>{profile.username}</h2>
        <p>{profile.email}</p>
      </div>

      <div className="profile-details">
        <div className="detail-item">
          <span>Username</span>
          <span>{profile.username}</span>
        </div>
        <div className="detail-item">
          <span>Phone Number</span>
          <span>{profile.phoneNumber}</span>
        </div>
        <div className="detail-item">
          <span>Email</span>
          <span>{profile.email}</span>
        </div>
        <div className="detail-item">
          <span>Address</span>
          <span>{profile.address}</span>
        </div>
        <div className="detail-item">
          <span>Role</span>
          <span>{profile.role}</span>
        </div>
        <div className="detail-item">
          <span>Payment</span>
          <span>{profile.payment}</span>
        </div>
        <div className="detail-item">
          <span>Rewards</span>
          <span>{profile.rewards}</span>
        </div>
      </div>

      <button className="edit-button" onClick={() => setIsModalOpen(true)}>
        Edit
      </button>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        profile={profile}
        onSave={handleEdit}
      />
    </div>
  );
}

export default Profile;
