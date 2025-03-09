import { Box, Typography, Grid, Container } from "@mui/material";
import Card from "./Card";

const features = [
  {
    title: "Personalized Care",
    description: "Our platform connects you with doctors specialized in weight management who create personalized treatment plans based on your unique needs and goals."
  },
  {
    title: "Progress Tracking",
    description: "Track your weight loss journey with comprehensive tools for monitoring calories, water intake, and other vital health metrics."
  },
  {
    title: "Integrated Pharmacy",
    description: "Seamlessly receive prescriptions from your doctor and have them filled at your preferred pharmacy, all within our platform."
  },
  {
    title: "Personalized Meal Plans",
    description: "Select from a variety of meal plans to fit your personal needs and goals, curated by specialized doctors as well as the general community."
  }
];

const FeatureCard = ({ title, description }) => (
  <Grid item xs={12} sm={6} md={3}>
    <Card>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        {title}
      </Typography>
      <Typography color="text.secondary">
        {description}
      </Typography>
    </Card>
  </Grid>
);

const AboutUs = () => {
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
          About Us
        </Typography>
        
        <Typography
          textAlign="center"
          fontSize={{ xs: "1rem", md: "1.25rem" }}
          mb={8}
          maxWidth="800px"
          mx="auto"
        >
          Our Clinic is a comprehensive healthcare platform designed to connect patients with
          specialized doctors and pharmacies. Our focus is on providing personalized care for
          weight management and overall wellness.
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutUs; 