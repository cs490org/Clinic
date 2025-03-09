import { Container, Typography, Paper, Grid, Box } from '@mui/material';
import { useAuth } from '../../auth/AuthProvider';

const DoctorDashboard = () => {
  const { userDetails } = useAuth();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Doctor Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Welcome, Dr. {userDetails.lastName}
            </Typography>
            <Typography variant="body1">
              Specialty: {userDetails.specialty}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Your doctor dashboard provides access to:
            </Typography>
            <Box component="ul">
              <Typography component="li">Patient appointments</Typography>
              <Typography component="li">Patient records</Typography>
              <Typography component="li">Prescription management</Typography>
              <Typography component="li">Treatment plans</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Today's Schedule
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No appointments scheduled
            </Typography>
          </Paper>
          <Paper sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box component="ul">
              <Typography component="li">Write prescription</Typography>
              <Typography component="li">View patient history</Typography>
              <Typography component="li">Schedule appointment</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DoctorDashboard; 