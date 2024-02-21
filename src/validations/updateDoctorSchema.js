import * as Yup from "yup";

const updateDoctorSchema = Yup.object().shape({
  doctorDetail: Yup.object().shape({
    phoneNumber: Yup.string().required("Phone number is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
  }),
});

export default updateDoctorSchema;
