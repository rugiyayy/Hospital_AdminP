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
} from "@chakra-ui/react";
import { useQuery } from "react-query";
import { httpClient } from "../utils/httpClient";
import { EmailIcon } from "@chakra-ui/icons";
import { colors } from "./Constants";

const SentEmailDetailModal = ({ isOpen, onClose, email }) => {
  const getApp = () => {
    return httpClient.get(`/email/${email?.id}`);
  };

  const { isLoading: emailLoading, error: emailError } = useQuery(
    ["emailDetails", email?.id],
    getApp,
    {
      refetchOnWindowFocus: false,
    }
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent padding="20px 0">
        <ModalHeader>Email Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody padding="20px ">
          {emailLoading ? (
            <div>Loading...</div>
          ) : emailError ? (
            <div>Error: {emailError?.message}</div>
          ) : (
            <Flex flexDirection="column" gap="20px " padding="0 20px">
              <Text fontWeight="600" fontSize="16px " color={colors.secondary}>
                From :
                <Text
                  padding="0 8px"
                  fontWeight="500"
                  as="span"
                  color={colors.primary}
                >
                  {email?.from}
                </Text>
              </Text>
              <Text fontWeight="600" fontSize="16px " color={colors.secondary}>
                To :
                <Text
                  padding="0 8px"
                  fontWeight="500"
                  as="span"
                  color={colors.primary}
                >
                  {email?.to}
                </Text>
              </Text>
              <Text fontWeight="600" fontSize="16px " color={colors.secondary}>
                Subject :
                <Text
                  padding="0 8px"
                  fontWeight="500"
                  as="span"
                  color={colors.primary}
                >
                  {email?.subject}
                </Text>
              </Text>
              <Text fontWeight="600" fontSize="16px " color={colors.secondary}>
                Body :
                <Text
                  padding="0 8px"
                  fontWeight="500"
                  as="span"
                  color={colors.primary}
                >
                  {email?.body}
                </Text>
              </Text>
              <Text fontWeight="600" fontSize="16px " color={colors.secondary}>
                Sent date :
                <Text
                  padding="0 8px"
                  fontWeight="500"
                  as="span"
                  color={colors.primary}
                >
                  {email?.sentTime}
                </Text>
              </Text>
            </Flex>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SentEmailDetailModal;
