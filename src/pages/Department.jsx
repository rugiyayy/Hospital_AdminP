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
import DoctorTypeModal from "../components/doctorTypeModals/CreateDoctorTypeModal";
import { useSelector } from "react-redux";
import useUpdateDoctorType from "../hooks/doctorTypesHooks/useUpdateDoctorType";
import UpdateDoctorTypeModal from "../components/doctorTypeModals/UpdateDoctorTypeModal";
import CreateDepartmentModal from "../components/departmentModals/CreateDepartmentModal";
import UpdateDepartmentModal from "../components/departmentModals/UpdateDepartmentModal";
import { useLocation, useNavigate } from "react-router-dom";
import { Search2Icon } from "@chakra-ui/icons";
import Pagination from "../components/Pagination";
import DepartmentDetailModal from "../components/DepartmenttDetailModal";

export default function Department() {
  const { token, role } = useSelector((state) => state.account);
  const toast = useToast();
  const [selectedDepartment, setselectedDepartment] = useState(null);
  const [selectedDepartmentDetails, setSelectedDepartmentDetails] = useState(null);

  
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const getDepartments = async () => {
    const params = {
      page,
      perPage,
      departmentName: searchQuery,
    };

    const response = await httpClient.get("/department", {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

  //!

  const deleteDepartment = useMutation(
    (id) =>
      httpClient.delete(`/department/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("departments");
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
    data: departmentsData,
    error: departmentError,
  } = useQuery(["departments", page, perPage, searchQuery], getDepartments, {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  useEffect(() => {
    if (!isLoading && deleteDepartment.isSuccess) {
      queryClient.invalidateQueries("departments");
    }
  }, [isLoading, deleteDepartment.isSuccess, queryClient]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("page", page.toString());
    urlParams.set("perPage", perPage.toString());

    navigate(`?${urlParams.toString()}`);
  }, [page, perPage, navigate]);

  const handleSearchChange = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
    setPage(1);
  };
  const handleUpdateClick = (department) => {
    setselectedDepartment(department);
  };

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
          <Text mb="20px">Departments</Text>

          <CreateDepartmentModal initialData={selectedDepartment} />
        </Heading>

        {departmentError ? (
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
        ) : departmentsData?.dDta?.length === 0 ? (
          <Text
            margin="4rem 0"
            padding="5rem"
            color={colors.primary}
            fontWeight="700"
            fontSize="32px"
            textAlign="center"
            as="h2"
          >
            No Departments
          </Text>
        ) : (
          <>
            <InputGroup w="50%" margin="3rem auto">
              <InputLeftElement pointerEvents="none">
                <Search2Icon marginLeft={3} color="gray.600" />
              </InputLeftElement>
              <Input
                autoFocus
                borderRadius="20px"
                type="search"
                placeholder="Search Department"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </InputGroup>

            {departmentsData?.departments?.length > 0 ? (
              <Box h="65vh" margin="0 auto">
                <Table w="70%" variant="simple" margin="50px auto ">
                  <Thead>
                    <Tr>
                      <Th></Th>
                      <Th textAlign="center">Department Name </Th>
                      <Th textAlign="center">More Detais</Th>
                      <Th textAlign="end"></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {departmentsData?.departments?.map((department, i) => (
                      <Tr key={department.id}>
                        <Td width="5%">{i + 1 + page * perPage - perPage}</Td>

                        <Td width="35%" textAlign="center">{department?.name}</Td>
                        <Td
                          w="25%"
                          textAlign="center"
                          onClick={() => setSelectedDepartmentDetails(department)}
                        >
                          <Button>Get more</Button>
                        </Td>
                        <Td
                          width="35%"
                          gap="12px"
                          textAlign="end"
                          fontWeight="700"
                        >
                          <Button
                            onClick={() => handleUpdateClick(department)}
                            color="Blue"
                          >
                            Update
                          </Button>
                          <Button
                            onClick={() =>
                              deleteDepartment.mutate(department.id)
                            }
                            marginLeft="12px"
                            color="red"
                            isDisabled={role !== "Admin"}
                          >
                            Delete
                          </Button>
                        </Td>
                      </Tr>
                   ))}
                   <DepartmentDetailModal
                     isOpen={!!selectedDepartmentDetails}
                     onClose={() => setSelectedDepartmentDetails(null)}
                     department={selectedDepartmentDetails}
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
                No Departments
              </Text>
            )}

            {selectedDepartment && (
              <UpdateDepartmentModal
                isOpen={!!selectedDepartment}
                onClose={() => setselectedDepartment(null)}
                department={selectedDepartment}
              />
            )}

            {departmentsData?.totalCount != 0 && (
              <Pagination
                totalCount={departmentsData?.totalCount}
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
