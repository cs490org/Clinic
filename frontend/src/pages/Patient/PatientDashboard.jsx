import { useState, useContext, useEffect } from 'react';
import {
    Container,
    Typography,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    useMediaQuery,
    useTheme,
    Stack,
    Divider,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { API_URL } from '../../utils/constants';
import axios from 'axios';
import { toast } from 'sonner';
import { UserContext } from '../../contexts/UserContext';
import { useQueryClient } from '@tanstack/react-query';
import MealPlansWidget from './MealPlansWidget.jsx';
import AllDoctors from './AllDoctors';
import PatientSurvey from './PatientSurvey.jsx';
import { useNavigate } from 'react-router-dom';

import PendingAppointments from "./PendingAppointments.jsx";
import PatientQuickActions from "./PatientQuickActions.jsx";
import PatientEditPreferredPharmacy from "./PatientEditPreferredPharmacy.jsx";
import PatientChosenDoctor from "./PatientChosenDoctor.jsx";
import {queryKeys} from "../../utils/queryKeys.js";
import AllPatientMetrics from "./AllPatientMetrics.jsx";

const PatientDashboard = () => {
    const { user, roleData } = useContext(UserContext);
    const [openBooking, setOpenBooking] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDateTime, setSelectedDateTime] = useState(dayjs());
    const [symptoms, setSymptoms] = useState('');
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const handleBookClick = (doctor) => {
        setSelectedDoctor(doctor);
        setOpenBooking(true);
    };

    const theme = useTheme();

    const isMdUp= useMediaQuery(theme.breakpoints.up("md"))
    const Widgets = () => {
        return (
            <>
                <Grid2 size={4} sx={{display:"flex",flexDirection:"column"}}>
                    <PatientQuickActions/>
                </Grid2 >
                <Grid2 size={4}>
                    <PatientChosenDoctor/>
                </Grid2>
                <Grid2 size={4} >
                    <PendingAppointments/>
                </Grid2 >
                <Grid2 size={4} >
                    <MealPlansWidget/>
                </Grid2>
                <Grid2 size={8} >
                    <AllDoctors onBookClick={handleBookClick} />
                </Grid2>
                <Grid2 size={6} >
                    <AllPatientMetrics patientId={roleData.id}/>
                </Grid2>
                <Grid2 size={6} >
                    <PatientSurvey />
                </Grid2>
                <Grid2 size={4} >
                    <PatientEditPreferredPharmacy/>
                </Grid2>
            </>
        )
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4, px: 4 }}>
            <Typography sx={{ fontSize: '1.6rem', fontWeight: 'bold' }} gutterBottom>
                Patient Dashboard
            </Typography>
            <Divider sx={{ mb: '2rem' }} />
            {isMdUp ? (
                <Grid container spacing={2}>
                    <Widgets />
                </Grid>
            ) : (
                <Stack spacing={3}>
                    <Widgets />
                </Stack>
            )}
            <BookAppointmentDialog
                openBooking={openBooking}
                setOpenBooking={setOpenBooking}
                roleData={roleData}
                selectedDoctor={selectedDoctor}
            />
        </Container>
    );
};

export default PatientDashboard;

function BookAppointmentDialog({ openBooking, setOpenBooking, roleData, selectedDoctor }) {
    const [selectedDateTime, setSelectedDateTime] = useState(dayjs());
    const [symptoms, setSymptoms] = useState('');
    const queryClient = useQueryClient();

    const handleCloseBooking = () => {
        setOpenBooking(false);
        setSelectedDateTime(dayjs());
        setSymptoms('');
        queryClient.invalidateQueries(queryKeys.appointments.all); 
    };

    const handleBookAppointment = async () => {
        handleCloseBooking();
        const request = {
            appointment: {
                doctor: { id: selectedDoctor.id },
                patient: { id: roleData.id },
                appointmentTimestamp: selectedDateTime.toISOString()
            },
            symptoms: symptoms.trim()
        };

        try {
            await axios.post(`${API_URL}/appointments`, request, { withCredentials: true });
            await axios.put(`${API_URL}/patient/doctor?patientId=${roleData.id}&doctorId=${selectedDoctor.id}`, null, { withCredentials: true });
            toast.success('Appointment created successfully!');
            await queryClient.invalidateQueries(queryKeys.appointments.all);
        } catch (error) {
            console.error('Error creating appointment:', error);
            toast.error('Failed to create appointment');
        }
    };

    return (
        <Dialog open={openBooking} onClose={handleCloseBooking}>
            <DialogTitle>Book Appointment</DialogTitle>
            <DialogContent>
                <Typography mb={4}>
                    Dr. {selectedDoctor?.firstName} {selectedDoctor?.lastName}
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        label="Appointment Date & Time"
                        value={selectedDateTime}
                        onChange={(newValue) => setSelectedDateTime(newValue)}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                        minDateTime={dayjs()}
                    />
                </LocalizationProvider>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                    label="Symptoms"
                    placeholder="Please describe your symptoms"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.currentTarget.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseBooking}>Cancel</Button>
                <Button onClick={handleBookAppointment} variant="contained" color="primary">
                    Book
                </Button>
            </DialogActions>
        </Dialog>
    );
}