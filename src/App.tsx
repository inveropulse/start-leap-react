import "./App.css";
import {
  Route,
  Routes,
  Navigate,
  BrowserRouter as Router,
} from "react-router-dom";
import LoginPage from "@/app/auth/LoginPage";
import ClinicPortal from "@/app/clinic/ClinicPortal";
import PatientPortal from "@/app/patient/PatientPortal";
import InternalPortal from "@/app/internal/InternalPortal";
import SedationistPortal from "@/app/sedationist/SedationistPortal";

/*
  hello DFF
*/

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/clinic" element={<ClinicPortal />} />
        <Route path="/patient" element={<PatientPortal />} />
        <Route path="/internal" element={<InternalPortal />} />
        <Route path="/sedationist" element={<SedationistPortal />} />
      </Routes>
    </Router>
  );
}
