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
  Select,
  Stack,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import useSignUpDoctorModal from "../hooks/doctorsHooks/useSignUpDoctor";
import { httpClient } from "../utils/httpClient";
import { useQuery } from "react-query";
import { colors } from "../components/Constants";
import { useDropzone } from "react-dropzone";

function DoctorRegister() {
  const { isLoading, formik } = useSignUpDoctorModal();
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const { token } = useSelector((state) => state.account);

  const getTypes = async () => {
    const response = await httpClient.get("/doctorType", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };
  const { isLoading: isLoadingTypes, data: types } = useQuery(
    "doctorTypes",
    getTypes
  );

  const getDepartments = async () => {
    const response = await httpClient.get("/department", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };
  const { isLoading: isLoadingDepartments, data: departments } = useQuery(
    "departments",
    getDepartments
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      formik.setFieldValue("photo", acceptedFiles[0]);
    },
  });

  return (
    <Flex>
      <Box width="15%"></Box>
      <Container
        maxW="85%"
        padding="2rem 0"
        style={{
          background: `url(${require("../assets/img/img/bg/bgdoctor.avif")}) `,
        }}
      >
        <Center>
          <Flex flexDir="column" w="60%" gap="2rem">
            <Stack align="center">
              <Heading
                backgroundColor="white"
                padding="1rem 3rem"
                color={colors.secondary}
                fontSize="2xl"
              >
                Sign Up Doctor
              </Heading>
            </Stack>

            <Box
              // justifyContent="space-between"
              // flexDir="column"
              bg={useColorModeValue("white", "gray.700")}
              rounded="lg"
              p={{ base: 5, sm: 10 }}
              gap="8px"
            >
              <FormControl   w="100%" mt={6} mb={10}>
                <FormLabel textAlign={formik.values.photo ? "center" : "start"} ms={2}>Photo</FormLabel>
                <Flex justifyContent="space-between" alignItems="center">
                  <Box
                  w="50%"
                    {...getRootProps()}
                    borderWidth="2px"
                    p="20px"
                    cursor="pointer"
                  >
                    <input {...getInputProps()} />
                    <Text>Drag 'n' drop or click to select a photo</Text>
                  </Box>
                  {formik.touched.photo && formik.errors.photo && (
                    <Text ms={3} style={{ color: "red" }}>
                      {formik.errors.photo}
                    </Text>
                  )}
                  <Box w="45%">
                    {" "}
                    {formik.values.photo &&
                      formik.values.photo instanceof File && (
                        <img
                          src={URL.createObjectURL(formik.values.photo)}
                          alt="Doctor's photo"
                          style={{ marginTop: "10px", maxWidth: "200px" }}
                        />
                      )}
                  </Box>
                </Flex>
              </FormControl>
              <Flex justifyContent="space-between">
                {/* //!fulname */}
                <Flex w="45%" flexDir="column">
                  {" "}
                  <FormControl mb="16px">
                    <FormLabel ms={2}>Full Name</FormLabel>
                    <Input
                      onChange={formik.handleChange}
                      value={formik.values.fullName}
                      onBlur={formik.handleBlur}
                      name="fullName"
                    />
                    {formik.errors.fullName && formik.touched.fullName && (
                      <Text mb="-24px" ms={3} style={{ color: "red" }}>
                        {formik.errors.fullName}
                      </Text>
                    )}
                  </FormControl>
                  <FormControl mb="16px" mt={6}>
                    <FormLabel ms={2}>Birth Date</FormLabel>
                    <Input
                      onChange={formik.handleChange}
                      value={formik.values.birthDate}
                      onBlur={formik.handleBlur}
                      name="birthDate"
                      type="date"
                    />
                    {formik.errors.birthDate && formik.touched.birthDate && (
                      <Text mb="-24px" ms={3} style={{ color: "red" }}>
                        {formik.errors.birthDate}
                      </Text>
                    )}
                  </FormControl>
                  <FormControl mt={6} mb="16px">
                    <FormLabel ms={2}>Phone Number</FormLabel>
                    <Input
                      onChange={formik.handleChange}
                      value={formik.values.phoneNumber}
                      onBlur={formik.handleBlur}
                      name="phoneNumber"
                      type="text"
                    />
                    {formik.errors.phoneNumber &&
                      formik.touched.phoneNumber && (
                        <Text mb="-24px" ms={3} style={{ color: "red" }}>
                          {formik.errors.phoneNumber}
                        </Text>
                      )}
                  </FormControl>
                  <FormControl mb="16px" mt={6}>
                    <FormLabel ms={2}>Email</FormLabel>
                    <Input
                      onChange={formik.handleChange}
                      value={formik.values.email}
                      onBlur={formik.handleBlur}
                      name="email"
                      type="email"
                    />
                    {formik.errors.email && formik.touched.email && (
                      <Text mb="-24px" ms={3} style={{ color: "red" }}>
                        {formik.errors.email}
                      </Text>
                    )}
                  </FormControl>
                  <FormControl mt={6} mb="16px">
                    <FormLabel ms={2}>Password</FormLabel>

                    <InputGroup size="md">
                      <Input
                        name="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        pr="4.5rem"
                        type={show ? "text" : "password"}
                      />
                      <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                          {show ? "Hide" : "Show"}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    {formik.errors.password && formik.touched.password && (
                      <Text mb="-24px" ms={3} style={{ color: "red" }}>
                        {formik.errors.password}
                      </Text>
                    )}
                  </FormControl>
                </Flex>

                {/* //!Anotherone */}
                <Flex
                  // pb="20px"
                  w="45%"
                  flexDir="column"
                >
                  <FormControl mb="16px">
                    <FormLabel ms={2}>Department</FormLabel>
                    <Select
                      onChange={formik.handleChange}
                      value={formik.values.departmentId}
                      onBlur={formik.handleBlur}
                      name="departmentId"
                      placeholder="Select Department"
                    >
                      {isLoadingDepartments ? (
                        <option>Loading...</option>
                      ) : (
                        departments?.departments?.map((deps) => (
                          <option key={deps.id} value={deps.id}>
                            {deps.name}
                          </option>
                        ))
                      )}
                    </Select>
                    {formik.errors.departmentId &&
                      formik.touched.departmentId && (
                        <Text mb="-24px" ms={3} style={{ color: "red" }}>
                          {formik.errors.departmentId}
                        </Text>
                      )}
                  </FormControl>
                  <FormControl mt={6} mb="16px">
                    <FormLabel ms={2}>Doctor Type</FormLabel>
                    <Select
                      onChange={formik.handleChange}
                      value={formik.values.doctorTypeId}
                      onBlur={formik.handleBlur}
                      name="doctorTypeId"
                      placeholder="Select Doctor Type"
                    >
                      {isLoadingTypes ? (
                        <option>Loading...</option>
                      ) : (
                        types?.types?.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))
                      )}
                    </Select>
                    {formik.errors.doctorTypeId &&
                      formik.touched.doctorTypeId && (
                        <Text mb="-24px" ms={3} style={{ color: "red" }}>
                          {formik.errors.doctorTypeId}
                        </Text>
                      )}
                  </FormControl>

                  <FormControl mb="16px" mt={6}>
                    <FormLabel ms={2}>Working Schedule Start Time</FormLabel>
                    <Input
                      onChange={formik.handleChange}
                      value={formik.values.startTime}
                      onBlur={formik.handleBlur}
                      name="startTime"
                      type="time"
                    />
                    {formik.errors.startTime && formik.touched.startTime && (
                      <Text ms={3} style={{ color: "red" }}>
                        {formik.errors.startTime}
                      </Text>
                    )}
                  </FormControl>
                  <FormControl mb="16px" mt={6}>
                    <FormLabel ms={2}>Working Schedule End Time</FormLabel>
                    <Input
                      onChange={formik.handleChange}
                      value={formik.values.endTime}
                      onBlur={formik.handleBlur}
                      name="endTime"
                      type="time"
                    />
                    {formik.errors.endTime && formik.touched.endTime && (
                      <Text ms={3} style={{ color: "red" }}>
                        {formik.errors.endTime}
                      </Text>
                    )}
                  </FormControl>
                  <FormControl mb="16px" mt={6}>
                    <FormLabel ms={2}>Room Number</FormLabel>
                    <Input
                      onChange={formik.handleChange}
                      value={formik.values.roomNumber}
                      onBlur={formik.handleBlur}
                      name="roomNumber"
                      type="text"
                    />
                    {formik.errors.roomNumber && formik.touched.roomNumber && (
                      <Text mb="-24px" ms={3} style={{ color: "red" }}>
                        {formik.errors.roomNumber}
                      </Text>
                    )}
                  </FormControl>
                </Flex>
              </Flex>

              <VStack w="100%">
                <Button
                  background="green"
                  _hover={{ backgroundColor: "green.500" }}
                  colorScheme="blue"
                  isLoading={isLoading}
                  onClick={formik.handleSubmit}
                  m="40px 0 12px"
                >
                  Register Doctor
                </Button>
              </VStack>

              {/* 

 
                <FormControl  mt={6} mb="16px">
                  <FormLabel ms={2}>Photo</FormLabel>
                  <Box
                    {...getRootProps()}
                    borderWidth="2px"
                    p="20px"
                    cursor="pointer"
                  >
                    <input {...getInputProps()} />
                    <Text>Drag 'n' drop or click to select a photo</Text>
                  </Box>
                  {formik.touched.photo && formik.errors.photo && (
                    <Text ms={3} style={{ color: "red" }}>
                      {formik.errors.photo}
                    </Text>
                  )}
                  {formik.values.photo &&
                    formik.values.photo instanceof File && (
                      <img
                        src={URL.createObjectURL(formik.values.photo)}
                        alt="Doctor's photo"
                        style={{ marginTop: "10px", maxWidth: "200px" }}
                      />
                    )}
                </FormControl>

           
              */}
            </Box>
          </Flex>
        </Center>
      </Container>
    </Flex>
  );
}

export default DoctorRegister;
