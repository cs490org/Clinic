import { createTheme } from "@mui/material";
const theme = createTheme({
  colorSchemes:{
    dark: {
      palette:{
        primary: {
          main: "#D71600",
        },
        background:{
          secondary:"#191919"
        }
      },
    },
    light: {
      palette:{
        primary: {
          main: "#D71600",
        },
        background:{
          secondary:"#f5f5f5"
        }
      }
    },
  },
  // palette: {
  //   primary: {
  //     main: "#D71600",
  //   },
  //   text: {
  //     primary: "#000000",
  //     secondary: "#000000",
  //   },
  //   background: {
  //     default: "#FFFFFF",
  //   },
  // },
});
export default theme;
