// DoctorTable.js

import React, { useState } from "react";
import {
  Box,
  Button,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { colors } from "../Constants";
import DoctoDetailModal from "../DoctoDetailModal";

const DoctorTable = ({
  doctorsData,
  doctors,
  handleUpdateClick,
  deleteDoctor,
  page,
  perPage,
  setselectedDoctor,
  selectedDoctor,
  role,
}) => {
  const toast = useToast();

  const notZero = doctorsData?.doctors?.length > 0;

  return (
    <Box height="60vh">
      {notZero ? (
        <Table w="90%" margin="50px auto "  >
          <Thead>
            <Tr>
              <Th></Th>
              <Th textAlign="center">Doctor Full Name </Th>
              <Th textAlign="center">Department</Th>
              <Th textAlign="center">More Detais</Th>
              <Th textAlign="end"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {doctorsData?.doctors?.map((doctor, i) => (
              <Tr key={doctor.id}>
                <Td width="5%">{i + 1 + page * perPage - perPage}</Td>
                <Td width="25%" textAlign="center">
                  {doctor?.fullName}
                </Td>
                <Td width="25%" textAlign="center">
                  {doctor?.departmentName}
                </Td>
                <Td
                  w="20%"
                  textAlign="center"
                  onClick={() => setselectedDoctor(doctor)}
                >
                  <Button>Get more</Button>
                </Td>
                <Td width="25%" gap="12px" textAlign="end" fontWeight="700">
                  <Button
                    onClick={() => handleUpdateClick(doctor)}
                    color="Blue"
                  >
                    Update
                  </Button>
                  <Button
                    onClick={() => deleteDoctor.mutate(doctor.id)}
                    marginLeft="12px"
                    color="red"
                    isDisabled={role !== "Admin"}
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
            <DoctoDetailModal
              isOpen={!!selectedDoctor}
              onClose={() => setselectedDoctor(null)}
              doctor={selectedDoctor}
            />
          </Tbody>
        </Table>
      ) : (
        <Text
          w="100%"
          color={colors.primary}
          fontWeight="700"
          fontSize="32px"
          textAlign="center"
        >
          No doctors
        </Text>
      )}
    </Box>
  );
};

export default DoctorTable;
