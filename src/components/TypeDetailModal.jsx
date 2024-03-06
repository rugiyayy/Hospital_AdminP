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

const TypeDetailModal = ({ isOpen, onClose, type }) => {
  const getType = () => {
    return httpClient.get(`/doctorType/${type?.id}`);
  };

  const { isLoading, error } = useQuery(["typeDetails", type?.id], getType, {
    refetchOnWindowFocus: false,
  });

  console.log(type);
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent padding="20px 0">
        <ModalHeader>Type Details :</ModalHeader>
        <ModalCloseButton />
        <ModalBody padding="20px ">
          {isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error: {error?.message}</div>
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
                  {type?.name}
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
                  {type?.description}
                </Text>
              </Text>
            </Flex>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TypeDetailModal;
