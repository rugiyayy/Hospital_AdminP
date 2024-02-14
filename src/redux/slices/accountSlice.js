import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";


const initialState = {
  token: null,
  userName: null,
  patientId: null,
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
      const patientId = parseInt(decodedToken.PatientId);
      if (!isNaN(patientId)) { 
        state.patientId = patientId;}
      console.log("Patient ID:",typeof decodedToken.PatientId, "parsed:", typeof patientId); //string
      console.log("User logged in:", decodedToken.email);
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
