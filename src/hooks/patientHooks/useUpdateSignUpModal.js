import { useMutation, useQueryClient } from "react-query";
import { httpClient } from "../../utils/httpClient";
import { useToast } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import patientRegisterSchema from "../../validations/patientRegisterSchema";
import updatePatientRegisterSchema from "../../validations/updatePatientRegisterSchema";

export default function useUpdateSignUpModal(patientId, onSuccessCallback) {
  const { token } = useSelector((state) => state.account);
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const updatePatient = useMutation(
    (formData) =>
      httpClient.put(`/patient/${patientId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    {
      onSuccess: () => {
        toast({
          title: "Patient information Updated",
          description:
            "Patient account information has been successfully updated.",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });
        setIsLoading(false);
        onSuccessCallback();
        queryClient.invalidateQueries("patient");
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
      phoneNumber: values.phoneNumber,
      email: values.email,
    };
    setIsLoading(true);
    updatePatient.mutate(formData);
  };

  const formik = useFormik({
    initialValues: {
      phoneNumber: "",
      email: "",
    },
    validationSchema: updatePatientRegisterSchema,
    onSubmit: onSubmit,
  });

  return { formik, updatePatient, isLoading };
}
