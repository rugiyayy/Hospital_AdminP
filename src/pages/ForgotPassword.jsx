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
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const forgotPassword = useMutation(
    (formData) => httpClient.post("/Account/forgotPassword", formData),
    {
      onSuccess: () => {
        toast({
          title: "Check your email",
          description: "Reset code sent to your email.",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });
        setFormSubmitted(true);
        setIsLoading(false);
      },
      onError: (error) => {
        if (
          error.response &&
          error.response?.data &&
          error.response?.data?.errors
        ) {
          const validationErrors = error.response.data.errors;
          const errorMessage = Object.values(validationErrors).join("\v\r\n");

          formik.setErrors(
            error?.response?.data?.errors ||
              error?.response?.data ||
              "Something went wrong. Please try again later."
          );

          console.log("api validation error:", error?.response?.data?.errors);
          toast({
            title: "Error",
            description:
              errorMessage || "Something went wrong. Please try again later.",
            status: "error",
            duration: 4000,
            isClosable: true,
            position: "top-right",
          });
        } else if (error?.response?.status === 401) {
          console.log("error401:", error);

          toast({
            title: "Authorization Error",
            description: "You are not authorized",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
          console.log(" if eldsfse error message :", error.response);
        } else {
          console.log(" if else error message :", error.response);

          toast({
            title: "Error",
            description:
              error?.response?.data ||
              error?.response ||
              "An unexpected error occurred. Please try again later.",

            status: "error",
            duration: 4000,
            isClosable: true,
            position: "top-right",
          });
        }
        setIsLoading(false);
      },
    }
  );
  const onSubmit = (values) => {
    formik.validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        const formData = {
          Email: values.email,
          FrontendPort: window.location.origin,
        };
        setIsLoading(true);
        forgotPassword.mutate(formData);
      }
    });
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      frontendPort: "",
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: onSubmit,
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
            {formSubmitted ? (
              <Text
                fontWeight="600"
                fontSize="22px"
                textAlign="center"
                color={colors.primary}
                m="2rem 0"
              >
                Please check your email for the reset link.
              </Text>
            ) : (
              <>
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
                    placeholder="email.com/az"
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

                {/* <Flex
            justifyContent="center"
            alignItems="center"
            maxW="100%"
            mt="0px"
          ></Flex> */}
              </>
            )}
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
