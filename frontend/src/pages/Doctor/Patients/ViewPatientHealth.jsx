import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import axios from 'axios';

import NavBar from '../../../NavBar';
import { API_URL } from '../../../utils/constants';
import { queryKeys } from '../../../utils/queryKeys';

import {
  Box,
  Container,
  Paper,
  Typography,
  Grid as Grid2,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';

export default function ViewPatientHealth() {
  const navigate = useNavigate();
  const { id } = useParams();
  const numericId = parseInt(id);

  const {
    data: allPatients,
    isLoading: loadingPatient,
    isError: errorPatient,
  } = useQuery({
    queryKey: [queryKeys.patient],
    queryFn: () =>
      axios
        .get(`${API_URL}/patients`, { withCredentials: true })
        .then((res) => res.data),
    onError: (err) => toast.error(`Failed to load patients: ${err.message}`),
  });

  //Grabbing prescription data
  const {
    data: prescriptions,
    isLoading: loadingPrescriptions,
    isError: errorPrescriptions,
  } = useQuery({
    queryKey: ['prescriptions', numericId],
    queryFn: () =>
      axios
        .get(`${API_URL}/prescriptions?patient_id=${numericId}`, { withCredentials: true })
        .then((res) => res.data),
    onError: (err) => toast.error(`Failed to load prescriptions: ${err.message}`),
  });
  //Appointment data
  const {
    data: appointments,
    isLoading: loadingAppointments,
    isError: errorAppointments,
  } = useQuery({
    queryKey: [queryKeys.appointments, numericId],
    queryFn: () =>
      axios
        .get(`${API_URL}/appointments/patient`, {
          params: {
            patientId: numericId,
            status: 1, // assuming the appointment is set
          },
          withCredentials: true,
        })
        .then((res) => res.data),
    onError: (err) => toast.error(`Failed to load appointments: ${err.message}`),
  });
  const upcomingAppointment = appointments?.[0]; 
  /*may need to adjust the index */
  //Meal plan data
  const {
    data: mealPlans,
    isLoading: loadingMeal,
    isError: errorMeal,
  } = useQuery({
    queryKey: [queryKeys.mealPlans, numericId],
    queryFn: () =>
      axios
        .get(`${API_URL}/mealplans/patient/${numericId}`, { withCredentials: true })
        .then((res) => res.data),
    onError: (err) => toast.error(`Failed to load meal plans: ${err.message}`),
  });
  const latestMealPlan = mealPlans?.[mealPlans.length - 1];
  //Should grab the latest meal plan

  //daily surveys
  const {
    data: dailySurveys = [],
    isLoading: loadingDailySurveys,
    isError: errorDailySurveys,
  } = useQuery({
    queryKey: [queryKeys.dailySurveys, numericId],
    queryFn: () =>
      axios
        .get(`${API_URL}/daily-surveys/patient/${numericId}`, {
          withCredentials: true,
        })
        .then((res) => res.data),
    enabled: !!numericId,
    onError: (err) => toast.error(`Failed to load daily surveys: ${err.message}`),
  });

  //Weekly
  const {
    data: weeklySurveys,
    isLoading: loadingWeekly,
    isError: errorWeekly,
  } = useQuery({
    queryKey: ['weeklySurveys', numericId],
    queryFn: () =>
      axios
        .get(`${API_URL}/weekly_surveys?patientId=${numericId}`, {
          withCredentials: true,
        })
        .then((res) => res.data),
  });

  const safeWeeklySurveys = weeklySurveys || [];
  
  const patient = allPatients?.find(p => p.id === numericId);

  const isLoading =
  loadingPatient || loadingPrescriptions || loadingAppointments || loadingMeal || loadingDailySurveys || loadingWeekly;
  const isError =
  errorPatient || errorPrescriptions || errorAppointments || errorMeal || errorDailySurveys || errorWeekly || !patient;


  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box>
        <NavBar />
        <Container maxWidth="sm" sx={{ mt: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            There was an error loading patient data.
          </Alert>
          <Button variant="contained" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Container>
      </Box>
    );
  }

  const firstName = patient?.firstName || 'Unknown';
  const lastName = patient?.lastName || 'Unknown';
  const email = patient?.email || 'Not provided';
  const phone = patient?.phone || 'Not provided';
  const address = patient?.address || 'Not provided';

  // Dummy data 
 /* const dummyMealPlan = {
    breakfastId: 101,
    lunchId: 202,
    dinnerId: 303,
  };

  const dummyAppointments = [
    {
      appointmentTimestamp: new Date().toISOString(),
      appointmentStatusCode: 'SCHEDULED',
    },
  ];

  const dummyPrescriptions = [
    {
      id: 1,
      rxStatusCode: 'ACTIVE',
      rxExpiryTimestamp: new Date().toISOString(),
    },
  ];

  const dummyDailySurveys = [
    {
      id: 1,
      createTimestamp: new Date().toISOString(),
      mood: 'Happy',
      caloriesEaten: 1800,
    },
  ];

  const dummyWeeklySurveys = [
    {
      id: 1,
      createTimestamp: new Date().toISOString(),
      weight: 150,
    },
  ]; */

  return (
    <Box>
      <NavBar />
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            View Patient Health
          </Typography>

          <Grid2 container spacing={4}>
            <Grid2 item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5">
                    {firstName} {lastName}
                  </Typography>
                  <Typography>Email: {email}</Typography>
                  <Typography>Phone: {phone}</Typography>
                  <Typography>Address: {address}</Typography>
                </CardContent>
              </Card>
            </Grid2>

            <Grid2 item xs={12} md={8}>
            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Typography variant="h6">Meal Plan</Typography>
                    <Divider sx={{ my: 1 }} />
                    {latestMealPlan ? (
                    <>
                        <Typography>Breakfast ID: {latestMealPlan.breakfast?.id}</Typography>
                        <Typography>Lunch ID: {latestMealPlan.lunch?.id}</Typography>
                        <Typography>Dinner ID: {latestMealPlan.dinner?.id}</Typography>
                    </>
                    ) : (
                    <Typography>No meal plan available</Typography>
                    )}
                </CardContent>
            </Card>

            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Typography variant="h6">Upcoming Appointment</Typography>
                    <Divider sx={{ my: 1 }} />
                    {upcomingAppointment ? (
                    <>
                        <Typography>
                        Time: {new Date(upcomingAppointment.appointmentTimestamp).toLocaleString()}
                        </Typography>
                        <Typography>Status: {upcomingAppointment.appointmentStatusCode.status || 'None set'}</Typography>
                    </>
                    ) : (
                    <Typography>No upcoming appointments found.</Typography>
                    )}
                </CardContent>
            </Card>



            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Typography variant="h6">Prescriptions</Typography>
                    <Divider sx={{ my: 1 }} />
                    {loadingPrescriptions ? (
                    <CircularProgress />
                    ) : errorPrescriptions || !prescriptions?.length ? (
                    <Typography>No prescriptions found.</Typography>
                    ) : (
                    prescriptions.map((rx) => (
                        <Box key={rx.id} sx={{ mb: 2 }}>
                        <Typography>ID: {rx.id}</Typography>
                        <Typography>Status: {rx.rxStatusCode?.status || 'Unknown'}</Typography>
                        <Typography>
                            Expires: {new Date(rx.rxExpiryTimestamp).toLocaleDateString()}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        </Box>
                    ))
                    )}
                </CardContent>
            </Card>

            </Grid2>

            <Grid2 item xs={12} md={6}>
            <Card>
                <CardContent>
                    <Typography variant="h6">Daily Surveys</Typography>
                    <Divider sx={{ my: 1 }} />
                    {dailySurveys.length === 0 ? (
                    <Typography>No surveys found.</Typography>
                    ) : (
                    dailySurveys.map((s) => (
                        <Typography key={s.id} sx={{ mb: 1 }}>
                        {new Date(s.surveyDate).toLocaleDateString()} — Mood: {s.mood}, Calories: {s.caloriesEaten}
                        </Typography>
                    ))
                    )}
                </CardContent>
            </Card>

            </Grid2>
            <Grid2 item xs={12} md={6}>
            <Card>
                <CardContent>
                    <Typography variant="h6">Weekly Surveys</Typography>
                    <Divider sx={{ my: 1 }} />
                    {safeWeeklySurveys.map((s) => (
                    <Typography key={s.id} sx={{ mb: 1 }}>
                        {new Date(s.surveyDate).toLocaleDateString()} — Weight: {s.weight}
                    </Typography>
                    ))}
                </CardContent>
            </Card>
            </Grid2>
          </Grid2>
        </Paper>
      </Container>
    </Box>
  );
}