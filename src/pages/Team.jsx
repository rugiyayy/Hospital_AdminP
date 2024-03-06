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
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Spinner1, colors } from "../components/Constants";
import { httpClient } from "../utils/httpClient";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SingleTeamDetailModal from "../components/SingleTeamDetailModal";
import Pagination from "../components/Pagination";

export default function Team() {
  const { token, role } = useSelector((state) => state.account);
  const toast = useToast();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [perPage] = useState(5);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedUser, setSelectedUser] = useState(null);

  const getusers = async () => {
    const params = {
      page,
      perPage,
    };

    const response = await httpClient.get("/account/GetUsersByRole", {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };
  const {
    isLoading,
    data: team,
    isError,
    error,
  } = useQuery(["team", page, perPage], getusers, {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("page", page.toString());
    urlParams.set("perPage", perPage.toString());

    navigate(`?${urlParams.toString()}`);
  }, [page, perPage, navigate]);

  const deleteuser = useMutation(
    (id) =>
      httpClient.delete(`/account/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    {
      onSuccess: () => {
        toast({
          title: "User account deleted",
          description: "User account has been successfully deleted.",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });
      },
      onError: (error) => {
        console.error("Error deleting user account", error);
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

  useEffect(() => {
    if (!isLoading && deleteuser.isSuccess) {
      queryClient.invalidateQueries("team");
    }
  }, [isLoading, deleteuser.isSuccess, queryClient]);

  
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  const handleNextPage = () => {
    setPage(page + 1);
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
          <VStack>
            <Text as="span">Team</Text>
            <Link to="/register">
              <Text color="green">Add user</Text>
            </Link>
          </VStack>
        </Heading>

        {isError ? (
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
        ) : team?.totalCount === 0 ? (
          <Text
            margin="4rem 0"
            padding="5rem"
            color={colors.primary}
            fontWeight="700"
            fontSize="32px"
            textAlign="center"
            as="h2"
          >
            No appointments
          </Text>
        ) : (
          <>
            <Box height="60vh" margin="3rem 0">
              <Table w="60%" variant="simple" margin="50px auto ">
                <Thead>
                  <Tr>
                    <Th></Th>
                    <Th>User's Full Name </Th>
                    <Th textAlign="center">Role</Th>
                    <Th textAlign="center">For more details</Th>
                    <Th textAlign="end"></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {team?.allUsers?.map((user, i) => (
                    <Tr key={user?.id}>
                      <Td width="5%">{i + 1 + page * perPage - perPage}</Td>

                      <Td width="30%">{user?.fullName}</Td>

                      <Td fontWeight="700" width="20%" textAlign="center">
                        {user?.isAdmin ? (
                          <Text color={colors.primary}>Admin</Text>
                        ) : (
                          <Text color={colors.paragraph}>Scheduler</Text>
                        )}
                      </Td>
                      <Td
                        w="30%"
                        textAlign="center"
                        onClick={() => setSelectedUser(user)}
                      >
                        <Button>Get more</Button>
                      </Td>
                      <Td
                        width="10%"
                        gap="12px"
                        textAlign="end"
                        fontWeight="700"
                      >
                        <Button
                          onClick={() => deleteuser.mutate(user?.id)}
                          marginLeft="12px"
                          color="red"
                          isDisabled={role !== "Admin"}
                        >
                          Delete
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                  <SingleTeamDetailModal
                    isOpen={!!selectedUser}
                    onClose={() => setSelectedUser(null)}
                    user={selectedUser}
                  />
                </Tbody>
              </Table>
            </Box>

            <Pagination
              totalCount={team?.totalCount}
              perPage={perPage}
              handleNextPage={handleNextPage}
              handlePreviousPage={handlePreviousPage}
              page={page}
            />
          </>
        )}
      </Container>
    </Flex>
  );
}
