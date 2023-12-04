import React, { useState } from "react";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Button,
  Image,
  Text,
  VStack,
  Link as ChakraLink,
  Heading,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import login_img from "../icons/login.svg";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginUser = async () => {
    const loginData = {
      username: username,
      password: password,
    };

    try {
      console.log(loginData);
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
        credentials: "include",
      });

      if (response.ok) {
        const token = await response.text();
        localStorage.setItem("userId", token);
        console.log(token);
        navigate("/post");
      } else {
      }
    } catch (error) {
      console.error("Login failed:", error);
    } 
      /* if (response.ok) {
        const responseData = await response.json();

        if (responseData.jwt) {
          // Store JWT in local storage
          localStorage.setItem("jwt", responseData.jwt);
          localStorage.setItem("userId", responseData.userId);

          console.log("Login successful!");
          navigate("/post");
        } else {
          console.error("JWT not found in the response");
        }
      } else {
        console.error("Login failed:", response.status);
        // Handle other error cases if needed
      }
    } catch (error) {
      console.error("Login failed:", error);
    } */
  };

  return (
    <Flex minHeight="100vh" align="center" justify="center" p={6}>
      <VStack spacing={6} align="center" width="full" maxWidth="md">
        <Image src={login_img} alt="Login" boxSize="250px" />
        <Heading as="h2" size="xl" mb={6}>
          Login
        </Heading>
        <FormControl id="username" isRequired>
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <Button
          colorScheme="red"
          bg="#bb0000"
          color="white"
          size="lg"
          width="full"
          _hover={{ bg: "#a00000" }}
          onClick={loginUser}
        >
          Login
        </Button>
        <Box>
          <Text>
            Don't have an account?{" "}
            <ChakraLink as={RouterLink} to="/register" color="red.500">
              Sign Up
            </ChakraLink>
          </Text>
        </Box>
      </VStack>
    </Flex>
  );
}

export default Login;
