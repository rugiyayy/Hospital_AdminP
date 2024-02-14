import * as Yup from "yup";

const today = new Date();
today.setDate(today.getDate() + 0.5);


export const appointmentSchema = Yup.object().shape({
    selectedDate: Yup.date()
    .min(today, "Selected date must be the next 30 days from today.")
    .required("Date is required"),
  doctorId: Yup.number().typeError("Required!").required("Required"),
  
});
