import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  VStack,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import logo from "../icons/login.svg";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [account, setAccount] = useState("");
  const [role, setRole] = useState("driver");
  const [entry, setEntry] = useState("");
  const [exit, setExit] = useState("");
  const [seats, setSeats] = useState();
  const [licenseNo, setLicenseNo] = useState("");

  const navigate = useNavigate();

  const handleSignUp = () => {
    // Email format validation
    const emailRegex = /^[^\s@]+@andrew\.cmu\.edu$/;
    const isValidEmail = emailRegex.test(email);

    // Number of seats validation
    const isValidSeats = seats > 0;

    if (!isValidEmail) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!isValidSeats) {
      alert("Number of seats must be greater than 0.");
      return;
    }

    if (exit < entry) {
      alert("Exit time must be greater than Entry time.");
    }

    console.log("Form submitted successfully!");
  };

  const registerUser = async () => {
    let registerData;

    if (role === 'driver') {
       registerData = {
        username: username,
        password: password,
        email: email,
        address: address,
        account: account,
        role: "DRIVER",
        entryTime: entry,
        exitTime: exit,
        noOfSeats: seats,
        licenseNo: licenseNo
      }
    }
    //for role==rider
      else {
       registerData = {
        username: username,
        password: password,
        email: email,
        role: "RIDER",
        address: address,
        account: account,
        entryTime: entry,
        exitTime: exit,
        noOfSeats: 1,
        licenseNo: "none",
      };
      }
    
    try {
      console.log(registerData);
      const response = await fetch("http://localhost:8080/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
        credentials: "include",
      });

      if (response.ok) {
        const token = await response.text();
        localStorage.setItem("userId", token);
        console.log(token);
        navigate("/login");
      } else {
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <Flex direction="column" align="center" p={6}>
      <img src={logo} alt="Login Icon" />
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        Sign Up
      </Text>

      <VStack spacing={4} align="stretch" maxWidth="md" width="full">
        <FormControl id="username">
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormControl>
        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <FormControl id="email">
          <FormLabel>Email</FormLabel>
          <Input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl id="address">
          <FormLabel>
            Address (
            <span style={{ fontWeight: "normal", fontStyle: "italic" }}>
              For eg. 585 Franklin St, Mountain View, CA, 94041
            </span>
            )
          </FormLabel>

          <Input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </FormControl>
        <FormControl id="account">
          <FormLabel>PayPal Account</FormLabel>
          <Input
            type="text"
            id="account"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          />
        </FormControl>
        <FormControl id="role">
          <FormLabel>Role</FormLabel>
          <Select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="driver">Driver</option>
            <option value="rider">Rider</option>
          </Select>
        </FormControl>
        {role === "driver" && (
          <>
            <FormControl id="licensoNo">
              <FormLabel>License Number</FormLabel>
              <Input
                type="text"
                id="licenseNo"
                value={licenseNo}
                onChange={(e) => setLicenseNo(e.target.value)}
              />
            </FormControl>
            <FormControl id="seats">
              <FormLabel>Number of Seats</FormLabel>
              <Input
                type="number"
                id="seats"
                value={seats}
                onChange={(e) => setSeats(parseInt(e.target.value, 10))}
                step="1"
              />
            </FormControl>
          </>
        )}
        <div className="form-group">
          <FormLabel>Entry Time</FormLabel>
          <input
            type="time"
            id="entry"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
          />
        </div>
        <div className="form-group">
          <FormLabel>Exit Time</FormLabel>
          <input
            type="time"
            id="exit"
            value={exit}
            onChange={(e) => setExit(e.target.value)}
          />
        </div>
        <Button
          colorScheme="red"
          bg="#bb0000"
          color="white"
          size="lg"
          _hover={{ bg: "#a00000" }}
          onClick={() => {
            handleSignUp();
            registerUser();
          }}
        >
          Sign Up
        </Button>
      </VStack>

      <Text mt={6}>
        Already a user?{" "}
        <ChakraLink as={RouterLink} to="/login" color="teal.500">
          Sign In
        </ChakraLink>
      </Text>
    </Flex>
  );
}

export default Register;
