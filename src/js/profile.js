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
import Icon from "../icons/User.png";

var stompClient = null;

function EditProfileModal({ isOpen, onClose, profile, onSave }) {
  const [updatedProfile, setUpdatedProfile] = useState(profile);

  const handleSave = () => {
    onSave(updatedProfile);
    onClose();
  };

  //get user id from local storage
  //fetch current user details to display
  //display current user details on profile screen
  //add those details to modal
  //edit modal fields 
  //send put request
  //update the screen with new profile details

  const userIdStored = localStorage.getItem("userId");

  //update user details via PUT
  const [status, setStatus] = useState(false); //to check if put was successful
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [entry, setEntry] = useState("");
  const [exit, setExit] = useState("");
  const [seats, setSeats] = useState(null);
  const [licenseNo, setLicenseNo] = useState("");

  const navigate = useNavigate();

  const updateUser = async () => {
    let updateData;

    updateData = {
      password: password,
      email: email,
      address: address,
      entryTime: entry,
      exitTime: exit,
      noOfSeats: seats,
      licenseNo: licenseNo,
    };
  

    try {
      console.log(updateData);
      const response = await fetch(
        `http://localhost:8080/users/${userIdStored}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
          credentials: "include",
        }
      );

      if (response.ok) {
        const token = await response.text();
        localStorage.setItem("userId", token);
        console.log(token);
        navigate("/profile");
      } else {
      }
    } catch (error) {
      console.error("Update Profile failed:", error);
    }

  };


  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={updatedProfile.password}
              onChange={(e) =>
                setUpdatedProfile((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
            />
            <FormLabel>Address</FormLabel>
            <Input
              type="text"
              value={updatedProfile.address}
              onChange={(e) =>
                setUpdatedProfile((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
            />
            <FormLabel>Entry Time</FormLabel>
            <Input
              type="text"
              value={updatedProfile.entryTime}
              onChange={(e) =>
                setUpdatedProfile((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
            />
            <FormLabel>Exit Time</FormLabel>
            <Input
              type="text"
              value={updatedProfile.exitTime}
              onChange={(e) =>
                setUpdatedProfile((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
            />
            <FormLabel>Number of Seats</FormLabel>
            <Input
              type="number"
              value={updatedProfile.noOfSeats}
              onChange={(e) =>
                setUpdatedProfile((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
            />
            <FormLabel>License Number</FormLabel>
            <Input
              type="text"
              value={updatedProfile.licenseNo}
              onChange={(e) =>
                setUpdatedProfile((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
            />
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
 
  );
}

function Profile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profile, setProfile] = useState(null); // Start with no profile data

  // const [profile, setProfile] = useState({
  //   username: "Jane Doe",
  //   phoneNumber: "+1650776899",
  //   email: "jane****@andrew.cmu.edu",
  //   address: "NASA Research park",
  //   role: "Driver",
  //   payment: "PayPal xx24xx33xx45",
  //   rewards: "100 Points",
  // });

  const handleEdit = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    userId: localStorage.getItem("userId"),
    connected: false,
  });

  useEffect(() => {
    const userId = localStorage.getItem("userId"); // Get userId from localStorage
    if (userId) {
      fetchUserProfile();
      connect();
    } else {
      navigate("/login"); // Redirect to login if no userId
    }
  }, [navigate]); // Depend on navigate to re-run effect if it changes

  const fetchUserProfile = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("jwt"); // Get JWT token from localStorage

    try {
      const response = await fetch(`http://localhost:8080/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Could not fetch user data.");
      }
      const userProfile = await response.json();
      setProfile(userProfile); // Set fetched profile data to state
    } catch (error) {
      console.error("Error fetching user profile:", error);
      navigate("/login"); // Redirect to login on error
    }
  };

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

  const handleLogout = () => {
    // Clear the JWT token and any other auth-related data
    localStorage.removeItem("jwt");
    localStorage.removeItem("userId"); // Remove userId if you're storing it

    // Optionally clear any related state
    setProfile(null);
    setUserData({ userId: null, connected: false });

    // Disconnect from WebSocket if connected
    if (stompClient && stompClient.connected) {
      stompClient.disconnect();
    }

    // Redirect user to login or home page
    navigate("/login");
  };

  return (
    <div className="profile-container">
      <Navbar />
      {profile ? ( // Only attempt to access profile properties if profile is not null
        <>
          <div className="profile-header">
            <img
              src={profile.avatarUrl || Icon} // Use a default image if avatarUrl is not available
              alt="User profile"
              className=""
              width="50px"
              height="50px"
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
          </div>

          <Button
            colorScheme="red"
            bg="#bb0000"
            color="white"
            size="lg"
            mt={4}
            _hover={{ bg: "#a00000" }}
            onClick={() => setIsModalOpen(true)}
          >
            Edit
          </Button>

          <Button
            colorScheme="red"
            bg="#bb0010"
            color="white"
            size="lg"
            mt={4}
            ml={4}
            _hover={{ bg: "#a00000" }}
            onClick={handleLogout}
          >
            Logout
          </Button>

          <EditProfileModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            profile={profile}
            onSave={handleEdit}
          />
        </>
      ) : (
        <Text>Loading profile...</Text> // Show a loading message while profile is null
      )}
    </div>
  );
}

export default Profile;
