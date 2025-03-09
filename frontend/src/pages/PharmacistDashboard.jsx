import { Container, Typography, Paper, Grid, Box } from '@mui/material';
import { useAuth } from '../auth/AuthProvider';

const PharmacistDashboard = () => {
  const { userDetails } = useAuth();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Pharmacy Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Welcome, {userDetails.firstName} {userDetails.lastName}
            </Typography>
            <Typography variant="body1">
              Pharmacy: {userDetails.pharmacyName}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Location: {userDetails.address}
            </Typography>
            <Typography variant="body1">
              Your pharmacy dashboard provides access to:
            </Typography>
            <Box component="ul">
              <Typography component="li">Prescription orders</Typography>
              <Typography component="li">Inventory management</Typography>
              <Typography component="li">Patient records</Typography>
              <Typography component="li">Insurance claims</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Pending Orders
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No pending prescriptions
            </Typography>
          </Paper>
          <Paper sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box component="ul">
              <Typography component="li">Fill prescription</Typography>
              <Typography component="li">Check inventory</Typography>
              <Typography component="li">Process refill request</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PharmacistDashboard; 