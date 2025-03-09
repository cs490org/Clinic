import { Container, Typography, Paper, Grid, Box } from '@mui/material';
import { useAuth } from '../../auth/AuthProvider';

const PatientDashboard = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Patient Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Welcome, {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="body1">
              This is your patient dashboard. Here you'll be able to:
            </Typography>
            <Box component="ul">
              <Typography component="li">View your prescriptions</Typography>
              <Typography component="li">Schedule appointments</Typography>
              <Typography component="li">View your medical history</Typography>
              <Typography component="li">Message your healthcare providers</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box component="ul">
              <Typography component="li">Request prescription refill</Typography>
              <Typography component="li">Book appointment</Typography>
              <Typography component="li">View test results</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PatientDashboard; 