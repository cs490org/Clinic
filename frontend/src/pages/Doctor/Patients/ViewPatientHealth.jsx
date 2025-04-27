import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import axios from 'axios';

import NavBar from '../../../NavBar';
import { UserContext } from '../../../contexts/UserContext';
import { API_URL } from '../../../utils/constants';
import { queryKeys } from '../../../utils/queryKeys';

import {
  Box,
  Container,
  Paper,
  Typography,
  Grid2,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';

export default function ViewPatientHealth() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  // Generic fetcher using your API_URL and including credentials
  const fetcher = (path) =>
    axios
      .get(`${API_URL}${path}`, { withCredentials: true })
      .then((res) => res.data);

  // Load patient
  const {
    data: patient,
    isLoading: loadingPatient,
    isError: errorPatient,
  } = useQuery({
    queryKey: [queryKeys.patient, id],
    queryFn: () => fetcher(`/patients/${id}`),
    onError: err => toast.error(`Failed to load patient: ${err.message}`),
  });

  // Load meal plan
  const {
    data: mealPlan,
    isLoading: loadingMealPlan,
    isError: errorMealPlan,
  } = useQuery({
    queryKey: [queryKeys.mealPlans, id],
    queryFn: () => fetcher(`/meal_plans?patientId=${id}`),
    onError: err => toast.error(`Failed to load meal plan: ${err.message}`),
  }
  );

  // Load prescriptions
  const {
    data: prescriptions = [],
    isLoading: loadingPrescriptions,
    isError: errorPrescriptions,
  } = useQuery({
    queryKey: [queryKeys.prescriptions, id],
    queryFn: () => fetcher(`/prescriptions?patientId=${id}`),
    onError: err => toast.error(`Failed to load prescriptions: ${err.message}`),
  }
  );

  // Load appointments
  const {
    data: appointments = [],
    isLoading: loadingAppointments,
    isError: errorAppointments,
  } = useQuery({
    queryKey: [queryKeys.appointments, id],
    queryFn: () => fetcher(`/appointments?patientId=${id}`),
    onError: err => toast.error(`Failed to load appointments: ${err.message}`),
});

  // Load daily surveys
  const {
    data: dailySurveys = [],
    isLoading: loadingDaily,
    isError: errorDaily,
  } = useQuery({
    queryKey: [queryKeys.dailySurveys, id],
    queryFn: () => fetcher(`/daily_surveys?patientId=${id}`),
    onError: err => toast.error(`Failed to load daily surveys: ${err.message}`),
});

  // Load weekly surveys
  const {
    data: weeklySurveys = [],
    isLoading: loadingWeekly,
    isError: errorWeekly,
  } = useQuery({
    queryKey: [queryKeys.weeklySurveys, id],
    queryFn: () => fetcher(`/weekly_surveys?patientId=${id}`),
    onError: err => toast.error(`Failed to load weekly surveys: ${err.message}`),
});

  // Combined loading & error states
  const isLoading =
    loadingPatient ||
    loadingMealPlan ||
    loadingPrescriptions ||
    loadingAppointments ||
    loadingDaily ||
    loadingWeekly;

  const isError =
    errorPatient ||
    errorMealPlan ||
    errorPrescriptions ||
    errorAppointments ||
    errorDaily ||
    errorWeekly;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !patient) {
    return (
      <Box>
        <NavBar />
        <Container maxWidth="sm" sx={{ mt: 4 }}>
          {isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              There was an error loading patient data.
            </Alert>
          )}
          {!patient && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Patient not found.
            </Alert>
          )}
          <Button variant="contained" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Container>
      </Box>
    );
  }

  // Destructure patient fields (match your DTO)
  const { firstName, lastName, email, phone, address } = patient;

  return (
    <Box>
      <NavBar />

      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            View Patient Health
          </Typography>

          <Grid2 container spacing={4}>
            {/* Profile */}
            <Grid2 item xs={12} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image="/assets/patient-placeholder.png"
                  alt={`${firstName} ${lastName}`}
                />
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

            {/* Meal Plan & Appointments & Prescriptions */}
            <Grid2 item xs={12} md={8}>
              {/* Meal Plan */}
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6">Meal Plan</Typography>
                  <Divider sx={{ my: 1 }} />
                  {mealPlan ? (
                    <>
                      <Typography>
                        Breakfast ID: {mealPlan.breakfastId}
                      </Typography>
                      <Typography>Lunch ID: {mealPlan.lunchId}</Typography>
                      <Typography>Dinner ID: {mealPlan.dinnerId}</Typography>
                      <Button
                        sx={{ mt: 1 }}
                        variant="contained"
                        onClick={() => navigate(`/assign-mealplan/${id}`)}
                      >
                        Assign Meal Plan
                      </Button>
                    </>
                  ) : (
                    <Typography>No meal plan assigned.</Typography>
                  )}
                </CardContent>
              </Card>

              {/* Upcoming Appointment */}
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6">Upcoming Appointment</Typography>
                  <Divider sx={{ my: 1 }} />
                  {appointments.length > 0 ? (
                    <>
                      <Typography>
                        Time:{' '}
                        {new Date(
                          appointments[0].appointmentTimestamp
                        ).toLocaleString()}
                      </Typography>
                      <Typography>
                        Status: {appointments[0].appointmentStatusCode}
                      </Typography>
                    </>
                  ) : (
                    <Typography>No upcoming appointments.</Typography>
                  )}
                </CardContent>
              </Card>

              {/* Prescriptions */}
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6">Prescriptions</Typography>
                  <Divider sx={{ my: 1 }} />
                  {prescriptions.length > 0 ? (
                    prescriptions.map((rx) => (
                      <Box key={rx.id} sx={{ mb: 2 }}>
                        <Typography>ID: {rx.id}</Typography>
                        <Typography>Status: {rx.rxStatusCode}</Typography>
                        <Typography>
                          Expires:{' '}
                          {new Date(rx.rxExpiryTimestamp).toLocaleDateString()}
                        </Typography>
                        <Button
                          sx={{ mt: 1 }}
                          variant="contained"
                          onClick={() =>
                            navigate(`/assign-medication/${id}`)
                          }
                        >
                          Assign Medication
                        </Button>
                        <Divider sx={{ my: 1 }} />
                      </Box>
                    ))
                  ) : (
                    <Typography>No prescriptions found.</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid2>

            {/* Surveys */}
            <Grid2 item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Daily Surveys</Typography>
                  <Divider sx={{ my: 1 }} />
                  {dailySurveys.length > 0 ? (
                    dailySurveys.map((s) => (
                      <Typography key={s.id} sx={{ mb: 1 }}>
                        {new Date(s.createTimestamp).toLocaleDateString()} — Mood:{' '}
                        {s.mood}, Calories: {s.caloriesEaten}
                      </Typography>
                    ))
                  ) : (
                    <Typography>No daily survey data.</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid2>
            <Grid2 item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Weekly Surveys</Typography>
                  <Divider sx={{ my: 1 }} />
                  {weeklySurveys.length > 0 ? (
                    weeklySurveys.map((s) => (
                      <Typography key={s.id} sx={{ mb: 1 }}>
                        {new Date(s.createTimestamp).toLocaleDateString()} — Weight:{' '}
                        {s.weight}
                      </Typography>
                    ))
                  ) : (
                    <Typography>No weekly survey data.</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid2>
          </Grid2>
        </Paper>
      </Container>
    </Box>
  );
}
