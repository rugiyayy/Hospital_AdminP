import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import useSignUpDoctorModal from "../../hooks/doctorsHooks/useSignUpDoctor";
import { httpClient } from "../../utils/httpClient";
import { useQuery } from "react-query";

export default function DoctorSignUpModal(prop) {
  const { onOpen, isLoading, onClose, formik, isOpen } = useSignUpDoctorModal();
  // const { userName } = useSelector((x) => x.account);
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const [selectedImage, setSelectedImage] = useState(null);
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      formik.setFieldValue("photo", file);
    }
  };
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
  return (
    <>
      <Button
        fontWeight="700"
        color="green"
        fontSize="16px"
        marginLeft="16px"
        padding="0 3rem"
        onClick={onOpen}
      >
        Add Doctor
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">
            <Text as="h1" fontSize="28px" fontWeight="bold">
              Sign Up Doctor
            </Text>{" "}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Full Name</FormLabel>
              <Input
                onChange={formik.handleChange}
                value={formik.values.fullName}
                onBlur={formik.handleBlur}
                name="fullName"
              />
              {formik.errors.fullName && formik.touched.fullName && (
                <span style={{ color: "red" }}>{formik.errors.fullName}</span>
              )}
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Doctor Type</FormLabel>
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
              {formik.errors.doctorTypeId && formik.touched.doctorTypeId && (
                <span style={{ color: "red" }}>
                  {formik.errors.doctorTypeId}
                </span>
              )}
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Department ID</FormLabel>
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
              {formik.errors.departmentId && formik.touched.departmentId && (
                <span style={{ color: "red" }}>
                  {formik.errors.departmentId}
                </span>
              )}
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Photo</FormLabel>
              <Input
                onChange={handleImageChange}
                accept="image/*"
                // value={formik.values.photo}
                onBlur={formik.handleBlur}
                name="photo"
                type="file"
              />{" "}
              {selectedImage && (
                <Box mt={2}>
                  <img
                    src={selectedImage}
                    alt="Selected"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                </Box>
              )}
              {formik.errors.photo && formik.touched.photo && (
                <span style={{ color: "red" }}>{formik.errors.photo}</span>
              )}
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Doctor Detail Phone Number</FormLabel>
              <Input
                onChange={formik.handleChange}
                value={formik.values.phoneNumber}
                onBlur={formik.handleBlur}
                name="phoneNumber"
                type="text"
              />
              {formik.errors.phoneNumber && formik.touched.phoneNumber && (
                <span style={{ color: "red" }}>
                  {formik.errors.phoneNumber}
                </span>
              )}
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Doctor Detail Email</FormLabel>
              <Input
                onChange={formik.handleChange}
                value={formik.values.email}
                onBlur={formik.handleBlur}
                name="email"
                type="email"
              />
              {formik.errors.email && formik.touched.email && (
                <span style={{ color: "red" }}>{formik.errors.email}</span>
              )}
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Doctor Detail Birth Date</FormLabel>
              <Input
                onChange={formik.handleChange}
                value={formik.values.birthDate}
                onBlur={formik.handleBlur}
                name="birthDate"
                type="date"
              />
              {formik.errors.birthDate && formik.touched.birthDate && (
                <span style={{ color: "red" }}>{formik.errors.birthDate}</span>
              )}
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Working Schedule Start Time</FormLabel>
              <Input
                onChange={formik.handleChange}
                value={formik.values.startTime}
                onBlur={formik.handleBlur}
                name="startTime"
                type="time"
              />
              {formik.errors.startTime && formik.touched.startTime && (
                <span style={{ color: "red" }}>{formik.errors.startTime}</span>
              )}
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Working Schedule End Time</FormLabel>
              <Input
                onChange={formik.handleChange}
                value={formik.values.endTime}
                onBlur={formik.handleBlur}
                name="endTime"
                type="time"
              />
              {formik.errors.endTime && formik.touched.endTime && (
                <span style={{ color: "red" }}>{formik.errors.endTime}</span>
              )}
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Examination Room Room Number</FormLabel>
              <Input
                onChange={formik.handleChange}
                value={formik.values.roomNumber}
                onBlur={formik.handleBlur}
                name="roomNumber"
                type="text"
              />
              {formik.errors.roomNumber && formik.touched.roomNumber && (
                <span style={{ color: "red" }}>{formik.errors.roomNumber}</span>
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
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              {formik.errors.password && formik.touched.password && (
                <span style={{ color: "red" }}>{formik.errors.password}</span>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter gap="12px" flexDirection="column" margin="0 auto 12px">
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
            <Button padding="0 24px" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
