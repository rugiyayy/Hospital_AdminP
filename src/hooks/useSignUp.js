import { useToast } from "@chakra-ui/react";
import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { httpClient } from "../utils/httpClient";
import registerSchema from "../validations/registerSchema";
import { useNavigate } from "react-router-dom";

export default function useSignUp() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token } = useSelector((state) => state.account);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      userName: "",
      email: "",
      isAdmin: false,
      password: "",
    },
    onSubmit: (values) => {
      setIsLoading(true);
      registerQuery(values);
    },
    validationSchema: registerSchema,
  });


  const registerQuery = async (values) => {
    try {
      const response = await httpClient.post("/Account/SignUp", values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast({
        title: "Signed Up.",
        description: "You have been signed up  Role successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      navigate("/team")

    } catch (error) {
      console.log("errors4:", error?.response?.data?.errors?.Email);
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
    } finally {
      setIsLoading(false);
    }
  };

  return { formik, isLoading };
}
