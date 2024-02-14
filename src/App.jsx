import { ChakraBaseProvider, ChakraProvider } from "@chakra-ui/react";
import HeaderSidebar from "./layouts/Header";
import RegisterRole from "./pages/RegisterRole";
import Layout from "./layouts/Layout";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";


function App() {
  return(
    <ChakraProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}> 
            <Route path="/" element={<RegisterRole/>} />
          </Route>
        </Routes>
      </Router>
    </ChakraProvider>
  )
}

export default App;
