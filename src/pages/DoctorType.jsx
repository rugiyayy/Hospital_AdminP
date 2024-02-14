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

export default function DoctorType() {
  const { token } = useSelector((state) => state.account);
  const toast = useToast();
  const [selectedType, setSelectedType] = useState(null);
  const queryClient = useQueryClient();

  const getTypes = () => {
    return httpClient.get("/doctorType");
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
    data: getDoctorType,
    isError,
    error,
  } = useQuery("docType", getTypes, {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!isLoading && deleteType.isSuccess) {
      queryClient.invalidateQueries("docType");
    }
  }, [isLoading, deleteType.isSuccess, queryClient]);

  const handleUpdateClick = (type) => {
    setSelectedType(type);
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
          <Text as="span">Doctor Types</Text>

          <DoctorTypeModal initialData={selectedType} />
        </Heading>

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
            {getDoctorType?.data?.map((type, i) => (
              <Tr key={type.id}>
                {/* <Td>{i + 1 + page * perPage - perPage}</Td> */}
                <Td width="5%" border="1px solid red">
                  {i + 1}
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
      </Container>
    </Flex>
  );
}
