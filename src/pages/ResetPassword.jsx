import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  FormControl,
  FormLabel,
  GridItem,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  SimpleGrid,
  Text,
  Textarea,
  VStack,
  extendTheme,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { httpClient } from "../utils/httpClient";
import { useMutation, useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import resetPasswordSchema from "../validations/resetPasswordSchema";
import { colors } from "../components/Constants";
import signInImage from "../assets/img/img/signInImage.png";

export default function ResetPassword() {
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickPassword = () => setShowPassword(!showPassword);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const handleClickConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = (queryParams.get("token"));

  const email = queryParams.get("email");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  const bgForm = useColorModeValue("white", "navy.700");



  
  const [loggedIn, setLoggedIn] = useState(true);
  const { userName } = useSelector((state) => state.account);


  useEffect(() => {
    if (!token) {
      navigate('/forgotPassword');
    }
  }, [token, navigate]);



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



  const resetPassword = useMutation(
    (formData) => httpClient.post("/Account/ResetPassword", formData),
    {
      onSuccess: () => {
        toast({
          title: "Password reset",
          description: "Your password succesfully reset.",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });
        setIsLoading(true);

        navigate(`/`);
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
          Email: email,
          Token: token,
          Password: values.password,
          ConfirmPassword: values.confirmPassword,
        };
        setIsLoading(true);

        resetPassword.mutate(formData);
      }
    });
  };

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    // validationSchema: resetPasswordSchema,
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
            top="88"
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
            gap="12px"
          >
           
            <Text
              fontSize="xl"
              color={colors.secondary}
              fontWeight="bold"
              textAlign="center"
              mb="16px"
            >
              Reset Password
            </Text>

           

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
                  size="lg"
                  width="98%"
                  border="1px"
                  borderColor="gray.200"
                  name="password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  onBlur={formik.handleBlur}
                  pr="4.5rem"
                  type={showPassword ? "text" : "password"}
                />
                <InputRightElement marginTop="5px" mr="8px" width="4.5rem">
                  <Button h="2rem" size="sm" onClick={handleClickPassword}>
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              {formik.errors.password && formik.touched.password && (
                <Text fontSize="16px" ms="4px" style={{ color: "red" }}>
                  {formik.errors.password}
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
                Confirm Password
              </FormLabel>

              <InputGroup size="md">
                <Input
                  fontSize="sm"
                  ms="4px"
                  size="lg"
                  width="98%"
                  border="1px"
                  borderColor="gray.200"
                  name="confirmPassword"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
                  pr="4.5rem"
                  type={showConfirmPassword ? "text" : "password"}
                />
                <InputRightElement marginTop="5px" mr="8px" width="4.5rem">
                  <Button
                    h="2rem"
                    size="sm"
                    onClick={handleClickConfirmPassword}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>

              {formik.errors.confirmPassword &&
                formik.touched.confirmPassword && (
                  <Text fontSize="16px" style={{ color: "red" }}>
                    {formik.errors.confirmPassword}
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
              onClick={formik.handleSubmit}
              p="12px 28px"
            >
              Reset Password
            </Button>
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
