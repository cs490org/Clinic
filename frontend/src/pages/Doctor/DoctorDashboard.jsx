import {
    Container,
    Typography,
    Stack,
    Switch,
    Box,
    Grid2,
    Paper,
    Button,
    Rating,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import PendingAppointments from "./Appointments/PendingAppointments.jsx";
import ConfirmedAppointments from "./Appointments/ConfirmedAppointments.jsx";
import { API_URL } from '../../utils/constants';
import axios from 'axios';
import { toast } from 'sonner';
import SearchPatients from "./Patients/SearchPatients.jsx";
import DoctorPatients from './DoctorPatients';
import DoctorQuickActions from './DoctorQuickActions.jsx';
import { useNavigate } from 'react-router-dom';
import CancelledAppointments from "./Appointments/CancelledAppointments.jsx";

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
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4, px: 4 }}>
            <Stack spacing={3}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                    flexWrap: 'wrap'
                }}>
                    <Typography fontWeight={"bold"} sx={{ fontSize: { xs: '1.6rem', sm: '2.2rem' } }} variant="h4" gutterBottom>
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
                <Grid2 container spacing={2}>

                    <Grid2 size={4}>
                        <DoctorQuickActions />
                    </Grid2>
                    <Grid2 size={4}>
                        <DoctorReviews />
                    </Grid2>
                    <Grid2 size={12}>
                        <DoctorPatients />
                    </Grid2>
                    <Grid2 size={4}>
                        <ConfirmedAppointments />
                    </Grid2>
                    <Grid2 size={4}>
                        <PendingAppointments />
                    </Grid2>
                    <Grid2 size={4}>
                        <CancelledAppointments/>
                    </Grid2>
                </Grid2>
            </Stack>
        </Container >
    );
};

export default DoctorDashboard;

function DoctorReviews() {
    const { roleData } = useContext(UserContext);
    const [rating, setRating] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRating = async () => {
            try {
                const response = await axios.get(`${API_URL}/doctors/${roleData.id}/rating`, { withCredentials: true });
                setRating(response.data);
            } catch (error) {
                console.error('Failed to fetch rating:', error);
            }
        };

        if (roleData?.id) {
            fetchRating();
        }
    }, [roleData?.id]);

    return (
        <Paper sx={{ p: "1rem", height: '100%' }}>
            <Typography sx={{ fontWeight: "bold", fontSize: "1.2rem", mb: 2 }}>
                Your Rating
            </Typography>
            
            <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating value={rating} precision={0.5} readOnly />
                    <Typography>({rating.toFixed(1)})</Typography>
                </Box>
                <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate('/doctor/reviews')}
                >
                    View All Reviews
                </Button>
            </Stack>
        </Paper>
    );
}