import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";


const initialState = {
  token: null,
  userName: null,
  patientId: null,
  doctorId:null,
  role: null,


};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    loginAction: (state, action) => {
      // const { token, userName,patientId } = action.payload;
      const { token } = action.payload;
      const decodedToken = jwtDecode(token);

      state.token = token;
      state.userName = decodedToken.email; 
      state.role = decodedToken.role; 

      const patientId = parseInt(decodedToken.PatientId);
      if (!isNaN(patientId)) { 
        state.patientId = patientId;}

      const doctorId = parseInt(decodedToken.DoctorId);
      if (!isNaN(doctorId)) { 
        state.doctorId = doctorId;}

      console.log("Patient ID:",typeof decodedToken.PatientId, "parsed:", typeof patientId); //string
      console.log("Doctor ID:",typeof decodedToken.DoctorId, "parsed:", typeof doctorId); //string
      console.log("Doctor ID:", decodedToken.DoctorId); //string


      console.log("User logged in:", decodedToken.email);
      console.log("Role:", decodedToken.role);
      console.log("Token:", token);
    },
    logoutAction: (state) => {
      console.log("User logged out:", state.userName);
      return initialState;
    },
  },
});

export const { loginAction, logoutAction } = accountSlice.actions;

export default accountSlice;
// myDoc@mail.ru