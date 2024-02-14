import * as Yup from "yup";

const registerSchema = Yup.object().shape({
  userName: Yup.string().required("user Name is required"),
  isAdmin: Yup.bool().required("bool  is required"),
  fullName: Yup.string().required("Full Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(3, "Password must be at least 3 characters")
    .max(50, "Password must not exceed 50 characters")
    .required("Password is required"),
});
export default registerSchema;
