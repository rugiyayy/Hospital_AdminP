// DoctorTable.js

import React from "react";
import {
  Button,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";

const DoctorTable = ({ doctors, handleUpdateClick, deleteDoctor , page , perPage}) => {
  const toast = useToast();

  return (
    <Table w="90%" variant="simple" margin="50px auto ">
      <Thead>
        <Tr>
          <Th></Th>
          <Th textAlign="center">Doctor Full Name </Th>
          <Th textAlign="center">Email</Th>
          <Th textAlign="center">Type</Th>
          <Th textAlign="center">Department</Th>
          <Th textAlign="end"></Th>
        </Tr>
      </Thead>
      <Tbody>
        {doctors &&
          doctors.map((doctor, i) => (
            <Tr key={doctor.id}>
               <Td width="5%">{i + 1 + page * perPage - perPage}</Td>
              <Td width="15%" border="1px solid red" textAlign="center">
                {doctor?.fullName}
              </Td>
              <Td width="20%" border="1px solid red" textAlign="center">
                {doctor?.doctorDetail.email}
              </Td>
              <Td width="20%" border="1px solid red" textAlign="center">
                {doctor?.doctorTypeName}
              </Td>
              <Td width="20%" border="1px solid red" textAlign="center">
                {doctor?.departmentName}
              </Td>
              <Td
                width="25%"
                border="1px solid red"
                gap="12px"
                textAlign="end"
                fontWeight="700"
              >
                <Button onClick={() => handleUpdateClick(doctor)} color="Blue">
                  Update
                </Button>
                <Button
                  onClick={() => deleteDoctor.mutate(doctor.id)}
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
  );
};

export default DoctorTable;
