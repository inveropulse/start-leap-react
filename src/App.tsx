import "./App.css";
import {
  Route,
  Routes,
  Navigate,
  BrowserRouter as Router,
} from "react-router-dom";
import LoginPage from "./portals/auth/LoginPage";
import ClinicPortal from "./portals/clinic/ClinicPortal";
import PatientPortal from "./portals/patient/PatientPortal";
import InternalPortal from "./portals/internal/InternalPortal";
import SedationistPortal from "./portals/sedationist/SedationistPortal";

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
