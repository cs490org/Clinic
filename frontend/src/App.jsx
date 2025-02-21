import { useState } from "react";
import Root from "./Root";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import Patient from "./pages/Patient";

const theme = createTheme({
  typography: {
    allVariants: {
      color: "white",
    },
    fontSize: 16,
  },
  palette: {
    main: "blue",
    background: {
      default: "#131313",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline></CssBaseline>
      <Root></Root>
      <Outlet></Outlet>
    </ThemeProvider>
  );
}

export default App;
