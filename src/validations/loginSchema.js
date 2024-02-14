import * as Yup from "yup";

const loginSchema = Yup.object().shape({
  userName: Yup.string().required("Required!"),
  password: Yup.string()
    .min(3, "Min 3 chars!")
    .max(50, "Max 50 chars!")
    .required("Required!"),
});
export default loginSchema;
