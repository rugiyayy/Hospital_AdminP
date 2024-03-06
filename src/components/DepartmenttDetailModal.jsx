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

const DepartmentDetailModal = ({ isOpen, onClose, department }) => {
  const getDepartment = () => {
    return httpClient.get(`/department/${department?.id}`);
  };

  const { isLoading: departmentLoading, error: departmentError } = useQuery(
    ["departmentDetails", department?.id],
    getDepartment,
    {
      refetchOnWindowFocus: false,
    }
  );

  console.log(department);
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent padding="20px 0">
        <ModalHeader>Department Details :</ModalHeader>
        <ModalCloseButton />
        <ModalBody padding="20px ">
          {departmentLoading ? (
            <div>Loading...</div>
          ) : departmentError ? (
            <div>Error: {departmentError?.message}</div>
          ) : (
            <Flex flexDirection="column" gap="20px " padding="0 20px">
              <Text fontWeight="600" fontSize="16px " color={colors.secondary}>
                Name :
                <Text
                  padding="0 8px"
                  fontWeight="500"
                  as="span"
                  color={colors.primary}
                >
                  {department?.name}
                </Text>
              </Text>
              <Text fontWeight="600" fontSize="16px " color={colors.secondary}>
                Description :
                <Text
                  padding="0 8px"
                  fontWeight="500"
                  as="span"
                  color={colors.primary}
                >
                  {department?.departmentDescription}
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
                  {department?.serviceCost}
                </Text>
              </Text>
            </Flex>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DepartmentDetailModal;
