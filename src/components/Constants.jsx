import { Box, Spinner } from "@chakra-ui/react";

const colors = {
  primary: "#e12454", //pink
  secondary: "#223a66", //blue
  paragraph: "#40709d", //lightBlue
};

function Spinner1() {
  return (
    <>
      {" "}
      <Box width="15%"></Box>{" "}
      <Box w="85%" position="relative">
        {" "}
        <Box
          position="absolute"
          // transform="translate(-70%, -50%)"
          top="90px"
          left="610px"
        >
          <Spinner size="xl" /> <h1>Loading ...</h1>
        </Box>
      </Box>
    </>
  );
}

export { colors, Spinner1 };
