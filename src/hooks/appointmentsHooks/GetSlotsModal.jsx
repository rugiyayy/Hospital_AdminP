import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
// import useSignInModal from "../hooks/useSignInModal";
import { useSelector } from "react-redux";
import useCreateDoctorType from "../../hooks/doctorTypesHooks/useCreateDoctorType";
import { useFormik } from "formik";
import { appointmentSchema } from "../../validations/appointmentSchema";
import { httpClient } from "../../utils/httpClient";
import { useQuery } from "react-query";

export default function GetSlotsModal() {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose: _onClose } = useDisclosure();
  
  const selectRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const { token, userName } = useSelector((state) => state.account);
  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      selectedDate: "",
      fullName: "",
      doctorId: null,
    },
    validationSchema: appointmentSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const response = await httpClient.get(
          "/Appointment/AvailableTimeSlots",
          {
            params: {
              selectedDate: values.selectedDate,
              doctorId: values.doctorId,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        navigate(
          `/schedule?doctorId=${values.doctorId}&selectedDate=${values.selectedDate}`
        );
      } catch (error) {
        console.error("Error fetching available time slots:", error);
        toast({
          title: "Error",
          description:
            error.response.data ||
            "Uppss something went wrong .. check your connection or logout and sign in again",
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
  const onClose = () => {
    formik.resetForm();
    _onClose();
  };
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const next30Days = new Date();
  next30Days.setDate(next30Days.getDate() + 30);

  const getDoctors = (token) => {
    return httpClient.get("/doctor", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  const {
    isLoading: doctorLoading,
    data: doctor,
    error: doctorError,
  } = useQuery(["doctor"], () => getDoctors(), {
    refetchOnWindowFocus: false,
  });



  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    const filtered = doctor?.data?.doctors?.filter((doctor) =>
    doctor.fullName.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredDoctors(filtered);
  };

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setFilteredDoctors([]);
    setSearchQuery(doctor.fullName);
    formik.setFieldValue("doctorId", doctor.id);
  };

 

  return (
    <>
      <Button
        onClick={onOpen}
        fontWeight="700"
        color="green"
        fontSize="16px"
        marginLeft="16px"
        padding="0 3rem"
        border="2px solid"
        background="white"
      >
        Schedule an Appointment
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">
            <Text as="h1" fontSize="28px" fontWeight="bold">
              Get Slots
            </Text>{" "}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Choose Date</FormLabel>
              <Input
                type="date"
                name="selectedDate"
                value={formik.values.selectedDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                min={new Date().toISOString().split("T")[0]}
                max={next30Days.toISOString().split("T")[0]}
              />
              {formik.errors.selectedDate && formik.touched.selectedDate && (
                <Text color="red" width="38%">
                  {formik.errors.selectedDate}
                </Text>
              )}
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Select Doctor</FormLabel>
              <Input
                placeholder="Search doctor by Name"
                value={searchQuery}
                onChange={handleSearchChange}
                onBlur={formik.handleBlur}

              />
              {filteredDoctors.length > 0 && (
                <Box maxHeight="200px" overflowY="auto">
                  {filteredDoctors.map((doctor, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => handleSelectDoctor(doctor)}
                      width="100%"
                      textAlign="left"
                    >
                      {doctor.fullName}
                    </Button>
                  ))}
                </Box>
              )}
              {formik.errors.doctorId && formik.touched.doctorId && (
                <Text color="red" width="58%">
                  {formik.errors.doctorId}
                </Text>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter margin="0 auto 12px">
            <Button
              padding="0 32px "
              onClick={formik.handleSubmit}
              isLoading={isLoading}
              colorScheme="green"
              mr={3}
            >
              Next
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
