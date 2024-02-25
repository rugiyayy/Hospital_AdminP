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
import { colors } from "../components/Constants";
import { httpClient } from "../utils/httpClient";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import SignPatientUpModal from "../components/patientModal/SignUpModal";
import UpdatePatientModal from "../components/patientModal/UpdatePatientModal";
import { useLocation, useNavigate } from "react-router-dom";
import { Search2Icon } from "@chakra-ui/icons";

export default function Patient() {
  const { token } = useSelector((state) => state.account);
  const toast = useToast();
  const queryClient = useQueryClient();
  const [selectedPatient, setselectedPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const navigate = useNavigate();
  const location = useLocation();

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
    data: patients,
    isError,
    error,
  } = useQuery(["patient", page, perPage, searchQuery], getPatients, {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("patientFullName", searchQuery.toString());
    urlParams.set("page", page.toString());
    urlParams.set("perPage", perPage.toString());

    navigate(`?${urlParams.toString()}`);
  }, [searchQuery, page, perPage, navigate]);

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

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error! {error.message}</div>;
  }
  const handleSearchChange = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
    setPage(1);
  };
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  console.log(patients?.patients?.length);

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
          <Text as="span">Patients</Text>

          <SignPatientUpModal initialData={selectedPatient} />
        </Heading>

        <InputGroup w="50%" margin="3rem auto">
          <InputLeftElement pointerEvents="none">
            <Search2Icon marginLeft={3} color="gray.600" />
          </InputLeftElement>
          <Input
            autoFocus
            borderRadius="20px"
            type="search"
            placeholder="Search by Patients's Full Name"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </InputGroup>

        <Table w="90%" variant="simple" margin="50px auto ">
          <Thead>
            <Tr>
              <Th></Th>
              <Th>Patient Full Name </Th>
              <Th textAlign="center">Phone Number</Th>
              <Th textAlign="center">Email</Th>
              <Th textAlign="center">Patient Identity Number</Th>
              <Th textAlign="center">Birth Date</Th>
              <Th textAlign="end"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {patients?.patients?.map((patient, i) => (
              <Tr key={patient.id}>
                <Td width="5%" border="1px solid red">
                  {i + 1 + page * perPage - perPage}
                </Td>

                <Td width="20%" border="1px solid red">
                  {patient?.fullName}
                </Td>
                <Td width="35%" border="1px solid red" textAlign="center">
                  {patient?.phoneNumber}
                </Td>
                <Td width="20%" border="1px solid red" textAlign="center">
                  {patient?.email}
                </Td>
                <Td width="20%" border="1px solid red" textAlign="center">
                  {patient?.patientIdentityNumber}
                </Td>
                <Td width="20%" border="1px solid red" textAlign="center">
                  {patient?.birthDate}
                </Td>

                <Td
                  width="20%"
                  border="1px solid red"
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
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        {selectedPatient && (
          <UpdatePatientModal
            isOpen={!!selectedPatient}
            onClose={() => setselectedPatient(null)}
            patient={selectedPatient}
          />
        )}

        <ButtonGroup>
          <Button
            type="button"
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
            type="button"
            onClick={(e) => {
              setPage((prevPage) => prevPage + 1);
              e.preventDefault();
            }}
            isDisabled={
              patients?.totalCount < perPage * page ||
              patients?.totalCount === perPage * page
            }
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
      </Container>
    </Flex>
  );
}
