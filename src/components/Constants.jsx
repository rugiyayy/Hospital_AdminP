import { Box, Spinner } from "@chakra-ui/react";

const colors = {
    primary: "#e12454", //pink
    secondary: "#223a66", //blue
    paragraph: "#40709d", //lightBlue
  };

  function Spinner1() {
    return (
      <Box
      position="absolute"
      top="280px"
      left="740px"
    >
      <Spinner size="xl" /> <h1>Loading ...</h1>
    </Box>
    )
  }
  
  export {colors,Spinner1}