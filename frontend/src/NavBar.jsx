import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { useNavigate } from "react-router";
import StyledButton from "./components/StyledButton";
import { styled, Typography } from "@mui/material";
import { useAuth } from "./auth/AuthProvider";

export default function NavBar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout, userRole } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar>
        <Box
          display="flex"
          justifyContent={"space-between"}
          padding=".8rem"
          margin={{ lg: "0 12rem" }}
        >
          <Box display="flex" alignItems={"center"}>
            <StyledButton
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: "1.25rem",
                padding: "0",
                margin: "0",
              }}
              onClick={() => navigate("/")}
            >
              Clinic Name
            </StyledButton>
          </Box>
          <Box display="flex" gap="0.5rem">
            {isAuthenticated ? (
              <>
                <StyledButton
                  sx={{ color: "white", border: "1px solid white" }}
                  onClick={handleLogout}
                >
                  Logout
                </StyledButton>
              </>
            ) : (
              <>
                <StyledButton 
                  sx={{ color: "white", border: "1px solid white" }} 
                  onClick={() => navigate("signin")}
                >
                  Sign In
                </StyledButton>
                <StyledButton
                  sx={{ backgroundColor: "white", border: "1px solid white" }}
                  onClick={() => navigate("signup")}
                >
                  Sign Up
                </StyledButton>
              </>
            )}
          </Box>
        </Box>
      </AppBar>
    </Box>
  );
}
