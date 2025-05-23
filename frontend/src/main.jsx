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
import CompletePatientProfile from './pages/Patient/CompletePatientProfile.jsx';
import Pharmacydashboard from './pages/Pharmacy/Pharmacydashboard.jsx';
import CompleteDoctorProfile from './pages/Doctor/CompleteDoctorProfile.jsx';
import Bills from "./pages/Pharmacy/Bills.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from 'sonner';
import Prescriptions from './pages/Pharmacy/prescriptions.jsx';
import Patients from "./pages/Pharmacy/Patients.jsx";
import AppointmentCompletePage from './pages/AppointmentCompletePage.jsx';
import Reviews from './pages/Doctor/Reviews.jsx';

import Recipes from "./pages/Recipes/Recipes.jsx";
import RecipeCreate from "./pages/Recipes/RecipeCreate.jsx";
import CompletePharmacyProfile from "./pages/Pharmacy/CompletePharmacyProfile.jsx";
import IngredientCreate from "./pages/Recipes/Ingredients/IngredientCreate.jsx";
import AssignMealPlan from "./pages/Doctor/AssignMealPlan.jsx";
import ViewAssignedMealPlans from "./pages/Patient/ViewAssignedMealPlans.jsx";
import SearchPatients from "./pages/Doctor/Patients/SearchPatients.jsx";
import AssignPrescription from "./pages/Doctor/AssignRx.jsx";
import MessageRoomPage from "./pages/MessageRoom/MessageRoomPage.jsx";
import CompletePatientSymptoms from "./pages/Patient/CompletePatientSymptoms.jsx";
import PatientPharmacy from "./pages/Patient/Pharmacy/PatientPharmacy.jsx";
import AllMealPlans from "./pages/MealPlans/AllMealPlans.jsx";
import CreateMealPlan from "./pages/MealPlans/CreateMealPlan.jsx";
import PatientInputCreditCard from "./pages/Patient/PatientInputCreditCard.jsx";
import PatientPaymentPortal from "./pages/Patient/PaymentPortal.jsx";
import PatientBills from "./pages/Patient/PatientBills.jsx";
import PatientMetrics from "./pages/Patient/PatientMetrics.jsx";
import Conversations from './pages/MessageRoom/Conversations.jsx';
import ReverseFulfillment from "./pages/Pharmacy/PharmacyHistoryOverride.jsx";

