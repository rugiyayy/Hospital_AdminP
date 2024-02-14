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
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import useUpdateDepartment from "../../hooks/departmentsHooks/useUpdateDepartment";
import { departmentsSchema } from "../../validations/departmnetsSchema";

export default function UpdateDepartmentModal({ isOpen, onClose, department }) {
  const { token } = useSelector((state) => state.account);
  const { updateDepartment } = useUpdateDepartment(department.id, onClose);

  const onSubmit = (values) => {
    const formData = {
      Name: values.name,
      DepartmentDescription: values.departmentDescription,
      ServiceCost:values.serviceCost,
    };
    updateDepartment.mutate(formData);
    onClose();
  };

  const formik = useFormik({
    initialValues: {
      name: department.name,
      serviceCost:department.serviceCost,
      departmentDescription: department.departmentDescription,
    },
    validationSchema: departmentsSchema,
    onSubmit: onSubmit,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">
          <Text as="h1" fontSize="28px" fontWeight="bold">
            Update Department
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
            {formik.errors.departmentDescription && formik.touched.departmentDescription && (
              <span style={{ color: "red" }}>{formik.errors.departmentDescription}</span>
            )}
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Description</FormLabel>
            <Input
              name="serviceCost"
              onChange={formik.handleChange}
              value={formik.values.serviceCost}
              onBlur={formik.handleBlur}
              pr="4.5rem"
              type="number"
            />
            {formik.errors.serviceCost && formik.touched.serviceCost && (
              <span style={{ color: "red" }}>{formik.errors.serviceCost}</span>
            )}
          </FormControl>
        </ModalBody>

        <ModalFooter margin="0 auto 12px">
          <Button
            padding="0 32px "
            isLoading={updateDepartment.isLoading}
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
