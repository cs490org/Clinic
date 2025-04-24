import {
    Container,
    Typography,
    Stack,
    Switch,
    Box,
    Paper
} from '@mui/material';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import ConfirmedAppointments from "./Appointments/ConfirmedAppointments.jsx";
import { API_URL } from '../../utils/constants';
import axios from 'axios';
import { toast } from 'sonner';
import SearchPatients from "./Patients/SearchPatients.jsx";
import DoctorPatients from "./Patients/DoctorPatients.jsx";

const DoctorHomepage = () => {
    const { roleData } = useContext(UserContext);

    return (
        <Container sx={{ mt: 4 }}>
            <Stack spacing={2}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                    flexWrap: 'wrap'
                }}>
                    <Typography fontWeight={"bold"} sx={{ fontSize: { xs: '1.6rem', sm: '2.2rem' } }} variant="h4" gutterBottom>
                        Doctor Homepage
                    </Typography>
                </Box>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                    flexWrap: 'wrap'
                }}>
                    <Typography fontWeight={"bold"} sx={{ fontSize: { xs: '1.6rem', sm: '1.6 rem' } }} variant="subtitle2" gutterBottom>
                        My Patients
                    </Typography>
                </Box>
                <Paper sx={{p: 2}}>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 3,
                        position: 'static'
                    }}>
                        <Typography fontWeight={"bold"} variant="h6" gutterBottom>
                            This area should only show patients that are currently with me
                        </Typography>
                    </Box>
                    <DoctorPatients />
                </Paper>
                {/*
                <SearchPatients />
                */}
                <Stack direction={"row"} spacing={2} flexWrap={"wrap"}>
                    <ConfirmedAppointments />
                </Stack>
            </Stack>
        </Container>
    );
};

export default DoctorHomepage;