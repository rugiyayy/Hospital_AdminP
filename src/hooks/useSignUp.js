import { useToast } from "@chakra-ui/react";
import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { httpClient } from "../utils/httpClient";
import registerSchema from "../validations/registerSchema";

export default function useSignUp() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
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
  console.log(formik.values);
  const onClose = () => {
    formik.resetForm();
  };

  const registerQuery = async (values) => {
    try {
      const response = await httpClient.post("/Account/SignUp", values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast({
        title: "Signed Up.",
        description: "You have been signed up successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      onClose();
    } catch (error) {
      if (
        error.response &&
        error.response?.data &&
        error.response?.data?.errors
      ) {
        formik.setErrors(error.response?.data?.errors);
      } else {
        toast({
          title: "Error",
          description: error?.response?.data || error?.message,
          status: "error",
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
