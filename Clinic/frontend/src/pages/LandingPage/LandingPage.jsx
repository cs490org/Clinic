import { Box } from "@mui/material";
import HeroSection from "./components/HeroSection";
import AboutUs from "./components/AboutUs";
import SuccessStories from "./components/SuccessStories";
import TopDoctors from "./components/TopDoctors";

function LandingPage() {
  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      sx={{
        overflowX: 'hidden'
      }}
    >
      <HeroSection />
      <AboutUs />
      <SuccessStories />
      <TopDoctors />
    </Box>
  );
}

export default LandingPage;
