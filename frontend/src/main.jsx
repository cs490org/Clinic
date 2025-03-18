import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Auth from './auth/AuthProvider';
import LandingPage from './pages/LandingPage/LandingPage.jsx';
import SignInPage from './pages/SignInPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import PatientDashboard from './pages/Patient/PatientDashboard.jsx';
import DoctorDashboard from "./pages/Doctor/DoctorDashboard.jsx";

const router = createBrowserRouter([
  {
    path: '/',
    element:
      <Auth notRequired>
        <LandingPage />
      </Auth>
  },
  {
    path: '/signin',
    element:
      <Auth>
        <SignInPage />
      </Auth>
  },
  {
    path: '/signup',
    element:
      <Auth>
        <SignupPage />
      </Auth>
  },
  {
    path: '/patient/dashboard',
    element:
      <Auth>
        <PatientDashboard />
      </Auth>
  },
  {
    path: '/doctor/dashboard',
    element:
        <Auth>
          <DoctorDashboard/>
        </Auth>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
