import { Box, Button, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useContext } from "react";
import { API_URL } from "../../../utils/constants.js";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../utils/queryKeys.js";
import { UserContext } from "../../../contexts/UserContext.jsx";
import { useNavigate } from "react-router-dom";

const ConfirmedAppointments = () => {
    const { user, roleData } = useContext(UserContext);
    const navigate = useNavigate();

    const { data: appointments, isLoading, error } = useQuery({
        queryKey: queryKeys.appointments.confirmed(roleData?.id),
        queryFn: () => fetch(`${API_URL}/appointments?doctor_id=${roleData?.id}&status=CONFIRMED`,
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then(res => res.json())
    });

    const ConfirmedAppointmentCard = ({ name, time, id,patientId }) => {
        const appointmentDate = new Date(time);
        const currentDate = new Date();
        const canEnter = appointmentDate <= currentDate;
        return (
            <Paper sx={{ p: 2 }}>
                <Stack direction={"row"} justifyContent={"space-between"}>
                    <Box>
                        <Box>
                            <Typography fontSize={"1.2rem"} fontWeight={"medium"}> {name}</Typography>
                        </Box>
                        <Box>
                            <Typography>{dayjs(time).format("MMMM D, YYYY")}</Typography>
                            <Typography>{dayjs(time).format("h:mm A")}</Typography>
                        </Box>
                        {/*<Button variant={"contained"} onClick={() => navigate(`/appointment/${id}`)}>Enter</Button>*/}
                        <Button disabled={!canEnter} variant={"contained"} onClick={() => navigate(`/appointment/${id}/${patientId}`)}>Enter</Button>
                    </Box>
                </Stack>
            </Paper>
        )
    }
    return (

        <Paper variant="outlined" sx={{ height:"100%",p: 2, flex: 1 }}>
            <Typography variant="h5" fontWeight={"bold"}>Upcoming Appointments</Typography>
            {isLoading ?
                <Box display="flex" justifyContent="center" p={4}>
                    <CircularProgress />
                </Box>
                :
                error ?
                    <Paper sx={{ p: 3, textAlign: "center" }}>
                        <Typography color="error">{error}</Typography>
                    </Paper>
                    :
                    appointments.length === 0 ?
                        <Paper sx={{ p: 3 }}>
                            <Typography>You have no confirmed appointments</Typography>
                        </Paper>
                        :
                        <Stack spacing={2}>
                            {
                                appointments.map((appointment, index) =>
                                    <ConfirmedAppointmentCard
                                        key={index}
                                        name={`${appointment.patient.user.firstName} ${appointment.patient.user.lastName}`}
                                        time={appointment.appointmentTimestamp}
                                        id={appointment.id}
                                        patientId={appointment.patient.id}
                                    />
                                )
                            }
                        </Stack>
            }
        </Paper>
    )
}

export default ConfirmedAppointments