import * as Yup from "yup";

const updatePatientRegisterSchema = Yup.object().shape({
  phoneNumber: Yup.string().required("Phone Number is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
});

export default updatePatientRegisterSchema;
