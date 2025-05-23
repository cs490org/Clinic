import { Box, Paper, Typography, Container, Avatar, Stack, Rating } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import { API_URL } from "../../../utils/constants";
import { useEffect, useState } from "react";

const DoctorCard = ({ firstName, lastName, specialty, description, user, rating }) => (
    <Paper sx={{ p: 2 }}>
        <Box display={"flex"} flexDirection={"column"} alignItems={"center"} width={"300px"}>
            <Avatar
                sx={{
                    width: 120,
                    height: 120,
                    mb: 2,
                    bgcolor: 'grey.200'
                }}
            >
                <img src={user.imgUri} alt="Doctor" />
            </Avatar>
            <Typography variant="h5" fontWeight="bold" mb={1}>
                {firstName} {lastName}, MD
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" mb={2}>
                {specialty}
            </Typography>
            <Typography textAlign={"center"} color="text.secondary">
                {description}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" mb={2}>
                <Rating
                    value={rating} 
                    readOnly 
                    precision={0.25}
                    sx={{ mb: 2 }}
                />
            </Typography>
        </Box>
    </Paper>
);

const TopDoctors = () => {

    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const fetchDoctors = async () => {
            const response = await fetch(`${API_URL}/doctors/topDoctors`);
            const data = await response.json();
            setDoctors([...data]);
        };

        fetchDoctors();
    }, []);

    return (
        <Box
            sx={{
                py: { xs: 6, md: 10 },
                px: { xs: 2, sm: 4, md: 6 },
                backgroundColor: 'background.secondary'
            }}
        >
            <Container maxWidth="lg">
                <Typography
                    variant="h2"
                    component="h2"
                    textAlign="center"
                    fontSize={{ xs: "2rem", md: "3.5rem" }}
                    fontWeight="bold"
                    mb={3}
                >
                    Our Top Doctors
                </Typography>

                <Typography
                    textAlign="center"
                    fontSize={{ xs: "1rem", md: "1.25rem" }}
                    mb={8}
                    maxWidth="800px"
                    mx="auto"
                >
                    Meet our highly qualified healthcare professionals specializing in weight
                    management and nutrition.
                </Typography>

                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                            overflowX: 'scroll',
                            flexWrap: 'nowrap',
                        }}
                    >
                    {doctors.map((doctor, index) => {
                        console.log(doctor)
                        return <DoctorCard key={index} firstName={doctor.doctor.firstName} lastName={doctor.doctor.lastName} specialty={doctor.doctor.specialty} description={doctor.doctor.description} user={doctor.doctor.user} rating={doctor.rating} />
                    })}
                </Stack>
            </Container>
        </Box>
    );
};

export default TopDoctors; 