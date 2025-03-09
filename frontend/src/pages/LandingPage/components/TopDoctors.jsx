import { Box, Typography, Grid, Container, Avatar } from "@mui/material";
import Card from "./Card";
import PersonIcon from '@mui/icons-material/Person';

const DoctorCard = ({ name, specialty, description }) => (
  <Grid item xs={12} sm={6} lg={4}>
    <Card centered>
      <Avatar
        sx={{
          width: 120,
          height: 120,
          mb: 2,
          bgcolor: 'grey.200'
        }}
      >
        <PersonIcon sx={{ fontSize: 80, color: 'grey.400' }} />
      </Avatar>
      <Typography variant="h5" fontWeight="bold" mb={1}>
        {name}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={2}>
        {specialty}
      </Typography>
      <Typography color="text.secondary">
        {description}
      </Typography>
    </Card>
  </Grid>
);

const doctors = [
  {
    name: "Dr. Elvin Gadd",
    specialty: "Weight loss Specialist",
    description: "Board-certified in obesity medicine with 15 years of experience helping patients achieve sustainable weight loss."
  },
  {
    name: "Dr. Luigi Verde",
    specialty: "Nutritionist",
    description: "Specializes in creating personalized nutrition plans that fit into patients' lifestyles for long-term success."
  },
  {
    name: "Dr. Peach Toadstool",
    specialty: "Obesity Medicine Specialist",
    description: "Physician specializing in non-surgical weight loss methods, including FDA-approved medications."
  }
];

const TopDoctors = () => {
  return (
    <Box 
      sx={{ 
        py: { xs: 6, md: 10 },
        px: { xs: 2, sm: 4, md: 6 },
        backgroundColor: '#f5f5f5'
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="h2"
          textAlign="center"
          fontSize={{ xs: "2rem", md: "3.5rem" }}
          fontWeight="bold"
          mb={3}
        >
          Our Top Doctors
        </Typography>
        
        <Typography
          textAlign="center"
          fontSize={{ xs: "1rem", md: "1.25rem" }}
          mb={8}
          maxWidth="800px"
          mx="auto"
        >
          Meet our highly qualified healthcare professionals specializing in weight
          management and nutrition.
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {doctors.map((doctor, index) => (
            <DoctorCard key={index} {...doctor} />
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TopDoctors; 