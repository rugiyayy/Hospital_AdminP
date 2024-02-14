import { useDisclosure, useToast } from "@chakra-ui/react";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { httpClient } from "../../utils/httpClient";
import { useSelector } from "react-redux";
import { departmentsSchema } from "../../validations/departmnetsSchema";

export default function useCreateDepartment() {
  const queryClient = useQueryClient();
  const { token } = useSelector((state) => state.account);

  const [isLoading, setIsLoading] = useState(false);

  const { isOpen, onOpen, onClose: _onClose } = useDisclosure();
  const toast = useToast();

  const onClose = () => {
    formik.resetForm();
    _onClose();
  };

  const createDepartment = useMutation(
    (formData) =>
      httpClient.post("/department", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    {
      onSuccess: () => {
        toast({
          title: "Department Added",
          description: "New department has been successfully created.",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });
        formik.resetForm();

        setIsLoading(false);
      },
      onError: (error) => {
        console.error("Error adding department", error);
        if (
          error.response &&
          error.response?.data &&
          error.response?.data?.errors
        ) {
          formik.setErrors(error.response?.data?.errors);
        } else {
          toast({
            title: "Error",
            description:
              error.response?.data ||
              error.message ||
              "Something went wrong. Please try again later.",
            status: "error",
            duration: 4000,
            isClosable: true,
            position: "top-right",
          });
        }
        setIsLoading(false);
      },
    }
  );

  const onSubmit = (values) => {
    const formData = {
      Name: values.name,
      ServiceCost:values.serviceCost,
      DepartmentDescription: values.departmentDescription,
    };
    setIsLoading(true);
    createDepartment.mutate(formData);
  };
  useEffect(() => {
    if (!isLoading && createDepartment.isSuccess) {
      queryClient.invalidateQueries("department");
    }
  }, [isLoading, createDepartment.isSuccess, queryClient]);

  const formik = useFormik({
    initialValues: {
      name: "",
      departmentDescription: "",
      serviceCost:"",
    },
    validationSchema: departmentsSchema,
    onSubmit: onSubmit,
  });

  return { onOpen, isOpen, onClose, formik, isLoading };
}
