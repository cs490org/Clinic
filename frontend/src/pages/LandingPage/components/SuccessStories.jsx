import { Box, Typography, Avatar, Grid, Container } from "@mui/material";
import Card from "./Card";

const TestimonialCard = ({ initial, achievement, testimonial }) => (
  <Grid item xs={12} sm={6} lg={4}>
    <Card withBorder>
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar sx={{ bgcolor: 'grey.800', mr: 2 }}>{initial}</Avatar>
        <Box>
          <Typography fontWeight="medium">Anonymous User</Typography>
          <Typography variant="body2" color="text.secondary">{achievement}</Typography>
        </Box>
      </Box>
      <Typography color="text.secondary">{testimonial}</Typography>
    </Card>
  </Grid>
);

const testimonials = [
  {
    initial: "J",
    achievement: "Lost 30 pounds in 6 months",
    testimonial: "The personalized care and top tier doctors helped me stay accountable. My doctor was always available to give advice and adjust my plan as needed."
  },
  {
    initial: "J",
    achievement: "Managed diabetes effectively",
    testimonial: "The integration with pharmacy made getting my medication and managing it much easier. My health metrics have significantly improved over time."
  },
  {
    initial: "C",
    achievement: "Improved eating habits",
    testimonial: "The personalized meal plans helped me lose weight and develop healthier eating habits. Using the discussion board helped with creating new recipes."
  }
];

const SuccessStories = () => {
  return (
    <Box 
      sx={{ 
        py: { xs: 6, md: 10 },
        px: { xs: 2, sm: 4, md: 6 },
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
          Success Stories
        </Typography>
        
        <Typography
          textAlign="center"
          fontSize={{ xs: "1rem", md: "1.25rem" }}
          mb={8}
          maxWidth="800px"
          mx="auto"
        >
          Hear from our patients who have achieved their health and weight loss goals.
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default SuccessStories; 