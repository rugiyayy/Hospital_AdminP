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
  const doctorId = queryParams.get("doctorId");
  const selectedDate = queryParams.get("selectedDate");
  const parsedDoctorId = parseInt(doctorId);
  const navigate = useNavigate();
  const toast = useToast();

  const textColor = useColorModeValue("gray.700", "white");
  const bgForm = useColorModeValue("white", "navy.700");

  const resetPassword = useMutation(
    (formData) => httpClient.post("/Account/resetPassword", formData),
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
        navigate(`/signIn`);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description:
            error.response?.data ||
            error.message ||
            "Something went wrong. Please try again later.",
          status: "error",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });
      },
    }
  );

  const onSubmit = (values) => {
    formik.validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        const formData = {
          Code: values.code,
          Password: values.password,
          confirmPassword: values.confirmPassword,
        };

        resetPassword.mutate(formData);
      }
    });
  };

  const formik = useFormik({
    initialValues: {
      code: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: resetPasswordSchema,
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
            top="50"
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
              textAlign="center"
              fontWeight="700"
              fontSize="26px"
              color={colors.secondary}
            >
              Check Your Email 
            </Text>
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
                Code
              </FormLabel>
              <Input
                fontSize="sm"
                ms="4px"
                size="lg"
                width="98%"
                border="1px"
                borderColor="gray.200"
                onChange={formik.handleChange}
                value={formik.values.code}
                onBlur={formik.handleBlur}
                name="code"
                type="text"
              />
              {formik.errors.code && formik.touched.code && (
                <Text ms="4px" fontSize="16px" style={{ color: "red" }}>
                  {formik.errors.code}
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
