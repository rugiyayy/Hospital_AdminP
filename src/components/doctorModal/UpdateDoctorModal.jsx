import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import patientRegisterSchema from "../../validations/patientRegisterSchema";
import useUpdateSignUpModal from "../../hooks/patientHooks/useUpdateSignUpModal";
import updatePatientRegisterSchema from "../../validations/updatePatientRegisterSchema";
import useUpdateDoctor from "../../hooks/doctorsHooks/useUpdateDoctor";
import updateDoctorSchema from "../../validations/updateDoctorSchema";
import { useDropzone } from "react-dropzone";

export default function UpdateDoctorModal({ isOpen, onClose, doctor }) {
  const { token } = useSelector((state) => state.account);
  const { updateDoctor } = useUpdateDoctor(doctor.id, onClose);
  const [selectedImage, setSelectedImage] = useState(null);
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      formik.setFieldValue("photo", file);
    }
  };

  const onSubmit = (values) => {
    formik.validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        const formData = {
          DoctorDetail: {
            PhoneNumber: values.doctorDetail.phoneNumber,
            Email: values.doctorDetail.email,
          },
          Photo: values.photo,
        };
        console.log(doctor);

        updateDoctor.mutate(formData);
        // onClose();
      }
    });
  };
  const formik = useFormik({
    initialValues: {
      doctorDetail: {
        phoneNumber: doctor.doctorDetail.phoneNumber,
        email: doctor.doctorDetail.email,
      },
      photo: doctor.photo,

    },

    validationSchema: updateDoctorSchema,
    onSubmit: onSubmit,
  });
  // const { getRootProps, getInputProps } = useDropzone({
  //   accept: "image/*",
  //   onDrop: (acceptedFiles) => {
  //     formik.setFieldValue("photo", acceptedFiles[0]); // Store the first accepted file
  //   },
  // });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">
          <Text as="h1" fontSize="28px" fontWeight="bold">
            Update Doctor
          </Text>{" "}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Phone Number</FormLabel>
            <Input
              onChange={formik.handleChange}
              value={formik.values.doctorDetail.phoneNumber}
              onBlur={formik.handleBlur}
              name="doctorDetail.phoneNumber"
              type="text"
            />
            {formik.errors.doctorDetail?.phoneNumber &&
              formik.touched.doctorDetail?.phoneNumber && (
                <span style={{ color: "red" }}>
                  {formik.errors.doctorDetail.phoneNumber}
                </span>
              )}
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Email</FormLabel>
            <Input
              name="doctorDetail.email"
              onChange={formik.handleChange}
              value={formik.values.doctorDetail.email}
              onBlur={formik.handleBlur}
              pr="4.5rem"
              type="email"
            />
            {formik.errors.doctorDetail?.email &&
              formik.touched.doctorDetail?.email && (
                <span style={{ color: "red" }}>
                  {formik.errors.doctorDetail.email}
                </span>
              )}
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Photo</FormLabel>
            <Input
              onChange={handleImageChange}
              accept="image/*"
              onBlur={formik.handleBlur}
              name="photo"
              type="file"
            />{" "}
            {selectedImage && (
              <Box mt={2}>
                <img
                  src={selectedImage}
                  alt="Selected"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </Box>
            )}
            {formik.errors.photo && formik.touched.photo && (
              <span style={{ color: "red" }}>{formik.errors.photo}</span>
            )}
          </FormControl>

          {/* <FormControl mt={4}>
            <FormLabel>Photo</FormLabel>
            <Box {...getRootProps()} borderWidth="2px" p="20px" cursor="pointer">
              <input {...getInputProps()} />
              <Text>Drag 'n' drop or click to select a photo</Text>
            </Box>
            {formik.touched.photo && formik.errors.photo && (
              <span style={{ color: "red" }}>{formik.errors.photo}</span>
            )}
            {formik.values.photo && formik.values.photo instanceof File && (
              <img src={URL.createObjectURL(formik.values.photo)} alt="Doctor's photo" style={{ marginTop: '10px', maxWidth: '200px' }} />
            )}
          </FormControl> */}
        </ModalBody>

        <ModalFooter margin="0 auto 12px">
          <Button
            padding="0 32px "
            isLoading={updateDoctor.isLoading}
            onClick={formik.handleSubmit}
            colorScheme="blue"
            mr={3}
          >
            Update
          </Button>
          <Button padding="0 24px" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
