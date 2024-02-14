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
import DoctorTypeModal from "../components/doctorTypeModals/CreateDoctorTypeModal";
import { useSelector } from "react-redux";
import useUpdateDoctorType from "../hooks/doctorTypesHooks/useUpdateDoctorType";
import UpdateDoctorTypeModal from "../components/doctorTypeModals/UpdateDoctorTypeModal";
import CreateDepartmentModal from "../components/departmentModals/CreateDepartmentModal";
import UpdateDepartmentModal from "../components/departmentModals/UpdateDepartmentModal";

export default function Appointments() {
  const { token } = useSelector((state) => state.account);
  const toast = useToast();
  const [selectedAppointment, setselectedAppointment] = useState(null);
  const queryClient = useQueryClient();

  const getAppointments = () => {
    return httpClient.get("/appointment");
  };

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

  const {
    isLoading,
    data: appointments,
    isError,
    error,
  } = useQuery("appointment", getAppointments, {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!isLoading && deleteAppointment.isSuccess) {
      queryClient.invalidateQueries("appointment");
    }
  }, [isLoading, deleteAppointment.isSuccess, queryClient]);

  const handleUpdateClick = (appointment) => {
    setselectedAppointment(appointment);
  };

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
          <Text as="span">Appointment</Text>

          {/* <CreateDepartmentModal initialData={selectedAppointment} /> */}
        </Heading>

        <Table w="90%" variant="simple" margin="50px auto ">
          <Thead>
            <Tr>
              <Th></Th>
              <Th textAlign="center">Doctor Full Name </Th>
              <Th textAlign="center">Patient Full Name</Th>
              <Th textAlign="center">Date</Th>
              <Th textAlign="center">Service Cost</Th>
              <Th textAlign="center">Appointment Status</Th>
              <Th textAlign="end"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {appointments?.data?.map((appointment, i) => (
              <Tr key={appointment.id}>
                {/* <Td>{i + 1 + page * perPage - perPage}</Td> */}
                <Td width="5%" border="1px solid red">
                  {i + 1}
                </Td>

                <Td width="20%" border="1px solid red">
                  {appointment?.doctorFullName}
                </Td>
                <Td width="20%" border="1px solid red" textAlign="center">
                  {appointment?.patientFullName}
                </Td>
                <Td width="15%" border="1px solid red" textAlign="center">
                  {appointment?.formattedStartTime}
                </Td>
                <Td width="10%" border="1px solid red" textAlign="center">
                  {appointment?.doctor?.serviceCost}
                </Td>

                <Td
                  width="5%"
                  border="1px solid red"
                  textAlign="center"
                  fontWeight="700"
                  color={
                    appointment?.isActive === true ? "green" : colors.primary
                  }
                >
                  {appointment?.isActive === true
                    ? "Active"
                    : appointment?.isActive === false
                    ? "Inactive"
                    : "Not specified"}
                </Td>
                <Td
                  width="25%"
                  border="1px solid red"
                  gap="12px"
                  textAlign="end"
                  fontWeight="700"
                >
                  <Button
                    onClick={() => handleUpdateClick(appointment)}
                    color="Blue"
                  >
                    Update
                  </Button>
                  <Button
                    onClick={() => deleteAppointment.mutate(appointment.id)}
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
        {/* {selectedAppointment && (
          <UpdateDepartmentModal
            isOpen={!!selectedDepartment}
            onClose={() => setselectedDepartment(null)}
            department={selectedDepartment}
          />
        )} */}
      </Container>
    </Flex>
  );
}
