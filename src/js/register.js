import React from "react";
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
import logo from "../icons/login.svg";

function Register() {
  return (
    <Flex direction="column" align="center" p={6}>
      <img src={logo} alt="Login Icon" />
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        Sign Up
      </Text>

      <VStack spacing={4} align="stretch" maxWidth="md" width="full">
        <FormControl id="username">
          <FormLabel>Username</FormLabel>
          <Input type="text" />
        </FormControl>
        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input type="password" />
        </FormControl>
        <FormControl id="email">
          <FormLabel>Email</FormLabel>
          <Input type="text" />
        </FormControl>
        <FormControl id="address">
          <FormLabel>Address</FormLabel>
          <Input type="text" />
        </FormControl>
        <FormControl id="role">
          <FormLabel>Role</FormLabel>
          <Select>
            <option value="driver">Driver</option>
            <option value="rider">Rider</option>
          </Select>
        </FormControl>
        <FormControl id="schedule">
          <FormLabel>Upload Schedule (.pdf or .ics)</FormLabel>
          <Input type="file" accept=".pdf, .ics" />
        </FormControl>
        <Button
          colorScheme="red"
          bg="#bb0000"
          color="white"
          size="lg"
          _hover={{ bg: "#a00000" }}
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
