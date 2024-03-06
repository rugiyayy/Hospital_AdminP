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
import { EmailIcon, Search2Icon } from "@chakra-ui/icons";
import SentEmailDetailModal from "../components/SentEmailDetailModal";
import Pagination from "../components/Pagination";

export default function SentEmail() {
  const { token, role } = useSelector((state) => state.account);
  const toast = useToast();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [selectedEmail, setSelectedEmail] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const getSentEmails = async () => {
    const params = {
      page,
      perPage,
      from: searchQuery,
    };

    const response = await httpClient.get("/email", {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

  const handleSearchChange = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
    setPage(1);
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
  } = useQuery(["sentEmails", page, perPage, searchQuery], getSentEmails, {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
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

  // const handlePreviousPage = () => {
  //   if (page > 1) {
  //     setPage(page - 1);
  //   }
  // };

  
  // const handleNextPage = () => {
  //   setPage(page + 1);
  // };

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }
  // if (isError) {
  //   return <div>Error! {error.message}</div>;
  // }

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

        {isError ? (
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
        ) : isLoading ? (
          <Spinner1 />
        ) : email?.totalCount === 0 && searchQuery === "" ? (
          <Text
            margin="4rem 0"
            padding="5rem"
            color={colors.primary}
            fontWeight="700"
            fontSize="32px"
            textAlign="center"
            as="h2"
          >
            No Sent Emails
          </Text>
        ) : (
          <Box>
            <InputGroup w="50%" margin="3rem auto">
              <InputLeftElement pointerEvents="none">
                <Search2Icon marginLeft={3} color="gray.600" />
              </InputLeftElement>
              <Input
                autoFocus
                borderRadius="20px"
                type="search"
                placeholder="Search by Email address"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </InputGroup>
            {searchQuery !== "" && email?.totalCount === 0 && (
              <Text
                margin="4rem 0"
                padding="5rem"
                color={colors.primary}
                fontWeight="700"
                fontSize="32px"
                textAlign="center"
                as="h2"
              >
                No matching emails found
              </Text>
            )}
            <Box height="60vh" margin="3rem 0">
              {email?.totalCount > 0 && (
                <Table w="90%" variant="simple" margin="50px auto ">
                  <Thead>
                    <Tr>
                      <Th></Th>
                      <Th textAlign="center">From</Th>
                      <Th textAlign="center">Sent Date</Th>
                      <Th textAlign="center">For more details</Th>
                      <Th textAlign="end"></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {email?.emails?.map((email, i) => (
                      <Tr key={email?.id}>
                        <Td w="5%">{i + 1 + page * perPage - perPage}</Td>

                        <Td w="30%" textAlign="center">
                          {email?.from}
                        </Td>
                        <Td w="25%" textAlign="center">
                          {email?.sentTime}
                        </Td>
                        <Td
                          w="25%"
                          textAlign="center"
                          onClick={() => setSelectedEmail(email)}
                        >
                          <Button>Get more</Button>
                        </Td>

                        <Td w="15%" textAlign="end">
                          <Button
                            onClick={() => deleteSentEmails.mutate(email?.id)}
                            marginLeft="12px"
                            color="red"
                            isDisabled={role !== "Admin"}
                          >
                            Delete
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                    <SentEmailDetailModal
                      isOpen={!!selectedEmail}
                      onClose={() => setSelectedEmail(null)}
                      email={selectedEmail}
                    />
                  </Tbody>
                </Table>
              )}
            </Box>
            <Pagination
            totalCount={email?.totalCount}
            perPage={perPage}
            setPage={setPage}
            page={page}
          />
          </Box>
        )}
      </Container>
    </Flex>
  );
}
