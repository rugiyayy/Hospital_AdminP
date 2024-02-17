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

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/register" element={<RegisterRole />} />

            <Route path="/doctorType" element={<DoctorType />} />



            <Route path="/" element={<Patient/>} />


             {/* <Route path="/" element={<ScheduleAppointment/>} /> */}

            <Route path="/scheduleAppointment" element={<GetSlots />} />


            <Route path="/allAppointments" element={<Appointments />} />
            <Route path="/doctorType" element={<DoctorType />} />
            <Route path="/department" element={<Department />} />

          </Route>
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
