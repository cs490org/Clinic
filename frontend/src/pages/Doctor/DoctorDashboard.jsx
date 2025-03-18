import {
    Container,
    Typography,
    Paper,
    Box,
    CircularProgress, Stack, Button, Divider, CardActions, CardContent
} from '@mui/material';
import {useState, useEffect} from "react";
import {API_URL} from "../../utils/constants.js";
import dayjs from "dayjs";


const DoctorDashboard = () => {

    // TODO: get this from usercontext
    const doctor_id = 1


    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("");


    useEffect(() => {
        const fetchPendingAppointments = async () => {
            try {
                const response = await fetch(`${API_URL}/appointments/${doctor_id}?status=PENDING`,
                    {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                if (!response.ok) {
                    throw new Error("Failed to fetch upcoming appointments")

                }
                const data = await response.json()
                setAppointments(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchPendingAppointments()
    }, []);

    const PendingAppointmentCard = ({name, time}) => {
        return (
            <Paper sx={{p: 2}}>
                <Stack direction={"row"} justifyContent={"space-between"}>
                    <Box>
                        <Box>
                            <Typography fontSize={"1.2rem"} fontWeight={"bold"}>{name}</Typography>
                        </Box>
                        <Box>
                            <Typography>{dayjs(time).format("MMMM D, YYYY")}</Typography>
                            <Typography>{dayjs(time).format("h:mm A")}</Typography>
                        </Box>
                    </Box>
                    <Stack spacing={.5}>
                        <Button variant={"contained"}>Accept</Button>
                        <Button variant={"outlined"}>Reject</Button>
                    </Stack>
                </Stack>
            </Paper>
        )
    }


    return (
        <Container sx={{mt: 4}}>
            <Typography variant="h4" gutterBottom>
                Doctor Dashboard
            </Typography>
            <Stack direction={"row"}>
                <Paper variant="outlined" sx={{p: 2}}>
                    <Typography variant="h5"> Appointment Requests</Typography>
                    {loading ?
                        <Box display="flex" justifyContent="center" p={4}>
                            <CircularProgress/>
                        </Box>
                        :
                        error ?
                            <Paper sx={{p: 3, textAlign: 'center'}}>
                                <Typography color="error">{error}</Typography>
                            </Paper>
                            :
                            <Stack spacing={2}>
                                {
                                    appointments.map((appointment, index) =>
                                        <PendingAppointmentCard
                                            key={index}
                                            name={`${appointment.patient.user.firstName} ${appointment.patient.user.firstName}`}
                                            time={appointment.appointmentTimestamp}
                                        />
                                    )
                                }
                            </Stack>
                    }
                </Paper>
            </Stack>
        </Container>
    );
};

export default DoctorDashboard; 