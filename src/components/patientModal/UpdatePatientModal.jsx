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
import patientRegisterSchema from "../../validations/patientRegisterSchema";
import useUpdateSignUpModal from "../../hooks/patientHooks/useUpdateSignUpModal";
import updatePatientRegisterSchema from "../../validations/updatePatientRegisterSchema";

  export default function UpdatePatientModal({ isOpen, onClose, patient }) {
    const { token } = useSelector((state) => state.account);
    const { updatePatient } = useUpdateSignUpModal(patient.id, onClose);

    const onSubmit = (values) => {
      const formData = {
        PhoneNumber: values.phoneNumber,
        Email: values.email,
      };
      updatePatient.mutate(formData);
      // onClose();
    };

    const formik = useFormik({
      initialValues: {
        phoneNumber: patient.phoneNumber,
        email: patient.email,
      },
      validationSchema: updatePatientRegisterSchema,
      onSubmit: onSubmit,
    });

    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">
            <Text as="h1" fontSize="28px" fontWeight="bold">
              Update Patient
            </Text>{" "}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Phone Number</FormLabel>
              <Input
                onChange={formik.handleChange}
                value={formik.values.phoneNumber}
                onBlur={formik.handleBlur}
                name="phoneNumber"
                type="text"
              />
              {formik.errors.phoneNumber && formik.touched.phoneNumber && (
                <span style={{ color: "red" }}>{formik.errors.phoneNumber}</span>
              )}
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                onBlur={formik.handleBlur}
                pr="4.5rem"
                type="email"
              />
              {formik.errors.email && formik.touched.email && (
                <span style={{ color: "red" }}>{formik.errors.email}</span>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter margin="0 auto 12px">
            <Button
              padding="0 32px "
              isLoading={updatePatient.isLoading}
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
