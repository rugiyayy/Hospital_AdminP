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

const PatientDetailModal = ({ isOpen, onClose, patient }) => {
  const getDoc = () => {
    return httpClient.get(`/patient/${patient?.id}`);
  };

  const { isLoading: patientLoading, error: patientError } = useQuery(
    ["patientDetails", patient?.id],
    getDoc,
    {
      refetchOnWindowFocus: false,
    }
  );

  console.log(patient);
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent padding="20px 0">
        <ModalHeader>Patient Details :</ModalHeader>
        <ModalCloseButton />
        <ModalBody padding="20px ">
          {patientLoading ? (
            <div>Loading...</div>
          ) : patientError ? (
            <div>Error: {patientError?.message}</div>
          ) : (
            <Flex flexDirection="column" gap="20px " padding="0 20px">
              <Text fontWeight="600" fontSize="16px " color={colors.secondary}>
                Full Name :
                <Text
                  padding="0 8px"
                  fontWeight="500"
                  as="span"
                  color={colors.primary}
                >
                  {patient?.fullName}
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
                  {patient?.email}
                </Text>
              </Text>
              <Text fontWeight="600" fontSize="16px " color={colors.secondary}>
              Patient Identity Number :
                <Text
                  padding="0 8px"
                  fontWeight="500"
                  as="span"
                  color={colors.primary}
                >
                  {patient?.patientIdentityNumber}
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
                  {patient?.birthDate}
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
                  {patient?.phoneNumber}
                </Text>
              </Text>
            </Flex>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PatientDetailModal;
