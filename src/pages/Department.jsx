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
  
  export default function Department() {
    const { token } = useSelector((state) => state.account);
    const toast = useToast();
    const [selectedDepartment, setselectedDepartment] = useState(null);
    const queryClient = useQueryClient();
  
    const getDepartments = () => {
      return httpClient.get("/department");
    };
  
    const deleteDepartment = useMutation(
      (id) =>
        httpClient.delete(`/department/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      {
        onSuccess: () => {
          toast({
            title: "Department deleted",
            description: "The department has been successfully deleted.",
            status: "success",
            duration: 4000,
            isClosable: true,
            position: "top-right",
          });
        },
        onError: (error) => {
          console.error("Error deleting department", error);
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
      data: departments,
      isError,
      error,
    } = useQuery("department", getDepartments, {
      refetchOnWindowFocus: false,
    });
  
    useEffect(() => {
      if (!isLoading && deleteDepartment.isSuccess) {
        queryClient.invalidateQueries("department");
      }
    }, [isLoading, deleteDepartment.isSuccess, queryClient]);
  
    const handleUpdateClick = (department) => {
      setselectedDepartment(department);
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
            <Text as="span">Departments</Text>
  
            <CreateDepartmentModal initialData={selectedDepartment} />
          </Heading>
  
          <Table w="90%" variant="simple" margin="50px auto ">
            <Thead>
              <Tr>
                <Th></Th>
                <Th>Department Name </Th>
                <Th textAlign="center">Description</Th>
                <Th textAlign="center">Service Cost</Th>
                <Th textAlign="end"></Th>
              </Tr>
            </Thead>
            <Tbody>
              {departments?.data?.map((department, i) => (
                <Tr key={department.id}>
                  {/* <Td>{i + 1 + page * perPage - perPage}</Td> */}
                  <Td width="5%" border="1px solid red">
                    {i + 1}
                  </Td>
  
                  <Td width="20%" border="1px solid red">
                    {department?.name}
                  </Td>
                  <Td width="35%" border="1px solid red" textAlign="center">
                    {department?.departmentDescription}
                  </Td>
                  <Td width="20%" border="1px solid red" textAlign="center">
                    {department?.serviceCost}
                  </Td>
  
                  <Td
                    width="20%"
                    border="1px solid red"
                    gap="12px"
                    textAlign="end"
                    fontWeight="700"
                  >
                    <Button onClick={() => handleUpdateClick(department)} color="Blue">
                      Update
                    </Button>
                    <Button
                      onClick={() => deleteDepartment.mutate(department.id)}
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
          {selectedDepartment && (
            <UpdateDepartmentModal
              isOpen={!!selectedDepartment}
              onClose={() => setselectedDepartment(null)}
              department={selectedDepartment}
            />
          )}
        </Container>
      </Flex>
    );
  }
  