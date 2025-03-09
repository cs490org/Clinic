import { Routes, Route, Navigate } from 'react-router';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { AuthProvider } from './auth/AuthProvider';
import SignInPage from './pages/SignInPage';
import SignupPage from './pages/SignupPage';
import PatientDashboard from './pages/Patient/PatientDashboard';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import PharmacistDashboard from './pages/Pharmacy/PharmacistDashboard';
import ProtectedRoute from './auth/ProtectedRoute';
import NavBar from "./NavBar";
import theme from "./theme";
import LandingPage from './pages/LandingPage/LandingPage';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NavBar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="signin" element={<SignInPage />} />
          <Route path="signup" element={<SignupPage />} />
          
          <Route 
            path="patient/dashboard" 
            element={
              <ProtectedRoute allowedRoles={["PATIENT"]}>
                <PatientDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="doctor/dashboard" 
            element={
              <ProtectedRoute allowedRoles={["DOCTOR"]}>
                <DoctorDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="pharmacist/dashboard" 
            element={
              <ProtectedRoute allowedRoles={["PHARMACIST"]}>
                <PharmacistDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Catch all route for unmatched paths */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
