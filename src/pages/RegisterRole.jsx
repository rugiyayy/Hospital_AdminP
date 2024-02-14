import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useState } from "react";
import useSignUp from "../hooks/useSignUp";

const RegisterRole = () => {
  const { isLoading, formik } = useSignUp();
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  return (
    <Flex>
      <Box width="15%"></Box>
      <Container
        maxW="85%"
        padding="3rem 0"
        // bg={useColorModeValue("gray.50", "gray.700")}
        style={{
          background: `url(${require("../assets/img/bg1.jpg")}) `,
          // backgroundRepeat: "no-repeat",
          // backgroundSize: "cover",
        }}
      >
        <Center>
          <Stack spacing={4}>
            <Stack align="center">
              <Heading fontSize="2xl">Sign Up User</Heading>
            </Stack>
            <VStack
              as="form"
              boxSize={{ base: "xs", sm: "sm", md: "md" }}
              h="max-content !important"
              bg={useColorModeValue("white", "gray.700")}
              rounded="lg"
              boxShadow="lg"
              p={{ base: 5, sm: 10 }}
              spacing={8}
            >
              <VStack spacing={4} w="100%">
                <FormControl>
                  <FormLabel>FullName</FormLabel>
                  <Input
                    onChange={formik.handleChange}
                    value={formik.values.fullName}
                    name="fullName"
                    type="text"
                    placeholder="Full Name"
                  />
                  {formik.errors.fullName && formik.touched.fullName && (
                    <span style={{ color: "red" }}>
                      {formik.errors.fullName}
                    </span>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel>UserName</FormLabel>
                  <Input
                    onChange={formik.handleChange}
                    value={formik.values.userName}
                    name="userName"
                    type="text"
                    placeholder="User Name"
                  />
                  {formik.errors.userName && formik.touched.userName && (
                    <span style={{ color: "red" }}>
                      {formik.errors.userName}
                    </span>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    name="email"
                    type="email"
                    placeholder="Email"
                  />
                  {formik.errors.email && formik.touched.email && (
                    <span style={{ color: "red" }}>{formik.errors.email}</span>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel>Is user Admin ?</FormLabel>
                  <Flex alignItems="center" gap="4px">
                    <input
                      type="radio"
                      name="isAdmin"
                      value="true"
                      onChange={() => formik.setFieldValue("isAdmin", true)}
                      checked={formik.values.isAdmin === true}
                    />
                    <label>True</label>

                    <input
                      style={{ marginLeft: "20px" }}
                      type="radio"
                      name="isAdmin"
                      value="false"
                      onChange={() => formik.setFieldValue("isAdmin", false)}
                      checked={formik.values.isAdmin === false}
                    />
                    <label>False</label>
                  </Flex>

                  {formik.errors.isAdmin && formik.touched.isAdmin && (
                    <span style={{ color: "red" }}>
                      {formik.errors.isAdmin}
                    </span>
                  )}
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Password</FormLabel>

                  <InputGroup size="md">
                    <Input
                      name="password"
                      onChange={formik.handleChange}
                      value={formik.values.password}
                      pr="4.5rem"
                      type={show ? "text" : "password"}
                      placeholder="Enter password"
                    />
                    <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  {formik.errors.password && formik.touched.password && (
                    <span style={{ color: "red" }}>
                      {formik.errors.password}
                    </span>
                  )}
                </FormControl>
              </VStack>
              <VStack w="100%">
                <Button
                  background="green"
                  _hover={{ backgroundColor: "green.500" }}
                  colorScheme="blue"
                  isLoading={isLoading}
                  onClick={formik.handleSubmit}
                  mr={3}
                >
                  Sign Up
                </Button>
              </VStack>
            </VStack>
          </Stack>
        </Center>
      </Container>
    </Flex>
  );
};

export default RegisterRole;