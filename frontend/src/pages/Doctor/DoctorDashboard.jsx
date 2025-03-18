import {
    Container,
    Typography,
    Stack
} from '@mui/material';
import PendingAppointments from "./PendingAppointments.jsx";
import ConfirmedAppointments from "./ConfirmedAppointments.jsx";


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