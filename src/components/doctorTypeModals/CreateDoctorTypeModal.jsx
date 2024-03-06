import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useRef } from "react";
import { NavLink } from "react-router-dom";
// import useSignInModal from "../hooks/useSignInModal";
import { useSelector } from "react-redux";
import useCreateDoctorType from "../../hooks/doctorTypesHooks/useCreateDoctorType";

export default function CreateDoctorTypeModal() {
  const { onOpen, isLoading, onClose, formik, isOpen } = useCreateDoctorType();
  const { userName } = useSelector((x) => x.account);

  return (
    <>
      <Button
        onClick={onOpen}
        fontWeight="700"
        color="green"
        fontSize="16px"
        marginLeft="16px"
        padding="0 3rem"
        border="2px solid"
        background="white"
      >
        Add
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">
            <Text as="h1" fontSize="28px" fontWeight="bold">
              Add Type
            </Text>{" "}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Type Name</FormLabel>
              <Input
                onChange={formik.handleChange}
                value={formik.values.name}
                onBlur={formik.handleBlur}
                name="name"
                type="text"
              />
              {formik.errors.name && formik.touched.name && (
                <span style={{ color: "red" }}>{formik.errors.name}</span>
              )}
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Input
                name="description"
                onChange={formik.handleChange}
                value={formik.values.description}
                onBlur={formik.handleBlur}
                pr="4.5rem"
                type="text"
              />

              {formik.errors.description && formik.touched.description && (
                <span style={{ color: "red" }}>
                  {formik.errors.description}
                </span>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter margin="0 auto 12px">
            <Button
              padding="0 32px "
              //   background="green"
              //   _hover={{ backgroundColor: "green.500" }}
              //   colorScheme="blue"
              //   isLoading={isLoading}
              //   onClick={formik.handleSubmit}
              isLoading={isLoading}
              onClick={formik.handleSubmit}
              colorScheme="green"
              mr={3}
            >
              Add
            </Button>
            <Button padding="0 24px" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
