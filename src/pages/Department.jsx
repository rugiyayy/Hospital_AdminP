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
import DoctorTypeModal from "../components/doctorTypeModals/CreateDoctorTypeModal";
import { useSelector } from "react-redux";
import useUpdateDoctorType from "../hooks/doctorTypesHooks/useUpdateDoctorType";
import UpdateDoctorTypeModal from "../components/doctorTypeModals/UpdateDoctorTypeModal";
import CreateDepartmentModal from "../components/departmentModals/CreateDepartmentModal";
import UpdateDepartmentModal from "../components/departmentModals/UpdateDepartmentModal";
import { useLocation, useNavigate } from "react-router-dom";
import { Search2Icon } from "@chakra-ui/icons";

export default function Department() {
  const { token } = useSelector((state) => state.account);
  const toast = useToast();
  const [selectedDepartment, setselectedDepartment] = useState(null);
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
    data: departments,
    isError,
    error,
  } = useQuery(["departments", page, perPage, searchQuery], getDepartments, {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!isLoading && deleteDepartment.isSuccess) {
      queryClient.invalidateQueries("departments");
    }
  }, [isLoading, deleteDepartment.isSuccess, queryClient]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("departmentName", searchQuery.toString());
    urlParams.set("page", page.toString());
    urlParams.set("perPage", perPage.toString());

    navigate(`?${urlParams.toString()}`);
  }, [searchQuery, page, perPage, navigate]);

  const handleSearchChange = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
    setPage(1);
  };
  const handleUpdateClick = (department) => {
    setselectedDepartment(department);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
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
            {departments?.departments?.map((department, i) => (
              <Tr key={department.id}>
                <Td width="5%" border="1px solid red">
                  {i + 1 + page * perPage - perPage}
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
                  <Button
                    onClick={() => handleUpdateClick(department)}
                    color="Blue"
                  >
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
              departments?.totalCount < perPage * page ||
              departments?.totalCount === perPage * page
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
