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
import CreateDoctorTypeModal from "../components/doctorTypeModals/CreateDoctorTypeModal";
import { useSelector } from "react-redux";
import UpdateDoctorTypeModal from "../components/doctorTypeModals/UpdateDoctorTypeModal";
import { useLocation, useNavigate } from "react-router-dom";
import { Search2Icon } from "@chakra-ui/icons";
import Pagination from "../components/Pagination";
import TypeDetailModal from "../components/TypeDetailModal";

export default function DoctorType() {
  const { token, role, username } = useSelector((state) => state.account);
  const toast = useToast();
  const [selectedType, setSelectedType] = useState(null);
  const [selectedTypeDetails, setselectedTypeDetails] = useState(null);

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
        if (error?.response?.status === 401) {
          console.log("error401:", error);

          toast({
            title: "Authorization Error",
            description: "You are not authorized or Session has expired",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
          console.log(" if eldsfse error message :", error.response);
        } else {
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
        }
      },
    }
  );

  const {
    isLoading,
    data: typesData,
    error,
  } = useQuery(["doctorType", page, perPage, searchQuery], getTypes, {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  useEffect(() => {
    if (!isLoading && deleteType.isSuccess) {
      queryClient.invalidateQueries("doctorType");
    }
  }, [isLoading, deleteType.isSuccess, queryClient]);

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
  const handleUpdateClick = (type) => {
    setSelectedType(type);
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
          <Text mb="20px">Doctor Types</Text>
          <CreateDoctorTypeModal initialData={selectedType} />
        </Heading>

        {error ? (
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
        ) : typesData?.tDta?.length === 0 ? (
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
                borderRadius="20px"
                type="search"
                placeholder="Search Type"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </InputGroup>

            {typesData?.types?.length > 0 ? (
              <Box h="65vh" margin="0 auto">
                <Table w="70%" variant="simple" margin="50px auto ">
                  <Thead>
                    <Tr>
                      <Th></Th>
                      <Th textAlign="center">Type Name </Th>
                      <Th textAlign="center">More Detais</Th>
                      <Th textAlign="end"></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {typesData?.types?.map((type, i) => (
                      <Tr key={type.id}>
                        <Td width="5%">{i + 1 + page * perPage - perPage}</Td>

                        <Td width="35%" textAlign="center">
                          {type?.name}
                        </Td>
                        <Td
                          w="25%"
                          textAlign="center"
                          onClick={() => setselectedTypeDetails(type)}
                        >
                          <Button>Get more</Button>
                        </Td>
                        <Td
                          width="35%"
                          gap="12px"
                          textAlign="end"
                          fontWeight="700"
                        >
                          {" "}
                          <Button
                            onClick={() => handleUpdateClick(type)}
                            color="Blue"
                          >
                            Update
                          </Button>
                          <Button
                            onClick={() => deleteType.mutate(type.id)}
                            marginLeft="12px"
                            color="red"
                            isDisabled={role !== "Admin"}
                          >
                            Delete
                          </Button>
                        </Td>
                      </Tr>
                    ))}

                    <TypeDetailModal
                      isOpen={!!selectedTypeDetails}
                      onClose={() => setselectedTypeDetails(null)}
                      type={selectedTypeDetails}
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
                No Types
              </Text>
            )}
            {selectedType && (
              <UpdateDoctorTypeModal
                isOpen={!!selectedType}
                onClose={() => setSelectedType(null)}
                type={selectedType}
              />
            )}

            {typesData?.totalCount != 0 && (
              <Pagination
                totalCount={typesData?.totalCount}
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
