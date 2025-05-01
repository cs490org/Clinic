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

  const patient = allPatients?.find(p => p.id === numericId);

  const isLoading = loadingPatient;
  const isError = errorPatient || !patient;

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
          </Grid2>
        </Paper>
      </Container>
    </Box>
  );
}
