import { useDisclosure, useToast } from "@chakra-ui/react";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { loginAction } from "../redux/slices/accountSlice";
import { httpClient } from "../utils/httpClient";
import loginSchema from "../validations/loginSchema";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function useSignIn() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userName } = useSelector((x) => x.account);

  useEffect(() => {
    if (userName) {
      navigate("/");
    }
  }, [userName, navigate]);

  const formik = useFormik({
    initialValues: {
      userName: "",
      password: "",
    },
    onSubmit: (values) => {
      setIsLoading(true);
      loginQuery(values);
    },
    validationSchema: loginSchema,
  });

  const loginQuery = async (values) => {
    try {
      const response = await httpClient.post("/Account/SignIn", values);
      const userRole = response.data;
      const decodedToken = jwtDecode(userRole);
      const decodedRole = decodedToken.role;
      if (decodedRole === "Admin" || decodedRole === "Scheduler") {
        toast({
          title: "Logged in.",
          description: "You have been signed in successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });

        navigate("/");
        console.log(userRole);
        dispatch(
          loginAction({ token: response.data, userName: values.userName })
        );
      } else {
        console.log(userRole, decodedRole);
        toast({
          title: "Authorization Error",
          description: "You are not authorized to log in.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      }
    } catch (error) {
      if (
        error.response &&
        error.response?.data &&
        error.response?.data?.errors
      ) {
        formik.setErrors(error.response?.data?.errors);
      } else if (error?.response?.status === 401) {
        console.log("error401:", error);

        toast({
          title: "Authorization Error",
          description: "You are not authorized || invalid credentials",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
        console.log(" if eldsfse error message :", error.response);
      } else {
        console.log(error);
        toast({
          title: "Error",
          status: "error",
          description:
            error.response?.data ||
            "Something went wrong. Please try again later.",

          duration: 3000,
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
///!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
///!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
///!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
///!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
///!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
///!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
///!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
///!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
