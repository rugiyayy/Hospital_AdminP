import React, { useState } from "react";
// Chakra imports
import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Text,
  useColorModeValue,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { Link, NavLink } from "react-router-dom";
// Assets
import signInImage from "../assets/img/img/signInImage.png";
import useSignIn from "../hooks/useSignIn";
import { useSelector } from "react-redux";

function SignIn() {
  const { isLoading, formik } = useSignIn();
  const { userName } = useSelector((x) => x.account);
  const [show, setShow] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);

  const textColor = useColorModeValue("gray.700", "white");
  const bgForm = useColorModeValue("white", "navy.700");

  const handleClick = () => setShow(!show);
  // const handleClickPassword = () => setShowPassword(!showPassword);
  // const handleClickConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <Flex position="relative" overflowY="hidden" h="100vh">
      <Flex
        border="5px solid green"
        minH={{ md: "1000px" }}
        h={{ sm: "initial", md: "75vh", lg: "85vh" }}
        mx="auto"
        justifyContent="space-between"
      >
        <Flex
          border="5px solid red"
          w="100%"
          alignItems="center"
          justifyContent="center"
        >
          <Flex
            position="absolute"
            top="110"
            zIndex="2"
            direction="column"
            w="445px"
            background="transparent"
            borderRadius="15px"
            p="40px"
            bg={bgForm}
            boxShadow={useColorModeValue(
              "0px 5px 14px rgba(0, 0, 0, 0.05)",
              "unset"
            )}
            gap="20px"
          >
            <Text
              fontSize="xl"
              color={textColor}
              fontWeight="bold"
              textAlign="center"
              mb="22px"
            >
              Sign In
            </Text>

            <FormControl>
              <FormLabel
                ms="4px"
                fontSize="15px"
                fontWeight="normal"
                fontFamily="sans-serif"
              >
                Username
              </FormLabel>
              <Input
                fontSize="sm"
                ms="4px"
                type="text"
                placeholder="Your full name"
                size="lg"
                width="98%"
                isDisabled={isLoading}
                border="1px"
                borderColor="gray.200"
                onChange={formik.handleChange}
                value={formik.values.userName}
                onBlur={formik.handleBlur}
                name="userName"
              />
              {formik.errors.userName && formik.touched.userName && (
                <Text ms="4px" style={{ color: "red" }}>
                  {formik.errors.userName}
                </Text>
              )}
            </FormControl>

            <FormControl>
              <FormLabel
                ms="4px"
                fontSize="15px"
                fontWeight="normal"
                fontFamily="sans-serif"
              >
                Password
              </FormLabel>

              <InputGroup size="md">
                <Input
                  fontSize="sm"
                  ms="4px"
                  placeholder="Your password"
                  size="lg"
                  width="98%"
                  border="1px"
                  isDisabled={isLoading}
                  borderColor="gray.200"
                  name="password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  onBlur={formik.handleBlur}
                  pr="4.5rem"
                  type={show ? "text" : "password"}
                />
                <InputRightElement marginTop="5px" mr="8px" width="4.5rem">
                  <Button h="2rem" size="sm" onClick={handleClick}>
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              {formik.errors.password && formik.touched.password && (
                <Text ms="4px" style={{ color: "red" }}>
                  {formik.errors.password}
                </Text>
              )}
            </FormControl>

            <Button
              textAlign="center"
              left="82px"
              fontSize="16px"
              variant="dark"
              fontWeight="bold"
              w="50%"
              h="45"
              color="white"
              _hover={{
                background: "green.500",
              }}
              backgroundColor="green"
              isLoading={isLoading}
              onClick={formik.handleSubmit}
            >
              SIGN IN
            </Button>

            <Flex
              justifyContent="center"
              alignItems="center"
              maxW="100%"
              mt="0px"
            >
              <Button variant="link">
                <Link to="/forgotPassword">Forgot Password?</Link>
              </Button>
            </Flex>
          </Flex>
        </Flex>
        <Box
          w="100%"
          left="0px"
          top="-40%"
          position="absolute"
          bgImage={signInImage}
        >
          <Box h="162vh" bgSize="cover" bg="gray.700" opacity="0.7"></Box>
        </Box>
      </Flex>
    </Flex>
  );
}

export default SignIn;

//!!!!!!!!!!!!!!!!!!!!!!!!!!
