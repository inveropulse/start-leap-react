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
import WithProviders from "./shared/provider/WithProviders";
import { ErrorDisplay } from "./shared/components/Error/ErrorDisplay";

export default function App() {
  return (
    <WithProviders>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/clinic" element={<ClinicPortal />} />
          <Route path="/patient" element={<PatientPortal />} />
          <Route path="/internal" element={<InternalPortal />} />
          <Route path="/sedationist" element={<SedationistPortal />} />
          <Route 
            path="/error-test" 
            element={
              <ErrorDisplay 
                title="Something went wrong"
                message="An unexpected error occurred while processing your request."
                severity="error"
                errorId="ERR-12345"
                timestamp={new Date().toISOString()}
              />
            } 
          />
        </Routes>
      </Router>
    </WithProviders>
  );
}
