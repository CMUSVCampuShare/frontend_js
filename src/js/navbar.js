import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Flex, Link, Icon, createIcon } from "@chakra-ui/react";
import {
  HamburgerIcon, // As an alternative to FaCar
  BellIcon, // As an alternative to FaRegBell
  StarIcon, // As an alternative to FaStar
  AtSignIcon, // As an alternative to FaUser
  ViewIcon, // As an alternative to FaHome
} from "@chakra-ui/icons";

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
        <Icon as={ViewIcon} boxSize="6" />
      </Link>
      <Link as={RouterLink} to="/post" _hover={{ textDecor: "none" }}>
        <Icon as={HamburgerIcon} boxSize="6" />
      </Link>
      <Link as={RouterLink} to="/recommendation" _hover={{ textDecor: "none" }}>
        <Icon as={StarIcon} boxSize="6" />
      </Link>
      <Link as={RouterLink} to="/profile" _hover={{ textDecor: "none" }}>
        <Icon as={AtSignIcon} boxSize="6" />
      </Link>
      <Link as={RouterLink} to="/notifications" _hover={{ textDecor: "none" }}>
        <Icon as={BellIcon} boxSize="6" />
      </Link>
    </Flex>
  );
}

export default Navbar;
