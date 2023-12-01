import { extendTheme } from "@chakra-ui/react";

const customTheme = extendTheme({
  fonts: {
    heading: '"Your Heading Font Family", sans-serif',
    body: '"Your Body Font Family", sans-serif',
  },
  // Add other global styles if needed
});

export default customTheme;
