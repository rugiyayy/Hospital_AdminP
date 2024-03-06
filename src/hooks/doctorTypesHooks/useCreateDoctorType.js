import { useDisclosure, useToast } from "@chakra-ui/react";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { doctorTypeSchema } from "../../validations/doctorTypeSchema";
import { httpClient } from "../../utils/httpClient";
import { useSelector } from "react-redux";

export default function useCreateDoctorType() {
  const queryClient = useQueryClient();
  const { token } = useSelector((state) => state.account);

  const [isLoading, setIsLoading] = useState(false);

  const { isOpen, onOpen, onClose: _onClose } = useDisclosure();
  const toast = useToast();

  const onClose = () => {
    formik.resetForm();
    _onClose();
  };

  const createTypeDoctor = useMutation(
    (formData) =>
      httpClient.post("/doctorType", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    {
      onSuccess: () => {
        toast({
          title: "Type Added",
          description: "New type has been successfully created.",
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
        } else if (error?.response?.status === 401) {
          console.log("error401:", error);

          toast({
            title: "Authorization Error",
            description: "You are not authorized",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
          console.log(" if eldsfse error message :", error.response);
        }  else {
          console.log(" if else error message :", error.response);

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
      Description: values.description,
    };
    setIsLoading(true);
    createTypeDoctor.mutate(formData);
  };

  useEffect(() => {
    if (!isLoading && createTypeDoctor.isSuccess) {
      queryClient.invalidateQueries("doctorType");
    }
  }, [isLoading, createTypeDoctor.isSuccess, queryClient]);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: doctorTypeSchema,
    onSubmit: onSubmit,
  });

  return { onOpen, isOpen, onClose, formik, isLoading };
}
