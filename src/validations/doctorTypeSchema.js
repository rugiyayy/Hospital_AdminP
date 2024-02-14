import * as Yup from "yup";

export const doctorTypeSchema = Yup.object().shape({
  name: Yup.string()
    .min(5, "Too Short!")
    .max(50, "Too Long!")
    .required("Required!"),
  description: Yup.string().required("Required!"),
});
