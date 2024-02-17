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
  Select,
  SimpleGrid,
  Text,
  Textarea,
  VStack,
  extendTheme,
  useToast,
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
        transition: ".6s ease",
        textTransform: "uppercase",
        letterSpacing: "1px",
      },
    },
  });
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
    data: patient,
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
        navigate(`/scheduleAppointment`);
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
    const formData = {
      StartTime: values.startTime,
      DoctorId: parsedDoctorId,
      PatientId: values.patientId,
      Description: values.description,
    };

    createAppointment.mutate(formData);
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

  if (patientLoading) {
    return <Spinner1 />;
  }
  return (
    <Flex>
      <Box width="15%"></Box>
      <Container maxW="85%">
        <Box>
          <Flex w="100%" justifyContent="space-between" alignItems="center">
            <Flex width="45%" flexWrap="wrap" gap="8px">
              <VStack>
                {isDoctorLoading && <p>Loading doctor information...</p>}
                {doctorError && (
                  <p>
                    Error fetching doctor information: {doctorError.message}
                  </p>
                )}
                {doctorData && <Text>{`Doctor: ${doctorData}`}</Text>}
                {timeSlotLoading && <p>Loading...</p>}
                {timeSlotError && <p>Error: {timeSlotError.message}</p>}
                {timeSlot && (
                  <Text>{`Available time slots for ${selectedDate}:`}</Text>
                )}
              </VStack>
              <SimpleGrid templateColumns="repeat(4, 4fr)" gap="20px">
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
              border="1px solid red"
              width="45%"
              flexDirection="column"
              gap="40px"
            >
              <Text>Choose One Available date</Text>
              <FormControl gap="20px">
                <FormLabel>
                  write about your symptoms or another thing{" "}
                </FormLabel>
                <Textarea
                  placeholder="checkup..."
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="description"
                  maxLength={29}
                />

                {formik.touched.description && formik.errors.description ? (
                  <div>{formik.errors.description}</div>
                ) : null}
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
                    <Select
                      width="58%"
                      name="patientId"
                      value={formik.values.patientId}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <option selected disabled value="default">
                        Select Patient
                      </option>
                      {patient?.data?.map((x, i) => {
                        return (
                          <option key={i} value={x.id}>
                            {x.fullName}
                          </option>
                        );
                      })}
                    </Select>
                  </Flex>
                </FormControl>
                <ButtonGroup margin="20px 0 0">
                  {" "}
                  <Button onClick={() => navigate(`/scheduleAppointment`)}>
                    Go Back to Previous Page
                  </Button>
                  <Button onClick={formik.handleSubmit}>
                    Make Appointment
                  </Button>
                </ButtonGroup>
              </FormControl>
            </Flex>
          </Flex>
        </Box>
      </Container>
    </Flex>
  );
}
