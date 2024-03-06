import * as Yup from "yup";

const resetPasswordSchema = Yup.object().shape({
  code: Yup.string().required("Code from your email is required"),
  password: Yup.string()
    .min(3, "Password must be at least 3 characters")
    .max(50, "Password must not exceed 50 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Password is required"),
});
export default resetPasswordSchema;
