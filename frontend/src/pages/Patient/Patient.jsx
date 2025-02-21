import { Box, Typography } from "@mui/material";
import PatientForm from "./PatientForm";
function Patient() {
  return (
    <Box
      sx={{
        mt: "6rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography fontWeight={""} textAlign={"center"}>
        Patient Sign Up
      </Typography>
      <PatientForm></PatientForm>
    </Box>
  );
}

export default Patient;
