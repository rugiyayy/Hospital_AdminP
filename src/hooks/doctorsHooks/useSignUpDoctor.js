import { useDisclosure, useToast } from "@chakra-ui/react";
import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { httpClient } from "../../utils/httpClient";
import { useSelector } from "react-redux";
import doctorRegisterSchema from "../../validations/doctorRegisterSchema";

export default function useSignUpDoctorModal() {
  const queryClient = useQueryClient();
  const { token } = useSelector((state) => state.account);

  const [isLoading, setIsLoading] = useState(false);

  const { isOpen, onOpen, onClose: _onClose } = useDisclosure();
  const toast = useToast();
  const fileInputRef = useRef(null);

  const onClose = () => {
    formik.resetForm();
    _onClose();
  };
  ///!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  const signUpDoctor = useMutation(
    (formData) =>
      httpClient.post("/doctor", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          // "type": "formData"
        },
      }),
    {
      onSuccess: () => {
        toast({
          title: "doctor account created",
          description: "doctor account has been successfully created.",
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
  const onSubmit = (values) => {
    // console.log("Form values:", values);

    formik.validateForm().then((errors) => {
      console.log("Validation errors:", errors);
      if (Object.keys(errors).length === 0) {
        const formData = {
          FullName: values.fullName,
          DepartmentId: values.departmentId,
          DoctorTypeId: values.doctorTypeId,
          Password: values.password,
          Photo: values.photo,
          DoctorDetail: {
            PhoneNumber: values.phoneNumber,
            Email: values.email,
            BirthDate: values.birthDate,
          
          },

          WorkingSchedule: {
            StartTime: values.startTime,
            EndTime: values.endTime,
          },

          ExaminationRoom: {
            RoomNumber: values.roomNumber,
          },
        };

        setIsLoading(true);
        signUpDoctor.mutate(formData);
      }
    });
  };

  useEffect(() => {
    if (!isLoading && signUpDoctor.isSuccess) {
      queryClient.invalidateQueries("doctor");
    }
  }, [isLoading, signUpDoctor.isSuccess, queryClient]);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      password: "",
      departmentId: "",
      doctorTypeId: "",
      photo: null,

      roomNumber: "",
      startTime: "",
      endTime: "",
      phoneNumber: "",
      email: "",
      birthDate: "",
    },
    validationSchema: doctorRegisterSchema,
    onSubmit: onSubmit,
  });

  return { onOpen, isOpen, onClose, formik, isLoading };
}