const queryClient = new QueryClient()
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
            <Auth notRequired>
                <SignupPage />
            </Auth>
    },
    {
        path: '/patient/dashboard',
        element:
            <Auth allowedRoles={["PATIENT"]}>
                <PatientDashboard />
            </Auth>
    },
    {
        path: '/patient/symptoms',
        element:
            <Auth allowedRoles={["PATIENT"]}>
                <CompletePatientSymptoms/>
            </Auth>
    },
    {
        path: '/patient/pharmacy',
        element:
            <Auth allowedRoles={["PATIENT"]}>
                <PatientPharmacy/>
            </Auth>
    },
    {
        path: '/doctor/dashboard',
        element:
            <Auth allowedRoles={["DOCTOR"]}>
                <DoctorDashboard />
            </Auth>
    },
    {
        path: '/pharmacist/dashboard',
        element:
            <Auth allowedRoles={["PHARMACIST"]} >
                <Pharmacydashboard />
            </Auth>
    },
    {
        path: '/pharmacist/inventory',
        element:
            <Auth allowedRoles={["PHARMACIST"]}>
                <Prescriptions />
            </Auth>
    },
    {
        path: '/pharmacist/override',
        element:
            <Auth allowedRoles={["PHARMACIST"]}>
                <ReverseFulfillment />
            </Auth>
    },
    {
        path: '/patient/complete-profile',
        element:
            <Auth allowedRoles={["PATIENT"]}>
                <CompletePatientProfile />
            </Auth>
    },
    {
        path: '/patient/add_payment',
        element:
            <Auth allowedRoles={["PATIENT"]}>
                <PatientInputCreditCard/>
            </Auth>
    },
    {
        path: '/patient/metrics',
        element:
            <Auth allowedRoles={["PATIENT"]}>
                <PatientMetrics/>
            </Auth>
    },
    {
        path: '/doctor/complete-profile',
        element:
            <Auth allowedRoles={["DOCTOR"]}>
                <CompleteDoctorProfile />
            </Auth>
    },
    {
        path: '/patients',
        element:
            <Auth allowedRoles={["PATIENT", "DOCTOR", "PHARMACIST"]}>
                <SearchPatients />
            </Auth>
    },
    {
        path: '/pharmacy/complete-profile',
        element:
            <Auth allowedRoles={["PHARMACIST"]}>
                <CompletePharmacyProfile />
            </Auth>
    }, {
        path: '/pharmacist/bills',
        element:
            <Auth allowedRoles={["PHARMACIST"]}>
                <Bills />
            </Auth>
    },
    {
        path: "/pharmacist/patients",
        element: (
            <Auth allowedRoles={["PHARMACIST"]}>
                <Patients />
            </Auth>
        )
    },
    {
        path: "/recipes",
        element:
            <Auth allowedRoles={["PATIENT", "DOCTOR"]}>
                <Recipes />
            </Auth>
    },
    {
        path: "/recipes/create",
        element:
            <Auth allowedRoles={["PATIENT", "DOCTOR"]}>
                <RecipeCreate />
            </Auth>
    },
    {
        path: "/ingredients/create",
        element:
            <Auth allowedRoles={["PATIENT", "DOCTOR"]}>
                <IngredientCreate />
            </Auth>
    },
    {
        path: "/mealplans/assign",
        element:
            <Auth allowedRoles={["DOCTOR"]}>
                <AssignMealPlan />
            </Auth>
    },
    {
        path: "/mealplans",
        element:
            <Auth allowedRoles={["DOCTOR","PATIENT"]}>
                <AllMealPlans/>
            </Auth>
    },
    {
        path: "/mealplans/create",
        element:
            <Auth allowedRoles={["DOCTOR","PATIENT"]}>
                <CreateMealPlan/>
            </Auth>
    },
    {
        path: "/mealplans/assigned",
        element:
            <Auth allowedRoles={["PATIENT"]}>
                <ViewAssignedMealPlans />
            </Auth>
    },
    {
        path: "/doctor/assignrx",
        element:
            <Auth allowedRoles={["DOCTOR"]}>
                <AssignPrescription />
            </Auth>
    },
    {
        path: "/appointment/:id/:toUserId",
        element:
            <Auth allowedRoles={["PATIENT", "DOCTOR"]}>
                <MessageRoomPage />
            </Auth>
    },
    {
        path: "/appointment/:id/complete",
        element:
            <Auth allowedRoles={["PATIENT", "DOCTOR"]}>
                <AppointmentCompletePage />
            </Auth>
    },
    {
        path: "/conversations",
        element:
            <Auth allowedRoles={["PATIENT", "DOCTOR", "PHARMACIST"]}>
                <Conversations />
            </Auth>
    },
    {
        path: '/doctor/reviews',
        element:
            <Auth allowedRoles={["DOCTOR"]}>
                <Reviews />
            </Auth>
    },
    {
        path: '/patient/bills',
        element:
            <Auth allowedRoles={["PATIENT"]}>
                <PatientBills />
            </Auth>
    },
    {
        path: '/patient/paymentportal',
        element:
            <Auth allowedRoles={["PATIENT"]}>
                <PatientPaymentPortal />
            </Auth>
    }
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient}>

        {/* https://sonner.emilkowal.ski/getting-started */}
        <Toaster expand={true} position="bottom-center" theme="light" />

        <RouterProvider router={router} />
    </QueryClientProvider>
)
