import NavBar from "./NavBar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Outlet } from "react-router";
import theme from "./theme";

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
