import { Button, styled } from "@mui/material";

const StyledButton = styled(Button)(({ theme }) => ({
  // allow lowercase
  textTransform: "none",
}));

export default StyledButton;
