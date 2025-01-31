
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./Components/Signup/Signup.jsx"
import Login from "./Components/Login/Login.jsx";
import Dashboard from "./Components/DashBoard/Dashboard.jsx";
import { ToastContainer} from 'react-toastify';



function App() {
  return (
 
    <Router>
         <ToastContainer />
      <Routes>
     
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
       
      </Routes>
    </Router>
  );
}

export default App;
