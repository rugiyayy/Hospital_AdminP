import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  Box,
  Flex,
  Image,
} from "@chakra-ui/react";
import { useQuery } from "react-query";
import { httpClient } from "../utils/httpClient";
import { EmailIcon } from "@chakra-ui/icons";
import { colors } from "./Constants";

const DoctoDetailModal = ({ isOpen, onClose, doctor }) => {
  const getDoc = () => {
    return httpClient.get(`/doctor/${doctor?.id}`);
  };

  const { isLoading: doctorLoading, error: doctorError } = useQuery(
    ["doctorDetails", doctor?.id],
    getDoc,
    {
      refetchOnWindowFocus: false,
    }
  );

  console.log(doctor);
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent padding="20px 0">
        <ModalHeader>Doctor Details :</ModalHeader>
        <ModalCloseButton />
        <ModalBody padding="20px ">
          {doctorLoading ? (
            <div>Loading...</div>
          ) : doctorError ? (
            <div>Error: {doctorError?.message}</div>
          ) : (
            <Flex flexDirection="column" gap="20px " padding="0 20px">
              <Box width="40%">
                {doctor?.photoPath != null && (
                  <Image
                    objectFit="cover"
                    width="100%"
                    height="200"
                    src={`https://localhost:7041/Images/${doctor?.photoPath}`}
                    borderRadius="lg"
                  />
                )}
              </Box>
              <Text fontWeight="600" fontSize="16px " color={colors.secondary}>
                Full Name :
                <Text
                  padding="0 8px"
                  fontWeight="500"
                  as="span"
                  color={colors.primary}
                >
                  {doctor?.fullName}
                </Text>
              </Text>
              <Text fontWeight="600" fontSize="16px " color={colors.secondary}>
                Email :
                <Text
                  padding="0 8px"
                  fontWeight="500"
                  as="span"
                  color={colors.primary}
                >
                  {doctor?.doctorDetail?.email}
                </Text>
              </Text>
              <Text fontWeight="600" fontSize="16px " color={colors.secondary}>
                Department :
                <Text
                  padding="0 8px"
                  fontWeight="500"
                  as="span"
                  color={colors.primary}
                >
                  {doctor?.departmentName}
                </Text>
              </Text>
              <Text fontWeight="600" fontSize="16px " color={colors.secondary}>
                Type :
                <Text
                  padding="0 8px"
                  fontWeight="500"
                  as="span"
                  color={colors.primary}
                >
                  {doctor?.doctorTypeName}
                </Text>
              </Text>

              <Text fontWeight="600" fontSize="16px " color={colors.secondary}>
                Birth Date :
                <Text
                  padding="0 8px"
                  fontWeight="500"
                  as="span"
                  color={colors.primary}
                >
                  {doctor?.doctorDetail?.birthDate}
                </Text>
              </Text>
              <Text fontWeight="600" fontSize="16px " color={colors.secondary}>
                Room Number:
                <Text
                  padding="0 8px"
                  fontWeight="500"
                  as="span"
                  color={colors.primary}
                >
                  {doctor?.examinationRoom?.roomNumber}
                </Text>
              </Text>
              <Text fontWeight="600" fontSize="16px " color={colors.secondary}>
                Phone Number :
                <Text
                  padding="0 8px"
                  fontWeight="500"
                  as="span"
                  color={colors.primary}
                >
                  {doctor?.doctorDetail?.phoneNumber}
                </Text>
              </Text>
              <Text fontWeight="600" fontSize="16px " color={colors.secondary}>
                Service Cost :
                <Text
                  padding="0 8px"
                  fontWeight="500"
                  as="span"
                  color={colors.primary}
                >
                  {doctor?.serviceCost}
                </Text>
              </Text>
            </Flex>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DoctoDetailModal;
