import { Box, Paper, Typography, useTheme } from "@mui/material";
import StyledButton from "../components/StyledButton";
import { useNavigate } from "react-router";

function LandingPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection={"column"}
      alignItems={"center"}
      mt={"8rem"}
    >
      <Box display="flex" width="80%" alignItems={"center"} gap="6rem">
        <Box display="flex" flexDirection={"column"}>
          <Typography variant="h1" fontWeight={"bold"} fontSize={"4rem"}>
            Your Health Journey Starts Here
          </Typography>
          <Typography fontSize={"1.5rem"}>
            Connect with specialized doctors, track your progress, and achieve
            your weight loss goals with our comprehensive healthcare platform.
          </Typography>
          <Box mt={"1rem"} display={"flex"} gap={".5rem"}>
            <StyledButton
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: "white",
                flex: 1,
              }}
              onClick={() => navigate("/signup?userType=patient")}
            >
              Join as Patient
            </StyledButton>
            <StyledButton
              sx={{ flex: 1 }}
              onClick={() => navigate("/signup?userType=doctor")}
            >
              Join as Docter
            </StyledButton>
            <StyledButton
              sx={{ flex: 1 }}
              onClick={() => navigate("/signup?userType=pharmacist")}
            >
              Join as Pharmacist
            </StyledButton>
          </Box>
        </Box>
        <Paper>
          <img width={800} src="./weightloss.jpg"></img>
        </Paper>
      </Box>
    </Box>
  );
}

export default LandingPage;
