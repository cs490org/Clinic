import {Box, Typography, useTheme} from "@mui/material";
import {useNavigate} from "react-router";


const HeroSection = () => {
    const theme = useTheme();
    const navigate = useNavigate();


    const buttonStyles = {
        base: {
            py: 0.8,
            px: 2,
            fontSize: {xs: '0.9rem', sm: '1rem'},
            fontWeight: 500,
            borderRadius: 1.5,
            minWidth: {xs: '80px', sm: '100px'}
        },
        primary: {
            backgroundColor: theme.palette.primary.main,
            color: "white",
            '&:hover': {
                backgroundColor: theme.palette.primary.dark,
            }
        },
        secondary: {
            backgroundColor: 'white',
            color: theme.palette.primary.main,
            border: `2px solid ${theme.palette.primary.main}`,
            '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
            }
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt={{xs: "4rem", md: "8rem"}}
            mb={{xs: "4rem", md: "8rem"}}
        >
            <Box
                display="flex"
                width="80%"
                alignItems="center"
                gap="6rem"
                flexDirection={{xs: "column", md: "row"}}
                flexWrap="wrap"
            >
                <Box display="flex" flexDirection="column" flex={1}>
                    <Typography
                        variant="h1"
                        fontWeight="bold"
                        fontSize={{xs: "2.5rem", sm: "3rem", md: "4rem"}}
                        mb={2}
                    >
                        Your Health Journey Starts Here
                    </Typography>
                    <Typography
                        fontSize={{xs: "1.25rem", md: "1.5rem"}}
                        mb={4}
                        color="text.secondary"
                    >
                        Connect with specialized doctors, track your progress, and achieve
                        your weight loss goals with our comprehensive healthcare platform.
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: {flex: 0.8, xs: 'none', md: 'block'},
                        height: 'auto',
                        animation: 'float 3s ease-in-out infinite'
                    }}
                >
                    <img
                        style={{
                            width: '100%',
                            display: 'block'
                        }}
                        src="chips.png"
                        alt="Weight loss journey"
                    />
                    <style>
                        {`
              @keyframes float {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-30px); }
                100% { transform: translateY(0px); }
              }
            `}
                    </style>
                </Box>
            </Box>
        </Box>
    );
};

export default HeroSection; 