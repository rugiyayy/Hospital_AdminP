import * as Yup from "yup";

export const departmentsSchema = Yup.object().shape({
  name: Yup.string()
    .min(5, "Too Short!")
    .max(50, "Too Long!")
    .required("Required!"),
  departmentDescription: Yup.string().required("Required!"),
  serviceCost: Yup.number()
    .required("Required!")
    .min(10, "Cannot be less than 10"), 
});
