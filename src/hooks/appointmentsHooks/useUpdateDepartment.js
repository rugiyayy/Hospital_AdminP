// import { useMutation, useQueryClient } from "react-query";
// import { httpClient } from "../../utils/httpClient";
// import { useToast } from "@chakra-ui/react";
// import { useSelector } from "react-redux";
// import { useFormik } from "formik";
// import { useState } from "react";
// import { departmentsSchema } from "../../validations/departmnetsSchema";

// export default function useUpdateDepartment(departmentId, onSuccessCallback) {
//   const { token } = useSelector((state) => state.account);
//   const toast = useToast();
//   const [isLoading, setIsLoading] = useState(false);
//   const queryClient = useQueryClient();

//   const updateDepartment = useMutation(
//     (formData) =>
//       httpClient.put(`/department/${departmentId}`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }),
//     {
//       onSuccess: () => {
//         toast({
//           title: "Department Updated",
//           description: "Department information has been successfully updated.",
//           status: "success",
//           duration: 4000,
//           isClosable: true,
//           position: "top-right",
//         });
//         setIsLoading(false);
//         onSuccessCallback();
//         queryClient.invalidateQueries("department");
//       },
//       onError: (error) => {
//         console.error("Error updating department", error);
//         if (
//           error.response &&
//           error.response?.data &&
//           error.response?.data?.errors
//         ) {
//           formik.setErrors(error.response?.data?.errors);
//         } else {
//           toast({
//             title: "Error",
//             description:
//               error.response?.data ||
//               error.message ||
//               "Something went wrong. Please try again later.",
//             status: "error",
//             duration: 4000,
//             isClosable: true,
//             position: "top-right",
//           });
//         }
//       },
//     }
//   );

//   const onSubmit = (values) => {
//     const formData = {
//       Name: values.name,
//       ServiceCost: values.serviceCost,
//       DepartmentDescription: values.departmentDescription,
//     };
//     setIsLoading(true);
//     updateDepartment.mutate(formData);
//   };

//   const formik = useFormik({
//     initialValues: {
//       name: "",
//       serviceCost:"",
//       departmentDescription: "",
//     },
//     validationSchema: departmentsSchema,
//     onSubmit: onSubmit,
//   });

//   return { formik, updateDepartment, isLoading };
// }
