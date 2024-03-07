import { ChakraBaseProvider, ChakraProvider } from "@chakra-ui/react";
import HeaderSidebar from "./layouts/HeaderSideBar";
import RegisterRole from "./pages/RegisterRole";
import Layout from "./layouts/Layout";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import DoctorType from "./pages/DoctorType";
import Department from "./pages/Department";
import Appointments from "./pages/Appointments";
import GetSlots from "./pages/GetSlots";
import ScheduleAppointment from "./pages/ScheduleAppointment";
import Patient from "./pages/Patient";
import Doctor from "./pages/Doctor";
import SenEmail from "./pages/SentEmail";
import SentEmail from "./pages/SentEmail";
import SignIn from "./pages/SignIn";
import { ProtectedRoute, ProtectedRouteAdmin } from "./utils/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Team from "./pages/Team";
import DoctorRegister from "./pages/DoctorRegister";

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route
              path="/register"
              element={
                <ProtectedRouteAdmin>
                  <RegisterRole />
                </ProtectedRouteAdmin>
              }
            />
             <Route
              path="/doctorRegister"
              element={
                <ProtectedRouteAdmin>
                <DoctorRegister/>
                </ProtectedRouteAdmin>
              }
            />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Doctor />
                </ProtectedRoute>
              }
            />

            <Route
              path="/patient"
              element={
                <ProtectedRoute>
                  <Patient />
                </ProtectedRoute>
              }
            />

            <Route
              path="/schedule"
              element={
                <ProtectedRoute>
                  <ScheduleAppointment />
                </ProtectedRoute>
              }
            />

            <Route
              path="/team"
              element={
                <ProtectedRoute>
                  <Team />
                </ProtectedRoute>
              }
            />

            {/* <Route
              path="/scheduleAppointment"
              element={
                <ProtectedRoute>
                  <GetSlots />
                </ProtectedRoute>
              }
            /> */}

            <Route
              path="/allAppointments"
              element={
                <ProtectedRoute>
                  <Appointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctorType"
              element={
                <ProtectedRoute>
                  <DoctorType />
                </ProtectedRoute>
              }
            />
            <Route
              path="/department"
              element={
                <ProtectedRoute>
                  <Department />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sentEmail"
              element={
                <ProtectedRoute>
                  <SentEmail />
                </ProtectedRoute>
              }
            />

            <Route path="/*" element={<Doctor />} />
            {/* //!!  not found sozday pls */}
          </Route>
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/resetPassword" element={<ResetPassword />} />

          <Route path="/signIn" element={<SignIn />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
