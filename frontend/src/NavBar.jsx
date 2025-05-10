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
import { API_URL, APP_BAR_HEIGHT } from './utils/constants';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import FlatwareIcon from '@mui/icons-material/Flatware';
import ReceiptIcon from '@mui/icons-material/Receipt';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { Medication } from "@mui/icons-material";
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';


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
      fontSize: '1rem',
      fontWeight: 500,
      borderRadius: 1.5,
      minWidth: '100px',
      textTransform: "none"
    },
    logo: {
      color: "white",
      fontWeight: "bold",
      fontSize: "1.25rem",
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
  const drawerWidth = 300
  return (
    <>
      <Drawer
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box sx={{ width: drawerWidth, p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
            {user?.imgUri ? <img src={user?.imgUri} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user?.firstName?.charAt(0)}
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

          {user?.role === "DOCTOR" && (
            <ListItemButton onClick={() => {
              navigate("/doctor/assignrx");
              setDrawerOpen(false);
            }}>
              <ListItemIcon>
                <Medication />
              </ListItemIcon>
              <ListItemText primary="Assign Medication" />
            </ListItemButton>
          )}

          {user?.role === "PATIENT" && (
              <ListItemButton onClick={() => {
                navigate("/patient/symptoms");
                setDrawerOpen(false);
              }}>
                <ListItemIcon>
                  <LocalHospitalIcon/>
                </ListItemIcon>
                <ListItemText primary="My Symptoms" />
              </ListItemButton>
          )}
          {(user?.role === "PATIENT" || user?.role === "DOCTOR") &&
            <ListItemButton
              onClick={() => {
                navigate("/recipes");
                setDrawerOpen(false);
              }}>
              <ListItemIcon>
                <FlatwareIcon />
              </ListItemIcon>
              <ListItemText primary={"Food"} />
            </ListItemButton>
          }
          {/*{(user?.role === "PATIENT" || user?.role === "DOCTOR") &&*/}
          {/*    <ListItemButton*/}
          {/*        onClick={() => {*/}
          {/*          navigate("/mealplans");*/}
          {/*          setDrawerOpen(false);*/}
          {/*        }}>*/}
          {/*      <ListItemIcon>*/}
          {/*        <FlatwareIcon />*/}
          {/*      </ListItemIcon>*/}
          {/*      <ListItemText primary={"Meal Plans"} />*/}
          {/*    </ListItemButton>*/}
          {/*}*/}
          {/*{(user?.role === "PATIENT" || user?.role === "DOCTOR") &&*/}
          {/*    <ListItemButton*/}
          {/*        onClick={() => {*/}
          {/*          navigate("/mealplans/create");*/}
          {/*          setDrawerOpen(false);*/}
          {/*        }}>*/}
          {/*      <ListItemIcon>*/}
          {/*        <FlatwareIcon />*/}
          {/*      </ListItemIcon>*/}
          {/*      <ListItemText primary={"Create a Meal Plan"} />*/}
          {/*    </ListItemButton>*/}
          {/*}*/}
          {user?.role === "PATIENT" && (
            <ListItemButton onClick={() => {
              navigate("/mealplans/assigned");
              setDrawerOpen(false);
            }}>
              <ListItemIcon>
                <RestaurantIcon />
              </ListItemIcon>
              <ListItemText primary="Assigned Meal Plans" />
            </ListItemButton>
          )}
          {user?.role === "DOCTOR" && (
            <ListItemButton onClick={() => {
              navigate("/mealplans/assign");
              setDrawerOpen(false);
            }}>
              <ListItemIcon>
                <RestaurantIcon />
              </ListItemIcon>
              <ListItemText primary="Assign a Meal Plan" />
            </ListItemButton>
          )}
          {user?.role === "DOCTOR" && (
            <ListItemButton onClick={() => {
              navigate("/patients");
              setDrawerOpen(false);
            }}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Patient Registry" />
            </ListItemButton>
          )}

          {user?.role === "PHARMACIST" && (
            <ListItemButton
              onClick={() => {
                navigate("/pharmacist/bills");
                setDrawerOpen(false);
              }}>
              <ListItemIcon>
                <ReceiptIcon />
              </ListItemIcon>
              <ListItemText primary={"Bills"} />
            </ListItemButton>
          )}

          {(user?.role === "PHARMACIST") &&
            <ListItemButton
              onClick={() => {
                navigate("/pharmacist/dashboard");
                setDrawerOpen(false);
              }}>
              <ListItemIcon>
              </ListItemIcon>
              <ListItemText primary={"Dashboard"} />
            </ListItemButton>
          }
          {user?.role === "PHARMACIST" && (
            <ListItemButton
              onClick={() => {
                navigate("/pharmacist/patients");
                setDrawerOpen(false);
              }}>
              <ListItemIcon><PersonIcon /></ListItemIcon>
              <ListItemText primary={"Patients"} />
            </ListItemButton>
          )}

          {(user?.role === "PHARMACIST") &&
            <ListItemButton
              onClick={() => {
                navigate("/pharmacist/prescriptions");
                setDrawerOpen(false);
              }}>
              <ListItemIcon>
              </ListItemIcon>
              <ListItemText primary={"Prescriptions"} />
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


      <AppBar position="fixed" elevation={0} sx={{ height: APP_BAR_HEIGHT, backgroundColor: "primary.main" }}>
        <Toolbar>
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
      </AppBar>
      {/* This toolbar acts as a spacer */}
      <Toolbar sx={{ mb: 3 }} />
    </>
  );
}
