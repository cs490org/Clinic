import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
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
import CompletePatientProfile from './pages/Patient/CompletePatientProfile.jsx';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";


const queryClient = new QueryClient()
const router = createBrowserRouter([
    {
        path: '/',
        element:
            <Auth notRequired>
                <LandingPage/>
            </Auth>
    },
    {
        path: '/signin',
        element:
            <Auth>
                <SignInPage/>
            </Auth>
    },
    {
        path: '/signup',
        element:
            <Auth notRequired>
                <SignupPage/>
            </Auth>
    },
    {
        path: '/patient/dashboard',
        element:
            <Auth>
                <PatientDashboard/>
            </Auth>
    },
    {
        path: '/doctor/dashboard',
        element:
            <Auth>
                <DoctorDashboard/>
            </Auth>
    },
    {
        path: '/patient/complete-profile',
        element:
            <Auth>
                <CompletePatientProfile/>
            </Auth>
    }
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}/>
    </QueryClientProvider>
)
