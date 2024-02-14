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
        console.error("Error adding doctor type", error);
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
      Description: values.description,
    };
    setIsLoading(true);
    createTypeDoctor.mutate(formData);
  };
  useEffect(() => {
    if (!isLoading && createTypeDoctor.isSuccess) {
      queryClient.invalidateQueries("docType");
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
