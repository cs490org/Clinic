import { useState } from "react";
import NavBar from "./NavBar";
import {
  Box,
  createTheme,
  CssBaseline,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import Patient from "./pages/Patient/Patient";

const theme = createTheme({
  palette: {
    primary: {
      main: "#D71600",
    },
    text: {
      primary: "#000000",
      secondary: "#000000",
    },
    background: {
      default: "#FFFFFF",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline></CssBaseline>
      <NavBar></NavBar>

      <Outlet></Outlet>
    </ThemeProvider>
  );
}

export default App;
