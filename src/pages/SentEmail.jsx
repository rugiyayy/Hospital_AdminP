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
import { EmailIcon, Search2Icon } from "@chakra-ui/icons";

export default function SentEmail() {
  const { token } = useSelector((state) => state.account);
  const toast = useToast();
  const [selectedDepartment, setselectedDepartment] = useState(null);
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const navigate = useNavigate();
  const location = useLocation();

  const getSentEmails = async () => {
    const params = {
      page,
      perPage,
    };

    const response = await httpClient.get("/email", {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

  //!

  const deleteSentEmails = useMutation(
    (id) =>
      httpClient.delete(`/email/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("sentEmails");
        toast({
          title: "Emails deleted",
          description: "The emails has been successfully deleted.",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });
      },
      onError: (error) => {
        console.error("Error deleting email", error);
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
    data: email,
    isError,
    error,
  } = useQuery(["sentEmails", page, perPage], getSentEmails, {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!isLoading && deleteSentEmails.isSuccess) {
      queryClient.invalidateQueries("departments");
    }
  }, [isLoading, deleteSentEmails.isSuccess, queryClient]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    urlParams.set("page", page.toString());
    urlParams.set("perPage", perPage.toString());

    navigate(`?${urlParams.toString()}`);
  }, [page, perPage, navigate]);

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
          <Text as="span">Sent Emails</Text>
        </Heading>

        {isError && (
          <Text
            color={colors.primary}
            fontWeight="700"
            fontSize="32px"
            textAlign="center"
            padding="3rem 0 "
            as="h2"
          >
            Something went wrong , please try again later
          </Text>
        )}
        {email?.totalCount > 0 && (
          <Table w="90%" variant="simple" margin="50px auto ">
            <Thead>
              <Tr>
                <Th></Th>
                <Th textAlign="center">To</Th>
                <Th textAlign="center">Subject</Th>
                <Th textAlign="center">Message</Th>
                <Th textAlign="center">Sent Time</Th>
                <Th textAlign="end"></Th>
              </Tr>
            </Thead>
            <Tbody>
              {email?.emails?.map((email, i) => (
                <Tr key={email?.id}>
                  <Td w="5%">{i + 1 + page * perPage - perPage}</Td>
                  <Td w="20%">{email?.to}</Td>

                  <Td w="20%" textAlign="center">
                    {email?.subject}
                  </Td>
                  <Td w="30%" textAlign="center">
                    {email?.body}
                  </Td>

                  <Td w="20%" textAlign="end">
                    {email?.sentTime}
                  </Td>
                  <Td w="5%" textAlign="end">
                    <Button
                      onClick={() => deleteSentEmails.mutate(email?.id)}
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
              email?.totalCount < perPage * page ||
              email?.totalCount === perPage * page
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
