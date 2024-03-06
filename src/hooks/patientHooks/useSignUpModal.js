import { useDisclosure, useToast } from "@chakra-ui/react";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { httpClient } from "../../utils/httpClient";
import { useSelector } from "react-redux";
import patientRegisterSchema from "../../validations/patientRegisterSchema";

export default function useSignUpModal() {
  const queryClient = useQueryClient();
  const { token } = useSelector((state) => state.account);

  const [isLoading, setIsLoading] = useState(false);

  const { isOpen, onOpen, onClose: _onClose } = useDisclosure();
  const toast = useToast();

  const onClose = () => {
    formik.resetForm();
    _onClose();
  };

  const signUpPatient = useMutation(
    (formData) =>
      httpClient.post("/patient", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    {
      onSuccess: () => {
        toast({
          title: "Patient account created",
          description: "Patient account has been successfully created.",
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
        } else {
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
    formik.validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        const formData = {
          FullName: values.fullName,
          Email: values.email,
          BirthDate: values.birthDate,
          PhoneNumber: values.phoneNumber,
          PatientIdentityNumber: values.patientIdentityNumber,
          Password: values.password,
        };
        setIsLoading(true);
        signUpPatient.mutate(formData);
      }
    });
  };

  useEffect(() => {
    if (!isLoading && signUpPatient.isSuccess) {
      queryClient.invalidateQueries("patient");
    }
  }, [isLoading, signUpPatient.isSuccess, queryClient]);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      birthDate: "",
      phoneNumber: "",
      patientIdentityNumber: "",
      password: "",
    },
    validationSchema: patientRegisterSchema,
    onSubmit: onSubmit,
  });

  return { onOpen, isOpen, onClose, formik, isLoading };
}
