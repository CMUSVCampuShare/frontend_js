import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Heading, Button } from "@chakra-ui/react";

function Payment() {
  const currentUrl = window.location.href;
  console.log(currentUrl);

  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading as="h1" size="xl" fontWeight="bold" mb={4}>
        Authorize Payment
      </Heading>

      <Button
        as={RouterLink}
        to="/post"
        bg="#bb0000"
        color="white"
        size="lg"
        _hover={{ bg: "#a00000" }}
      >
        Authorize
      </Button>
    </Box>
  );
}

export default Payment;
