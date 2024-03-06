import {
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
} from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";
import useCreateDepartment from "../../hooks/departmentsHooks/useCreateDepartment";

export default function CreateDepartmentModal() {
  const { onOpen, isLoading, onClose, formik, isOpen } = useCreateDepartment();
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
              Add Department
            </Text>{" "}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Department Name</FormLabel>
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
                name="departmentDescription"
                onChange={formik.handleChange}
                value={formik.values.departmentDescription}
                onBlur={formik.handleBlur}
                pr="4.5rem"
                type="text"
              />

              {formik.errors.departmentDescription &&
                formik.touched.departmentDescription && (
                  <span style={{ color: "red" }}>
                    {formik.errors.departmentDescription}
                  </span>
                )}
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Service Cost</FormLabel>
              <Input
                name="serviceCost"
                onChange={formik.handleChange}
                value={formik.values.serviceCost}
                onBlur={formik.handleBlur}
                pr="4.5rem"
                type="number"
              />

              {formik.errors.serviceCost && formik.touched.serviceCost && (
                <span style={{ color: "red" }}>
                  {formik.errors.serviceCost}
                </span>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter margin="0 auto 12px">
            <Button
              padding="0 32px "
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
