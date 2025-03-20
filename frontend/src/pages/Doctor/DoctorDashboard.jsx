import {
    Container,
    Typography,
    Stack,
    Switch,
    Box
} from '@mui/material';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import PendingAppointments from "./Appointments/PendingAppointments.jsx";
import ConfirmedAppointments from "./Appointments/ConfirmedAppointments.jsx";
import { API_URL } from '../../utils/constants';
import axios from 'axios';
import { toast } from 'sonner';

const DoctorDashboard = () => {
    const { roleData } = useContext(UserContext);

    const handleToggleAccepting = async (event) => {
        try {
            await axios.patch(
                `${API_URL}/doctors/${roleData.id}/accepting-status`,
                { acceptingNewPatients: event.target.checked },
                { withCredentials: true }
            );
            toast.success('Status updated successfully');
        } catch (error) {
            toast.error('Failed to update status');
            // Revert the switch if the update failed
            event.target.checked = !event.target.checked;
        }
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Doctor Dashboard
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>Accepting New Patients</Typography>
                    <Switch
                        defaultChecked={roleData?.acceptingNewPatients}
                        onChange={handleToggleAccepting}
                    />
                </Box>
            </Box>
            <Stack direction={"row"} spacing={2}>
                <PendingAppointments />
                <ConfirmedAppointments />
            </Stack>
        </Container>
    );
};

export default DoctorDashboard; 