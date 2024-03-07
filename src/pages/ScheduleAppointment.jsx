import {
  useColorModeValue,
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  FormControl,
  FormLabel,
  GridItem,
  Input,
  Select,
  SimpleGrid,
  Text,
  Textarea,
  VStack,
  extendTheme,
  useToast,
  Center,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import React, { useState } from "react";
import { httpClient } from "../utils/httpClient";
import { useMutation, useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { appDetailsSchema } from "../validations/appDetailsSchema";
import { Spinner1, colors } from "../components/Constants";

export default function ScheduleAppointment() {
  const theme = extendTheme({
    textStyles: {
      a: {
        fontSize: "14px",
        fontWeight: "700",
        color: "white",
        bg: colors.secondary,
        marginTop: "12px",
        borderRadius: "20px",
        padding: "24px 16px",
        _hover: {
          bg: colors.primary,
        },
        transition: ".2s ease",
        textTransform: "uppercase",
        letterSpacing: "1px",
      },
    },
  });
  const bgColor = useColorModeValue("white", "gray.700");
  const { token } = useSelector((state) => state.account);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const doctorId = queryParams.get("doctorId");
  const selectedDate = queryParams.get("selectedDate");
  const parsedDoctorId = parseInt(doctorId);
  const navigate = useNavigate();
  const toast = useToast();

  const getDoctorName = async () => {
    const response = await httpClient.get(`/doctor/${parsedDoctorId}`);
    return response.data.fullName;
  };
  const {
    isLoading: isDoctorLoading,
    data: doctorData,
    error: doctorError,
  } = useQuery(["doctor", parsedDoctorId], getDoctorName, {
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  const getPatients = (token) => {
    return httpClient.get("/patient", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  const {
    isLoading: patientLoading,
    data: patients,
    error: patientError,
  } = useQuery(["patient"], () => getPatients(), {
    refetchOnWindowFocus: false,
  });

  const createAppointment = useMutation(
    (formData) =>
      httpClient.post("/appointment", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    {
      onSuccess: () => {
        toast({
          title: "Appointment Created",
          description: "Your appointment has been successfully scheduled.",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });
        navigate(`/allAppointments`);
      },
      onError: (error) => {
        console.error("Error creating appointment:", error);
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

  const getTimeSlot = () => {
    return httpClient.get("/Appointment/AvailableTimeSlots", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        selectedDate: selectedDate,
        doctorId: parsedDoctorId,
      },
    });
  };
  const {
    isLoading: timeSlotLoading,
    data: timeSlot,
    error: timeSlotError,
  } = useQuery(
    ["availableTimeSlots", parsedDoctorId, selectedDate],
    getTimeSlot,
    {
      refetchOnWindowFocus: false,
      refetchInterval: false,
    }
  );

  const onSubmit = (values) => {
    formik.validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        const formData = {
          StartTime: values.startTime,
          DoctorId: parsedDoctorId,
          PatientId: values.patientId,
          Description: values.description,
        };

        createAppointment.mutate(formData);
      }
    });
  };

  const formik = useFormik({
    initialValues: {
      startTime: selectedDate,
      patientId: null,
      doctorId: parsedDoctorId,
      description: "",
    },
    validationSchema: appDetailsSchema,
    onSubmit: onSubmit,
  });
  const [selectedTime, setSelectedTime] = useState(null);

  const handleSelectTime = (time) => {
    setSelectedTime(selectedTime === time ? null : time);
    const startTime =
      selectedTime === time ? selectedDate : `${selectedDate} ${time}`;
    formik.setFieldValue("startTime", startTime);
  };

  //!!!!!!!!!!!!!!!!!!!!!!
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    const filtered = patients?.data?.patients?.filter((patient) =>
      patient.fullName.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredPatients(filtered);
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setFilteredPatients([]);
    setSearchQuery(patient.fullName);
    formik.setFieldValue("patientId", patient.id);
  };

  if (patientLoading) {
    return <Spinner1 />;
  }
  return (
    <Flex>
      <Box width="15%"></Box>

      <Container
        maxW="85%"
        padding="2rem 0"
        style={{
          background: `url(${require("../assets/img/img/bg2.avif")}) `,
        }}
        mt="2rem"
      >
        <Center>
          <Box bg={bgColor} rounded="lg" w="50%" p={{ base: 5, sm: 10 }}>
            <Flex
              w="100%"
              border="4px solid grey"
              flexDir="column"
              justifyContent="space-between"
              alignItems="center"
            >
              <Flex
                justifyContent="center"
                alignItems="center"
                flexWrap="wrap"
                gap="8px"
              >
                <VStack>
                  {isDoctorLoading && <p>Loading doctor information...</p>}
                  {doctorError && (
                    <p>
                      Error fetching doctor information: {doctorError.message}
                    </p>
                  )}
                  {doctorData && (
                    <Text
                      fontSize="18px"
                      fontWeight="600"
                      color={colors.secondary}
                    >
                      Doctor:
                      <Text padding="0 20px" color={colors.primary} as="span">
                        {doctorData}
                      </Text>
                    </Text>
                  )}
                  {timeSlotLoading && <p>Loading...</p>}
                  {timeSlotError && <p>Error: {timeSlotError.message}</p>}
                  {timeSlot && (
                    <Text
                      fontSize="18px"
                      margin="0 28px "
                      fontWeight="600"
                      color={colors.secondary}
                    >
                      Available time slots for
                      <Text padding="0 20px" color={colors.primary} as="span">
                        {selectedDate} :
                      </Text>
                    </Text>
                  )}
                </VStack>
                <SimpleGrid
                  margin="20px"
                  border="5px solid red"
                  templateColumns="repeat(4, 4fr)"
                  gap="20px"
                >
                  {timeSlot?.data?.map((time, i) => (
                    <GridItem w="105px">
                      <Button
                        w="100%"
                        key={i}
                        style={{
                          backgroundColor:
                            selectedTime === time
                              ? colors.primary
                              : colors.secondary,
                        }}
                        gap="10px"
                        name="startTime"
                        justifyContent="center"
                        alignItems="center"
                        sx={theme.textStyles.a}
                        onClick={() => handleSelectTime(time)}
                      >
                        <Text> {time}</Text>
                      </Button>
                    </GridItem>
                  ))}
                </SimpleGrid>
                {timeSlotLoading && <p>Loading...</p>} {/* potom napishu */}
                {timeSlotError && <p>Error: {timeSlotError.message}</p>}
              </Flex>

              <Flex
                flexDirection="column"
                // gap="40px"
                w="88%"
                p="20px"
                border="4px solid red"
              >
                <FormControl gap="20px">
                  <FormLabel>Appointment description(details) :</FormLabel>
                  <Textarea
                    placeholder="Checkup..."
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="description"
                    maxLength={29}
                  />

                  {formik.touched.description && formik.errors.description && (
                    <Text ms={2} color="red" width="58%">
                      {formik.errors.description}
                    </Text>
                  )}
                  <FormControl gap="20px">
                    <Flex justifyContent="space-between">
                      {formik.errors.patientId && formik.touched.patientId && (
                        <Text color="red" width="58%">
                          {formik.errors.patientId}
                        </Text>
                      )}
                    </Flex>
                    <Flex
                      alignItems="center"
                      margin="20px 0 50px"
                      justifyContent="space-between"
                    >
                      <FormControl gap="20px">
                        <Input
                          placeholder="Enterthe Patient's full name"
                          value={searchQuery}
                          onChange={handleSearchChange}
                        />
                        {filteredPatients.length > 0 && (
                          <Box maxHeight="150px" overflowY="auto">
                            {filteredPatients.map((patient, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                onClick={() => handleSelectPatient(patient)}
                                width="100%"
                                textAlign="left"
                              >
                                {patient.fullName}
                              </Button>
                            ))}
                          </Box>
                        )}
                      </FormControl>
                    </Flex>
                  </FormControl>
                  <ButtonGroup margin="20px 0 0">
                    {" "}
                    <Button onClick={() => navigate(`/allAppointments`)}>
                      Go Back to Previous Page
                    </Button>
                    <Button
                      isDisabled={
                        selectedTime === null ||
                        formik.errors.description ||
                        formik.errors.patientId
                      }
                      onClick={formik.handleSubmit}
                    >
                      Make Appointment
                    </Button>
                  </ButtonGroup>
                </FormControl>
              </Flex>
            </Flex>
          </Box>
        </Center>
      </Container>
    </Flex>
  );
}
