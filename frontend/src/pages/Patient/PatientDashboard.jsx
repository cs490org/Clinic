import { useState, useContext } from 'react';
import {
    Container,
    Typography,
    Paper,
    CircularProgress,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField, Grid2, useMediaQuery, useTheme, Stack,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { API_URL } from '../../utils/constants';
import axios from 'axios';
import { toast } from 'sonner';
import { UserContext } from '../../contexts/UserContext';
import { useQuery } from "@tanstack/react-query";
import MealPlansWidget from "./MealPlansWidget.jsx";
import AllDoctors from './AllDoctors';
import PatientSurvey from "./PatientSurvey.jsx";

const PatientDashboard = () => {
    const { user, roleData } = useContext(UserContext);
    const [openBooking, setOpenBooking] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDateTime, setSelectedDateTime] = useState(dayjs());
    const [symptoms, setSymptoms] = useState('');

    const { data: chosenDoctor, isLoading: chosenDoctorIsLoading } = useQuery({
        queryKey: "chosen_doctor",
        queryFn: async () => {
            const res = await fetch(API_URL + `/patient/doctor?patientId=${roleData.id}`, {
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to fetch pharmacies');
            return res.json();
        }
    });

    const handleBookAppointment = async () => {
        const request = {
            appointment: {
                doctor: {
                    id: selectedDoctor.id
                },
                patient: {
                    id: roleData.id
                },
                appointmentTimestamp: selectedDateTime.toISOString()
            },
            symptoms: symptoms.trim()
        };

        try {
            const response = await axios.post(`${API_URL}/appointments`, request, { withCredentials: true });
            await axios.put(`${API_URL}/patient/doctor?patientId=${roleData.id}&doctorId=${selectedDoctor.id}`
                , { withCredentials: true });
            toast.success('Appointment created successfully!');
            window.location.reload()
        } catch (error) {
            console.error('Error creating appointment:', error);
            toast.error('Failed to create appointment');
        }

        handleCloseBooking();
    };

    const handleBookClick = (doctor) => {
        setSelectedDoctor(doctor);
        setOpenBooking(true);
    };

    const handleCloseBooking = () => {
        setOpenBooking(false);
        setSelectedDoctor(null);
        setSelectedDateTime(dayjs());
        setSymptoms('');
    };

    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"))
    const Widgets = () => {
        return (

            <>
                <Grid2 size={"grow"}>
                    <Paper sx={{ height: "100%", p: "1rem" }}>
                        <Typography sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
                            Chosen doctor
                        </Typography>

                        {chosenDoctor ? (
                                <Typography>
                                    {chosenDoctor.doctor.firstName} {chosenDoctor.doctor.lastName}
                                </Typography>
                            )
                            :
                            (
                                <Typography>
                                    You currently do not have a chosen doctor. To choose one, make an appointment.
                                </Typography>
                            )
                        }
                    </Paper>
                </Grid2>

                <Grid2 size={8}>
                    <AllDoctors onBookClick={handleBookClick} />
                </Grid2>
                <Grid2 size={8}>
                    <PatientSurvey/>
                </Grid2>
                <Grid2 size={"grow"}>
                    <MealPlansWidget />
                </Grid2>

            </>
        )
    }
    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4, px: 4 }}>
            <Typography variant="h4" sx={{fontWeight:"bold"}} gutterBottom>
                Patient Dashboard
            </Typography>
            {
                isMdUp ?
                <Grid2 wrap={"wrap"} container spacing={3}>
                    <Widgets/>
                </Grid2>
                    :
                <Stack wrap={"wrap"} container spacing={3}>
                    <Widgets/>
                </Stack>
            }


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
                        onChange={(e) => setSymptoms(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseBooking}>Cancel</Button>
                    <Button onClick={handleBookAppointment} variant="contained" color="primary">
                        Book
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default PatientDashboard; 