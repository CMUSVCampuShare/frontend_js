import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Heading, Image, Button, Text } from "@chakra-ui/react";
import logo from "../campushare.png";

function Home() {
  const isLoggedIn = Boolean(localStorage.getItem("jwt"));
  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading as="h1" size="xl" fontWeight="bold" mb={4}>
        CampuShare
      </Heading>
      <Text fontSize="md" mb={2}>
        Join our campus carpool community, where CMU Silicon Valley students
        with cars help fellow students access campus and food pickups, earning
        rewards in return!
      </Text>
      <Image src={logo} alt="CampuShare Logo" mx="auto" mb={4} />

      {!isLoggedIn && (
        <Button
          as={RouterLink}
          to="/login"
          bg="#bb0000"
          color="white"
          size="lg"
          _hover={{ bg: "#a00000" }}
        >
          Get Started
        </Button>
      )}
    </Box>
  );
}

export default Home;
