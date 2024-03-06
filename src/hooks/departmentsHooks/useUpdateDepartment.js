import { useMutation, useQueryClient } from "react-query";
import { httpClient } from "../../utils/httpClient";
import { useToast } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { useState } from "react";
import { departmentsSchema } from "../../validations/departmnetsSchema";

export default function useUpdateDepartment(departmentId, onSuccessCallback) {
  const { token } = useSelector((state) => state.account);
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const updateDepartment = useMutation(
    (formData) =>
      httpClient.put(`/department/${departmentId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    {
      onSuccess: () => {
        toast({
          title: "Department Updated",
          description: "Department information has been successfully updated.",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });
        setIsLoading(false);
        queryClient.invalidateQueries("departments");
        onSuccessCallback();
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
          console.log(" hello if else error message :", error.response.data);

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
    updateDepartment.mutate(formData);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      serviceCost: "",
      departmentDescription: "",
    },
    validationSchema: departmentsSchema,
    onSubmit: onSubmit,
  });

  return { formik, updateDepartment, isLoading };
}
