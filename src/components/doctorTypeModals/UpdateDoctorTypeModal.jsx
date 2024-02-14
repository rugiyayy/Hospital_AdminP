import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
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
import React from "react";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { doctorTypeSchema } from "../../validations/doctorTypeSchema";
import useUpdateDoctorType from "../../hooks/doctorTypesHooks/useUpdateDoctorType";

export default function UpdateDoctorTypeModal({ isOpen, onClose, type }) {
  const { token } = useSelector((state) => state.account);
  const { updateTypeDoctor } = useUpdateDoctorType(type.id, onClose);

  const onSubmit = (values) => {
    const formData = {
      Name: values.name,
      Description: values.description,
    };
    updateTypeDoctor.mutate(formData);
    onClose();
  };

  const formik = useFormik({
    initialValues: {
      name: type.name,
      description: type.description,
    },
    validationSchema: doctorTypeSchema,
    onSubmit: onSubmit,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">
          <Text as="h1" fontSize="28px" fontWeight="bold">
            Update Type
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
              <span style={{ color: "red" }}>{formik.errors.description}</span>
            )}
          </FormControl>
        </ModalBody>

        <ModalFooter margin="0 auto 12px">
          <Button
            padding="0 32px "
            isLoading={updateTypeDoctor.isLoading}
            onClick={formik.handleSubmit}
            colorScheme="blue"
            mr={3}
          >
            Update
          </Button>
          <Button padding="0 24px" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
