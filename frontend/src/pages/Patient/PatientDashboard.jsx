import { useState, useContext, useEffect } from 'react';
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
    Avatar,
    Divider,
    Tooltip,
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
import { useNavigate } from 'react-router-dom';
import PendingAppointments from "./PendingAppointments.jsx";
import PatientQuickActions from "./PatientQuickActions.jsx";
const PatientDashboard = () => {
    const { user, roleData } = useContext(UserContext);
    const [openBooking, setOpenBooking] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDateTime, setSelectedDateTime] = useState(dayjs());
    const [symptoms, setSymptoms] = useState('');
    const navigate = useNavigate();

    const { data: chosenDoctor, isLoading: chosenDoctorIsLoading } = useQuery({
        queryKey: ["chosen_doctor"],
        queryFn: async () => {
            console.log(user)
            const res = await fetch(API_URL + `/patient/doctor?userId=${user?.id}`, {
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to fetch pharmacies');
            return res.json();
        }
    });


    const handleBookClick = (doctor) => {
        setSelectedDoctor(doctor);
        setOpenBooking(true);
    };

    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"))
    const Widgets = () => {
        return (
            <>
                <Grid2 size={4} sx={{height:"100%",display:"flex",flexDirection:"column"}}>
                    <PatientQuickActions/>
                </Grid2 >
                <Grid2 size={4}>
                    <Paper sx={{ height: "100%", p: "1rem" }}>
                        <Typography sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
                            Chosen doctor
                        </Typography>

                        {chosenDoctor ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                                <Avatar
                                    src={chosenDoctor.doctor.user.imgUri}
                                    alt={`${chosenDoctor.doctor.firstName} ${chosenDoctor.doctor.lastName}`}
                                    sx={{ width: 64, height: 64 }}
                                />
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        Dr. {chosenDoctor.doctor.firstName} {chosenDoctor.doctor.lastName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {chosenDoctor.doctor.specialty}
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        onClick={() => {
                                            axios.delete(`${API_URL}/patient/doctor?patientId=${roleData.id}`, { withCredentials: true })
                                                .then(() => {
                                                    toast.success('Doctor removed successfully');
                                                    window.location.reload();
                                                })
                                                .catch(() => {
                                                    toast.error('Failed to remove doctor');
                                                });
                                        }}
                                        sx={{ mt: 1 }}
                                    >
                                        Fire Doctor
                                    </Button>
                                </Box>
                            </Box>
                        )
                            :
                            (
                                <Typography>
                                    You currently do not have a chosen doctor.<br></br>To choose one, make an appointment.
                                </Typography>
                            )
                        }
                    </Paper>
                </Grid2>

                <Grid2 size={4} sx={{height:"100%"}}>
                    <PendingAppointments/>
                </Grid2 >
                <Grid2 size={4} sx={{height:"100%"}}>
                    <MealPlansWidget/>
                </Grid2>
                <Grid2 size={8} sx={{height:"100%"}}>
                    <AllDoctors onBookClick={handleBookClick} />
                </Grid2>
                <Grid2 size={12} sx={{height:"100%"}}>
                    <PatientSurvey />
                </Grid2>
            </>
        )
    }
    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4, px: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: "bold" }} gutterBottom>
                Patient Dashboard
            </Typography>
            {
                isMdUp ?
                    <Grid2 wrap={"wrap"} container spacing={3}>
                        <Widgets />
                    </Grid2>
                    :
                    <Stack wrap={"wrap"} container spacing={3}>
                        <Widgets />
                    </Stack>
            }

            <BookAppointmentDialog openBooking={openBooking} setOpenBooking={setOpenBooking} roleData={roleData} selectedDoctor={selectedDoctor} />

        </Container>
    );
};

export default PatientDashboard;

function BookAppointmentDialog({ openBooking, setOpenBooking, roleData, selectedDoctor }) {
    const [selectedDateTime, setSelectedDateTime] = useState(dayjs());
    const [symptoms, setSymptoms] = useState('');

    const handleCloseBooking = () => {
        setOpenBooking(false);
        setSelectedDoctor(null);
        setSelectedDateTime(dayjs());
        setSymptoms('');
    };

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
    )
}