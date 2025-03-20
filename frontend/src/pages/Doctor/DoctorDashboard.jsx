import {
    Container,
    Typography,
    Stack
} from '@mui/material';
import PendingAppointments from "./Appointments/PendingAppointments.jsx";
import ConfirmedAppointments from "./Appointments/ConfirmedAppointments.jsx";


const DoctorDashboard = () => {

    return (
        <Container sx={{mt: 4}}>
            <Typography variant="h4" gutterBottom>
                Doctor Dashboard
            </Typography>
            <Stack direction={"row"} spacing={2}>

                <PendingAppointments/>
                <ConfirmedAppointments/>
            </Stack>
        </Container>
    );
};

export default DoctorDashboard; 