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
import CreateDoctorTypeModal from "../components/doctorTypeModals/CreateDoctorTypeModal";
import { useSelector } from "react-redux";
import UpdateDoctorTypeModal from "../components/doctorTypeModals/UpdateDoctorTypeModal";
import { useLocation, useNavigate } from "react-router-dom";
import { Search2Icon } from "@chakra-ui/icons";

export default function DoctorType() {
  const { token } = useSelector((state) => state.account);
  const toast = useToast();
  const [selectedType, setSelectedType] = useState(null);
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const getTypes = async () => {
    const params = {
      page,
      perPage,
      typeName: searchQuery,
    };

    const response = await httpClient.get("/doctorType", {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

  const deleteType = useMutation(
    (id) =>
      httpClient.delete(`/doctorType/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    {
      onSuccess: () => {
        toast({
          title: "Doctor type deleted",
          description: "The type has been successfully deleted.",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });
      },
      onError: (error) => {
        console.error("Error deleting doctor type", error);
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
    data: types,
    isError,
    error,
  } = useQuery(["doctorType", page, perPage, searchQuery], getTypes, {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!isLoading && deleteType.isSuccess) {
      queryClient.invalidateQueries("docType");
    }
  }, [isLoading, deleteType.isSuccess, queryClient]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("typeName", searchQuery.toString());
    urlParams.set("page", page.toString());
    urlParams.set("perPage", perPage.toString());

    navigate(`?${urlParams.toString()}`);
  }, [searchQuery, page, perPage, navigate]);

  const handleSearchChange = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
    setPage(1);
  };
  const handleUpdateClick = (type) => {
    setSelectedType(type);
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

  console.log(types);
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
          <Text as="span">Doctor Types</Text>

          <CreateDoctorTypeModal initialData={selectedType} />
        </Heading>
        <InputGroup w="50%" margin="3rem auto">
          <InputLeftElement pointerEvents="none">
            <Search2Icon marginLeft={3} color="gray.600" />
          </InputLeftElement>
          <Input
            autoFocus
            borderRadius="20px"
            type="search"
            placeholder="Search Type"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </InputGroup>
        <Table w="90%" variant="simple" margin="50px auto ">
          <Thead>
            <Tr>
              <Th></Th>
              <Th>Type Name </Th>
              <Th textAlign="center">Description</Th>
              <Th textAlign="end"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {types?.types?.map((type, i) => (
              <Tr key={type.id}>
                {/* <Td>{i + 1 + page * perPage - perPage}</Td> */}
                <Td width="5%" border="1px solid red">
                  {i + 1 + page * perPage - perPage}
                </Td>

                <Td width="30%" border="1px solid red">
                  {type?.name}
                </Td>
                <Td width="45%" border="1px solid red" textAlign="center">
                  {type?.description}
                </Td>

                <Td
                  width="20%"
                  border="1px solid red"
                  gap="12px"
                  textAlign="end"
                  fontWeight="700"
                >
                  <Button onClick={() => handleUpdateClick(type)} color="Blue">
                    Update
                  </Button>
                  <Button
                    onClick={() => deleteType.mutate(type.id)}
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
        {selectedType && (
          <UpdateDoctorTypeModal
            isOpen={!!selectedType}
            onClose={() => setSelectedType(null)}
            type={selectedType}
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
              types?.totalCount < perPage * page ||
               types?.totalCount === perPage * page
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
