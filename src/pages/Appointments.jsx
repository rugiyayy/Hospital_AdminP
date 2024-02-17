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

  const getAppointments = async () => {
    const params = {
      page,
      perPage,
      doctorName: searchQuery,
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
    isLoading,
    data: appointments,
    isError,
    error,
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
    if (!isLoading && deleteAppointment.isSuccess) {
      queryClient.invalidateQueries("appointment");
    }
  }, [isLoading, deleteAppointment.isSuccess]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("doctorName", searchQuery.toString());
    urlParams.set("isActive", isActiveFilter);
    urlParams.set("page", page.toString());
    urlParams.set("perPage", perPage.toString());

    navigate(`?${urlParams.toString()}`);
  }, [searchQuery, isActiveFilter, page, perPage, navigate]);

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

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleResetAll = () => {
    setSearchQuery("");
    setIsActiveFilter(null);
    setStartDate("");
    setEndDate("");
    setPage(1);
    setPerPage(5);
  };
  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setPage(1);
  };
  const currentDate = new Date().toISOString().split("T")[0];

  console.log(appointments?.totalCount > 0);
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

          {appointments != null ? (
            <Button
              fontWeight="700"
              color="green"
              fontSize="16px"
              padding="0 3rem"
            >
              <Link to="/scheduleAppointment">Schedule appointment</Link>
            </Button>
          ) : (
            <Button
              fontWeight="700"
              color="green"
              disabled
              fontSize="16px"
              padding="0 3rem"
            >
              <Link to="/scheduleAppointment">Schedule appointment</Link>
            </Button>
          )}
          {/* //! Seacrh Input */}
          {/* {appointments?.totalCount !=0 && ( */}
          
          <Box>
            <Button
              onClick={handleResetAll}
              colorScheme="red"
              marginLeft="10px"
            >
              Reset All filters
            </Button>
            <InputGroup w="50%" margin="3rem auto">
              <InputLeftElement pointerEvents="none">
                <Search2Icon marginLeft={3} color="gray.600" />
              </InputLeftElement>
              <Input
                autoFocus
                borderRadius="20px"
                type="search"
                placeholder="Search by Doctor's Full Name"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </InputGroup>

            <Box width="20%" margin="0 60px ">
              <Select
                value={
                  isActiveFilter === null
                    ? "all"
                    : isActiveFilter
                    ? "active"
                    : "inactive"
                }
                onChange={(e) => {
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
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </Box>
            <InputGroup w="50%" margin="3rem auto">
              <InputLeftElement pointerEvents="none">
                <CalendarIcon marginLeft={3} color="gray.600" />
              </InputLeftElement>
              <Input
                borderRadius="20px"
                type="date"
                onKeyDown={(e) => e.preventDefault()}
                placeholder="Start Date"
                value={startDate}
                onChange={handleStartDateChange}
              />
              <InputLeftElement pointerEvents="none">
                <CalendarIcon marginLeft={3} color="gray.600" />
              </InputLeftElement>
              <Input
                borderRadius="20px"
                type="date"
                placeholder="End Date"
                onKeyDown={(e) => e.preventDefault()}
                value={endDate}
                min={startDate}
                onChange={handleEndDateChange}
              />
            </InputGroup>
            <Button onClick={handleReset} colorScheme="blue" marginLeft="10px">
              Reset Date
            </Button>
          </Box>
          {/* )} */}
          {/* <CreateDepartmentModal initialData={selectedAppointment} /> */}
        </Heading>
        {appointments?.totalCount > 0 && (
          <>
            {isLoading ? (
              <Flex justify="center" align="center" minHeight="100vh">
                <Spinner size="xl" />
              </Flex>
            ) : (
              <Table w="90%" variant="simple" margin="50px auto ">
                <Thead>
                  <Tr>
                    <Th></Th>
                    <Th textAlign="center">Doctor Full Name </Th>
                    <Th textAlign="center">Patient Full Name</Th>
                    <Th textAlign="center">Date</Th>
                    <Th textAlign="center">Service Cost</Th>
                    <Th textAlign="center">Appointment Status</Th>
                    <Th textAlign="ceneter"></Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {appointments?.appointments?.map((appointment, i) => (
                    <Tr key={appointment?.id}>
                      {/* <Td>{i + 1 + page * perPage - perPage}</Td> */}
                      <Td width="5%">{i + 1 + page * perPage - perPage}</Td>

                      <Td width="25%" textAlign="center">
                        {appointment?.doctorFullName}
                      </Td>
                      <Td width="30%" textAlign="center">
                        {appointment?.patientFullName}
                      </Td>
                      <Td width="15%" textAlign="center">
                        {appointment?.formattedStartTime}
                      </Td>
                      <Td width="10%" textAlign="center">
                        {appointment?.doctor?.serviceCost}
                      </Td>

                      <Td
                        width="5%"
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
                </Tbody>
              </Table>
            )}

            <ButtonGroup>
              <Button
                onClick={handlePreviousPage}
                isDisabled={page === 1}
                _active={{
                  bg: "#dddfe2",
                  transform: "scale(0.98)",
                  borderColor: "#bec3c9",
                }}
                _focus={{
                  boxShadow:
                    "0 0 1px 2px rgba(88, 144, 255, .75), 0 1px 1px rgba(0, 0, 0, .15)",
                }}
              >
                Previous Page
              </Button>
              <Button
                onClick={() => setPage((prevPage) => prevPage + 1)}
                isDisabled={appointments?.appointments?.length < perPage * page}
                _active={{
                  bg: "#dddfe2",
                  transform: "scale(0.98)",
                  borderColor: "#bec3c9",
                }}
                _focus={{
                  boxShadow:
                    "0 0 1px 2px rgba(88, 144, 255, .75), 0 1px 1px rgba(0, 0, 0, .15)",
                }}
              >
                Next Page
              </Button>
            </ButtonGroup>
          </>
        )}
        {appointments?.totalCount === 0 ||
          ((isActiveFilter != null || searchQuery != "") && (
            <Center
              marginTop="5rem"
              fontWeight="700"
              fontSize="30px"
              color={colors.primary}
            >
              No appointments yet, add appointments
            </Center>
          ))}
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

        {appointments == null && error != null && (
          <Center
            marginTop="5rem"
            fontWeight="700"
            fontSize="30px"
            color={colors.primary}
          >
            Failed to get Appointments
          </Center>
        )}
      </Container>
    </Flex>
  );
}
