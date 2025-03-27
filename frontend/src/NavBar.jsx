import { useContext, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  useTheme,
  Container,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useColorScheme,
  Avatar,
} from "@mui/material";
import { UserContext } from './contexts/UserContext';
import { API_URL } from './utils/constants';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import FlatwareIcon from '@mui/icons-material/Flatware';

export default function NavBar() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useContext(UserContext);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (newOpen) => () => {
    setDrawerOpen(newOpen);
  };

  // light | dark | system
  const { mode, setMode } = useColorScheme()

  const handleLogout = async () => {
    const res = await fetch(API_URL + '/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (res.status === 200) {
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
      minWidth: { xs: '80px', sm: '100px' },
      textTransform: "none"
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
      <Drawer
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
            <PersonIcon />
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
        </Box>

        <Divider />

        <List>
          {user?.role === "PATIENT" && (
            <ListItemButton onClick={() => {
              navigate("/patient/dashboard");
              setDrawerOpen(false);
            }}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Patient Dashboard" />
            </ListItemButton>
          )}

          {user?.role === "DOCTOR" && (
            <ListItemButton onClick={() => {
              navigate("/doctor/dashboard");
              setDrawerOpen(false);
            }}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Doctor Dashboard" />
            </ListItemButton>
          )}

          {(user?.role==="PATIENT" || user?.role==="DOCTOR") &&
              <ListItemButton
                  onClick={()=>{
                    navigate("/recipes");
                    setDrawerOpen(false);
                  }}>
                <ListItemIcon>
                  <FlatwareIcon/>
                </ListItemIcon>
                <ListItemText primary={"Recipes"}/>
              </ListItemButton>
          }
        </List>

        <Divider />

        <List>
          <ListItemButton onClick={() => {
            handleLogout();
            setDrawerOpen(false);
          }}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Drawer>


      <AppBar position="fixed" elevation={0} sx={{ backgroundColor: "primary.main" }}>
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              py: { xs: 1, sm: 1.5 },
            }}
          >
            <Box sx={{ display: "flex", gap: "1rem", flexGrow: 1 }}>
              {user &&
                <IconButton onClick={toggleDrawer(true)}>
                  <MenuIcon sx={{ color: "white" }} />
                </IconButton>
              }
              <Button
                sx={{
                  ...buttonStyles.base,
                  ...buttonStyles.logo,
                  display: { xs: "none", sm: "block" }
                }}
                onClick={() => navigate("/")}
              >
                You Win, You Lose Clinic
              </Button>
            </Box>

            <Box display="flex" gap={{ xs: 1, sm: 2 }}>
              <IconButton
                sx={{ color: "white" }}
                onClick={() => {
                  setMode(mode === "light" ? "dark" : "light")
                }}>
                {mode === "light" ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
              {user ? (
                <>
                  <Button
                    sx={{
                      ...buttonStyles.base,
                      ...buttonStyles.transparent
                    }}
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    sx={{
                      ...buttonStyles.base,
                      ...buttonStyles.transparent
                    }}
                    onClick={() => navigate("/signin")}
                  >
                    Sign In
                  </Button>
                  <Button
                    sx={{
                      ...buttonStyles.base,
                      ...buttonStyles.white
                    }}
                    onClick={() => navigate("/signup")}
                  >
                    Sign Up
                  </Button>
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
