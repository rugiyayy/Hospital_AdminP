import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Spinner1, colors } from "../components/Constants";
import { httpClient } from "../utils/httpClient";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import SignPatientUpModal from "../components/patientModal/SignUpModal";
import UpdatePatientModal from "../components/patientModal/UpdatePatientModal";
import { useLocation, useNavigate } from "react-router-dom";
import { Search2Icon } from "@chakra-ui/icons";
import Pagination from "../components/Pagination";
import PatientDetailModal from "../components/PatientDetailModal";

export default function Patient() {
  const { token, role } = useSelector((state) => state.account);
  const toast = useToast();
  const queryClient = useQueryClient();
  const [selectedPatient, setselectedPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPatientDetails, setselectedPatientDetails] = useState(null);

  const getPatients = async () => {
    const params = {
      page,
      perPage,
      patientFullName: searchQuery,
    };

    const response = await httpClient.get("/patient", {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };
  const {
    isLoading,
    data: patientsData,
    error: patientError,
  } = useQuery(["patient", page, perPage, searchQuery], getPatients, {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("page", page.toString());
    urlParams.set("perPage", perPage.toString());

    navigate(`?${urlParams.toString()}`);
  }, [page, perPage, navigate]);

  const deletePatient = useMutation(
    (id) =>
      httpClient.delete(`/patient/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    {
      onSuccess: () => {
        toast({
          title: "Patient account deleted",
          description: "Patient account has been successfully deleted.",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });
      },
      onError: (error) => {
        console.error("Error deleting patient account", error);
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
    if (!isLoading && deletePatient.isSuccess) {
      queryClient.invalidateQueries("patient");
    }
  }, [isLoading, deletePatient.isSuccess, queryClient]);

  const handleUpdateClick = (patient) => {
    setselectedPatient(patient);
  };

  const handleSearchChange = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
    setPage(1);
  };

  console.log(patientsData?.patients?.length);

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
          <Text mb="20px">Patients</Text>

          <SignPatientUpModal initialData={selectedPatient} />
        </Heading>

        {patientError ? (
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
        ) : isLoading ? (
          <Spinner1 />
        ) : patientsData?.pDta?.length === 0 ? (
          <Text
            margin="4rem 0"
            padding="5rem"
            color={colors.primary}
            fontWeight="700"
            fontSize="32px"
            textAlign="center"
            as="h2"
          >
            No patients
          </Text>
        ) : (
          <>
            <InputGroup w="50%" margin="3rem auto">
              <InputLeftElement pointerEvents="none">
                <Search2Icon marginLeft={3} color="gray.600" />
              </InputLeftElement>
              <Input
                borderRadius="20px"
                type="search"
                placeholder="Search by Patients's Full Name"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </InputGroup>

            {patientsData?.patients?.length > 0 ? (
              <Box h="65vh" margin="0 auto">
                <Table w="80%" margin="50px auto">
                  <Thead>
                    <Tr>
                      <Th></Th>
                      <Th>Patient Full Name </Th>
                      <Th textAlign="center">Email</Th>
                      <Th textAlign="center">More Detais</Th>
                      <Th textAlign="end"></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {patientsData?.patients?.map((patient, i) => (
                      <Tr key={patient.id}>
                        <Td width="5%" >
                          {i + 1 + page * perPage - perPage}
                        </Td>

                        <Td width="25%" >
                          {patient?.fullName}
                        </Td>
                        <Td
                          width="25%"
                          textAlign="center"
                        >
                          {patient?.email}
                        </Td>
                        <Td
                          w="15%"
                          textAlign="center"
                          onClick={() => setselectedPatientDetails(patient)}
                        >
                          <Button>Get more</Button>
                        </Td>
                        <Td
                          width="25%"
                          gap="12px"
                          textAlign="end"
                          fontWeight="700"
                        >
                          <Button
                            onClick={() => handleUpdateClick(patient)}
                            color="Blue"
                          >
                            Update
                          </Button>
                          <Button
                            onClick={() => deletePatient.mutate(patient.id)}
                            marginLeft="12px"
                            color="red"
                            isDisabled={role !== "Admin"}
                          >
                            Delete
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                    <PatientDetailModal
                      isOpen={!!selectedPatientDetails}
                      onClose={() => setselectedPatientDetails(null)}
                      patient={selectedPatientDetails}
                    />
                  </Tbody>
                </Table>
              </Box>
            ) : (
              <Text
                w="100%"
                color={colors.primary}
                fontWeight="700"
                fontSize="32px"
                textAlign="center"
              >
                No Patients
              </Text>
            )}

            {selectedPatient && (
              <UpdatePatientModal
                isOpen={!!selectedPatient}
                onClose={() => setselectedPatient(null)}
                patient={selectedPatient}
              />
            )}

            {patientsData?.totalCount != 0 && (
              <Pagination
                totalCount={patientsData?.totalCount}
                perPage={perPage}
                setPage={setPage}
                page={page}
              />
            )}
          </>
        )}
      </Container>
    </Flex>
  );
}
