import { Paper } from "@mui/material";

const Card = ({ children, withBorder = false, centered = false, ...props }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        height: '100%',
        backgroundColor: 'white',
        borderRadius: 2,
        border: withBorder ? '1px solid' : 'none',
        borderColor: withBorder ? 'grey.200' : 'transparent',
        display: 'flex',
        flexDirection: 'column',
        alignItems: centered ? 'center' : 'flex-start',
        textAlign: centered ? 'center' : 'left',
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Paper>
  );
};

export default Card; 