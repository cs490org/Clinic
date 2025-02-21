import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router";

export default function Root() {
  const navigate = useNavigate();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar>
        <Toolbar>
          <Button onClick={() => navigate("/")} color="inherit">
            Home
          </Button>
          <Button onClick={() => navigate("/patient")} color="inherit">
            Patient
          </Button>
          <Button onClick={() => navigate("/doctor")} color="inherit">
            Doctor
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
