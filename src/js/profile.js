import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  VStack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Image,
  Text,
} from "@chakra-ui/react";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import "../css/profile.css";
import Navbar from "./navbar";

var stompClient = null;

function EditProfileModal({ isOpen, onClose, profile, onSave }) {
  const [updatedProfile, setUpdatedProfile] = useState(profile);

  const handleSave = () => {
    onSave(updatedProfile);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              value={updatedProfile.username}
              onChange={(e) =>
                setUpdatedProfile((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
            />
            {/* Add other fields similarly... */}
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="red"
            bg="#bb0000"
            color="white"
            mr={3}
            _hover={{ bg: "#a00000" }}
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
//     <>
//       <Navbar />

//       <div className={`modal ${isOpen ? "modal-open" : ""}`}>
//         <div className="modal-content">
//           <button className="modal-close" onClick={onClose}>
//             X
//           </button>
//           <h2>Edit Profile</h2>

//           <label>Username</label>
//           <input
//             type="text"
//             value={updatedProfile.username}
//             onChange={(e) =>
//               setUpdatedProfile((prev) => ({
//                 ...prev,
//                 username: e.target.value,
//               }))
//             }
//           />
//           {/* Add other fields similarly... */}

//           <button className="modal-confirm" onClick={handleSave}>
//             Save Changes
//           </button>
//         </div>
//       </div>
//     </>
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

    var showMap = false;
    var forPassenger = false;
    if (
      payloadData.notification.includes("lat") &&
      payloadData.notification.includes("lng")
    ) {
      showMap = true;
    }
    if (payloadData.notification.includes("rejected")) {
      forPassenger = true;
    }
    const propsToPass = {
      message: payloadData.notification,
      showMap: showMap,
      forPassenger: forPassenger,
      notificationId: payloadData.notificationId,
    };
    navigate("/join", { state: propsToPass });
  };

  const onError = (err) => {
    console.log("Error", err);
  };

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

      <Button
        colorScheme="red"
        bg="#bb0000"
        color="white"
        size="lg"
        _hover={{ bg: "#a00000" }}
        onClick={() => setIsModalOpen(true)}
      >
        Edit
      </Button>

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
