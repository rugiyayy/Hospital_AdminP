import { Td, Tr, Button } from "@chakra-ui/react"; // Импорт Button из Chakra UI
import React from "react";

const DoctorTableRow = ({ doctor, i, page, perPage, onUpdate, onDelete }) => { // Передача переменных i, page, perPage в параметры
  return (
    <Tr key={doctor.id}>
      <Td width="5%">{i + 1 + page * perPage - perPage}</Td> {/* Использование переменных i, page, perPage */}
      {/* Остальной код без изменений */}
      <Td
        width="25%"
        border="1px solid red"
        gap="12px"
        textAlign="end"
        fontWeight="700"
      >
        <Button onClick={() => onUpdate(doctor)} color="blue"> {/* Использование Button */}
          Update
        </Button>
        <Button
          onClick={() => onDelete(doctor.id)}
          marginLeft="12px"
          color="red"
        >
          Delete
        </Button>
      </Td>
    </Tr>
  );
};

export default DoctorTableRow;
