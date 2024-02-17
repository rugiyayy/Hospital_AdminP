import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
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
import SignUpModal from "../components/patientModal/SignUpModal";

export default function Patient() {
  const { token } = useSelector((state) => state.account);
  const toast = useToast();
  const queryClient = useQueryClient();

  const getPatients = () => {
    return httpClient.get("/patient");
  };

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

  const {
    isLoading,
    data: patients,
    isError,
    error,
  } = useQuery("patient", getPatients, {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!isLoading && deletePatient.isSuccess) {
      queryClient.invalidateQueries("patient");
    }
  }, [isLoading, deletePatient.isSuccess, queryClient]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error! {error.message}</div>;
  }

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

          <SignUpModal name={"signIn"} />
        </Heading>

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
            {patients?.data?.map((patient, i) => (
              <Tr key={patient.id}>
                {/* <Td>{i + 1 + page * perPage - perPage}</Td> */}
                <Td width="5%" border="1px solid red">
                  {i + 1}
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
                  <Button color="Blue">Update</Button>
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
      </Container>
    </Flex>
  );
}
