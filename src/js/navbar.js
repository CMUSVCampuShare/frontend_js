import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Flex, Link, Icon } from "@chakra-ui/react";
import { FaHome, FaUser, FaStar, FaBell, FaAlignJustify } from "react-icons/fa";

function Navbar() {
  return (
    <Flex
      as="nav"
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      justifyContent="space-around"
      alignItems="center"
      p={3}
      bg="white"
      color="gray.800"
      boxShadow="0 -2px 10px rgba(0,0,0,0.1)"
      zIndex="10"
    >
      <Link as={RouterLink} to="/" _hover={{ textDecor: "none" }}>
        <Icon as={FaHome} boxSize="6" />
      </Link>
      <Link as={RouterLink} to="/post" _hover={{ textDecor: "none" }}>
        <Icon as={FaAlignJustify} boxSize="6" />
      </Link>
      <Link as={RouterLink} to="/recommendation" _hover={{ textDecor: "none" }}>
        <Icon as={FaStar} boxSize="6" />
      </Link>
      <Link as={RouterLink} to="/profile" _hover={{ textDecor: "none" }}>
        <Icon as={FaUser} boxSize="6" />
      </Link>
      <Link as={RouterLink} to="/notifications" _hover={{ textDecor: "none" }}>
        <Icon as={FaBell} boxSize="6" />
      </Link>
    </Flex>
  );
}

export default Navbar;
