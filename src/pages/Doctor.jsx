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
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Spinner1, colors } from "../components/Constants";
import { httpClient } from "../utils/httpClient";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import UpdateDoctorModal from "../components/doctorModal/UpdateDoctorModal";
import { useLocation, useNavigate } from "react-router-dom";
import { Search2Icon } from "@chakra-ui/icons";
import DoctorTable from "../components/Doctor/DoctorTable";
import Pagination from "../components/Pagination";

export default function Doctor() {
  const { token, role } = useSelector((state) => state.account);
  const toast = useToast();
  const queryClient = useQueryClient();
  const [selectedDoctor, setselectedDoctor] = useState(null);
  const [selectedDoctorDetail, setSelectedDoctorDetail] = useState(null);

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
  const {
    isLoading: isLoadingDepartments,
    data: departments,
    error: departmentrror,
  } = useQuery(["departments"], () => getDepartments(), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  const getTypes = async () => {
    const response = await httpClient.get("/doctorType", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

  const {
    isLoading: isLoadingTypes,
    data: types,
    error: typeError,
  } = useQuery("doctorTypes", () => getTypes(), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  const getRooms = async () => {
    const response = await httpClient.get("/examinationRoom", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

  const {
    isLoading: isLoadingRooms,
    data: rooms,
    error: roomError,
  } = useQuery(["rooms"], () => getRooms(), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

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
            error?.response?.data ||
            error?.message ||
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
    isLoading: doctorLoading,
    data: doctorsData,
    error: doctorError,
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
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (!doctorLoading && deleteDoctor.isSuccess) {
      queryClient.invalidateQueries("doctor");
    }
  }, [doctorLoading, deleteDoctor.isSuccess, queryClient]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("doctorTypeName", doctorTypeName.toString());
    urlParams.set("departmentName", departmentName.toString());
    urlParams.set("examinationRoomNumber", examinationRoomNumber);
    urlParams.set("page", page.toString());
    urlParams.set("perPage", perPage.toString());

    navigate(`?${urlParams.toString()}`);
  }, [
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

  // const handlePreviousPage = () => {
  //   if (page > 1) {
  //     setPage(page - 1);
  //   }
  // };

  // const handleNextPage = () => {
  //   setPage(page + 1);
  // };

  return (
    <Flex>
      <Box width="15%"></Box>
      <Container maxW="85%">
        <Heading
          margin="20px 0"
          textAlign="center"
          size="md"
          npm
          start
          color={colors.secondary}
        >
          <Text mb="20px">Doctors</Text>

          <Button
            color="green"
            border="2px solid"
            background="white"
            onClick={() => navigate("/doctorRegister")}
          >
            Register Doctor
          </Button>
        </Heading>
        {doctorError ? (
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
        ) : doctorLoading ? (
          <Spinner1 />
        ) : doctorsData?.docs?.length === 0 ? (
          <Text
            margin="4rem 0"
            padding="5rem"
            color={colors.primary}
            fontWeight="700"
            fontSize="32px"
            textAlign="center"
            as="h2"
          >
            No doctors
          </Text>
        ) : (
          <>
            <Box textAlign="center">
              <Flex
                gap="20px"
                margin="0 auto"
                justifyContent="center"
                alignItems="center"
              >
                <Select
                  value={examinationRoomNumber}
                  onChange={(e) => setExaminationRoomNumber(e.target.value)}
                  placeholder="All Rooms"
                  marginTop="10px"
                  width="200px"
                  disabled={isLoadingRooms}
                >
                  {isLoadingRooms ? (
                    <option>Loading rooms...</option>
                  ) : (
                    rooms?.map((room) => (
                      <option key={room?.id} value={room?.roomNumber}>
                        {room?.roomNumber}
                      </option>
                    ))
                  )}
                </Select>
                <Select
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  placeholder="All Departments"
                  marginTop="10px"
                  width="200px"
                  disabled={isLoadingDepartments}
                >
                  {isLoadingDepartments ? (
                    <option>Loading departments...</option>
                  ) : (
                    departments &&
                    departments?.departments?.map((department) => (
                      <option key={department?.id} value={department?.name}>
                        {department?.name}
                      </option>
                    ))
                  )}
                </Select>
                <Select
                  value={doctorTypeName}
                  onChange={(e) => setDoctorTypeName(e.target.value)}
                  placeholder="All Types"
                  marginTop="10px"
                  width="200px"
                  disabled={isLoadingTypes}
                >
                  {isLoadingTypes ? (
                    <option>Loading types...</option>
                  ) : (
                    types?.types?.map((type) => (
                      <option key={type?.id} value={type?.name}>
                        {type?.name}
                      </option>
                    ))
                  )}
                </Select>
              </Flex>
              <Button
                onClick={handleResetAll}
                color={colors.primary}
                border="2px solid"
                background="white"
                m="20px 0"
              >
                Reset All filters
              </Button>
              <InputGroup w="50%" margin="2rem auto">
                <InputLeftElement pointerEvents="none">
                  <Search2Icon marginLeft={3} color="gray.600" />
                </InputLeftElement>
                <Input
                  borderRadius="20px"
                  type="search"
                  placeholder="Search by Doctor's Full Name"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  disabled={roomError || doctorLoading}
                />
              </InputGroup>
            </Box>
            <DoctorTable
              setselectedDoctor={setSelectedDoctorDetail}
              selectedDoctor={selectedDoctorDetail}
              doctor={doctorsData?.doctors}
              doctorsData={doctorsData}
              handleUpdateClick={handleUpdateClick}
              deleteDoctor={deleteDoctor}
              page={page}
              perPage={perPage}
              role={role}
            />

            {selectedDoctor && (
              <UpdateDoctorModal
                isOpen={!!selectedDoctor}
                onClose={() => setselectedDoctor(null)}
                doctor={selectedDoctor}
              />
            )}
            {doctorsData?.totalCount != 0 && (
              <Pagination
                totalCount={doctorsData?.totalCount}
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
