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
import Pharmacydashboard from './pages/Pharmacy/Pharmacydashboard.jsx';
import CompleteDoctorProfile from './pages/Doctor/CompleteDoctorProfile.jsx';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Toaster} from 'sonner';
import Prescriptions from './pages/Pharmacy/prescriptions.jsx';


import Recipes from "./pages/Recipes/Recipes.jsx";
import RecipeCreate from "./pages/Recipes/RecipeCreate.jsx";

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
            <Auth allowedRoles={["PATIENT"]}>
                <PatientDashboard/>
            </Auth>
    },
    {
        path: '/doctor/dashboard',
        element:
            <Auth allowedRoles={["DOCTOR"]}>
                <DoctorDashboard/>
            </Auth>
    },
    {
        path: '/patient/complete-profile',
        element:
            <Auth allowedRoles={["PATIENT"]}>
                <CompletePatientProfile/>
            </Auth>
    },
    {
        path: '/doctor/complete-profile',
        element:
            <Auth allowedRoles={["DOCTOR"]}>
                <CompleteDoctorProfile/>
            </Auth> 
    },
    {
        path: '/pharmacydashboard',
        element:
            <Auth allowedRoles={["PHARMACIST"]}>
                <Pharmacydashboard/>
            </Auth>
    },  {
        path: '/prescriptions',
        element:
            <Auth allowedRoles={["PHARMACIST"]}>
                <Prescriptions/>
            </Auth>
    },
    {
        path: "/recipes",
        element:
        <Auth allowedRoles={["PATIENT","DOCTOR"]}>
           <Recipes/>
        </Auth>
    },
    {
        path: "/recipes/create",
        element:
            <Auth allowedRoles={["PATIENT","DOCTOR"]}>
                <RecipeCreate/>
            </Auth>
    }
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient}>

        {/* https://sonner.emilkowal.ski/getting-started */}
        <Toaster expand={true}position="bottom-center" theme="light"/>

        <RouterProvider router={router}/>
    </QueryClientProvider>
)
