import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { useNavigate } from "react-router";
import StyledButton from "./components/StyledButton";

export default function NavBar() {
  const navigate = useNavigate();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar>
        <Toolbar>
          <StyledButton onClick={() => navigate("/")} color="inherit">
            Home
          </StyledButton>
          <StyledButton onClick={() => navigate("/patient")} color="inherit">
            Patient
          </StyledButton>
          <StyledButton onClick={() => navigate("/doctor")} color="inherit">
            Doctor
          </StyledButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
