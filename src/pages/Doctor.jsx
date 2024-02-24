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
  Select,
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
import { useSelector } from "react-redux";
import DoctorSignUpModal from "../components/doctorModal/DoctorSignUpModal";
import UpdateDoctorModal from "../components/doctorModal/UpdateDoctorModal";
import { useLocation, useNavigate } from "react-router-dom";
import { Search2Icon } from "@chakra-ui/icons";
import DoctorTable from "../components/Doctor/DoctorTable";

export default function Doctor() {
  const { token } = useSelector((state) => state.account);
  const toast = useToast();
  const queryClient = useQueryClient();
  const [selectedDoctor, setselectedDoctor] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [doctorTypeName, setDoctorTypeName] = useState("");
  const [departmentName, setDepartmentName] = useState("");

  const [examinationRoomNumber, setExaminationRoomNumber] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const navigate = useNavigate();
  const location = useLocation();

  const getDepartments = async () => {
    const response = await httpClient.get("/department", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };
  const { isLoading: isLoadingDepartments, data: departments } = useQuery(
    "departments",
    getDepartments
  );

  const getTypes = async () => {
    const response = await httpClient.get("/doctorType", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };
  const { isLoading: isLoadingTypes, data: types } = useQuery(
    "doctorTypes",
    getTypes
  );

  const getRooms = async () => {
    const response = await httpClient.get("/examinationRoom", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };
  const { isLoading: isLoadingRooms, data: rooms } = useQuery(
    "rooms",
    getRooms
  );

  const getDoctors = async () => {
    const params = {
      page,
      perPage,
      doctorName: searchQuery,
      doctorTypeName: doctorTypeName,
      departmentName: departmentName,
      examinationRoomNumber: examinationRoomNumber,
    };

    const response = await httpClient.get("/doctor", {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

  const deleteDoctor = useMutation(
    (id) =>
      httpClient.delete(`/doctor/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    {
      onSuccess: () => {
        toast({
          title: "Doctor account deleted",
          description:
            "Doctor account has been successfully deleted and doctor has been removed.",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });
      },
      onError: (error) => {
        console.error("Error deleting docto account", error);
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
    data: doctors,
    isError,
    error,
  } = useQuery(
    [
      "doctor",
      page,
      perPage,
      searchQuery,
      doctorTypeName,
      departmentName,
      examinationRoomNumber,
    ],
    getDoctors,
    {
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (!isLoading && deleteDoctor.isSuccess) {
      queryClient.invalidateQueries("doctor");
    }
  }, [isLoading, deleteDoctor.isSuccess, queryClient]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("doctorName", searchQuery.toString());
    urlParams.set("doctorTypeName", doctorTypeName.toString());
    urlParams.set("departmentName", departmentName.toString());
    urlParams.set("examinationRoomNumber", examinationRoomNumber);
    urlParams.set("page", page.toString());
    urlParams.set("perPage", perPage.toString());

    navigate(`?${urlParams.toString()}`);
  }, [
    searchQuery,
    doctorTypeName,
    departmentName,
    examinationRoomNumber,
    page,
    perPage,
    navigate,
  ]);

  const handleUpdateClick = (doctor) => {
    setselectedDoctor(doctor);
  };
  const handleSearchChange = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
    setPage(1);
  };
  const handleResetAll = () => {
    setSearchQuery("");
    setExaminationRoomNumber("");
    setDepartmentName("");
    setDoctorTypeName("");
    setPage(1);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }
  if (isError) {
    return <div>Error! {error.message}</div>;
  }
  ///!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  //////!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  //////!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  //////!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  //////!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  ///!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  
  console.log(rooms);
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
          <Text as="span">Doctors</Text>

          <DoctorSignUpModal initialData={selectedDoctor} />
        </Heading>
        ///!!!!!
        <Select
          value={examinationRoomNumber}
          onChange={(e) => setExaminationRoomNumber(e.target.value)}
          placeholder="All Rooms"
          marginTop="10px"
          width="200px"
        >
          {rooms?.map((room) => (
            <option key={room?.id} value={room?.roomNumber}>
              {room?.roomNumber}
            </option>
          ))}
        </Select>
        <Select
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
          placeholder="All Departments"
          marginTop="10px"
          width="200px"
        >
          {departments &&
            departments?.departments?.map((department) => (
              <option key={department.id} value={department.name}>
                {department.name}
              </option>
            ))}
        </Select>
        <Select
          value={doctorTypeName}
          onChange={(e) => setDoctorTypeName(e.target.value)}
          placeholder="All Types"
          marginTop="10px"
          width="200px"
        >
          {types &&
            types?.types?.map((type) => (
              <option key={type.id} value={type.name}>
                {type.name}
              </option>
            ))}
        </Select>
        <Button onClick={handleResetAll} colorScheme="red" marginLeft="10px">
          Reset All filters
        </Button>
        <InputGroup w="50%" margin="3rem auto">
          <InputLeftElement pointerEvents="none">
            <Search2Icon marginLeft={3} color="gray.600" />
          </InputLeftElement>
          <Input
            autoFocus
            borderRadius="20px"
            type="search"
            placeholder="Search by Doctor's Full Name"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </InputGroup>
        <DoctorTable
          doctors={doctors?.doctors}
          handleUpdateClick={handleUpdateClick}
          deleteDoctor={deleteDoctor}
          page={page}
          perPage={perPage}
        />
        {selectedDoctor && (
          <UpdateDoctorModal
            isOpen={!!selectedDoctor}
            onClose={() => setselectedDoctor(null)}
            doctor={selectedDoctor}
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
              doctors?.totalCount < perPage * page ||
              doctors?.totalCount === perPage * page
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
