import * as Yup from "yup";

const patientRegisterSchema = Yup.object().shape({
    fullName: Yup.string().required("Full Name is required"),
  phoneNumber: Yup.string().required("Phone Number is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  patientIdentityNumber: Yup.string().required("Patient Identity Number is required"),
  birthDate: Yup.date()
    .max(new Date(), "Birth Date cannot be in the future")
    .required("Birth Date is required")
    .test("age", "User must be at least 18 years old", function(value) {
      const currentDate = new Date();
      const userDate = new Date(value);
      const userAge = currentDate.getFullYear() - userDate.getFullYear();
      const isUnder18 = userAge < 18;
      return !isUnder18;
    }),
  password: Yup.string()
    .min(3, "Password must be at least 3 characters")
    .max(50, "Password must not exceed 50 characters")
    .required("Password is required"),
});
export default patientRegisterSchema;
