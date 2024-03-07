import {
    Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import forgotPasswordSchema from "../validations/forgotPasswordSchema";
import { useMutation } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { httpClient } from "../utils/httpClient";
import { colors } from "../components/Constants";
import signInImage from "../assets/img/img/signInImage.png";


const ForgotPassword = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const textColor = useColorModeValue("gray.700", "white");
  const bgForm = useColorModeValue("white", "navy.700");
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { userName } = useSelector((state) => state.account);

  const [loggedIn, setLoggedIn] = useState(true);

  useEffect(() => {
    if (userName) {
      setLoggedIn(false);
    }
  }, [userName]);
  useEffect(() => {
    if (!loggedIn) {
      navigate("/");
    }
  }, [loggedIn, navigate]);
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const response = await httpClient.get("/Account/forgotPassword", {
          params: {
            email: values.email,
          },
        });

        navigate(`/resetPassword`);

        toast({
          title: "Check your email",
          description: "Reset code sent to your email.",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });
      } catch (error) {
        const errorMessage =
          error.response?.data ||
          "Something went wrong. Please try again later.";
        toast({
          title: "Error",
          description: errorMessage || error.message || error || error.response,
          status: "error",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

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
            To reset password please enter your Email:{" "}
          </Text>

          <FormControl>
            <Input
              fontSize="sm"
              ms="4px"
              placeholder="email.com/az/ru"
              size="lg"
              width="98%"
              border="1px"
              borderColor="gray.200"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              name="email"
              type="text"
            />
            {formik.errors.email && formik.touched.email && (
              <Text ms="4px" style={{ color: "red" }}>
                {formik.errors.email}
              </Text>
            )}
          </FormControl>

          <Button
            mt="1rem"
            padding="0 32px "
            isLoading={isLoading}
            onClick={formik.handleSubmit}
            mr={3}
            backgroundColor={colors.secondary}
            color="white"
            _hover={{ bg: "blue.600" }}
          >
            Send
          </Button>

          <Flex
            justifyContent="center"
            alignItems="center"
            maxW="100%"
            mt="0px"
          ></Flex>
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

 
};

export default ForgotPassword;
