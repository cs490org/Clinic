import { useContext, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { useNavigate } from "react-router";
import StyledButton from "./components/StyledButton";
import { styled, Typography, useTheme, Container } from "@mui/material";
import { UserContext } from './contexts/UserContext';
import { API_URL } from './utils/constants';
export default function NavBar() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useContext(UserContext);

  const handleLogout = async () => {
    const res = await fetch(API_URL + '/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (res.status == 200) {
      navigate('/', { replace: true });
    } else {
      console.log("Logout failed. Try reloading the page or opening a new browser window.");
    }
    // is this the best way to handle this?
    window.location.reload();
  };

  const buttonStyles = {
    base: {
      py: 0.8,
      px: 2,
      fontSize: { xs: '0.9rem', sm: '1rem' },
      fontWeight: 500,
      borderRadius: 1.5,
      minWidth: { xs: '80px', sm: '100px' }
    },
    logo: {
      color: "white",
      fontWeight: "bold",
      fontSize: { xs: "1.1rem", sm: "1.25rem" },
      padding: "0.5rem",
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      }
    },
    transparent: {
      color: "white",
      border: "1.5px solid white",
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      }
    },
    white: {
      backgroundColor: "white",
      color: theme.palette.primary.main,
      border: "1.5px solid white",
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
      }
    }
  };

  return (
    <>
      <AppBar position="fixed" elevation={0}>
        <Container maxWidth="xl">
          <Toolbar 
            disableGutters 
            sx={{
              py: { xs: 1, sm: 1.5 },
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <StyledButton
              sx={{
                ...buttonStyles.base,
                ...buttonStyles.logo
              }}
              onClick={() => navigate("/")}
            >
              Clinic Name
            </StyledButton>

            <Box display="flex" gap={{ xs: 1, sm: 2 }}>
              {user ? (
                <>
                  <StyledButton
                    sx={{
                      ...buttonStyles.base,
                      ...buttonStyles.transparent
                    }}
                    onClick={() => navigate(`/patient/dashboard`)}
                  >
                    Patient Dashboard
                  </StyledButton>
                  <StyledButton
                    sx={{
                      ...buttonStyles.base,
                      ...buttonStyles.transparent
                    }}
                    onClick={handleLogout}
                  >
                    Logout
                  </StyledButton>
                </>
              ) : (
                <>
                  <StyledButton 
                    sx={{
                      ...buttonStyles.base,
                      ...buttonStyles.transparent
                    }}
                    onClick={() => navigate("/signin")}
                  >
                    Sign In
                  </StyledButton>
                  <StyledButton
                    sx={{
                      ...buttonStyles.base,
                      ...buttonStyles.white
                    }}
                    onClick={() => navigate("/signup")}
                  >
                    Sign Up
                  </StyledButton>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {/* This toolbar acts as a spacer */}
      <Toolbar sx={{ mb: { xs: 2, sm: 3 } }} />
    </>
  );
}
