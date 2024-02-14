import { useMutation, useQueryClient } from "react-query";
import { httpClient } from "../../utils/httpClient";
import { useToast } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { doctorTypeSchema } from "../../validations/doctorTypeSchema";
import { useEffect, useState } from "react";

export default function useUpdateDoctorType(doctorTypeId, onSuccessCallback) {
  const { token } = useSelector((state) => state.account);
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const updateTypeDoctor = useMutation(
    (formData) =>
      httpClient.put(`/doctorType/${doctorTypeId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    {
      onSuccess: () => {
        toast({
          title: "Type Updated",
          description: "Type information has been successfully updated.",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });
        setIsLoading(false);
        onSuccessCallback();
        queryClient.invalidateQueries("docType");
      },
      onError: (error) => {
        console.error("Error updating doctor type", error);
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
      },
    }
  );

  const onSubmit = (values) => {
    const formData = {
      Name: values.name,
      Description: values.description,
    };
    setIsLoading(true);
    updateTypeDoctor.mutate(formData);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },
    validationSchema: doctorTypeSchema,
    onSubmit: onSubmit,
  });

  return { formik, updateTypeDoctor, isLoading };
}
