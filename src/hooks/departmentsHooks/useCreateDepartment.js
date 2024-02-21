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
        if (
          error.response &&
          error.response?.data &&
          error.response?.data?.errors
        ) {
          const validationErrors = error.response.data.errors;
          const errorMessage = Object.values(validationErrors).join("\v\r\n");

          formik.setErrors(
            error?.response?.data?.errors ||
              error?.response?.data ||
              "Something went wrong. Please try again later."
          );

          console.log("api validation error:", error?.response?.data?.errors);
          toast({
            title: "Error",
            description:
              errorMessage || "Something went wrong. Please try again later.",
            status: "error",
            duration: 4000,
            isClosable: true,
            position: "top-right",
          });
        } else {
          console.log(" if eldsfse error message :", error.response);
         
          toast({
            title: "Error",
            description:
              error?.response?.data ||
              error?.response ||
              "An unexpected error occurred. Please try again later.",

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
      ServiceCost: values.serviceCost,
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
      serviceCost: "",
    },
    validationSchema: departmentsSchema,
    onSubmit: onSubmit,
  });

  return { onOpen, isOpen, onClose, formik, isLoading };
}
