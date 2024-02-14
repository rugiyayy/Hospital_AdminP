import * as Yup from "yup";

const today = new Date();

export const appDetailsSchema = Yup.object().shape({
  startTime: Yup.string().required("Please select a start time."),
  patientId: Yup.number().required("Please login to make an appointment."),
  doctorId: Yup.number().required("Please select a doctor."),
  description: Yup.string()
    .required("Required!")
    .max(100, "Description must be at most 30 characters long."),
});
