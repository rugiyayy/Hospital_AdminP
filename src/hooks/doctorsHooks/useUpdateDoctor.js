import { useMutation, useQueryClient } from "react-query";
import { httpClient } from "../../utils/httpClient";
import { useToast } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import updateDoctorSchema from "../../validations/updateDoctorSchema";

export default function useUpdateDoctor(doctorId, onSuccessCallback) {
  const { token } = useSelector((state) => state.account);
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const updateDoctor = useMutation(
    (formData) =>
      httpClient.put(`/doctor/${doctorId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      }),
    {
      onSuccess: () => {
        toast({
          title: "Doctor information Updated",
          description:
            "Doctor account information has been successfully updated.",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });
        setIsLoading(false);
        onSuccessCallback();
        queryClient.invalidateQueries("doctor"); // Move it here
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
              // error?.response?.data?.errors?.FullName ||
              // error?.response?.data?.errors?.Password ||
              // error?.response?.data?.errors?.Photo ||
              // error?.response?.data?.errors?.DepartmentId ||
              // error?.response?.data?.errors?.DoctorTypeId ||
              // error?.response?.data?.errors?.Email ||
              // error?.response?.data?.errors?.BirthDate ||
              // error?.response?.data?.errors?.PhoneNumber ||
              // error?.response?.data?.errors?.RoomNumber ||
              // error?.response?.data?.errors?.EndTime ||
              // error?.response?.data?.errors?.StartTime ||
              // error?.response?.data ||
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
  ///!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const onSubmit = (values) => {
    const formData = {
      Photo: values.photo,
      DoctorDetail: {
        PhoneNumber: values.phoneNumber,
        Email: values.email,
      },
    };
    setIsLoading(true);
    updateDoctor.mutate(formData);
  };

  const formik = useFormik({
    initialValues: {
      phoneNumber: "",
      email: "",
      photo: null,

    },
    validationSchema: updateDoctorSchema,
    onSubmit: onSubmit,
  });

  return { formik, updateDoctor, isLoading };
}
