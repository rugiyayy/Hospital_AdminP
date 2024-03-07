import { debounce } from "lodash";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Container,
  Flex,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Radio,
  Select,
  Spinner,
  Table,
  TagLabel,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  color,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Spinner1, colors } from "../components/Constants";
import { httpClient } from "../utils/httpClient";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { CalendarIcon, Search2Icon } from "@chakra-ui/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import GetSlotsModal from "../hooks/appointmentsHooks/GetSlotsModal";
import AppointmentDetailModal from "../components/AppointmentDetailModal";

export default function Appointments() {
  const queryClient = useQueryClient();
  const { token } = useSelector((state) => state.account);
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedAppointmentDetail, setSelectedAppointmentDetail] = useState(null);


  const getAppointments = async () => {
    const params = {
      page,
      perPage,
      searchQuery: searchQuery,
      isActive: isActiveFilter,
      startDate: startDate,
      endDate: endDate,
    };
    const response = await httpClient.get("/appointment", {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

  const {
    error: appointmentError,
    isLoading: appointmentLoading,
    data: appointments,
  } = useQuery(
    [
      "appointment",
      isActiveFilter,
      page,
      perPage,
      searchQuery,
      startDate,
      endDate,
    ],
    getAppointments,
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  const deleteAppointment = useMutation(
    (id) =>
      httpClient.delete(`/appointment/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    {
      onSuccess: () => {
        toast({
          title: "Appointment canceled",
          description: "The appointment has been successfully deleted.",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });
      },
      onError: (error) => {
        console.error("Error deleting appointment", error);
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

  useEffect(() => {
    if (!appointmentLoading && deleteAppointment.isSuccess) {
      queryClient.invalidateQueries("appointment");
    }
  }, [appointmentLoading, deleteAppointment.isSuccess]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("isActive", isActiveFilter);
    urlParams.set("page", page.toString());
    urlParams.set("perPage", perPage.toString());

    navigate(`?${urlParams.toString()}`);
  }, [isActiveFilter, page, perPage, navigate]);

  const handleSearchChange = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
  };

  const handleStartDateChange = (e) => {
    e.preventDefault();
    const startDateValue = e.target.value;
    setStartDate(startDateValue);
    if (endDate && new Date(startDateValue) > new Date(endDate)) {
      setEndDate("");
    }
  };

  const handleEndDateChange = (e) => {
    e.preventDefault();
    setEndDate(e.target.value);
  };

  // const handlePreviousPage = () => {
  //   if (page > 1) {
  //     setPage(page - 1);
  //   }
  // };

  const handleResetAll = () => {
    setSearchQuery("");
    setIsActiveFilter(null);
    setStartDate("");
    setEndDate("");
    setPage(1);
  };
  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setPage(1);
  };
  const currentDate = new Date().toISOString().split("T")[0];
  console.log(appointments);

  return (
    <Flex>
      <Box width="15%"></Box>
      <Container maxW="85%">
        <Heading
          margin="20px 0"
          textAlign="center"
          size="md"
          color={colors.secondary}
        >
          <Text as="h1" marginBottom="20px">
            Appointment{" "}
          </Text>

          {/* <Button
            fontWeight="700"
            color="green"
            fontSize="16px"
            padding="0 3rem"
          >
            <Link to="/scheduleAppointment">Schedule appointment</Link>
          </Button> */}
          <GetSlotsModal initialData={selectedAppointment} />

          {/* //! Seacrh Input */}
          {/* {appointments?.totalCount !=0 && ( */}
        </Heading>

        {appointmentError ? (
          <Text
            margin="4rem 0"
            padding="5rem"
            color={colors.primary}
            fontWeight="700"
            fontSize="32px"
            textAlign="center"
            as="h2"
          >
            Something went wrong, please try again later
          </Text>
        ) : appointmentLoading ? (
          <Spinner1 />
        ) : appointments?.apps?.length === 0 ? (
          <Text
            margin="4rem 0"
            padding="5rem"
            color={colors.primary}
            fontWeight="700"
            fontSize="32px"
            textAlign="center"
            as="h2"
          >
            No appointments
          </Text>
        ) : (
          <>
            <Flex flexDir="column" gap="8px">
              <Flex gap="10px" justifyContent="center" alignItems="center">
                <Text
                  color={colors.paragraph}
                  fontSize="18px"
                  fontWeight="600"
                  textAlign="center"
                >
                  Select Date{" "}
                  <span
                    style={{
                      margin: "0 20px",
                      color: colors.secondary,
                      fontSize: "16px",
                      fontWeight: "500",
                    }}
                  >
                    or
                  </span>
                </Text>
                <Button
                  onClick={handleReset}
                  backgroundColor="white"
                  color={colors.primary}
                  _hover={{
                    backgroundColor: colors.paragraph,
                    color: "white",
                    border: "2px solid ",
                  }}
                  border="2px solid"
                  borderColor={colors.primary}
                >
                  Reset Date
                </Button>
              </Flex>

              <InputGroup
                justifyContent="space-between"
                w="40%"
                margin="20px auto"
              >
                <Input
                  w="40%"
                  borderRadius="20px"
                  type="date"
                  onKeyDown={(e) => e.preventDefault()}
                  placeholder="Start Date"
                  value={startDate}
                  onChange={handleStartDateChange}
                />
                <Input
                  w="40%"
                  borderRadius="20px"
                  type="date"
                  placeholder="End Date"
                  onKeyDown={(e) => e.preventDefault()}
                  value={endDate}
                  min={startDate}
                  onChange={handleEndDateChange}
                />
              </InputGroup>
              <Flex gap="4rem" justifyContent="center" alignItems="center">
                <Select
                  w="13%"
                  value={
                    isActiveFilter === null
                      ? "all"
                      : isActiveFilter
                      ? "active"
                      : "inactive"
                  }
                  onChange={(e) => {
                    setPage(1);
                    const selectedValue = e.target.value;
                    setIsActiveFilter(
                      selectedValue === "all"
                        ? null
                        : selectedValue === "active"
                        ? true
                        : false
                    );
                  }}
                >
                  <option value="all"> Select Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Select>
                <Button
                  w="13%"
                  padding="22px"
                  onClick={handleResetAll}
                  backgroundColor="white"
                  color={colors.primary}
                  _hover={{
                    backgroundColor: colors.paragraph,
                    color: "white",
                    border: "2px solid ",
                  }}
                  border="2px solid"
                  borderColor={colors.primary}
                >
                  Reset All filters
                </Button>
              </Flex>
            </Flex>

            <InputGroup w="50%" margin="3rem auto">
              <InputLeftElement pointerEvents="none">
                <Search2Icon marginLeft={3} color="gray.600" />
              </InputLeftElement>
              <Input
                borderRadius="20px"
                type="search"
                placeholder="Search by Doctor's Full Name"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </InputGroup>

            {/* )} */}
            {/* <CreateDepartmentModal initialData={selectedAppointment} /> */}
            <Box height="60vh" margin="3rem 0">
              <Table w="100%" variant="simple" margin="50px auto ">
                {appointments?.appointments?.length > 0 ? (
                  <>
                    <Thead>
                      <Tr>
                        <Th></Th>
                        <Th textAlign="center">Doctor Full Name </Th>
                        <Th textAlign="center">Patient Full Name</Th>
                        <Th textAlign="center">Date</Th>
                        <Th textAlign="center">Appointment Status</Th>
                        <Th textAlign="center">For more details</Th>
                        <Th textAlign="ceneter"></Th>
                      </Tr>
                    </Thead>

                    <Tbody>
                      {appointments?.appointments?.map((appointment, i) => (
                        <Tr key={appointment?.id}>
                          <Td width="5%">{i + 1 + page * perPage - perPage}</Td>

                          <Td width="20%" textAlign="center">
                            {appointment?.doctorFullName}
                          </Td>
                          <Td width="20%" textAlign="center">
                            {appointment?.patientFullName}
                          </Td>
                          <Td width="20%" textAlign="center">
                            {appointment?.formattedStartTime}
                          </Td>

                          <Td
                            width="15%"
                            textAlign="center"
                            fontWeight="700"
                            color={
                              appointment?.isActive === true
                                ? "green"
                                : colors.primary
                            }
                          >
                            {appointment?.isActive === true
                              ? "Active"
                              : appointment?.isActive === false
                              ? "Inactive"
                              : "Not specified"}
                          </Td>
                          <Td
                            textAlign="end"
                            w="15%"
                            onClick={() => setSelectedAppointmentDetail(appointment)}
                          >
                            <Button>Get more</Button>
                          </Td>
                          <Td
                            width="5%"
                            gap="12px"
                            textAlign="end"
                            fontWeight="700"
                          >
                            <Button
                              type="button"
                              onClick={() =>
                                deleteAppointment.mutate(appointment.id)
                              }
                              marginLeft="12px"
                              color="red"
                            >
                              Cancel
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                       <AppointmentDetailModal
                      isOpen={!!selectedAppointmentDetail}
                      onClose={() => setSelectedAppointmentDetail(null)}
                      appointment={selectedAppointmentDetail}
                    />
                    </Tbody>
                  </>
                ) : (
                  <Text
                    color={colors.primary}
                    fontWeight="700"
                    fontSize="24px"
                    textAlign="center"
                    padding="3rem 0 "
                  >
                    No{" "}
                    {isActiveFilter === null
                      ? " "
                      : isActiveFilter
                      ? "active"
                      : "inactive"}{" "}
                    appointments found.
                  </Text>
                )}
              </Table>
            </Box>

            <Pagination
              totalCount={appointments?.totalCount}
              perPage={perPage}
              setPage={setPage}
              page={page}
            />
          </>
        )}

        {/* {appointments?.totalCount === 0 &&
          (isActiveFilter === null || searchQuery === "") && (
            <Center
              marginTop="5rem"
              fontWeight="700"
              fontSize="30px"
              color={colors.primary}
            >
              No appointment matcheing
            </Center>
          )} */}

        {/* {appointments == null && error != null && (
          <Center
            marginTop="5rem"
            fontWeight="700"
            fontSize="30px"
            color={colors.primary}
          >
            Failed to get Appointments
          </Center>
        )} */}
      </Container>
    </Flex>
  );
}
